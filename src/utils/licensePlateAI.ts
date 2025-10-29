import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { recognizePlateWithCNN } from "./licensePlateCNN";

export interface RecognitionResult {
  success: boolean;
  plate: string | null;
  confidence: number;
  message?: string;
}

export type RecognitionMethod = 'cnn' | 'ai';

const scanDataSchema = z.object({
  plateNumber: z.string()
    .min(1, "Plate number is required")
    .max(20, "Plate number too long")
    .regex(/^[A-Z0-9-]+$/, "Invalid plate format"),
  confidence: z.number()
    .min(0, "Confidence must be at least 0")
    .max(1, "Confidence must be at most 1"),
  deviceType: z.enum(['web', 'mobile', 'camera'], {
    errorMap: () => ({ message: "Invalid device type" })
  }),
});

export async function recognizePlateWithAI(
  canvas: HTMLCanvasElement
): Promise<RecognitionResult> {
  try {
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        plate: null,
        confidence: 0,
        message: 'Authentication required'
      };
    }

    const { data, error } = await supabase.functions.invoke('recognize-license-plate', {
      body: { imageBase64 }
    });

    if (error) {
      return {
        success: false,
        plate: null,
        confidence: 0,
        message: error.message
      };
    }

    return data as RecognitionResult;
  } catch (error) {
    return {
      success: false,
      plate: null,
      confidence: 0,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function recognizePlate(
  canvas: HTMLCanvasElement,
  method: RecognitionMethod = 'cnn'
): Promise<RecognitionResult> {
  console.log(`Using recognition method: ${method}`);
  
  if (method === 'cnn') {
    return recognizePlateWithCNN(canvas);
  } else {
    return recognizePlateWithAI(canvas);
  }
}

export async function saveScanToDatabase(
  plateNumber: string,
  confidence: number,
  deviceType: string = 'web'
): Promise<boolean> {
  try {
    // Validate input data
    const validated = scanDataSchema.parse({
      plateNumber: plateNumber.toUpperCase(),
      confidence,
      deviceType,
    });

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { error } = await supabase
      .from('license_plate_scans')
      .insert({
        user_id: user.id,
        plate_number: validated.plateNumber,
        confidence: validated.confidence,
        device_type: validated.deviceType,
        scanned_at: new Date().toISOString()
      });

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
    }
    return false;
  }
}