import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
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

// Default Path Details with 7 Steps
const INITIAL_PATH_DATA = {
  title: 'Fullstack React & Next.js Architecture',
  description: 'A comprehensive, peer-reviewed roadmap to mastering modern full-stack React 19, server actions, optimistic UI, caching strategies, and production deployments.',
  author: 'Alex Turner',
  authorRole: 'Staff Frontend Architect',
  followers: '2,450',
  forksCount: 6,
  healthScore: 94,
  category: 'Web Dev',
  rating: 4.9,
  reviewsCount: 184,
  steps: [
    {
      id: 1,
      number: 1,
      title: 'Modern JavaScript & TypeScript Prerequisites',
      description: 'Review async iterators, closures, TypeScript generics, discriminant unions, and module bundlers.',
      isCompleted: true,
      resources: [
        {
          id: 'r1-1',
          type: 'doc',
          title: 'TypeScript 5.x Deep Dive & Utility Types',
          duration: '35 mins read',
          progress: '100% finished',
        },
        {
          id: 'r1-2',
          type: 'video',
          title: 'Mastering JavaScript Event Loop & Microtasks',
          duration: '42 mins video',
          progress: '100% finished',
        },
      ],
    },
    {
      id: 2,
      number: 2,
      title: 'React 19 Core Mental Model & Hook Composition',
      description: 'Understand the fiber reconciliation engine, useActionState, useOptimistic, and compiler optimizations.',
      isCompleted: true,
      resources: [
        {
          id: 'r2-1',
          type: 'doc',
          title: 'React 19 Official Upgrade & Architecture Guide',
          duration: '25 mins read',
          progress: '100% finished',
        },
        {
          id: 'r2-2',
          type: 'video',
          title: 'Concurrency, Transitions & useActionState Deep Dive',
          duration: '50 mins video',
          progress: '100% finished',
        },
      ],
    },
    {
      id: 3,
      number: 3,
      title: 'Advanced Component Patterns & Custom Hook Architecture',
      description: 'Compound components, render props with polymorphic types, custom hook test harnesses, and headless UI.',
      isCompleted: true,
      resources: [
        {
          id: 'r3-1',
          type: 'article',
          title: 'Building Bulletproof Polymorphic Components in TypeScript',
          duration: '20 mins read',
          progress: '100% finished',
        },
        {
          id: 'r3-2',
          type: 'project',
          title: 'Mini-Lab: Headless Modal & Dropdown Composition',
          duration: '1.5 hours hands-on',
          progress: '100% finished',
        },
      ],
    },
    {
      id: 4,
      number: 4,
      title: 'Server Components & Next.js App Router Internals',
      description: 'Deconstruct React Server Components (RSC), streaming SSR with Suspense, client boundaries, and caching layers.',
      isCompleted: false,
      resources: [
        {
          id: 'r4-1',
          type: 'video',
          title: 'RSC Mental Model from Scratch (No Magic)',
          duration: '38 mins video',
          progress: '78% finished',
        },
        {
          id: 'r4-2',
          type: 'doc',
          title: 'Next.js App Router: Caching, ISR & Server Actions Spec',
          duration: '30 mins read',
          progress: '65% finished',
        },
        {
          id: 'r4-3',
          type: 'article',
          title: 'Preventing Waterfalls with Parallel Data Fetching in Server Components',
          duration: '18 mins read',
          progress: '40% finished',
        },
        {
          id: 'r4-4',
          type: 'project',
          title: 'Hands-on Milestone: Streaming Catalog with Suspense Boundaries',
          duration: '2 hours coding',
          progress: 'Not started',
        },
      ],
    },
    {
      id: 5,
      number: 5,
      title: 'Full-Stack State Management & Server Actions',
      description: 'Zustand client state, TanStack Query integration, form mutations with Server Actions, and optimistic updates.',
      isCompleted: false,
      resources: [
        {
          id: 'r5-1',
          type: 'article',
          title: 'Optimistic UI Updates with Server Actions & useOptimistic',
          duration: '22 mins read',
          progress: 'Not started',
        },
        {
          id: 'r5-2',
          type: 'video',
          title: 'When to Use Zustand vs React Context vs Server Cache',
          duration: '45 mins video',
          progress: 'Not started',
        },
      ],
    },
    {
      id: 6,
      number: 6,
      title: 'Performance Optimization, Caching & Bundle Analysis',
      description: 'Dynamic imports, Webpack/Turbopack analysis, image optimization, edge caching, and Core Web Vitals profiling.',
      isCompleted: false,
      resources: [
        {
          id: 'r6-1',
          type: 'doc',
          title: 'Core Web Vitals Optimization Checklist for Next.js Apps',
          duration: '25 mins read',
          progress: 'Not started',
        },
      ],
    },
    {
      id: 7,
      number: 7,
      title: 'Production Deployment, CI/CD & Observability',
      description: 'Vercel & Docker containerized deployments, OpenTelemetry tracing, automated Lighthouse testing, and error monitoring with Sentry.',
      isCompleted: false,
      resources: [
        {
          id: 'r7-1',
          type: 'project',
          title: 'Capstone: End-to-End Enterprise React App with Full CI/CD',
          duration: '4 hours capstone',
          progress: 'Not started',
        },
      ],
    },
  ],
};

