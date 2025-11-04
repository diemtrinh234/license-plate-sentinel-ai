-- Create table for license plate search history
CREATE TABLE public.license_plate_search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plate_number TEXT NOT NULL,
  searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_plate UNIQUE (user_id, plate_number)
);

-- Enable Row Level Security
ALTER TABLE public.license_plate_search_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own search history"
ON public.license_plate_search_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history"
ON public.license_plate_search_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history"
ON public.license_plate_search_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_search_history_user_id ON public.license_plate_search_history(user_id);
CREATE INDEX idx_search_history_searched_at ON public.license_plate_search_history(searched_at DESC);