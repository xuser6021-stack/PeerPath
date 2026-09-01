import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Star,
  Users,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Compass
} from 'lucide-react';
import { Card, Badge, Button, Avatar, EmptyState } from '../components/common';

const CATEGORIES = [
  'All',
  'Web Dev',
  'Data Science',
  'Design',
  'AI/ML',
  'Cybersecurity',
];

const MOCK_PATHS = [
  {
    id: 'fullstack-react-nextjs',
    title: 'Fullstack React & Next.js Architecture',
    description: 'Master server components, caching strategies, full-stack state, and enterprise production deployments.',
    category: 'Web Dev',
    badgeVariant: 'primary',
    mustLearn: true,
    author: 'Alex Turner',
    steps: 12,
    rating: 4.9,
    reviews: 218,
    followers: 2450,
    healthScore: 98,
    createdAt: '2026-08-15',
  },
  {
    id: 'generative-ai-llms',
    title: 'Generative AI & LLM App Engineering',
    description: 'Build robust RAG pipelines, agentic workflows, structured function calling, and vector database systems.',
    category: 'AI/ML',
    badgeVariant: 'accent',
    mustLearn: true,
    author: 'Liam Gallagher',
    steps: 10,
    rating: 4.9,
    reviews: 342,
    followers: 3120,
    healthScore: 99,
    createdAt: '2026-08-29',
  },
  {
    id: 'applied-data-science-python',
    title: 'Applied Data Science with Python & Polars',
    description: 'High-performance exploratory data analytics, statistical modeling, feature engineering, and ML pipelines.',
    category: 'Data Science',
    badgeVariant: 'success',
    mustLearn: false,
    author: 'Dr. Maya Chen',
    steps: 16,
    rating: 4.8,
    reviews: 164,
    followers: 1890,
    healthScore: 91,
    createdAt: '2026-07-20',
  },
  {
    id: 'ethical-hacking-pentest',
    title: 'Practical Ethical Hacking & Web Security',
    description: 'OWASP Top 10 hands-on exploits, API vulnerabilities, privilege escalation, and security auditing.',
    category: 'Cybersecurity',
    badgeVariant: 'danger',
    mustLearn: true,
    author: 'Tarek Al-Mansoor',
    steps: 15,
    rating: 4.9,
    reviews: 280,
    followers: 2280,
    healthScore: 95,
    createdAt: '2026-08-22',
  },
  {
    id: 'product-design-figma',
    title: 'Product Design & Design Systems in Figma',
    description: 'Token architecture, responsive auto-layout variants, micro-interactions, and developer handoff workflows.',
    category: 'Design',
    badgeVariant: 'warning',
    mustLearn: false,
    author: 'Elena Rostova',
    steps: 8,
    rating: 4.7,
    reviews: 95,
    followers: 1340,
    healthScore: 92,
    createdAt: '2026-08-05',
  },
  {
    id: 'modern-typescript-patterns',
    title: 'Modern TypeScript & Architectural Patterns',
    description: 'Type gymnastics, generics, robust domain modeling, AST tooling, and scalable full-stack abstractions.',
    category: 'Web Dev',
    badgeVariant: 'primary',
    mustLearn: true,
    author: 'Sofia Morales',
    steps: 9,
    rating: 4.8,
    reviews: 140,
    followers: 1820,
    healthScore: 88,
    createdAt: '2026-08-28',
  },
  {
    id: 'sql-analytics-dbt',
    title: 'Modern Analytics Engineering with dbt & Snowflake',
    description: 'Data modeling, dimensional schemas, automated testing, and CI/CD pipelines for data teams.',
    category: 'Data Science',
    badgeVariant: 'success',
    mustLearn: false,
    author: 'Marcus Vance',
    steps: 11,
    rating: 4.6,
    reviews: 82,
    followers: 1150,
    healthScore: 74, // Amber health score example (50-79)
    createdAt: '2026-05-12',
  },
  {
    id: 'ui-motion-animation',
    title: 'Micro-Interactions & Framer Motion UI',
    description: 'Create delightful physics-based animations, layout transitions, and gesture controls in React.',
    category: 'Design',
    badgeVariant: 'warning',
    mustLearn: false,
    author: 'Devon Miles',
    steps: 6,
    rating: 4.4,
    reviews: 48,
    followers: 820,
    healthScore: 68, // Amber health score example (50-79)
    createdAt: '2025-11-20',
  },
  {
    id: 'legacy-php-migration',
    title: 'Legacy Monolith Migration to Serverless APIs',
    description: 'Strangler fig patterns and migration techniques. Note: Some curriculum links require community updating.',
    category: 'Web Dev',
    badgeVariant: 'primary',
    mustLearn: false,
    author: 'Kenji Sato',
    steps: 7,
    rating: 3.9,
    reviews: 31,
    followers: 410,
    healthScore: 42, // Red health score example (< 50)
    createdAt: '2024-03-10',
  },
];

