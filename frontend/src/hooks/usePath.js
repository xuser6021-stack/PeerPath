import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function usePath(pathId) {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPath = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the path with author username
      const { data: pathData, error: pathError } = await supabase
        .from('paths')
        .select('id, title, description, category, difficulty, author_id, profiles!inner(username)')
        .eq('id', pathId)
        .single();
      if (pathError) throw pathError;

      // Fetch steps ordered
      const { data: stepsData, error: stepsError } = await supabase
        .from('steps')
        .select('id, title, description, order_index')
        .eq('path_id', pathId)
        .order('order_index', { ascending: true });
      if (stepsError) throw stepsError;

      // For each step, fetch resources and their reviews
      const stepsWithResources = await Promise.all(
        stepsData.map(async (step) => {
          const { data: resourcesData, error: resErr } = await supabase
            .from('resources')
            .select('id, title, url, type')
            .eq('step_id', step.id);
          if (resErr) throw resErr;
          // Fetch reviews for these resources
          const resourceIds = resourcesData.map((r) => r.id);
          const { data: reviewsData = [], error: revErr } = await supabase
            .from('reviews')
            .select('id, rating, comment, resource_id')
            .in('resource_id', resourceIds);
          if (revErr) throw revErr;
          const resources = resourcesData.map((r) => ({
            ...r,
            reviews: reviewsData.filter((rev) => rev.resource_id === r.id),
          }));
          return { ...step, resources };
        })
      );

      setPath({ ...pathData, steps: stepsWithResources });
    } catch (e) {
      console.error(e);
      setError(e);
      setPath(null);
    } finally {
      setLoading(false);
    }
  }, [pathId]);

  useEffect(() => {
    if (pathId) fetchPath();
  }, [fetchPath, pathId]);

  return { path, loading, error, refetch: fetchPath };
}