// Initial Reviews Mock
const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Sarah Connor',
    role: 'Senior Engineer at FinTech Corp',
    rating: 5,
    date: '3 days ago',
    comment: 'The explanation of Server Components in Step 4 saved me dozens of hours of trial and error. The recommended resources are pristine.',
    helpfulCount: 24,
  },
  {
    id: 2,
    author: 'Devon Miles',
    role: 'Full-Stack Developer',
    rating: 5,
    date: '1 week ago',
    comment: 'Clear roadmap with high-signal resources. Step 2 & 3 custom hook composition patterns directly improved our codebase at work.',
    helpfulCount: 16,
  },
  {
    id: 3,
    author: 'Elena Rostova',
    role: 'Frontend Specialist',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Excellent path overall. Would love to see an additional module on TanStack Table for complex data grids, but the core fundamentals are 10/10.',
    helpfulCount: 9,
  },
];

export default function PathDetail() {
  const { id } = useParams();

  // Format title if ID is provided in route
  const displayTitle = useMemo(() => {
    if (!id || id === 'react-mastery' || id === 'fullstack-react-nextjs') {
      return INITIAL_PATH_DATA.title;
    }
    return id
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [id]);
  const [steps, setSteps] = useState(INITIAL_PATH_DATA.steps);
  // Current active step ID (first uncompleted step, default id: 4)
  const currentStepId = useMemo(() => {
    const firstUnfinished = steps.find((s) => !s.isCompleted);
    return firstUnfinished ? firstUnfinished.id : steps[steps.length - 1].id;
  }, [steps]);

  // Open / expanded step rows: current step is expanded by default
  const [expandedSteps, setExpandedSteps] = useState(() => ({
    4: true,
  }));

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Reviews state & Review Modal
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('Alex Turner');

  // Compute progress
  const completedCount = steps.filter((s) => s.isCompleted).length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  // Toggle step expansion
  const toggleStepExpand = (stepId) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Toggle step completion checkbox
  const handleToggleCompletion = (stepId, e) => {
    e.stopPropagation();
    setSteps((prevSteps) =>
      prevSteps.map((step) => {
        if (step.id === stepId) {
          const nextCompleted = !step.isCompleted;
          if (nextCompleted) {
            toast.success(`Completed Step ${step.number}: ${step.title}`);
          }
          return { ...step, isCompleted: nextCompleted };
        }
        return step;
      })
    );
  };

  // Suggest alternative resource handler
  const handleSuggestAlternative = (resourceTitle) => {
    console.log('Suggest alternative for resource:', resourceTitle);
    toast.success(`Suggestion opened for: "${resourceTitle}"`);
  };

  // Fork handler
  const handleFork = () => {
    toast.success('Forked path to your workspace! You can customize this version.');
  };

  // Submit Review Modal
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newReviewObj = {
      id: Date.now(),
      author: authorName || 'Anonymous Learner',
      role: 'Verified Path Learner',
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      helpfulCount: 0,
    };

    setReviews([newReviewObj, ...reviews]);
    setNewComment('');
    setIsReviewModalOpen(false);
    toast.success('Thank you! Your review was published.');
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
          <Badge variant="primary">{INITIAL_PATH_DATA.category}</Badge>
          <Badge variant="must">MUST LEARN</Badge>
          <Badge variant="success" dot className="font-semibold">
            Health {INITIAL_PATH_DATA.healthScore}
          </Badge>
        </div>

        {/* Path Title & Description */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {displayTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {INITIAL_PATH_DATA.description}
          </p>
        </div>

        {/* Author Info & Follower Counts */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <Avatar name={INITIAL_PATH_DATA.author} size="sm" status="online" />
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {INITIAL_PATH_DATA.author}
            </span>
            <span className="text-slate-400 text-xs">({INITIAL_PATH_DATA.authorRole})</span>
          </div>

          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{INITIAL_PATH_DATA.followers} learners</span>
          </div>

          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{INITIAL_PATH_DATA.rating}</span>
            <span className="text-slate-400 font-normal">({INITIAL_PATH_DATA.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Button Row: Start Path, Fork, Variants Link */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={Play}
              onClick={() => {
                setIsStarted(true);
                toast.success('Resumed path milestone!');
              }}
              className="shadow-md shadow-primary-500/20 font-semibold"
            >
              {isStarted ? 'Resume path' : 'Start path'}
            </Button>

            <Button
              variant="outline"
              size="md"
              leftIcon={GitFork}
              onClick={handleFork}
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
            <span>Forked {INITIAL_PATH_DATA.forksCount} times — see variants</span>
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
            <span>Next up: Step {currentStepId} — Server Components & Next.js App Router Internals</span>
            <span className="text-primary-600 dark:text-primary-400 font-medium">Est. 4 hours remaining</span>
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
                                      {resource.duration}
                                    </p>
                                  </div>
                                </div>

                                {/* Right-Aligned Progress / Finished Label */}
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                                  {resource.progress}
                                </span>
                              </div>

                              {/* 5. Suggest Alternative Button */}
                              <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleSuggestAlternative(resource.title)}
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
    </div>
  );
}
