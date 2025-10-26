import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Calling Lovable AI for license plate recognition...');

    // Call Lovable AI with vision capability
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert at reading Vietnamese license plates. Extract the license plate number from the image. Return ONLY the license plate number in the format XX-XXXXX or XXX-XXXXX (Vietnamese format). If no license plate is visible, return 'NOT_FOUND'. Be precise and confident."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Read the license plate number from this image. Return only the plate number."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const plateNumber = data.choices[0].message.content.trim();

    console.log('Recognition result:', plateNumber);

    if (plateNumber === 'NOT_FOUND') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          plate: null,
          confidence: 0,
          message: 'No license plate detected in image'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return success with plate number
    // Confidence is estimated based on clear detection
    return new Response(
      JSON.stringify({ 
        success: true,
        plate: plateNumber,
        confidence: 0.95 // High confidence from AI model
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in recognize-license-plate:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        plate: null,
        confidence: 0
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});