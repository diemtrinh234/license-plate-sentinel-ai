-- Create license_plate_scans table to store scan history
CREATE TABLE public.license_plate_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plate_number TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  image_url TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_type TEXT,
  location_lat NUMERIC,
  location_lng NUMERIC
);

-- Enable Row Level Security
ALTER TABLE public.license_plate_scans ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own scans" 
ON public.license_plate_scans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans" 
ON public.license_plate_scans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans" 
ON public.license_plate_scans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_license_plate_scans_user_id ON public.license_plate_scans(user_id);
CREATE INDEX idx_license_plate_scans_plate_number ON public.license_plate_scans(plate_number);
CREATE INDEX idx_license_plate_scans_scanned_at ON public.license_plate_scans(scanned_at DESC);