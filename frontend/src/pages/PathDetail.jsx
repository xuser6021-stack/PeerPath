import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  GitFork,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileText,
  BookOpen,
  Code2,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Sparkles,
  MessageSquarePlus,
  ThumbsUp,
  X,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Card, Badge, Avatar, ProgressBar } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { usePath } from '../hooks/usePath';
import { useProgress } from '../hooks/useProgress';
import { useCreatePath } from '../hooks/useCreatePath';
import { useGroups } from '../hooks/useGroups';
import { supabase } from '../lib/supabaseClient';
import Skeleton from '../components/common/Skeleton';

function PathDetailSkeleton() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto py-2 sm:py-6">
      <div className="flex justify-between"><Skeleton width={140} height={34} /><Skeleton width={190} height={34} /></div>
      <div className="space-y-5 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2"><Skeleton width={80} height={24} variant="badge" /><Skeleton width={90} height={24} variant="badge" /></div>
        <Skeleton width="75%" height={48} />
        <Skeleton width="90%" height={48} />
        <Skeleton width="55%" height={24} />
        <div className="flex gap-3"><Skeleton width={130} height={40} /><Skeleton width={90} height={40} /></div>
      </div>
      <Card className="p-5 sm:p-6 space-y-4"><Skeleton width="100%" height={20} /><Skeleton width="100%" height={14} /><Skeleton width="45%" height={14} /></Card>
      <div className="space-y-4"><Skeleton width="45%" height={30} count={1} /><Skeleton height={110} count={4} /></div>
    </div>
  );
}

