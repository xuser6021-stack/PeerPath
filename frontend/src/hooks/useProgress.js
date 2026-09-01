import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useProgress(userId, pathId) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('path_id', pathId);
      if (err) throw err;
      setProgress(data);
    } catch (e) {
      console.error(e);
      setError(e);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, [userId, pathId]);

  useEffect(() => {
    if (userId && pathId) fetchProgress();
  }, [fetchProgress, userId, pathId]);

  const markStepComplete = async (stepId, completed = true) => {
    // optimistic update
    setProgress((prev) => {
      const existing = prev.find((p) => p.step_id === stepId);
      if (existing) {
        return prev.map((p) => (p.step_id === stepId ? { ...p, completed } : p));
      }
      // if no existing row, add one
      return [...prev, { user_id: userId, path_id: pathId, step_id: stepId, completed }];
    });
    try {
      const { error: err } = await supabase.from('progress').upsert({
        user_id: userId,
        path_id: pathId,
        step_id: stepId,
        completed,
      });
      if (err) throw err;
    } catch (e) {
      console.error(e);
      setError(e);
      // rollback optimistic change by refetching
      fetchProgress();
    }
  };

  return { progress, loading, error, markStepComplete, refetch: fetchProgress };
}
