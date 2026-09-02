import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function usePaths({ category, difficulty, sort = 'created_at', search } = {}) {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('paths')
          .select('id, title, description, category, difficulty, created_at, author_id, followers_count, profiles!inner(username), steps(id, title, order_index, resources(id, avg_rating, flag_count, reviews(rating)))').order(sort, { ascending: false });
        if (category) query = query.eq('category', category);
        if (difficulty) query = query.eq('difficulty', difficulty);
        const { data, error: err } = await query;
        if (err) throw err;
        setPaths(data);
      } catch (e) {
        console.error(e);
        setError(e);
        setPaths([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty, sort, search]);

  const filtered = paths.filter(p => {
    if (!search) return true;
    const lower = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower) ||
      p.category?.toLowerCase().includes(lower)
    );
  });

  return { paths: filtered, loading, error };
}
