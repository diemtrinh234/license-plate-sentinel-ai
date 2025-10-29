-- Create violations table
CREATE TABLE IF NOT EXISTS public.violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plate_number TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  violation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  fine_amount NUMERIC,
  status TEXT DEFAULT 'unpaid',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can check violations)
CREATE POLICY "Anyone can view violations"
ON public.violations
FOR SELECT
USING (true);

-- Create index for faster plate number lookups
CREATE INDEX idx_violations_plate_number ON public.violations(plate_number);

-- Insert some sample violation data for testing
INSERT INTO public.violations (plate_number, violation_type, violation_date, location, fine_amount, status, description) VALUES
('29A12345', 'Vượt đèn đỏ', '2024-01-15 10:30:00+07', 'Ngã tư Hàng Xanh, TP.HCM', 1000000, 'unpaid', 'Vi phạm vượt đèn đỏ tại ngã tư Hàng Xanh'),
('29A12345', 'Đậu xe sai quy định', '2024-01-20 14:20:00+07', 'Đường Lê Lợi, Q1, TP.HCM', 200000, 'paid', 'Đậu xe trên vỉa hè'),
('30B56789', 'Không đội mũ bảo hiểm', '2024-02-01 08:15:00+07', 'Quận 3, TP.HCM', 300000, 'unpaid', 'Người lái xe không đội mũ bảo hiểm'),
('51C99999', 'Vượt tốc độ', '2024-02-10 16:45:00+07', 'Đại lộ Thăng Long, Hà Nội', 800000, 'unpaid', 'Vượt tốc độ cho phép 20km/h')
ON CONFLICT DO NOTHING;