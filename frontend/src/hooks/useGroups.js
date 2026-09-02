import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useGroups(pathId, userId) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const joinOrCreateGroup = useCallback(async (targetPathId = pathId, targetUserId = userId) => {
    if (!targetPathId || !targetUserId) throw new Error('You must be signed in to join a peer group.');

    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('id, group_members(count)')
      .eq('path_id', targetPathId);
    if (groupsError) throw groupsError;

    const availableGroup = groups?.find((item) => (item.group_members?.[0]?.count || 0) < 5);
    let groupId = availableGroup?.id;

    if (!groupId) {
      const { data: newGroup, error: createError } = await supabase
        .from('groups')
        .insert({ path_id: targetPathId })
        .select('id')
        .single();
      if (createError) throw createError;
      groupId = newGroup.id;
    }

    const { error: memberError } = await supabase
      .from('group_members')
      .upsert({ group_id: groupId, user_id: targetUserId }, { onConflict: 'group_id,user_id', ignoreDuplicates: true });
    if (memberError) throw memberError;

    return groupId;
  }, [pathId, userId]);

  const fetchGroup = useCallback(async () => {
    if (!pathId || !userId) {
      setGroup(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: memberships, error: membershipError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', userId);
      if (membershipError) throw membershipError;

      const groupIds = memberships.map((membership) => membership.group_id);
      if (groupIds.length === 0) {
        setGroup(null);
        return;
      }

      const { data: groups, error: groupError } = await supabase
        .from('groups')
        .select('id, path_id')
        .eq('path_id', pathId)
        .in('id', groupIds);
      if (groupError) throw groupError;
      const currentGroup = groups?.[0];
      if (!currentGroup) {
        setGroup(null);
        return;
      }

      const { data: members, error: membersError } = await supabase
        .from('group_members')
        .select('user_id, profiles(username)')
        .eq('group_id', currentGroup.id);
      if (membersError) throw membersError;

      const memberIds = members.map((member) => member.user_id);
      const { data: memberProgress, error: progressError } = await supabase
        .from('progress')
        .select('user_id, step_id, completed')
        .eq('path_id', pathId)
        .in('user_id', memberIds);
      if (progressError) throw progressError;

      const { count: totalSteps, error: stepsError } = await supabase
        .from('steps')
        .select('id', { count: 'exact', head: true })
        .eq('path_id', pathId);
      if (stepsError) throw stepsError;

      setGroup({
        ...currentGroup,
        members: members.map((member) => ({
          id: member.user_id,
          name: member.profiles?.username || member.user_id,
          progress: totalSteps ? Math.round((memberProgress.filter((item) => item.user_id === member.user_id && item.completed).length / totalSteps) * 100) : 0,
          currentMilestone: 'Shared path progress',
          isCurrentUser: member.user_id === userId,
          status: 'online',
        })),
      });
    } catch (caughtError) {
      console.error(caughtError);
      setError(caughtError);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [pathId, userId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  return { group, loading, error, joinOrCreateGroup, refetch: fetchGroup };
}
