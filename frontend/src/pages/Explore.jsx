import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Users, Layers, ChevronLeft, ChevronRight, X, Compass } from 'lucide-react';
import { Card, Badge, Button, Avatar, EmptyState } from '../components/common';
import { usePaths } from '../hooks/usePaths';

const CATEGORIES = ['All', 'Web Dev', 'Data Science', 'Design', 'AI/ML', 'Cybersecurity'];
const CATEGORY_BADGES = { 'Web Dev': 'primary', 'Data Science': 'success', Design: 'warning', 'AI/ML': 'accent', Cybersecurity: 'danger' };

function getHealthBadge(score) {
  const variant = score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger';
  return { variant, label: `${score}% Health`, tooltip: 'Based on resource ratings and recent activity' };
}

function normalizePath(path) {
  const resources = path.steps?.flatMap((step) => step.resources || []) || [];
  const ratings = resources.flatMap((resource) => resource.reviews || []).map((review) => review.rating).filter(Boolean);
  const rating = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : 0;
  const flags = resources.reduce((sum, resource) => sum + (resource.flag_count || 0), 0);
  const healthScore = Math.max(0, Math.min(100, Math.round((rating ? rating / 5 * 80 : 60) + (flags ? -Math.min(flags * 2, 30) : 20))));
  return { ...path, author: path.profiles?.username || 'Community', stepsCount: path.steps?.[0]?.count ?? path.steps?.length ?? 0, rating, reviews: ratings.length, followers: path.followers_count || 0, healthScore };
}

export default function Explore() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { paths, loading, error } = usePaths({ sort: 'created_at', search: searchQuery });
  const normalizedPaths = paths.map(normalizePath);
  const filteredAndSortedPaths = useMemo(() => {
    const result = normalizedPaths.filter((path) => selectedCategory === 'All' || path.category === selectedCategory).filter((path) => {
      const query = searchQuery.trim().toLowerCase();
      return !query || [path.title, path.description, path.author, path.category].some((value) => value?.toLowerCase().includes(query));
    });
    return result.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'Most Followed') return b.followers - a.followers;
      return (b.rating * Math.log10(b.followers + 10)) - (a.rating * Math.log10(a.followers + 10));
    });
  }, [normalizedPaths, searchQuery, selectedCategory, sortBy]);
  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(filteredAndSortedPaths.length / pageSize));
  const visiblePaths = filteredAndSortedPaths.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handleClearFilters = () => { setSearchQuery(''); setSelectedCategory('All'); setSortBy('Trending'); setCurrentPage(1); };

  return (
    <div className="space-y-8 py-2 sm:py-4">
      <div className="space-y-1"><h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Explore Paths</h1><p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Discover community-vetted curricula, step-by-step milestones, and learning roadmaps.</p></div>
      <div className="space-y-4"><div className="relative flex items-center group"><Search className="absolute left-4 w-5 h-5 text-slate-400" /><input type="search" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search paths by title, keywords, tools, or curator name..." className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />{searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3.5 p-1 text-slate-400" title="Clear search"><X className="w-4 h-4" /></button>}</div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"><div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">{CATEGORIES.map((category) => <button key={category} type="button" onClick={() => { setSelectedCategory(category); setCurrentPage(1); }} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${selectedCategory === category ? 'bg-primary-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{category}</button>)}</div><div className="flex items-center gap-2 self-end"><span className="text-xs text-slate-400 flex items-center gap-1"><SlidersHorizontal className="w-3.5 h-3.5" />Sort:</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"><option>Trending</option><option>Newest</option><option>Most Followed</option></select></div></div></div>
      <div className="flex items-center justify-between text-xs text-slate-500"><span>Showing <strong>{filteredAndSortedPaths.length}</strong> {filteredAndSortedPaths.length === 1 ? 'path' : 'paths'}</span>{(selectedCategory !== 'All' || searchQuery) && <button type="button" onClick={handleClearFilters} className="text-primary-600 hover:underline">Reset filters</button>}</div>
      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3, 4, 5, 6].map((item) => <Card key={item} className="p-6 h-64 animate-pulse bg-slate-200 dark:bg-slate-800" />)}</div> : error ? <EmptyState title="Paths unavailable" description="We couldn't load community paths right now." /> : visiblePaths.length === 0 ? <EmptyState icon={Compass} title="No paths found" description="Try changing your search or category filter." actionLabel="Clear filters" onAction={handleClearFilters} /> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{visiblePaths.map((path) => { const health = getHealthBadge(path.healthScore); return <Card key={path.id} className="flex flex-col justify-between p-5 sm:p-6 cursor-pointer border hover:border-primary-300 dark:hover:border-primary-700 group" onClick={() => navigate(`/path/${path.id}`)}><div><div className="flex items-start justify-between gap-2 mb-3"><Badge variant={CATEGORY_BADGES[path.category] || 'neutral'}>{path.category}</Badge><Badge variant={health.variant} dot title={health.tooltip} className="shrink-0 font-semibold">{health.label}</Badge></div><h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">{path.title}</h3><p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">{path.description}</p></div><div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-3"><div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><Avatar name={path.author} size="xs" /><span className="font-medium text-slate-700 dark:text-slate-300">{path.author}</span></div><span className="text-slate-400 flex items-center gap-1"><Layers className="w-3.5 h-3.5" />{path.stepsCount} steps</span></div><div className="flex items-center justify-between text-xs text-slate-500"><div className="flex items-center gap-1 text-amber-500 font-semibold"><Star className="w-3.5 h-3.5 fill-amber-400" /><span>{path.rating ? path.rating.toFixed(1) : 'New'}</span><span className="text-slate-400 font-normal">({path.reviews})</span></div><div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /><span>{path.followers.toLocaleString()} learners</span></div></div></div></Card>; })}</div>}
      {visiblePaths.length > 0 && <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between"><Button variant="outline" size="sm" leftIcon={ChevronLeft} disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</Button><span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Page {currentPage} of {pageCount}</span><Button variant="outline" size="sm" rightIcon={ChevronRight} disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}>Next</Button></div>}
    </div>
  );
}
