-- Fix nullable user_id column
-- First, if there are any NULL user_id records, we need to handle them
-- Since we're implementing real auth, any existing records without user_id should be cleaned up
DELETE FROM license_plate_scans WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE license_plate_scans 
ALTER COLUMN user_id SET NOT NULL;

-- Add input validation constraints
ALTER TABLE license_plate_scans
ADD CONSTRAINT plate_number_length CHECK (length(plate_number) BETWEEN 1 AND 20),
ADD CONSTRAINT confidence_range CHECK (confidence >= 0 AND confidence <= 1);

-- Add missing UPDATE policy for consistent access control
CREATE POLICY "Users can update their own scans"
ON license_plate_scans
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);