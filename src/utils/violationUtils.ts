import { supabase } from "@/integrations/supabase/client";

export interface Violation {
  id: string;
  plate_number: string;
  violation_type: string;
  violation_date: string;
  location: string | null;
  fine_amount: number | null;
  status: string;
  description: string | null;
  created_at: string;
}

export interface ViolationCheckResult {
  hasViolations: boolean;
  violations: Violation[];
  totalFines: number;
  unpaidFines: number;
}

export async function checkViolations(plateNumber: string): Promise<ViolationCheckResult> {
  try {
    const { data, error } = await supabase
      .from('violations')
      .select('*')
      .eq('plate_number', plateNumber.toUpperCase())
      .order('violation_date', { ascending: false });

    if (error) {
      if (import.meta.env.DEV) {
        console.error('[DEV] Error fetching violations:', error);
      }
      return {
        hasViolations: false,
        violations: [],
        totalFines: 0,
        unpaidFines: 0
      };
    }

    const violations = data as Violation[];
    const totalFines = violations.reduce((sum, v) => sum + (Number(v.fine_amount) || 0), 0);
    const unpaidFines = violations
      .filter(v => v.status === 'unpaid')
      .reduce((sum, v) => sum + (Number(v.fine_amount) || 0), 0);

    return {
      hasViolations: violations.length > 0,
      violations,
      totalFines,
      unpaidFines
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[DEV] Exception checking violations:', error);
    }
    return {
      hasViolations: false,
      violations: [],
      totalFines: 0,
      unpaidFines: 0
    };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
}
