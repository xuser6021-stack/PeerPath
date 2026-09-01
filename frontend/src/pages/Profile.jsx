import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit3,
  MapPin,
  Calendar,
  Layers,
  Compass,
  CheckCircle2,
  GitPullRequest,
  Award,
  Flame,
  ArrowRight,
  Sparkles,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Avatar, Badge, Button, ProgressBar } from '../components/common';

// Generate 16 weeks x 7 days of realistic mock contribution heatmap activity
function generateContributionGrid() {
  const weeks = 16;
  const daysPerWeek = 7;
  const grid = [];
  let totalContribs = 0;

  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < daysPerWeek; d++) {
      // Deterministic pseudo-randomness for stable rendering
      const rand = Math.sin(w * 7 + d * 13) * 10000;
      const val = Math.abs(rand - Math.floor(rand));
      let level = 0;
      let count = 0;

      if (val > 0.8) {
        level = 4;
        count = Math.floor(val * 8) + 4;
      } else if (val > 0.6) {
        level = 3;
        count = Math.floor(val * 4) + 2;
      } else if (val > 0.35) {
        level = 2;
        count = 2;
      } else if (val > 0.18) {
        level = 1;
        count = 1;
      }

      totalContribs += count;
      week.push({ level, count, day: d, week: w });
    }
    grid.push(week);
  }
  return { grid, totalContribs };
}

const TAB_DATA = {
  created: [
    {
      id: 'fullstack-react-nextjs',
      title: 'Fullstack React & Next.js Architecture',
      description: 'Master server actions, React 19 compiler paradigms, and enterprise streaming SSR.',
      category: 'Web Dev',
      badgeVariant: 'primary',
      statusText: 'Published · ★ 4.9 avg rating (184 reviews)',
      learners: '2,450 learners',
      milestones: 7,
      isCreator: true,
    },
    {
      id: 'distributed-systems-go',
      title: 'Distributed Systems & Microservices in Go',
      description: 'Concurrency patterns, gRPC streaming, Raft consensus, and observability in Go.',
      category: 'Backend',
      badgeVariant: 'accent',
      statusText: 'Published · ★ 4.8 avg rating (82 reviews)',
      learners: '1,150 learners',
      milestones: 8,
      isCreator: true,
    },
    {
      id: 'typescript-patterns-draft',
      title: 'Advanced TypeScript & Type-Level Metaprogramming',
      description: 'AST transforms, conditional types, template literals, and domain modeling.',
      category: 'Web Dev',
      badgeVariant: 'neutral',
      statusText: 'Draft · 3 of 6 milestones mapped',
      learners: 'Drafting',
      milestones: 6,
      isCreator: true,
    },
  ],
  followed: [
    {
      id: 'generative-ai-llms',
      title: 'Generative AI & LLM App Engineering',
      description: 'Build robust RAG pipelines, agentic workflows, and vector database systems.',
      category: 'AI/ML',
      badgeVariant: 'accent',
      statusText: 'In Progress · 40% complete · 4 of 10 steps finished',
      progress: 40,
      currentStep: 'Step 4: Vector Embeddings & Hybrid Search',
    },
    {
      id: 'applied-data-science-python',
      title: 'Applied Data Science with Python & Polars',
      description: 'Exploratory data analytics, statistical modeling, and high-speed dataframes.',
      category: 'Data Science',
      badgeVariant: 'success',
      statusText: 'In Progress · 65% complete · 10 of 16 steps finished',
      progress: 65,
      currentStep: 'Step 11: Machine Learning Pipelines',
    },
    {
      id: 'cloud-native-kubernetes',
      title: 'Cloud Native & Kubernetes Microservices',
      description: 'Container orchestration, GitOps deployment, service mesh, and cluster monitoring.',
      category: 'DevOps',
      badgeVariant: 'warning',
      statusText: 'In Progress · 20% complete · 3 of 14 steps finished',
      progress: 20,
      currentStep: 'Step 4: Helm Charts & Ingress Controllers',
    },
  ],
  completed: [
    {
      id: 'modern-typescript-mastery',
      title: 'Modern TypeScript from Zero to Production',
      description: 'Comprehensive static typing, generics, build tooling, and design patterns.',
      category: 'Web Dev',
      badgeVariant: 'success',
      statusText: 'Completed on Aug 18, 2026 · 9 milestones verified',
      completionDate: 'Aug 18, 2026',
    },
    {
      id: 'product-design-figma',
      title: 'Product Design Systems & Tokens in Figma',
      description: 'Design tokens, auto-layout variants, interactive prototypes, and token exports.',
      category: 'Design',
      badgeVariant: 'warning',
      statusText: 'Completed on Jul 29, 2026 · 8 milestones verified',
      completionDate: 'Jul 29, 2026',
    },
    {
      id: 'sql-analytics-dbt',
      title: 'Modern Analytics Engineering with dbt & Snowflake',
      description: 'Dimensional modeling, automated data tests, and documentation workflows.',
      category: 'Data Science',
      badgeVariant: 'success',
      statusText: 'Completed on May 14, 2026 · 11 milestones verified',
      completionDate: 'May 14, 2026',
    },
  ],
};

