import { supabase } from "@/integrations/supabase/client";

export interface RecognitionResult {
  success: boolean;
  plate: string | null;
  confidence: number;
  message?: string;
}

export async function recognizePlateWithAI(
  canvas: HTMLCanvasElement
): Promise<RecognitionResult> {
  try {
    // Convert canvas to base64 image
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);

    // Call edge function
    const { data, error } = await supabase.functions.invoke('recognize-license-plate', {
      body: { imageBase64 }
    });

    if (error) {
      console.error('Edge function error:', error);
      return {
        success: false,
        plate: null,
        confidence: 0,
        message: error.message
      };
    }

    return data as RecognitionResult;
  } catch (error) {
    console.error('Recognition error:', error);
    return {
      success: false,
      plate: null,
      confidence: 0,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function saveScanToDatabase(
  plateNumber: string,
  confidence: number,
  deviceType: string = 'web'
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    const { error } = await supabase
      .from('license_plate_scans')
      .insert({
        user_id: user.id,
        plate_number: plateNumber,
        confidence: confidence,
        device_type: deviceType,
        scanned_at: new Date().toISOString()
      });

    if (error) {
      console.error('Database save error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Save scan error:', error);
    return false;
  }
}