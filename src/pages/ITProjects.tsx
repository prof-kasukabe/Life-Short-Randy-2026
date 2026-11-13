import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  Github,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Terminal,
  ArrowLeft
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ITProject } from '../types';
import { itProjectsData } from '../data';
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';

export function ITProjects() {
  const [projects, setProjects] = useState<ITProject[]>(itProjectsData);
  const [statusTab, setStatusTab] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ITProject | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(collection(db, 'it_projects'));
        if (!snap.empty) {
          const dbProjects = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ITProject[];
          const existingIds = new Set(dbProjects.map((p) => p.id));
          setProjects([...dbProjects, ...itProjectsData.filter((p) => !existingIds.has(p.id))]);
        }
      } catch (err) {
        console.warn('Using local curated IT projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const inProgressCount = useMemo(
    () => projects.filter((p) => p.status === 'in_progress').length,
    [projects]
  );
  const completedCount = useMemo(
    () => projects.filter((p) => p.status === 'completed').length,
    [projects]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const matchesStatus = statusTab === 'all' || item.status === statusTab;
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.techStack.some((t) => t.toLowerCase().includes(q));
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [projects, statusTab, categoryFilter, searchQuery]);

  const tabs: BoardTabItem[] = [
    { id: 'all', label: 'All Initiatives', icon: Layers, badge: projects.length },
    { id: 'in_progress', label: 'In Progress', icon: Clock, badge: inProgressCount },
    { id: 'completed', label: 'Delivered', icon: CheckCircle2, badge: completedCount }
  ];

  return (
    <>
      <Helmet>
        <title>IT &amp; Software Engineering Projects — Randy</title>
        <meta
          name="description"
          content="Explore IT engineering and software development projects by Randy — ongoing innovations and completed production systems."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="Architected Systems"
        pageSubtitle="Autonomous AI pipelines, real-time telemetry, and production full-stack platforms."
        breadcrumbCategory="IT Projects"
        tabs={tabs}
        activeTab={statusTab}
        onTabChange={(id) => {
          setStatusTab(id);
          setSelectedProject(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search stack..."
        sidebarExtraSlot={
          <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden py-0.5 text-xs">
            <span className="text-[11px] font-mono text-[#71717A] dark:text-zinc-500 mr-1 shrink-0">
              Domain:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat);
                  setSelectedProject(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-[#E84634] text-white font-semibold'
                    : 'bg-black/[0.04] dark:bg-[#161618] text-[#52525B] dark:text-zinc-400 hover:text-[#18181B] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        }
      >
        {selectedProject ? (
          <div className="rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E84634] hover:underline cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Projects</span>
              </button>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span
                  className={`font-semibold uppercase ${
                    selectedProject.status === 'in_progress' ? 'text-amber-500' : 'text-emerald-500'
                  }`}
                >
                  {selectedProject.status === 'in_progress' ? 'In Progress' : 'Delivered'}
                </span>
                <span className="text-[#71717A] dark:text-zinc-500">·</span>
                <span className="text-[#71717A] dark:text-zinc-400">{selectedProject.timeline}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-[#E84634] font-semibold">
                  {selectedProject.category}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#18181B] dark:text-white leading-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#52525B] dark:text-zinc-300">
                  {selectedProject.tagline}
                </p>
                <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400 leading-relaxed">
                  {selectedProject.description}
                </p>

                {selectedProject.architectureSummary && (
                  <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-[#0D0D0F] border border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#E84634] mb-1">
                      <Terminal size={13} />
                      <span>System Architecture</span>
                    </div>
                    <p className="text-xs text-[#52525B] dark:text-zinc-400 leading-relaxed">
                      {selectedProject.architectureSummary}
                    </p>
                  </div>
                )}

                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#71717A] dark:text-zinc-500 font-semibold">
                      Key Highlights
                    </div>
                    <ul className="space-y-1.5">
                      {selectedProject.features.map((feat, i) => (
                        <li
                          key={i}
                          className="text-xs text-[#52525B] dark:text-zinc-400 flex items-start gap-2"
                        >
                          <span className="text-[#E84634] font-mono font-bold mt-0.5">&bull;</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                {selectedProject.imageUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-[#0D0D0F] border border-black/10 dark:border-white/10 space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] dark:text-zinc-500">
                    Technology Stack
                  </div>
                  <div className="text-xs font-mono text-[#18181B] dark:text-zinc-300 leading-relaxed">
                    {selectedProject.techStack.join(' · ')}
                  </div>

                  <div className="pt-3 flex flex-wrap gap-2">
                    {selectedProject.demoUrl && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#0D0D0F] text-xs font-semibold hover:opacity-90"
                      >
                        <span>Live Demo</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 dark:border-white/12 text-xs font-semibold text-[#18181B] dark:text-zinc-200 hover:border-[#E84634]"
                      >
                        <Github size={13} />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredProjects.map((p, idx) => {
              const isOngoing = p.status === 'in_progress';
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="group rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 hover:border-[#E84634]/70 p-4 flex flex-col justify-between min-h-[190px] transition-all cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span className="font-bold text-[#18181B] dark:text-zinc-300">
                        {String(idx + 1).padStart(2, '0')} · {p.category}
                      </span>
                      <span
                        className={`font-semibold uppercase ${
                          isOngoing ? 'text-amber-500' : 'text-emerald-500'
                        }`}
                      >
                        {isOngoing ? 'In Progress' : 'Delivered'}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] transition-colors leading-snug mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#52525B] dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                      {p.description}
                    </p>
                  </div>

                  <div>
                    {isOngoing && p.progressPercentage && (
                      <div className="mb-2.5">
                        <div className="flex justify-between text-[10px] font-mono text-amber-500 mb-1">
                          <span>Progress</span>
                          <span>{p.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-amber-500/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${p.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-[#71717A] dark:text-zinc-500">
                      <span className="truncate pr-3">{p.techStack.slice(0, 3).join(' · ')}</span>
                      <span className="text-[#E84634] font-semibold flex items-center gap-0.5 shrink-0">
                        Inspect <ArrowUpRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BoardPageLayout>
    </>
  );
}