const BADGES_LIST = [
  {
    id: 1,
    title: '10 Paths Created',
    desc: 'Authored 10+ published roadmaps',
    icon: Layers,
    color: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/70 border-primary-200 dark:border-primary-800',
  },
  {
    id: 2,
    title: 'Top Contributor',
    desc: 'Top 5% peer RFC reviewer in 2026',
    icon: Sparkles,
    color: 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/70 border-accent-200 dark:border-accent-800',
  },
  {
    id: 3,
    title: 'Streak Master (14d)',
    desc: 'Maintained 14 consecutive active learning days',
    icon: Flame,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800',
  },
  {
    id: 4,
    title: 'Consensus Champion',
    desc: '15+ resource improvements merged by community',
    icon: Shield,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800',
  },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'followed' | 'completed'

  const { grid, totalContribs } = useMemo(() => generateContributionGrid(), []);

  // Intensity color class helper for contribution squares
  const getCellColor = (level) => {
    switch (level) {
      case 4:
        return 'bg-primary-600 dark:bg-primary-500';
      case 3:
        return 'bg-primary-400 dark:bg-primary-600';
      case 2:
        return 'bg-primary-200 dark:bg-primary-800';
      case 1:
        return 'bg-primary-100 dark:bg-primary-950';
      case 0:
      default:
        return 'bg-slate-100 dark:bg-slate-800/80';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-6 space-y-10">
      {/* 1. HEADER ROW */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Large Avatar */}
            <Avatar
              name="Alex Turner"
              size="xl"
              status="online"
              className="ring-4 ring-primary-100 dark:ring-primary-950"
            />

            <div className="space-y-2">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Alex Turner
                  </h1>
                  <Badge variant="primary" size="sm" className="font-semibold">
                    Staff Curator
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  @alexturner
                </p>
              </div>

              {/* Bio line */}
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Staff Frontend Architect passionate about peer-guided roadmaps, distributed state, React Server Components, and developer experience.
              </p>

              {/* Meta tags */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 dark:text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> San Francisco, CA
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Joined January 2026
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="shrink-0 self-center sm:self-start">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Edit3}
              onClick={() => toast.success('Edit Profile modal triggered')}
            >
              Edit profile
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. STAT GRID (2-4 columns) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Paths created', value: '4', icon: Layers, color: 'text-primary-600' },
          { label: 'Paths followed', value: '7', icon: Compass, color: 'text-accent-600' },
          { label: 'Paths completed', value: '12', icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Contributions', value: '86', icon: GitPullRequest, color: 'text-indigo-600' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </div>
            </Card>
          );
        })}
      </section>

      {/* 3. GITHUB-STYLE CONTRIBUTION GRAPH */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-primary-500" />
            Curriculum Contributions
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {totalContribs} contributions in the last 16 weeks
          </span>
        </div>

        <Card className="p-5 sm:p-6 overflow-hidden">
          {/* Scrollable Container for Heatmap Grid */}
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="min-w-[620px] space-y-2">
              {/* Month Header row */}
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-6 pr-2">
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>

              {/* Heatmap Row: Days on left + Grid Columns */}
              <div className="flex items-start gap-2">
                {/* Weekday indicators */}
                <div className="flex flex-col justify-between text-[9px] font-semibold text-slate-400 h-[88px] pt-1">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* 16-Week Grid Columns */}
                <div className="flex items-center gap-1.5 flex-1 justify-between">
                  {grid.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                      {week.map((cell, dIdx) => (
                        <div
                          key={dIdx}
                          title={`${cell.count} contributions on week ${wIdx + 1}, day ${dIdx + 1}`}
                          className={`w-3 h-3 rounded-xs transition-colors ${getCellColor(
                            cell.level
                          )} hover:ring-2 hover:ring-primary-500 cursor-pointer`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend & Summary */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
                <span>Learn & contribute daily to maintain your peer streak</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">Less</span>
                  <div className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-xs bg-primary-100 dark:bg-primary-950" />
                  <div className="w-2.5 h-2.5 rounded-xs bg-primary-200 dark:bg-primary-800" />
                  <div className="w-2.5 h-2.5 rounded-xs bg-primary-400 dark:bg-primary-600" />
                  <div className="w-2.5 h-2.5 rounded-xs bg-primary-600 dark:bg-primary-500" />
                  <span className="text-[10px]">More</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. TABS & 5. UNDER ACTIVE TAB: PATH CARDS LIST */}
      <section className="space-y-6">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { key: 'created', label: 'Created', count: TAB_DATA.created.length },
            { key: 'followed', label: 'Followed', count: TAB_DATA.followed.length },
            { key: 'completed', label: 'Completed', count: TAB_DATA.completed.length },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-xs ${
                    isActive
                      ? 'bg-primary-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content: Vertical List of Path Cards */}
        <div className="space-y-4">
          {TAB_DATA[activeTab].map((path) => (
            <Card
              key={path.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={path.badgeVariant}>
                    {path.category}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {path.statusText}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {path.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {path.description}
                </p>

                {/* Followed Progress Bar (if activeTab === 'followed') */}
                {activeTab === 'followed' && path.progress !== undefined && (
                  <div className="pt-2 max-w-md space-y-1">
                    <ProgressBar value={path.progress} variant="primary" size="sm" />
                    <p className="text-[11px] text-slate-400">
                      Focus: <strong className="text-slate-700 dark:text-slate-300">{path.currentStep}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Right Action Button */}
              <div className="shrink-0 self-end sm:self-center">
                <Link to={`/path/${path.id}`}>
                  <Button
                    variant={activeTab === 'followed' ? 'primary' : 'outline'}
                    size="sm"
                    rightIcon={ArrowRight}
                  >
                    {activeTab === 'created'
                      ? 'View Path'
                      : activeTab === 'followed'
                      ? 'Resume'
                      : 'Review Path'}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. "BADGES" ACHIEVEMENTS ROW (Stretch / Lighter Section) */}
      <section className="space-y-4 pt-4">
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Learner Badges & Achievements
              </h2>
              <p className="text-xs text-slate-400">
                Recognitions earned through milestone completions and community curation.
              </p>
            </div>
            <Badge variant="accent" size="sm">
              4 of 12 Unlocked
            </Badge>
          </div>

          {/* Badge Chips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {BADGES_LIST.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/40 flex items-start gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className={`p-2 rounded-lg border ${b.color} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
