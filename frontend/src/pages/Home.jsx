import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  PlusCircle,
  Target,
  Route,
  TrendingUp,
  Star,
  Users,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button, Card, Badge, Avatar, EmptyState } from '../components/common';
import { usePaths } from '../hooks/usePaths';

const CATEGORY_BADGE_VARIANTS = {
  'Web Dev': 'primary',
  'Data Science': 'success',
  Design: 'warning',
  'AI/ML': 'accent',
  Cybersecurity: 'danger',
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { paths: trendingPaths, loading, error } = usePaths({ sort: 'created_at' });
  const displayedPaths = trendingPaths.slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* 1. HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6 sm:space-y-8">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Peer-Powered Roadmaps & Milestone Guides</span>
        </div>

        {/* Hero Headlines */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Don't search for what to learn.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Follow a path built by learners, improved by learners.
          </p>
        </div>

        {/* CTA Buttons Side by Side */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link to="/explore" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-md shadow-primary-500/20 font-semibold"
              rightIcon={ArrowRight}
            >
              Explore paths
            </Button>
          </Link>
          <Link to="/create" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto font-medium"
              leftIcon={PlusCircle}
            >
              Create a path
            </Button>
          </Link>
        </div>

        {/* 2. SEARCH BAR DIRECTLY BELOW HERO (Max ~500px, centered) */}
        <div className="pt-4 max-w-[500px] mx-auto w-full">
          <form onSubmit={handleSearch} className="relative flex items-center group">
            <div className="absolute left-4 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a goal, like 'React' or 'Data Science'"
              className="w-full pl-12 pr-24 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-150"
            />
            <button
              type="submit"
              className="absolute right-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (3 columns, stack on mobile) */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            How it works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            A collaborative learning framework designed to eliminate decision paralysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <Card className="flex flex-col items-start p-6 sm:p-7 relative group">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950/70 border border-primary-200/80 dark:border-primary-800/80 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-5 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">
              Step 01
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Pick a goal
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Choose a community-curated milestone curriculum aligned with your career ambitions.
            </p>
          </Card>

          {/* Step 2 */}
          <Card className="flex flex-col items-start p-6 sm:p-7 relative group">
            <div className="w-12 h-12 rounded-2xl bg-accent-100 dark:bg-accent-950/70 border border-accent-200/80 dark:border-accent-800/80 flex items-center justify-center text-accent-600 dark:text-accent-400 mb-5 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <Route className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400 mb-1">
              Step 02
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Follow the path
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Work through step-by-step milestones verified and updated by fellow peer learners.
            </p>
          </Card>

          {/* Step 3 */}
          <Card className="flex flex-col items-start p-6 sm:p-7 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              Step 03
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Track your progress
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Check off completed achievements, earn peer badges, and monitor your skill health.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. TRENDING PATHS SECTION (Responsive grid / horizontal scroll on mobile) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trending paths
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top community-rated curricula to start learning today
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group self-start sm:self-auto"
          >
            <span>View all paths</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards Container: Horizontal scroll row on mobile, responsive grid on desktop */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="p-5 sm:p-6 animate-pulse">
                <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700 mb-4" />
                <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mb-3" />
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700 mb-6" />
                <div className="h-10 rounded bg-slate-200 dark:bg-slate-700" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Trending paths unavailable"
            description="We couldn't load the latest community paths right now. Please try again in a moment."
          />
        ) : displayedPaths.length === 0 ? (
          <EmptyState
            title="No trending paths yet"
            description="Looks like the community hasn't created a path for this goal yet. Be the first to share one."
          />
        ) : (
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory">
            {displayedPaths.map((path) => {
              const authorName = path.profiles?.username || 'Community';
              const stepCount = path.steps?.[0]?.count ?? 0;
              const categoryVariant = CATEGORY_BADGE_VARIANTS[path.category] || 'neutral';

              return (
                <div key={path.id} className="min-w-[290px] sm:min-w-[320px] md:min-w-0 snap-start flex-1 flex">
                  <Card
                    className="w-full flex flex-col justify-between p-5 sm:p-6 cursor-pointer border hover:border-primary-300 dark:hover:border-primary-700 group"
                    onClick={() => navigate(`/path/${path.id}`)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge variant={categoryVariant}>{path.category}</Badge>
                        {path.difficulty && <Badge variant="nice">{path.difficulty}</Badge>}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                        {path.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {path.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar name={authorName} size="xs" />
                          <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                            {authorName}
                          </span>
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                          {stepCount} steps
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{path.difficulty || 'Community'}</span>
                        </div>

                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Users className="w-3.5 h-3.5" />
                          <span>{path.rating ? `${path.rating.toFixed(1)} rating` : 'No ratings yet'}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
