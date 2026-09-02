import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Layers, Compass, CheckCircle2, GitPullRequest, Award, Flame, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { Card, Avatar, Badge, Button, ProgressBar } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const BADGES_LIST = [
  { id: 1, title: '10 Paths Created', desc: 'Authored 10+ published roadmaps', icon: Layers, color: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/70 border-primary-200 dark:border-primary-800' },
  { id: 2, title: 'Top Contributor', desc: 'Top 5% peer RFC reviewer in 2026', icon: Sparkles, color: 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/70 border-accent-200 dark:border-accent-800' },
  { id: 3, title: 'Streak Master (14d)', desc: 'Maintained 14 consecutive active learning days', icon: Flame, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800' },
  { id: 4, title: 'Consensus Champion', desc: '15+ resource improvements merged by community', icon: Shield, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800' },
];

const CATEGORY_VARIANTS = { 'Web Dev': 'primary', 'Data Science': 'success', Design: 'warning', 'AI/ML': 'accent', Cybersecurity: 'danger' };

export default function Profile() {
  const [activeTab, setActiveTab] = useState('created');
  const { user } = useAuth();
  const { profile, created, followed, completed, stats, activity, loading, error } = useProfile(user?.id);
  const displayName = profile?.username || user?.email || 'Learner';
  const tabData = { created, followed, completed };

  const getCellColor = (level) => {
    switch (level) {
      case 4: return 'bg-primary-600 dark:bg-primary-500';
      case 3: return 'bg-primary-400 dark:bg-primary-600';
      case 2: return 'bg-primary-200 dark:bg-primary-800';
      case 1: return 'bg-primary-100 dark:bg-primary-950';
      default: return 'bg-slate-100 dark:bg-slate-800/80';
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto py-10 text-center text-sm text-slate-500">Loading profile...</div>;
  if (error) return <div className="max-w-4xl mx-auto py-10 text-center text-sm text-danger-600">Unable to load profile.</div>;

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-6 space-y-10">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <Avatar name={displayName} size="xl" status="online" className="ring-4 ring-primary-100 dark:ring-primary-950" />
            <div className="space-y-2">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{displayName}</h1>
                  <Badge variant="primary" size="sm" className="font-semibold">Staff Curator</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">@{profile?.username || displayName}</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">{profile?.bio || 'Building a learning history through peer-guided roadmaps and shared milestones.'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 dark:text-slate-500 pt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location not set</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Paths created', value: stats.created, icon: Layers, color: 'text-primary-600' },
          { label: 'Paths followed', value: stats.followed, icon: Compass, color: 'text-accent-600' },
          { label: 'Paths completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Contributions', value: stats.contributions, icon: GitPullRequest, color: 'text-indigo-600' },
        ].map((stat) => {
          const Icon = stat.icon;
          return <Card key={stat.label} className="p-4 sm:p-5 flex flex-col justify-between"><div className="flex items-center justify-between text-slate-400 mb-2"><span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{stat.label}</span><Icon className={`w-4 h-4 ${stat.color}`} /></div><div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stat.value}</div></Card>;
        })}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2"><GitPullRequest className="w-4 h-4 text-primary-500" />Curriculum Contributions</h2><span className="text-xs text-slate-500 font-medium">{activity.totalContribs} contributions in the last 12 weeks</span></div>
        <Card className="p-5 sm:p-6 overflow-hidden"><div className="overflow-x-auto pb-2 -mx-2 px-2"><div className="min-w-[620px] space-y-2"><div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-6 pr-2"><span>Last 12 weeks</span></div><div className="flex items-start gap-2"><div className="flex flex-col justify-between text-[9px] font-semibold text-slate-400 h-[88px] pt-1"><span>Mon</span><span>Wed</span><span>Fri</span></div><div className="flex items-center gap-1.5 flex-1 justify-between">{activity.grid.map((week, weekIndex) => <div key={weekIndex} className="flex flex-col gap-1.5">{week.map((cell) => <div key={cell.date} title={`${cell.count} contributions on ${cell.date}`} className={`w-3 h-3 rounded-xs transition-colors ${getCellColor(cell.level)} hover:ring-2 hover:ring-primary-500 cursor-pointer`} />)}</div>)}</div></div><div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400"><span>Learn & contribute daily to maintain your peer streak</span><div className="flex items-center gap-1.5"><span className="text-[10px]">Less</span><div className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-800" /><div className="w-2.5 h-2.5 rounded-xs bg-primary-100 dark:bg-primary-950" /><div className="w-2.5 h-2.5 rounded-xs bg-primary-200 dark:bg-primary-800" /><div className="w-2.5 h-2.5 rounded-xs bg-primary-400 dark:bg-primary-600" /><div className="w-2.5 h-2.5 rounded-xs bg-primary-600 dark:bg-primary-500" /><span className="text-[10px]">More</span></div></div></div></div></Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">{Object.entries(tabData).map(([key, paths]) => <button key={key} type="button" onClick={() => setActiveTab(key)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === key ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}><span>{key.charAt(0).toUpperCase() + key.slice(1)}</span><span className={`px-1.5 py-0.5 rounded-md text-xs ${activeTab === key ? 'bg-primary-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>{paths.length}</span></button>)}</div>
        <div className="space-y-4">{tabData[activeTab].map((path) => <Card key={path.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-300 dark:hover:border-primary-700 transition-all group"><div className="space-y-2 flex-1"><div className="flex items-center gap-2"><Badge variant={path.badgeVariant || CATEGORY_VARIANTS[path.category] || 'neutral'}>{path.category}</Badge><span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{path.statusText}</span></div><h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{path.title}</h3><p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{path.description}</p>{activeTab === 'followed' && <div className="pt-2 max-w-md space-y-1"><ProgressBar value={path.percentage} variant="primary" size="sm" /><p className="text-[11px] text-slate-400">Focus: <strong className="text-slate-700 dark:text-slate-300">{path.currentStep}</strong></p></div>}</div><div className="shrink-0 self-end sm:self-center"><Link to={`/path/${path.id}`}><Button variant={activeTab === 'followed' ? 'primary' : 'outline'} size="sm" rightIcon={ArrowRight}>{activeTab === 'created' ? 'View Path' : activeTab === 'followed' ? 'Resume' : 'Review Path'}</Button></Link></div></Card>)}</div>
      </section>

      <section className="space-y-4 pt-4"><div className="border-t border-slate-200 dark:border-slate-800 pt-6"><div className="flex items-center justify-between mb-4"><div><h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" />Learner Badges & Achievements</h2><p className="text-xs text-slate-400">Recognitions earned through milestone completions and community curation.</p></div><Badge variant="accent" size="sm">4 of 12 Unlocked</Badge></div><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">{BADGES_LIST.map((badge) => { const Icon = badge.icon; return <div key={badge.id} className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/40 flex items-start gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"><div className={`p-2 rounded-lg border ${badge.color} shrink-0 mt-0.5`}><Icon className="w-4 h-4" /></div><div><h4 className="text-xs font-bold text-slate-900 dark:text-white">{badge.title}</h4><p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{badge.desc}</p></div></div>; })}</div></div></section>
    </div>
  );
}
