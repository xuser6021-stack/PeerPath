import React, { useState } from 'react';
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

const STATS_DATA = [
  {
    label: 'Steps completed',
    value: '28',
    subtext: 'across 4 active curricula',
    icon: CheckCircle2,
    color: 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/60 border-success-200/80 dark:border-success-800/80',
  },
  {
    label: 'Current streak',
    value: '14',
    unit: 'days',
    subtext: 'Personal best: 21 days',
    icon: Flame,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80',
  },
  {
    label: 'Paths followed',
    value: '4',
    subtext: '2 nearing completion',
    icon: Compass,
    color: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 border-primary-200/80 dark:border-primary-800/80',
  },
  {
    label: 'Paths created',
    value: '2',
    subtext: '32 community bookmarks',
    icon: Layers,
    color: 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/60 border-accent-200/80 dark:border-accent-800/80',
  },
];

const ACTIVE_PATHS = [
  {
    id: 'fullstack-react-nextjs',
    title: 'Fullstack React & Next.js Architecture',
    category: 'Web Dev',
    completedSteps: 5,
    totalSteps: 7,
    percentage: 71,
    currentStepTitle: 'Server Components & Next.js App Router Internals',
    lastActive: 'Active 2 hours ago',
    badgeVariant: 'primary',
  },
  {
    id: 'generative-ai-llms',
    title: 'Generative AI & LLM App Engineering',
    category: 'AI/ML',
    completedSteps: 4,
    totalSteps: 10,
    percentage: 40,
    currentStepTitle: 'RAG Architecture with Vector Databases',
    lastActive: 'Active yesterday',
    badgeVariant: 'accent',
  },
  {
    id: 'distributed-systems-go',
    title: 'Distributed Systems & Microservices in Go',
    category: 'Backend',
    completedSteps: 2,
    totalSteps: 8,
    percentage: 25,
    currentStepTitle: 'gRPC Streaming & Protocol Buffers',
    lastActive: 'Active 3 days ago',
    badgeVariant: 'neutral',
  },
];

const COMPLETED_PATHS = [
  {
    id: 'modern-typescript-mastery',
    title: 'Modern TypeScript from Zero to Production',
    category: 'Web Dev',
    completionDate: 'Aug 18, 2026',
    milestonesCount: 9,
    author: 'Sofia Morales',
  },
  {
    id: 'ui-design-figma',
    title: 'Product Design Systems & Tokens in Figma',
    category: 'Design',
    completionDate: 'Jul 29, 2026',
    milestonesCount: 8,
    author: 'Elena Rostova',
  },
];

const PEER_MEMBERS = [
  {
    id: 1,
    name: 'Sarah Connor',
    role: 'Staff Frontend Engineer',
    currentMilestone: 'Step 6: Performance & Caching',
    progress: 85,
    status: 'online',
  },
  {
    id: 2,
    name: 'Alex Turner (You)',
    role: 'Full-Stack Learner',
    currentMilestone: 'Step 5: State & Server Actions',
    progress: 71,
    status: 'online',
    isCurrentUser: true,
  },
  {
    id: 3,
    name: 'Marcus Vance',
    role: 'Backend Developer',
    currentMilestone: 'Step 4: App Router Internals',
    progress: 60,
    status: 'away',
  },
  {
    id: 4,
    name: 'Dr. Maya Chen',
    role: 'Data Engineer',
    currentMilestone: 'Step 3: Component Composition',
    progress: 45,
    status: 'offline',
  },
];

export default function Progress() {
  const [showProgressToGroup, setShowProgressToGroup] = useState(true);
  const [showEmptyStateDemo, setShowEmptyStateDemo] = useState(false);
  const navigate = useNavigate();

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
            {STATS_DATA.map((stat) => {
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
                {ACTIVE_PATHS.length} active
              </Badge>
            </div>

            {/* Vertical list of path progress cards */}
            <div className="space-y-4">
              {ACTIVE_PATHS.map((path) => (
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
                {COMPLETED_PATHS.length} Completed
              </Badge>
            </div>

            {/* Simpler List */}
            <div className="space-y-3">
              {COMPLETED_PATHS.map((item) => (
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
                    You're grouped with 4 other learners on <strong>Fullstack React & Next.js Architecture</strong>
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
                {PEER_MEMBERS.map((peer) => (
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
