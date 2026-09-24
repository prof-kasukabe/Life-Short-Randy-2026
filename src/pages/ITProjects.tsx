import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Code2, 
  Search, 
  ExternalLink, 
  Github, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  X, 
  ArrowUpRight, 
  Terminal,
  Cpu,
  Globe,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ITProject } from '../types';
import { itProjectsData } from '../data';

export function ITProjects() {
  const [projects, setProjects] = useState<ITProject[]>(itProjectsData);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ITProject | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(collection(db, 'it_projects'));
        if (!snap.empty) {
          const dbProjects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ITProject[];
          // Merge with default seed data if DB has fewer or custom records
          const existingIds = new Set(dbProjects.map(p => p.id));
          const merged = [...dbProjects, ...itProjectsData.filter(p => !existingIds.has(p.id))];
          setProjects(merged);
        } else {
          setProjects(itProjectsData);
        }
      } catch (err) {
        console.warn("Could not query it_projects collection, using curated local data:", err);
        setProjects(itProjectsData);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(item => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        item.tagline.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.techStack.some(t => t.toLowerCase().includes(query));
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [projects, statusFilter, categoryFilter, searchQuery]);

  const inProgressCount = useMemo(() => projects.filter(p => p.status === 'in_progress').length, [projects]);
  const completedCount = useMemo(() => projects.filter(p => p.status === 'completed').length, [projects]);

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>IT & Software Engineering Projects - Randy</title>
        <meta name="description" content="Explore IT engineering and software development projects by Randy — ongoing innovations and completed production systems." />
      </Helmet>

      {/* Header Section */}
      <header className="max-w-4xl mb-14">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E84634] flex items-center gap-1.5">
            <Code2 size={15} />
            Software Engineering &amp; IT Portfolio
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-bold tracking-tight text-[#E84634] leading-[1.08] mb-6">
          Architected Systems &amp; IT Projects<span className="text-[#E84634]">.</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#E84634]/80 dark:text-[#E84634]/80 font-light leading-relaxed mb-8">
          A transparent index of technology initiatives. From autonomous AI pipelines and real-time edge telemetry currently in active development, to hardened enterprise platforms delivered with zero-trust security.
        </p>

        {/* Editorial Metrics Banner (No pills, clean unboxed typography) */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 border-t border-[#E0DACE] dark:border-[#3A332E] text-xs font-sans-clean">
          <div className="flex items-center gap-2">
            <span className="text-[#E84634]/60 uppercase tracking-wider font-semibold">Total Initiatives:</span>
            <span className="font-bold text-[#E84634]">{projects.length} Projects</span>
          </div>
          <span className="text-[#E84634]/30" aria-hidden="true">&middot;</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[#E84634]/60 uppercase tracking-wider font-semibold">In Progress:</span>
            <span className="font-bold text-[#E84634]">{inProgressCount} Sedang Dikerjakan</span>
          </div>
          <span className="text-[#E84634]/30" aria-hidden="true">&middot;</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            <span className="text-[#E84634]/60 uppercase tracking-wider font-semibold">Delivered:</span>
            <span className="font-bold text-[#E84634]">{completedCount} Selesai</span>
          </div>
          <span className="text-[#E84634]/30" aria-hidden="true">&middot;</span>
          <div className="flex items-center gap-1.5 text-[#E84634]/60">
            <Cpu size={13} />
            <span>Modern Stack: TypeScript, Go, Python, React, PostgreSQL</span>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section aria-label="Project Controls" className="mb-12">
        <div className="bg-[#E0DACE]/20 dark:bg-[#2C241B]/30 border border-[#E0DACE] dark:border-[#3A332E] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Status Tabs (Segmented Control) */}
          <div className="flex items-center gap-1 p-1 bg-[#FAFAF5] dark:bg-[#1E1A18] rounded-xl border border-[#E0DACE]/80 dark:border-[#3A332E]/80 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#E84634] text-white shadow-sm'
                  : 'text-[#E84634]/70 hover:text-[#E84634] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Semua Proyek ({projects.length})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                statusFilter === 'in_progress'
                  ? 'bg-[#E84634] text-white shadow-sm'
                  : 'text-[#E84634]/70 hover:text-[#E84634] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'in_progress' ? 'bg-white' : 'bg-amber-500 animate-pulse'}`} />
              Sedang Dikerjakan ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                statusFilter === 'completed'
                  ? 'bg-[#E84634] text-white shadow-sm'
                  : 'text-[#E84634]/70 hover:text-[#E84634] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <CheckCircle2 size={13} className={statusFilter === 'completed' ? 'text-white' : 'text-emerald-500'} />
              Selesai Dikerjakan ({completedCount})
            </button>
          </div>

          {/* Search & Domain Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E84634]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari teknologi, judul, arsitektur..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] placeholder-[#E84634]/40 focus:outline-none focus:border-[#E84634] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#E84634]/50 hover:text-[#E84634]"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#E84634]/60 shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 px-3 text-xs rounded-xl bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] focus:outline-none focus:border-[#E84634] transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'Semua Kategori' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List Grid */}
      <main>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-[#E0DACE]/10 dark:bg-[#2C241B]/20 rounded-2xl border border-dashed border-[#E0DACE] dark:border-[#3A332E]">
            <Code2 size={40} className="mx-auto text-[#E84634]/40 mb-3" />
            <h3 className="text-lg font-serif-display font-bold text-[#E84634] mb-1">Tidak Ada Proyek yang Cocok</h3>
            <p className="text-xs text-[#E84634]/70 mb-4">Coba sesuaikan kata kunci pencarian atau bersihkan filter status.</p>
            <button
              onClick={() => { setStatusFilter('all'); setCategoryFilter('All'); setSearchQuery(''); }}
              className="text-xs font-semibold px-4 py-2 bg-[#E84634] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {filteredProjects.map((project) => {
              const isInProgress = project.status === 'in_progress';

              return (
                <article
                  key={project.id}
                  className="group bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E] hover:border-[#E84634]/60 dark:hover:border-[#E84634]/60 rounded-2xl p-6 sm:p-7 shadow-sm transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Status & Category Metadata Header */}
                    <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E0DACE]/60 dark:border-[#3A332E]/60 text-xs">
                      <div className="flex items-center gap-2">
                        {isInProgress ? (
                          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            <span>Sedang Dikerjakan</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={13} />
                            <span>Selesai Dikerjakan</span>
                          </div>
                        )}
                        <span className="text-[#E84634]/30" aria-hidden="true">&middot;</span>
                        <span className="text-[#E84634]/70 font-medium">{project.category}</span>
                      </div>

                      {project.timeline && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#E84634]/60">
                          <Clock size={12} />
                          <span>{project.timeline}</span>
                        </div>
                      )}
                    </div>

                    {/* Image Preview (Optional Banner) */}
                    {project.imageUrl && (
                      <div 
                        onClick={() => setSelectedProject(project)}
                        className="w-full aspect-[16/8] rounded-xl overflow-hidden mb-5 bg-[#E0DACE]/30 dark:bg-[#2C241B]/50 relative cursor-pointer group-hover:shadow-md transition-shadow"
                      >
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-end p-4">
                          <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-md">
                            Lihat Cetak Biru Arsitektur <ArrowUpRight size={13} />
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Title and Tagline */}
                    <h2 
                      onClick={() => setSelectedProject(project)}
                      className="text-xl sm:text-2xl font-serif-display font-bold text-[#E84634] group-hover:text-[#E84634] transition-colors mb-2 cursor-pointer leading-tight flex items-start justify-between gap-3"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight size={20} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#E84634]" />
                    </h2>

                    <p className="text-xs font-medium font-sans-clean text-[#E84634]/90 mb-3 italic">
                      "{project.tagline}"
                    </p>

                    <p className="text-sm text-[#4A3F35] dark:text-[#E0DACE] leading-relaxed mb-5 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Progress Bar for Ongoing Projects */}
                    {isInProgress && project.progressPercentage !== undefined && (
                      <div className="mb-5 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                        <div className="flex justify-between items-center text-xs mb-1.5 font-semibold text-amber-700 dark:text-amber-300">
                          <span className="flex items-center gap-1">
                            <Sparkles size={13} /> Status Perkembangan
                          </span>
                          <span className="font-mono">{project.progressPercentage}% Complete</span>
                        </div>
                        <div className="w-full h-2 bg-amber-500/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${project.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tech Stack Metadata List */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 text-[#4A3F35] dark:text-[#E0DACE] border border-[#E0DACE]/60 dark:border-[#3A332E]/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#E0DACE]/60 dark:border-[#3A332E]/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-bold uppercase tracking-wider text-[#E84634] hover:underline flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      Detail Proyek &amp; Arsitektur <ChevronRight size={14} />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-[#E84634]/70 hover:text-[#E84634] hover:bg-[#E0DACE]/30 dark:hover:bg-[#3A332E]/30 transition-colors"
                          title="Lihat Repositori GitHub"
                          aria-label={`GitHub source code for ${project.title}`}
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#E84634] text-white hover:opacity-90 transition-opacity shadow-sm"
                        >
                          <span>Live Demo</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Project Detail Lightbox / Architecture Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#E84634] hover:bg-[#E0DACE]/40 dark:hover:bg-[#3A332E]/40 transition-colors cursor-pointer"
              aria-label="Tutup jendela detail"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="pr-10 mb-6">
              <div className="flex items-center gap-2 mb-2 text-xs">
                {selectedProject.status === 'in_progress' ? (
                  <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Sedang Dikerjakan (In Progress)
                  </span>
                ) : (
                  <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    Selesai Dikerjakan (Completed)
                  </span>
                )}
                <span className="text-[#E84634]/30">&middot;</span>
                <span className="text-[#E84634]/70 font-semibold">{selectedProject.category}</span>
                {selectedProject.timeline && (
                  <>
                    <span className="text-[#E84634]/30">&middot;</span>
                    <span className="font-mono text-[#E84634]/60">{selectedProject.timeline}</span>
                  </>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#E84634] leading-snug">
                {selectedProject.title}
              </h2>
              <p className="text-sm font-medium text-[#E84634]/80 mt-1">
                {selectedProject.tagline}
              </p>
            </div>

            {/* Project Image Banner */}
            {selectedProject.imageUrl && (
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-black/10 border border-[#E0DACE] dark:border-[#3A332E]">
                <img 
                  src={selectedProject.imageUrl} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            {/* Progress Bar (if in progress) */}
            {selectedProject.status === 'in_progress' && selectedProject.progressPercentage !== undefined && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex justify-between items-center text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5">
                  <span>Tahap Pengerjaan Aktif</span>
                  <span className="font-mono">{selectedProject.progressPercentage}% Selesai</span>
                </div>
                <div className="w-full h-2.5 bg-amber-500/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${selectedProject.progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] mb-2">Deskripsi &amp; Masalah yang Diselesaikan</h3>
              <p className="text-sm text-[#4A3F35] dark:text-[#E0DACE] leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Architecture Summary */}
            {selectedProject.architectureSummary && (
              <div className="mb-6 p-4 rounded-2xl bg-[#E0DACE]/25 dark:bg-[#3A332E]/30 border border-[#E0DACE] dark:border-[#3A332E]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] mb-1.5 flex items-center gap-1.5">
                  <Layers size={14} /> Ringkasan Arsitektur Sistem
                </h3>
                <p className="text-xs text-[#4A3F35] dark:text-[#E0DACE] leading-relaxed font-mono">
                  {selectedProject.architectureSummary}
                </p>
              </div>
            )}

            {/* Key Features */}
            {selectedProject.features && selectedProject.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] mb-3">Fitur Kunci &amp; Kapabilitas Rekayasa</h3>
                <ul className="space-y-2">
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#4A3F35] dark:text-[#E0DACE]">
                      <span className="text-[#E84634] font-bold mt-0.5">&bull;</span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] mb-2.5">Teknologi &amp; Framework</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.techStack.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 text-xs font-mono rounded-lg bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 text-[#4A3F35] dark:text-[#E0DACE] border border-[#E0DACE]/70 dark:border-[#3A332E]/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer Links */}
            <div className="pt-5 border-t border-[#E0DACE] dark:border-[#3A332E] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E84634] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <span>Kunjungi Live App</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E84634] text-[#E84634] text-xs font-bold uppercase tracking-wider hover:bg-[#E84634] hover:text-white transition-colors"
                  >
                    <Github size={15} />
                    <span>Source Code</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="text-xs font-semibold text-[#E84634]/70 hover:text-[#E84634] transition-colors py-2 px-3"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
