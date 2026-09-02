import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('suggestions')
        .select('id, votes, status, resource_id, suggested_by, suggested_title, suggested_url, reason, created_at, resources!inner(title, url, type, avg_rating, steps!inner(title, paths!inner(title)))')
        .in('status', ['pending', 'accepted']);
      if (err) throw err;
      setSuggestions((data || []).map((suggestion) => ({
        ...suggestion,
        pathTitle: suggestion.resources?.steps?.paths?.title || 'Path',
        stepTitle: suggestion.resources?.steps?.title || 'Step',
        author: suggestion.suggested_by || 'Peer learner',
        timeAgo: suggestion.created_at ? new Date(suggestion.created_at).toLocaleDateString() : 'Recently',
        oldResource: {
          title: suggestion.resources?.title || 'Current resource',
          rating: suggestion.resources?.avg_rating || 0,
          type: suggestion.resources?.type || 'Resource',
        },
        newResource: {
          title: suggestion.suggested_title,
          rating: 0,
          type: suggestion.resources?.type || 'Resource',
        },
        requiredVotes: 10,
        isMerged: suggestion.status === 'accepted',
      })));
    } catch (e) {
      console.error(e);
      setError(e);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const upvote = async (suggestionId) => {
    // optimistic UI update
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, votes: (s.votes || 0) + 1 } : s))
    );
    try {
      // fetch current suggestion
      const { data: current, error: fetchErr } = await supabase
        .from('suggestions')
        .select('votes, status, resource_id, suggested_title, suggested_url')
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
        .select('votes, status, resource_id, suggested_title, suggested_url')
        .eq('id', suggestionId)
        .single();
      if (freshErr) throw freshErr;
      if (fresh.votes >= 10 && fresh.status !== 'accepted') {
        // accept suggestion: update resource and mark accepted
        const { error: resErr } = await supabase
          .from('resources')
          .update({ title: fresh.suggested_title, url: fresh.suggested_url })
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
      return false;
    }
    // refresh list
    await fetchSuggestions();
    return true;
  };

  return { suggestions, loading, error, upvote };
}
