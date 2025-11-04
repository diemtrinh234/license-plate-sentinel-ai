import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SearchHistoryItem {
  id: string;
  plate_number: string;
  searched_at: string;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch search history
  const fetchHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('license_plate_search_history')
        .select('*')
        .order('searched_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[DEV] Error fetching search history:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add to search history
  const addToHistory = async (plateNumber: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('license_plate_search_history')
        .upsert(
          {
            user_id: user.id,
            plate_number: plateNumber.toUpperCase(),
            searched_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,plate_number',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;
      
      // Refresh history
      await fetchHistory();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[DEV] Error adding to search history:', error);
      }
    }
  };

  // Clear all search history
  const clearHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('license_plate_search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setHistory([]);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[DEV] Error clearing search history:', error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  return {
    history,
    loading,
    addToHistory,
    clearHistory,
    fetchHistory
  };
}
