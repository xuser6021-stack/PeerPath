import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function buildActivityGrid(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (12 * 7 - 1));
  const counts = new Map();

  events.filter(Boolean).forEach((timestamp) => {
    const date = new Date(timestamp);
    if (date >= start && date <= today) {
      const key = date.toISOString().slice(0, 10);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  });

  const grid = [];
  let total = 0;
  for (let week = 0; week < 12; week += 1) {
    const days = [];
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7 + day);
      const count = counts.get(date.toISOString().slice(0, 10)) || 0;
      const level = count >= 4 ? 4 : count >= 3 ? 3 : count === 2 ? 2 : count === 1 ? 1 : 0;
      total += count;
      days.push({ level, count, date: date.toISOString().slice(0, 10) });
    }
    grid.push(days);
  }
  return { grid, totalContribs: total };
}

export function useProfile(userId) {
  const [data, setData] = useState({
    profile: null,
    created: [],
    followed: [],
    completed: [],
    stats: { created: 0, followed: 0, completed: 0, contributions: 0 },
    activity: { grid: [], totalContribs: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const [profileResult, createdResult, progressResult, reviewsResult, suggestionsResult] = await Promise.all([
        supabase.from('profiles').select('id, username, avatar_url, bio, location, created_at').eq('id', userId).single(),
        supabase.from('paths').select('id, title, description, category, difficulty, is_public, created_at, author_id, profiles(username), steps(id, title, order_index)').eq('author_id', userId).order('created_at', { ascending: false }),
        supabase.from('progress').select('path_id, step_id, completed, completed_at, created_at').eq('user_id', userId),
        supabase.from('reviews').select('id, created_at').eq('user_id', userId),
        supabase.from('suggestions').select('id, created_at').eq('suggested_by', userId),
      ]);
      const firstError = [profileResult, createdResult, progressResult, reviewsResult, suggestionsResult].find((result) => result.error)?.error;
      if (firstError) throw firstError;

      const progressRows = progressResult.data || [];
      const followedIds = [...new Set(progressRows.map((row) => row.path_id))];
      let followed = [];
      if (followedIds.length > 0) {
        const followedResult = await supabase
          .from('paths')
          .select('id, title, description, category, difficulty, is_public, created_at, author_id, profiles(username), steps(id, title, order_index)')
          .in('id', followedIds);
        if (followedResult.error) throw followedResult.error;
        followed = followedResult.data || [];
      }

      const decoratePath = (path) => {
        const pathProgress = progressRows.filter((row) => row.path_id === path.id);
        const completedSteps = pathProgress.filter((row) => row.completed).length;
        const totalSteps = path.steps?.length || 0;
        const percentage = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;
        const nextStep = path.steps?.find((step) => !pathProgress.some((row) => row.step_id === step.id && row.completed));
        const completionDate = pathProgress.map((row) => row.completed_at).filter(Boolean).sort().at(-1);
        return {
          ...path,
          completedSteps,
          totalSteps,
          percentage,
          currentStep: nextStep?.title || 'All steps complete',
          completionDate: completionDate ? new Date(completionDate).toLocaleDateString() : 'Completed',
          milestones: totalSteps,
          author: path.profiles?.username || path.author_id,
          badgeVariant: path.category === 'AI/ML' ? 'accent' : 'primary',
          statusText: path.is_public === false ? `Draft · ${completedSteps} of ${totalSteps} milestones mapped` : `In Progress · ${percentage}% complete · ${completedSteps} of ${totalSteps} steps finished`,
        };
      };

      const followedDecorated = followed.map(decoratePath);
      const completed = followedDecorated.filter((path) => path.totalSteps > 0 && path.completedSteps === path.totalSteps);
      const activityEvents = [
        ...(reviewsResult.data || []).map((item) => item.created_at),
        ...(suggestionsResult.data || []).map((item) => item.created_at),
        ...progressRows.filter((row) => row.completed).map((item) => item.completed_at),
      ];
      const activity = buildActivityGrid(activityEvents);
      const contributions = activityEvents.filter(Boolean).length;

      setData({
        profile: profileResult.data,
        created: (createdResult.data || []).map(decoratePath),
        followed: followedDecorated.filter((path) => path.completedSteps > 0 && path.completedSteps < path.totalSteps),
        completed,
        stats: {
          created: createdResult.data?.length || 0,
          followed: followedIds.length,
          completed: completed.length,
          contributions,
        },
        activity,
      });
    } catch (caughtError) {
      console.error(caughtError);
      setError(caughtError);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { ...data, loading, error, refetch: fetchProfile };
}