export default function PathDetail() {
  const { id: pathId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { path, loading: pathLoading, error: pathError, refetch: refetchPath } = usePath(pathId);
  const { progress, markStepComplete, refetch: refetchProgress } = useProgress(user?.id, pathId);
  const { forkPath, loading: forkLoading } = useCreatePath({ userId: user?.id });
  const { joinOrCreateGroup } = useGroups(pathId, user?.id);
  const [isStarted, setIsStarted] = useState(false);

  const steps = useMemo(() => (path?.steps || []).map((step, index) => ({
    ...step,
    number: index + 1,
    isCompleted: progress.some((item) => item.step_id === step.id && item.completed),
  })), [path, progress]);
  const currentStepId = useMemo(() => {
    const firstUnfinished = steps.find((s) => !s.isCompleted);
    return firstUnfinished?.id || steps[steps.length - 1]?.id;
  }, [steps]);

  // Open / expanded step rows: current step is expanded by default
  const [expandedSteps, setExpandedSteps] = useState(() => ({
    4: true,
  }));

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState(user?.user_metadata?.username || user?.email || '');
  const [suggestionResource, setSuggestionResource] = useState(null);
  const [suggestionUrl, setSuggestionUrl] = useState('');
  const [suggestionTitle, setSuggestionTitle] = useState('');
  const [suggestionReason, setSuggestionReason] = useState('');

  // Compute progress
  const completedCount = progress.filter((item) => item.completed && steps.some((step) => step.id === item.step_id)).length;
  const totalSteps = steps.length;
  const progressPercent = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;
  const reviews = useMemo(() => (path?.steps || []).flatMap((step) =>
    (step.resources || []).flatMap((resource) => (resource.reviews || []).map((review) => ({
      ...review,
      resource_id: resource.id,
      author: review.user_id || 'Peer learner',
      role: 'Verified Path Learner',
      date: review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recently',
      helpfulCount: 0,
    })))
  ), [path]);

  if (pathLoading) {
    return <PathDetailSkeleton />;
  }

  if (pathError || !path) {
    return <div className="max-w-4xl mx-auto py-10 text-center text-slate-500">Unable to load this path.</div>;
  }

  // Toggle step expansion
  const toggleStepExpand = (stepId) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Toggle step completion checkbox
  const handleToggleCompletion = async (stepId, e) => {
    e.stopPropagation();
    const step = steps.find((item) => item.id === stepId);
    await markStepComplete(stepId, !step.isCompleted);
    if (!step.isCompleted) toast.success(`Completed Step ${step.number}: ${step.title}`);
  };

  const handleSuggestAlternative = (resource) => {
    setSuggestionResource(resource);
    setSuggestionTitle(resource.title);
    setSuggestionUrl(resource.url || '');
  };

  const handleStart = async () => {
    if (!user) return toast.error('Sign in to start this path.');
    if (progress.length === 0) {
      const { error } = await supabase.from('progress').insert(steps.map((step) => ({
        user_id: user.id,
        path_id: pathId,
        step_id: step.id,
        completed: false,
      })));
      if (error) return toast.error(error.message);
      await refetchProgress();
    }
    try {
      await joinOrCreateGroup(pathId, user.id);
    } catch (error) {
      toast.error(error.message || 'Unable to join a peer group.');
    }
    setIsStarted(true);
    toast.success('Path is now in progress.');
  };

  const handleFork = async () => {
    if (!user) return toast.error('Sign in to fork this path.');
    const forked = await forkPath(pathId);
    if (!forked) return toast.error('Unable to fork this path.');
    toast.success('Forked path to your workspace!');
    navigate(`/path/${forked.pathId}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const resourceId = path.steps.flatMap((step) => step.resources || [])[0]?.id;
    if (!resourceId || !newComment.trim() || !user) return;
    const { error } = await supabase.from('reviews').insert({
      resource_id: resourceId,
      user_id: user.id,
      rating: newRating,
      comment: newComment.trim(),
    });
    if (error) return toast.error(error.message);
    const { data: resourceReviews, error: reviewsError } = await supabase.from('reviews').select('rating').eq('resource_id', resourceId);
    if (reviewsError) return toast.error(reviewsError.message);
    const average = resourceReviews.reduce((sum, review) => sum + review.rating, 0) / resourceReviews.length;
    const { error: updateError } = await supabase.from('resources').update({ avg_rating: average }).eq('id', resourceId);
    if (updateError) return toast.error(updateError.message);
    setNewComment('');
    setIsReviewModalOpen(false);
    await refetchPath();
    toast.success('Thank you! Your review was published.');
  };

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!suggestionResource || !user || !suggestionUrl.trim() || !suggestionTitle.trim()) return;
    const { error } = await supabase.from('suggestions').insert({
      resource_id: suggestionResource.id,
      suggested_by: user.id,
      suggested_url: suggestionUrl.trim(),
      suggested_title: suggestionTitle.trim(),
      reason: suggestionReason.trim(),
    });
    if (error) return toast.error(error.message);
    setSuggestionResource(null);
    setSuggestionReason('');
    toast.success('Alternative resource suggested.');
  };

  // Resource Icon Helper
  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'doc':
        return FileText;
      case 'article':
        return BookOpen;
      case 'project':
      default:
        return Code2;
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-2 sm:py-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/explore">
          <Button variant="ghost" size="sm" leftIcon={ArrowLeft}>
            Back to Explore
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={Share2}
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success('Path link copied to clipboard!');
            }}
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={Bookmark}
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              toast.success(isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks!');
            }}
            className={isBookmarked ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300' : ''}
          >
            {isBookmarked ? 'Saved' : 'Bookmark'}
          </Button>
        </div>
      </div>

      {/* 1. HEADER BLOCK */}
      <div className="space-y-5 pb-6 border-b border-slate-200 dark:border-slate-800">
        {/* Category & Health Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{path.category || 'Uncategorized'}</Badge>
          <Badge variant="must">MUST LEARN</Badge>
          <Badge variant="success" dot className="font-semibold">
            {path.difficulty || 'Path'}
          </Badge>
        </div>

        {/* Path Title & Description */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {path.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {path.description}
          </p>
        </div>

        {/* Author Info & Follower Counts */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <Avatar name={path.profiles?.username || path.author_id} size="sm" status="online" />
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {path.profiles?.username || path.author_id}
            </span>
            <span className="text-slate-400 text-xs">(Path author)</span>
          </div>

          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{path.learners_count || 0} learners</span>
          </div>

          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}</span>
            <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
          </div>
        </div>

        {/* Button Row: Start Path, Fork, Variants Link */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={Play}
              onClick={handleStart}
              className="shadow-md shadow-primary-500/20 font-semibold"
            >
              {isStarted || progress.length > 0 ? 'Resume path' : 'Start path'}
            </Button>

            <Button
              variant="outline"
              size="md"
              leftIcon={GitFork}
              onClick={handleFork}
              isLoading={forkLoading}
              title="Fork this roadmap to create your own customized curriculum"
            >
              Fork
            </Button>
          </div>

          {/* Small text link underneath */}
          <button
            type="button"
            onClick={() => toast('6 peer variants created from this curriculum', { icon: '🔀' })}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer self-start sm:self-center"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Forked {path.forks_count || 0} times — see variants</span>
          </button>
        </div>
      </div>

      {/* 2. OVERALL PROGRESS BAR */}
      <Card className="p-5 sm:p-6">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              Overall Roadmap Progress
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              <strong>{completedCount}</strong> of <strong>{totalSteps}</strong> steps complete ({progressPercent}%)
            </span>
          </div>

          <ProgressBar
            value={completedCount}
            max={totalSteps}
            variant="primary"
            size="md"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Next up: {currentStepId ? `Step ${steps.find((step) => step.id === currentStepId)?.number}` : 'Complete'}</span>
            <span className="text-primary-600 dark:text-primary-400 font-medium">{progressPercent}% complete</span>
          </div>
        </div>
      </Card>

      {/* 3. THE ROADMAP VERTICAL STEPPER */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Curriculum Milestones
          </h2>
          <span className="text-xs text-slate-500">
            Click any step to inspect resources
          </span>
        </div>

        {/* Vertical Stepper List */}
        <div className="relative space-y-4">
          {/* Continuous vertical timeline connector line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

          {steps.map((step) => {
            const isCompleted = step.isCompleted;
            const isCurrent = step.id === currentStepId && !isCompleted;
            const isLocked = !isCompleted && !isCurrent;
            const isExpanded = !!expandedSteps[step.id];

            return (
              <div
                key={step.id}
                className={`relative z-10 transition-all duration-200 rounded-2xl ${
                  isCurrent
                    ? 'bg-primary-50/40 dark:bg-primary-950/20 border-2 border-primary-500/40 shadow-sm'
                    : isLocked
                    ? 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 opacity-85'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Step Row Header (Clickable / Expandable) */}
                <div
                  onClick={() => toggleStepExpand(step.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none group"
                >
                  {/* Left status icon and title */}
                  <div className="flex items-start gap-3.5">
                    {/* Status Icon on the left */}
                    <div className="mt-0.5 shrink-0 bg-white dark:bg-slate-900 rounded-full p-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-success-500 fill-success-100 dark:fill-success-950/60" />
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Step Title & Metadata */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Step 0{step.number}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300 text-[10px] font-bold">
                            CURRENT STEP
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-300 text-[10px] font-bold">
                            COMPLETED
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-base sm:text-lg tracking-tight ${
                          isCurrent
                            ? 'font-bold text-primary-900 dark:text-primary-100'
                            : isCompleted
                            ? 'font-medium text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700'
                            : 'font-semibold text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {step.title}
                      </h3>

                      {step.description && (
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Completion Checkbox & Expand Arrow */}
                  <div className="flex items-center gap-3 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                    {/* Mark Complete Checkbox */}
                    <label
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg"
                      title={isCompleted ? 'Mark as incomplete' : 'Mark milestone as complete'}
                    >
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={(e) => handleToggleCompletion(step.id, e)}
                        className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                      />
                      <span className="hidden sm:inline text-[11px] font-medium">
                        {isCompleted ? 'Done' : 'Mark done'}
                      </span>
                    </label>

                    {/* Expand/Collapse Chevron */}
                    <button
                      type="button"
                      onClick={() => toggleStepExpand(step.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      aria-label="Toggle step details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 4. EXPANDED STEP CONTENT (Resource List) */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider pt-2">
                      <span>Curated Learning Resources ({step.resources?.length || 0})</span>
                      <span>Progress Status</span>
                    </div>

                    <div className="space-y-3">
                      {step.resources && step.resources.length > 0 ? (
                        step.resources.map((resource) => {
                          const IconComponent = getResourceIcon(resource.type);

                          return (
                            <div
                              key={resource.id}
                              className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                {/* Icon + Resource Title */}
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                                      {resource.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5">
                                      <Clock className="w-3 h-3" />
                                      {resource.type || 'Resource'}
                                    </p>
                                  </div>
                                </div>

                                {/* Right-Aligned Progress / Finished Label */}
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                                  {resource.url ? 'Open resource' : 'No link available'}
                                </span>
                              </div>

                              {/* 5. Suggest Alternative Button */}
                              <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleSuggestAlternative(resource)}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                                >
                                  <MessageSquarePlus className="w-3 h-3" />
                                  <span>Suggest an alternative</span>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic py-2">
                          No resources logged for this step yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. REVIEWS SECTION */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Learner Reviews
              </h2>
              <Badge variant="accent" dot>
                {reviews.length} reviews
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Verified feedback from learners who completed or forked this path
            </p>
          </div>

          {/* Write a Review Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={Star}
            onClick={() => setIsReviewModalOpen(true)}
            className="self-start sm:self-auto shadow-sm"
          >
            Write a review
          </Button>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Author row + Star rating */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={rev.author} size="sm" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {rev.author}
                      </h4>
                      <p className="text-[11px] text-slate-500">{rev.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Card Footer: Date & Helpful votes */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{rev.date}</span>
                <button
                  type="button"
                  onClick={() => toast.success('Marked as helpful!')}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. WRITE A REVIEW MODAL DIALOG */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-7 relative space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Review this Learning Path
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 rounded text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= newRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-2">
                    {newRating} / 5 stars
                  </span>
                </div>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Name / Handle
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex Turner"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Feedback & Impressions
                </label>
                <textarea
                  rows={4}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What was the most valuable step? Any resources that need improvement or updating?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {suggestionResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-7 relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Suggest an alternative</h3>
              <button type="button" onClick={() => setSuggestionResource(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" aria-label="Close suggestion form">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500">Suggesting an alternative to: {suggestionResource.title}</p>
            <form onSubmit={handleSuggestionSubmit} className="space-y-4">
              <input required type="text" value={suggestionTitle} onChange={(e) => setSuggestionTitle(e.target.value)} placeholder="Suggested resource title" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input required type="url" value={suggestionUrl} onChange={(e) => setSuggestionUrl(e.target.value)} placeholder="https://example.com/resource" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <textarea rows={3} value={suggestionReason} onChange={(e) => setSuggestionReason(e.target.value)} placeholder="Why is this a better alternative?" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" type="button" onClick={() => setSuggestionResource(null)}>Cancel</Button>
                <Button variant="primary" type="submit">Submit suggestion</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
