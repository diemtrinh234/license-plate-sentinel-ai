-- Fix PUBLIC_DATA_EXPOSURE: Require authentication for violations table
DROP POLICY IF EXISTS "Anyone can view violations" ON public.violations;

CREATE POLICY "Authenticated users can view violations"
ON public.violations
FOR SELECT
TO authenticated
USING (true);