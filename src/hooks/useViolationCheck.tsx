import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Violation {
  id: string;
  plate_number: string;
  violation_type: string;
  violation_date: string;
  location: string | null;
  fine_amount: number | null;
  status: string;
  description: string | null;
}

export function useViolationCheck(plateNumber: string | null) {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plateNumber) {
      setViolations([]);
      return;
    }

    const checkViolations = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('violations')
          .select('*')
          .eq('plate_number', plateNumber)
          .order('violation_date', { ascending: false });

        if (fetchError) throw fetchError;

        setViolations(data || []);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('[DEV] Error fetching violations:', err);
        }
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin vi phạm');
      } finally {
        setLoading(false);
      }
    };

    checkViolations();
  }, [plateNumber]);

  const unpaidViolations = violations.filter(v => v.status === 'unpaid');
  const totalFine = unpaidViolations.reduce((sum, v) => sum + (v.fine_amount || 0), 0);

  return {
    violations,
    unpaidViolations,
    totalFine,
    hasViolations: violations.length > 0,
    loading,
    error
  };
}
