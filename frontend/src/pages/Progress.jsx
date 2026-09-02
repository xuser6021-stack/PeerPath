import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Flame,
  Compass,
  Layers,
  ArrowRight,
  Users,
  Award,
  Calendar,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Card,
  CardTitle,
  ProgressBar,
  Badge,
  Button,
  Avatar,
  EmptyState
} from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { useGroups } from '../hooks/useGroups';
import { supabase } from '../lib/supabaseClient';

const STAT_COLORS = {
  success: 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/60 border-success-200/80 dark:border-success-800/80',
  amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80',
  primary: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 border-primary-200/80 dark:border-primary-800/80',
  accent: 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/60 border-accent-200/80 dark:border-accent-800/80',
};

function getCurrentStreak(progress) {
  const completedDates = new Set(progress.filter((item) => item.completed && item.completed_at).map((item) => new Date(item.completed_at).toISOString().slice(0, 10)));
  let date = new Date();
  let streak = 0;
  while (completedDates.has(date.toISOString().slice(0, 10))) {
    streak += 1;
    date.setUTCDate(date.getUTCDate() - 1);
  }
  return streak;
}

function pathProgressRowsForPath(path, rows) {
  return rows.filter((row) => row.path_id === path.id && row.completed);
}

export default function Progress() {
  const { user } = useAuth();
  const [showProgressToGroup, setShowProgressToGroup] = useState(true);
  const [showEmptyStateDemo, setShowEmptyStateDemo] = useState(false);
  const [progressRows, setProgressRows] = useState([]);
  const [followedPaths, setFollowedPaths] = useState([]);
  const [createdPathsCount, setCreatedPathsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    const loadProgress = async () => {
      setLoading(true);
      const [{ data: progressData, error: progressError }, { count: createdPathsCountFromDb, error: createdError }] = await Promise.all([
        supabase.from('progress').select('user_id, path_id, step_id, completed, completed_at').eq('user_id', user.id),
        supabase.from('paths').select('id', { count: 'exact', head: true }).eq('author_id', user.id),
      ]);
      if (progressError || createdError) {
        toast.error((progressError || createdError).message);
        setLoading(false);
        return;
      }
      const rows = progressData || [];
      const pathIds = [...new Set(rows.map((row) => row.path_id))];
      let paths = [];
      if (pathIds.length > 0) {
        const { data, error } = await supabase
          .from('paths')
          .select('id, title, category, author_id, profiles(username), steps(id, title, order_index)')
          .in('id', pathIds);
        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }
        paths = data || [];
      }
      setProgressRows(rows);
      setFollowedPaths(paths);
      setCreatedPathsCount(createdPathsCountFromDb || 0);
      setLoading(false);
    };
    loadProgress();
  }, [user?.id]);

  const activePaths = followedPaths.map((path) => {
    const pathProgress = progressRows.filter((row) => row.path_id === path.id);
    const completedSteps = pathProgress.filter((row) => row.completed).length;
    const totalSteps = path.steps?.length || 0;
    const nextStep = path.steps?.find((step) => !pathProgress.some((row) => row.step_id === step.id && row.completed));
    const latestActivity = pathProgress.map((row) => row.completed_at || row.created_at).filter(Boolean).sort().at(-1);
    return {
      ...path,
      completedSteps,
      totalSteps,
      percentage: totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0,
      currentStepTitle: nextStep?.title || 'All steps complete',
      lastActive: latestActivity ? `Active ${new Date(latestActivity).toLocaleDateString()}` : 'Not started',
      badgeVariant: path.category === 'AI/ML' ? 'accent' : 'primary',
    };
  }).filter((path) => path.completedSteps > 0 && path.completedSteps < path.totalSteps);

  const completedPaths = followedPaths.map((path) => {
    const pathProgress = progressRows.filter((row) => row.path_id === path.id && row.completed);
    const completionDate = pathProgress.map((row) => row.completed_at).filter(Boolean).sort().at(-1);
    return {
      ...path,
      completionDate: completionDate ? new Date(completionDate).toLocaleDateString() : 'Completed',
      milestonesCount: path.steps?.length || 0,
      author: path.profiles?.username || path.author_id,
    };
  }).filter((path) => path.steps?.length > 0 && pathProgressRowsForPath(path, progressRows).length === path.steps.length);

  const peerPath = activePaths[0] || completedPaths[0] || followedPaths[0];
  const { group } = useGroups(peerPath?.id, user?.id);
  const statsData = [
    { label: 'Steps completed', value: progressRows.filter((row) => row.completed).length, subtext: `across ${new Set(progressRows.map((row) => row.path_id)).size} paths`, icon: CheckCircle2, color: STAT_COLORS.success },
    { label: 'Current streak', value: getCurrentStreak(progressRows), unit: 'days', subtext: 'Consecutive learning days', icon: Flame, color: STAT_COLORS.amber },
    { label: 'Paths followed', value: new Set(progressRows.map((row) => row.path_id)).size, subtext: `${activePaths.length} in progress`, icon: Compass, color: STAT_COLORS.primary },
    { label: 'Paths created', value: createdPathsCount, subtext: 'Created by you', icon: Layers, color: STAT_COLORS.accent },
  ];

  if (loading) {
    return <div className="space-y-10 py-2 sm:py-6 max-w-5xl mx-auto text-sm text-slate-500">Loading learning progress...</div>;
  }

  const handleToggleShare = () => {
    const next = !showProgressToGroup;
    setShowProgressToGroup(next);
    toast.success(
      next
        ? 'Your progress is now visible to your peer group'
        : 'Your progress is now hidden from peers'
    );
  };

  return (
    <div className="space-y-10 py-2 sm:py-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Learning Progress
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Track your milestone achievements, active curricula, and peer cohort standing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmptyStateDemo(!showEmptyStateDemo)}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            {showEmptyStateDemo ? 'Show Active View' : 'Demo Empty State'}
          </Button>
          <Link to="/explore">
            <Button variant="primary" size="sm" rightIcon={ArrowRight}>
              Explore More Paths
            </Button>
          </Link>
        </div>
      </div>

      {showEmptyStateDemo ? (
        /* 5. EMPTY STATE VARIANT (When user has no active paths) */
        <EmptyState
          icon={Compass}
          title="No active paths followed yet"
          description="You haven't enrolled in any peer-created learning paths. Explore the curated catalog or start building your own curriculum roadmap."
          actionLabel="Explore paths"
          actionIcon={ArrowRight}
          onAction={() => navigate('/explore')}
          className="my-8"
        />
      ) : (
        <>
          {/* 1. 2x2 STAT GRID AT THE TOP (Single col below ~400px, 2 col mobile, 4 col desktop) */}
          <section className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-5 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </span>
                    <div className={`p-2 rounded-xl border ${stat.color} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {stat.value}
                      </span>
                      {stat.unit && (
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {stat.unit}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      {stat.subtext}
                    </p>
                  </div>
                </Card>
              );
            })}
          </section>

          {/* 2. "CONTINUE LEARNING" SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Continue learning
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Pick up right where you left off in your enrolled curricula
                </p>
              </div>
              <Badge variant="primary" dot>
                {activePaths.length} active
              </Badge>
            </div>

            {/* Vertical list of path progress cards */}
            <div className="space-y-4">
              {activePaths.map((path) => (
                <Card
                  key={path.id}
                  className="p-5 sm:p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Path Title & Metadata */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={path.badgeVariant}>
                          {path.category}
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {path.lastActive}
                        </span>
                      </div>

                      <CardTitle className="text-base sm:text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {path.title}
                      </CardTitle>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Current milestone: <strong className="text-slate-700 dark:text-slate-300">{path.currentStepTitle}</strong>
                      </p>
                    </div>

                    {/* Progress Bar & Resume Button */}
                    <div className="sm:w-72 space-y-3 sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-6">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-400">
                          {path.completedSteps} of {path.totalSteps} steps
                        </span>
                        <span className="text-primary-600 dark:text-primary-400 font-bold">
                          {path.percentage}%
                        </span>
                      </div>

                      <ProgressBar
                        value={path.completedSteps}
                        max={path.totalSteps}
                        variant="primary"
                        size="md"
                      />

                      <div className="flex justify-end pt-1">
                        <Link to={`/path/${path.id}`} className="w-full">
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            rightIcon={ArrowRight}
                          >
                            Resume
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* 3. "COMPLETED PATHS" SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Completed paths
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Fully verified curricula you've conquered and archived
                </p>
              </div>
              <Badge variant="success">
                {completedPaths.length} Completed
              </Badge>
            </div>

            {/* Simpler List */}
            <div className="space-y-3">
              {completedPaths.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-success-50 dark:bg-success-950/80 border border-success-200/80 dark:border-success-800/80 flex items-center justify-center text-success-600 dark:text-success-400 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Curated by {item.author}</span>
                        <span>•</span>
                        <span>{item.milestonesCount} milestones</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.completionDate}</span>
                    </div>

                    <Badge variant="success" dot className="font-semibold">
                      Completed
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* 4. "YOUR PEER GROUP" SECTION */}
          <section className="space-y-4">
            <Card className="p-6 sm:p-7 space-y-6">
              {/* Section Header with Toggle Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-500" />
                    Your peer group
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {group?.members?.length ? `You're grouped with ${group.members.length - 1} other learners on ` : 'Join a peer group to learn alongside others on '}<strong>{peerPath?.title || 'your active path'}</strong>
                  </p>
                </div>

                {/* Toggle switch: "Show my progress to my group" */}
                <label className="inline-flex items-center gap-3 cursor-pointer self-start sm:self-auto select-none">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Show my progress to my group
                  </span>
                  <div
                    onClick={handleToggleShare}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                      showProgressToGroup
                        ? 'bg-primary-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                        showProgressToGroup ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </label>
              </div>

              {/* Peer Rows */}
              <div className="space-y-3">
                {(group?.members || []).map((peer) => (
                  <div
                    key={peer.id}
                    className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      peer.isCurrentUser
                        ? 'bg-primary-50/50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800'
                        : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800/80'
                    }`}
                  >
                    {/* Peer Identity */}
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={peer.name}
                        size="sm"
                        status={peer.status}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {peer.name}
                          </span>
                          {peer.isCurrentUser && (
                            <Badge variant="primary" size="sm">You</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {peer.currentMilestone}
                        </p>
                      </div>
                    </div>

                    {/* Progress percentage aligned right with mini progress bar */}
                    <div className="flex items-center gap-3 sm:w-48 self-end sm:self-center">
                      <div className="flex-1">
                        <ProgressBar
                          value={peer.progress}
                          max={100}
                          variant={peer.isCurrentUser ? 'primary' : 'accent'}
                          size="sm"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-10 text-right">
                        {peer.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