// Helper to calculate Health Score Badge properties
function getHealthBadge(score) {
  if (score >= 80) {
    return {
      variant: 'success',
      label: `${score}% Health`,
      tooltip: 'High curriculum health: recently updated and verified by peer learners',
    };
  }
  if (score >= 50) {
    return {
      variant: 'warning',
      label: `${score}% Health`,
      tooltip: 'Medium curriculum health: some links or exercises may need review',
    };
  }
  return {
    variant: 'danger',
    label: `${score}% Health`,
    tooltip: 'Low curriculum health: outdated resources flagged by learners',
  };
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending'); // 'Trending' | 'Newest' | 'Most Followed'
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Filter & Sort Logic (Client-Side)
  const filteredAndSortedPaths = useMemo(() => {
    let result = [...MOCK_PATHS];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((path) => path.category === selectedCategory);
    }

    // 2. Search Query Filter (Title, Description, Author)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (path) =>
          path.title.toLowerCase().includes(q) ||
          path.description.toLowerCase().includes(q) ||
          path.author.toLowerCase().includes(q) ||
          path.category.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'Most Followed') {
        return b.followers - a.followers;
      }
      // Default 'Trending' (score based on rating * followers weight)
      const trendA = a.rating * Math.log10(a.followers + 10);
      const trendB = b.rating * Math.log10(b.followers + 10);
      return trendB - trendA;
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('Trending');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 py-2 sm:py-4">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Explore Paths
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Discover community-vetted curricula, step-by-step milestones, and learning roadmaps.
        </p>
      </div>

      {/* Top Controls Container */}
      <div className="space-y-4">
        {/* 1. Full-Width Search Input */}
        <div className="relative flex items-center group">
          <div className="absolute left-4 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search paths by title, keywords, tools, or curator name..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-150"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. Category Filter Pills & Sort Dropdown Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
          {/* Horizontally scrollable row of category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20 font-semibold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown aligned right */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
            >
              <option value="Trending">Trending</option>
              <option value="Newest">Newest</option>
              <option value="Most Followed">Most Followed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Path Results Count & Filter Tag Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
        <span>
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredAndSortedPaths.length}</strong> {filteredAndSortedPaths.length === 1 ? 'path' : 'paths'}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* 3. Responsive Grid of Path Cards or Empty State */}
      {filteredAndSortedPaths.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPaths.map((path) => {
            const health = getHealthBadge(path.healthScore);
            return (
              <Card
                key={path.id}
                className="flex flex-col justify-between p-5 sm:p-6 cursor-pointer border hover:border-primary-300 dark:hover:border-primary-700 group relative"
                onClick={() => navigate(`/path/${path.id}`)}
              >
                <div>
                  {/* Top Row: Category Tag / Must Learn & Health Score Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={path.badgeVariant}>
                        {path.category}
                      </Badge>
                      {path.mustLearn && (
                        <Badge variant="must">MUST LEARN</Badge>
                      )}
                    </div>

                    {/* Health-Score Badge in Top-Right Corner */}
                    <Badge
                      variant={health.variant}
                      dot
                      title={health.tooltip}
                      className="shrink-0 font-semibold"
                    >
                      {health.label}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                    {path.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {path.description}
                  </p>
                </div>

                {/* Bottom Row: Author, Steps, Star Rating, Followers */}
                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  {/* Author & Steps */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar name={path.author} size="xs" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {path.author}
                      </span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      {path.steps} steps
                    </span>
                  </div>

                  {/* Rating & Followers */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{path.rating}</span>
                      <span className="text-slate-400 font-normal">({path.reviews})</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>{path.followers.toLocaleString()} learners</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* 4. EmptyState when search/filter returns nothing */
        <EmptyState
          icon={Compass}
          title="No paths found for this search"
          description={`We couldn't find any learning paths matching "${searchQuery}" in ${selectedCategory}. Try changing your keywords or clearing the category filter.`}
          actionLabel="Clear filters"
          onAction={handleClearFilters}
          className="my-6"
        />
      )}

      {/* 5. Pagination Control at bottom (UI preview) */}
      {filteredAndSortedPaths.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            leftIcon={ChevronLeft}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>

          <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
            Page {currentPage} of 3
          </span>

          <Button
            variant="outline"
            size="sm"
            rightIcon={ChevronRight}
            disabled={currentPage === 3}
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
