import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('suggestions')
        .select('id, votes, status, resource_id, path_id, step_id, resources!inner(title, url), paths!inner(title as path_title), steps!inner(title as step_title)')
        .eq('status', 'pending');
      if (err) throw err;
      setSuggestions(data);
    } catch (e) {
      console.error(e);
      setError(e);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upvote = async (suggestionId) => {
    // optimistic UI update
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, votes: (s.votes || 0) + 1 } : s))
    );
    try {
      // fetch current suggestion
      const { data: current, error: fetchErr } = await supabase
        .from('suggestions')
        .select('votes, status, resource_id, title, url')
        .eq('id', suggestionId)
        .single();
      if (fetchErr) throw fetchErr;
      const newVotes = (current.votes || 0) + 1;
      const { error: updErr } = await supabase
        .from('suggestions')
        .update({ votes: newVotes })
        .eq('id', suggestionId);
      if (updErr) throw updErr;
      const { data: fresh, error: freshErr } = await supabase
        .from('suggestions')
        .select('votes, status, resource_id, title, url')
        .eq('id', suggestionId)
        .single();
      if (freshErr) throw freshErr;
      if (fresh.votes >= 10 && fresh.status !== 'accepted') {
        // accept suggestion: update resource and mark accepted
        const { error: resErr } = await supabase
          .from('resources')
          .update({ title: fresh.title, url: fresh.url })
          .eq('id', fresh.resource_id);
        if (resErr) throw resErr;
        const { error: suggErr } = await supabase
          .from('suggestions')
          .update({ status: 'accepted' })
          .eq('id', suggestionId);
        if (suggErr) throw suggErr;
      }
    } catch (e) {
      console.error(e);
      setError(e);
      // rollback UI by refetching list
      await fetchSuggestions();
      return;
    }
    // refresh list
    await fetchSuggestions();
  };

  return { suggestions, loading, error, upvote };
}
