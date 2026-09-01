import React, { useState } from 'react';
import {
  ArrowUp,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Badge, Button, Avatar } from '../components/common';

const INITIAL_SUGGESTIONS = [
  {
    id: 1,
    pathTitle: 'Fullstack React & Next.js Architecture',
    stepTitle: 'Step 2: React 19 Core Mental Model',
    author: 'Elena Rostova',
    authorRole: 'Frontend Specialist',
    timeAgo: '2 hours ago',
    oldResource: {
      title: 'Class Components & Lifecycle Methods in React 16.8',
      rating: 3.8,
      type: 'Doc',
    },
    newResource: {
      title: 'React 19 Mental Model, Server Actions & useOptimistic Guide',
      rating: 4.9,
      type: 'Article',
    },
    reason: 'The old tutorial teaches legacy componentDidMount lifecycles. This new guide directly covers modern React 19 compiler paradigms and action states.',
    votes: 8,
    requiredVotes: 10,
    hasUpvoted: false,
    isMerged: false,
  },
  {
    id: 2,
    pathTitle: 'Applied Data Science with Python & Polars',
    stepTitle: 'Step 3: High-Performance Dataframes',
    author: 'Marcus Vance',
    authorRole: 'Data Engineer',
    timeAgo: '5 hours ago',
    oldResource: {
      title: 'Intro to Pandas 1.x & Itertuples for Loop Processing',
      rating: 4.1,
      type: 'Video',
    },
    newResource: {
      title: 'High-Performance Data Analytics with Polars & Apache Arrow',
      rating: 4.9,
      type: 'Doc',
    },
    reason: 'Polars is 10-50x faster for large datasets and has become the de-facto standard in modern enterprise data pipelines.',
    votes: 7,
    requiredVotes: 10,
    hasUpvoted: false,
    isMerged: false,
  },
  {
    id: 3,
    pathTitle: 'Generative AI & LLM App Engineering',
    stepTitle: 'Step 4: Vector Embeddings & RAG Architecture',
    author: 'Liam Gallagher',
    authorRole: 'AI Systems Architect',
    timeAgo: '1 day ago',
    oldResource: {
      title: 'Building Simple Similarity Search in LangChain 0.0.x',
      rating: 3.4,
      type: 'Project',
    },
    newResource: {
      title: 'Production RAG with Hybrid Dense/Sparse Search & LlamaIndex',
      rating: 4.8,
      type: 'Article',
    },
    reason: 'The LangChain 0.0 syntax is completely deprecated and breaks with newer dependencies. This replacement is robust and actively maintained.',
    votes: 9,
    requiredVotes: 10,
    hasUpvoted: true,
    isMerged: false,
  },
  {
    id: 4,
    pathTitle: 'Distributed Systems & Microservices in Go',
    stepTitle: 'Step 1: Go Concurrency & Goroutines',
    author: 'Sarah Connor',
    authorRole: 'Staff Infrastructure Engineer',
    timeAgo: '3 days ago',
    oldResource: {
      title: 'Goroutines & Go 1.14 Concurrency Examples',
      rating: 4.0,
      type: 'Doc',
    },
    newResource: {
      title: 'Effective Go Concurrency, Context Propagation & Channel Pipelines',
      rating: 5.0,
      type: 'Doc',
    },
    reason: 'Updated with Go 1.22+ loop semantics and sync.Map idioms. Verified by 10 peer learners.',
    votes: 10,
    requiredVotes: 10,
    hasUpvoted: false,
    isMerged: true, // Already merged state
  },
];

const FLAGGED_ITEMS = [
  {
    id: 'flag-1',
    resourceName: 'Legacy Webpack 4 Config Tutorial for SPA Bundling',
    pathContext: 'Modern Web Dev Roadmap → Step 1: Bundlers & Setup',
    reason: 'No completions in 90 days • Reported deprecated by 14 learners',
    flaggedCount: 14,
  },
  {
    id: 'flag-2',
    resourceName: 'Docker Swarm Orchestration Fundamentals',
    pathContext: 'Cloud Native Microservices → Step 5: Container Orchestration',
    reason: 'Industry consensus shifted to Kubernetes & K3s • Broken documentation links',
    flaggedCount: 9,
  },
  {
    id: 'flag-3',
    resourceName: 'Python 3.7 Type Hinting Workarounds & Backports',
    pathContext: 'Data Science with Python → Step 2: Pythonic Typings',
    reason: 'Python 3.7 reached end-of-life • Contains broken GitHub repo links',
    flaggedCount: 6,
  },
];

