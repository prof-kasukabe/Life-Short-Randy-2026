import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Code2,
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
    { id: 'completed', label: 'Delivered Systems', icon: CheckCircle2, badge: completedCount }
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
        pageTitle="Architected Systems & IT Projects"
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
        searchPlaceholder="Search stack or project..."
        sidebarExtraSlot={
          <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden py-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7267] dark:text-[#9E9589] mr-1 shrink-0">
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
                className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-[#E84634] text-white font-semibold'
                    : 'bg-[#F2EFE9] dark:bg-[#211D1A] text-[#6E655B] dark:text-[#A39B8F] hover:text-[#E84634]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        }
      >
        {/* IN-STAGE ARCHITECTURE INSPECTOR */}
        {selectedProject ? (
          <div className="rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] p-5 sm:p-7 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E0DACE] dark:border-[#332D29]">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E84634] hover:underline cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Projects Board</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span
                  className={`px-2.5 py-0.5 rounded font-bold uppercase ${
                    selectedProject.status === 'in_progress'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {selectedProject.status === 'in_progress' ? 'In Progress' : 'Delivered'}
                </span>
                <span className="text-[#6E655B] dark:text-[#A39B8F]">{selectedProject.timeline}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-[#E84634] font-semibold">
                  {selectedProject.category}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] leading-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#E84634]/85">
                  {selectedProject.tagline}
                </p>
                <p className="text-xs sm:text-sm text-[#4A3F35] dark:text-[#D8D0C5] leading-relaxed">
                  {selectedProject.description}
                </p>

                {selectedProject.architectureSummary && (
                  <div className="p-3.5 rounded-xl bg-[#F5F2EB] dark:bg-[#191614] border border-[#E0DACE] dark:border-[#332D29]">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#E84634] mb-1">
                      <Terminal size={13} />
                      <span>System Architecture Blueprint</span>
                    </div>
                    <p className="text-xs text-[#4A3F35] dark:text-[#D8D0C5] leading-relaxed">
                      {selectedProject.architectureSummary}
                    </p>
                  </div>
                )}

                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#6E655B] dark:text-[#A39B8F] font-semibold">
                      Key Engineering Highlights
                    </div>
                    <ul className="space-y-1.5">
                      {selectedProject.features.map((feat, i) => (
                        <li
                          key={i}
                          className="text-xs text-[#4A3F35] dark:text-[#D8D0C5] flex items-start gap-2"
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
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#E0DACE] dark:border-[#332D29]">
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#F5F2EB] dark:bg-[#191614] border border-[#E0DACE] dark:border-[#332D29] space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E655B] dark:text-[#A39B8F]">
                    Technology Stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#24201D] text-[#E84634] border border-[#E0DACE] dark:border-[#332D29]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 flex flex-wrap gap-2">
                    {selectedProject.demoUrl && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#E84634] text-white text-xs font-semibold hover:opacity-90"
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
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] bg-white dark:bg-[#24201D] text-xs font-semibold text-[#2A2521] dark:text-[#F5F2EB] hover:border-[#E84634]"
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
          /* BOARD-UI PROJECT CARDS MATRIX */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProjects.map((p, idx) => {
              const isOngoing = p.status === 'in_progress';
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE]/80 dark:border-[#332D29] hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[210px] transition-all cursor-pointer shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span className="font-bold text-[#2A2521] dark:text-[#F5F2EB]">
                        {String(idx + 1).padStart(2, '0')} · {p.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isOngoing
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {isOngoing ? 'In Progress' : 'Delivered'}
                      </span>
                    </div>

                    <h3 className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-snug mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 leading-relaxed mb-3">
                      {p.description}
                    </p>
                  </div>

                  <div>
                    {isOngoing && p.progressPercentage && (
                      <div className="mb-2.5">
                        <div className="flex justify-between text-[10px] font-mono text-amber-600 dark:text-amber-400 mb-1">
                          <span>Development Progress</span>
                          <span>{p.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-amber-500/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${p.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#E0DACE]/50 dark:border-[#2E2824] flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {p.techStack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E0DACE]/40 dark:bg-[#2A2420] text-[#4A3F35] dark:text-[#D8D0C5]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-[#E84634] flex items-center gap-0.5">
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