export default function Community() {
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);

  // Optimistic Upvote Toggle Handler
  const handleUpvote = (id) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVoted = !item.hasUpvoted;
          const nextVotes = nextVoted ? item.votes + 1 : item.votes - 1;

          if (nextVoted) {
            toast.success(`Vote added! (${nextVotes} of ${item.requiredVotes} votes to auto-merge)`);
          } else {
            toast('Vote removed', { icon: '↩️' });
          }

          return {
            ...item,
            hasUpvoted: nextVoted,
            votes: nextVotes,
          };
        }
        return item;
      })
    );
  };

  const handleProposeAlternative = (resourceName) => {
    toast.success(`Opened suggestion modal for: "${resourceName}"`);
  };

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-6 space-y-12">
      {/* 1. PAGE HEADING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Community suggestions
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Help keep paths fresh and accurate.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Badge variant="primary" dot className="font-semibold">
            {suggestions.filter((s) => !s.isMerged).length} Active RFCs
          </Badge>
          <Badge variant="success" dot className="font-semibold">
            Auto-Merge Active
          </Badge>
        </div>
      </div>

      {/* 2. VERTICAL FEED OF SUGGESTION CARDS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Resource Update Proposals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Community proposals with 10 upvotes automatically replace outdated curriculum steps.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {suggestions.map((item) => {
            const isMerged = item.isMerged;
            const progressPercent = Math.min(
              100,
              Math.round((item.votes / item.requiredVotes) * 100)
            );

            return (
              <Card
                key={item.id}
                className={`p-5 sm:p-6 transition-all duration-200 ${
                  isMerged
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-90'
                    : 'hover:border-primary-300 dark:hover:border-primary-700 shadow-sm'
                }`}
              >
                {/* Card Top Context Line & Author */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                  {/* Context: Path → Step */}
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-xs">
                      {item.pathTitle}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-primary-600 dark:text-primary-400 font-semibold truncate">
                      {item.stepTitle}
                    </span>
                  </div>

                  {/* Curator attribution */}
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Avatar name={item.author} size="xs" />
                    <span>
                      Proposed by <strong className="text-slate-700 dark:text-slate-300">{item.author}</strong>
                    </span>
                    <span>•</span>
                    <span>{item.timeAgo}</span>
                  </div>
                </div>

                {/* Stacked Old vs New Resource Comparison Rows */}
                <div className="space-y-3">
                  {/* Old Resource Row */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-danger-50/40 dark:bg-danger-950/20 border border-danger-200/60 dark:border-danger-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="danger" size="sm" className="font-bold shrink-0">
                        Old
                      </Badge>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 line-through decoration-danger-400/60">
                        {item.oldResource.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0 self-end sm:self-auto">
                      <Star className="w-3.5 h-3.5 fill-amber-400/60 text-amber-400/60" />
                      <span>{item.oldResource.rating}</span>
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ml-1.5">
                        {item.oldResource.type}
                      </span>
                    </div>
                  </div>

                  {/* New Suggested Resource Row */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-success-50/50 dark:bg-success-950/30 border border-success-200/70 dark:border-success-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-3">
                      <Badge variant="success" size="sm" className="font-bold shrink-0">
                        New
                      </Badge>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {item.newResource.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 shrink-0 self-end sm:self-auto">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.newResource.rating}</span>
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-success-100 dark:bg-success-900/60 text-success-800 dark:text-success-200 ml-1.5">
                        {item.newResource.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Curator Reason / Comment */}
                <div className="pt-3.5 mt-3.5">
                  <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-primary-300 dark:border-primary-700">
                    "{item.reason}"
                  </p>
                </div>

                {/* Card Bottom: Vote Progress & Upvote Action OR Merged Badge */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Vote count progress text */}
                  {isMerged ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-success-500" />
                      <span>Consensus achieved with 10+ peer votes</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 sm:w-64">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong>{item.votes}</strong> of <strong>{item.requiredVotes}</strong> votes to auto-merge
                        </span>
                        <span className="text-primary-600 dark:text-primary-400 text-[11px]">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Right: Upvote Button OR Merged Status Badge */}
                  <div>
                    {isMerged ? (
                      <Badge
                        variant="success"
                        size="md"
                        className="font-semibold shadow-xs py-1.5 px-3"
                      >
                        ✓ Updated by the community
                      </Badge>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpvote(item.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                          item.hasUpvoted
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25 ring-2 ring-primary-500/20 scale-102'
                            : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <ArrowUp
                          className={`w-4 h-4 transition-transform ${
                            item.hasUpvoted ? '-translate-y-0.5' : ''
                          }`}
                        />
                        <span>{item.hasUpvoted ? 'Upvoted' : 'Upvote'}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                            item.hasUpvoted
                              ? 'bg-primary-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.votes}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. FLAGGED AS OUTDATED SECTION */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Flagged as outdated
              </h2>
              <Badge variant="warning" dot>
                {FLAGGED_ITEMS.length} items flagged
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Resources identified by learners with declining health scores or broken references
            </p>
          </div>
        </div>

        {/* Simpler List of Flagged Rows */}
        <div className="space-y-3">
          {FLAGGED_ITEMS.map((flag) => (
            <Card
              key={flag.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-amber-500"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {flag.resourceName}
                  </h4>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                    {flag.pathContext}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-1 font-medium">
                    {flag.reason}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={Sparkles}
                  onClick={() => handleProposeAlternative(flag.resourceName)}
                  className="text-xs font-semibold"
                >
                  Suggest replacement
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
