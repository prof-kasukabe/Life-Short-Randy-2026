import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Compass, 
  Code2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Database, 
  Terminal, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem, BlogPost, MediaItem, ITProject } from '../types';
import { itProjectsData } from '../data';
import { Helmet } from 'react-helmet-async';
import { getMediaThumbnail } from '../lib/media';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';
import { InteractiveIdentityShowcase } from '../components/InteractiveIdentityShowcase';

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function Home() {
  const [featuredWorks, setFeaturedWorks] = useState<PortfolioItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [recentMedia, setRecentMedia] = useState<MediaItem[]>([]);
  const [itProjects, setItProjects] = useState<ITProject[]>(itProjectsData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfoliosSnapshot = await getDocs(query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'), limit(6)));
        const works = portfoliosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PortfolioItem[];
        setFeaturedWorks(works);

        const blogsSnapshot = await getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3)));
        const posts = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
        setRecentPosts(posts);

        const mediaSnapshot = await getDocs(query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(2)));
        const media = mediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MediaItem[];
        setRecentMedia(media);

        // Fetch IT projects from Firestore if available
        const itSnap = await getDocs(collection(db, 'it_projects'));
        if (!itSnap.empty) {
          const dbProjects = itSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ITProject[];
          const existingIds = new Set(dbProjects.map(p => p.id));
          setItProjects([...dbProjects, ...itProjectsData.filter(p => !existingIds.has(p.id))]);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  const ongoingProjects = itProjects.filter(p => p.status === 'in_progress').slice(0, 2);
  const completedProjects = itProjects.filter(p => p.status === 'completed').slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Randy | Software Engineer &amp; Digital Realist</title>
        <meta name="description" content="Randy Ardiansyah — Software Engineer & digital realist crafting full-stack web architectures, AI integrations, and high-performance digital systems." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 border border-[#E0DACE] dark:border-[#3A332E] text-xs font-mono font-semibold text-[#E84634] mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Available for High-Impact Software &amp; IT Engineering
          </div>

          <h1 className="text-[12vw] sm:text-[9vw] lg:text-[130px] font-serif-display font-bold tracking-tighter text-[#E84634] mb-4 leading-[0.9] w-full text-center">
            The Late 20s
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg font-sans-clean font-bold uppercase tracking-[0.18em] text-[#E84634] max-w-3xl leading-relaxed mb-6 px-4">
            Diving deeper into the process, embracing the discomfort, and bending fate to create meaningful digital systems.
          </p>

          <p className="text-xs sm:text-sm text-[#E84634]/80 max-w-2xl leading-relaxed mb-10 px-4">
            Software Engineer &amp; Digital Realist. Integrating modern full-stack frameworks, AI workflow engines, and deliberate interactive interfaces.
          </p>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 px-4">
            <Link 
              to="/projects" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E84634] text-white hover:opacity-90 font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <Code2 size={16} />
              Lihat Proyek TI
            </Link>
            <Link 
              to="/curated" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E84634] text-[#E84634] hover:bg-[#E84634] hover:text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full transition-colors"
            >
              <Layers size={16} />
              Curated Space
            </Link>
            <Link 
              to="/tools/dither" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] hover:border-[#E84634] font-semibold uppercase tracking-wider text-xs rounded-full transition-colors"
            >
              <Sparkles size={15} />
              Dither Tool
            </Link>
            <Link 
              to="/tools/scratch" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] hover:border-[#E84634] font-semibold uppercase tracking-wider text-xs rounded-full transition-colors"
            >
              <Compass size={15} />
              Creative Scratch
            </Link>
          </div>

          {/* Spotify Widget */}
          <a 
            href="https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5?si=JUVlCAjzQ6ew20AQH2H7Wg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[340px] mx-auto mb-14 flex items-center justify-between p-2.5 border border-[#E0DACE] dark:border-[#3A332E] hover:border-[#E84634]/60 bg-white/60 dark:bg-[#1E1A18]/60 backdrop-blur-md rounded-2xl transition-all shadow-sm group overflow-hidden"
          >
            <div className="flex flex-col text-left pl-3 py-1">
              <div className="flex items-center gap-1.5 mb-1">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1DB954]" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.241 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E84634]/70">Spotify</span>
              </div>
              <span className="text-lg font-serif-display font-bold text-[#E84634] leading-none mb-1">Late20s</span>
              <span className="text-[11px] text-[#E84634]/60 font-medium">Curated by Randy</span>
            </div>
            <div className="w-[72px] h-[72px] shrink-0 rounded-[10px] overflow-hidden border border-[#E0DACE]/50 dark:border-[#3A332E]/50">
              <img 
                src={avatarImg} 
                alt="Late20s Playlist Cover" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>
          </a>

          {/* Interactive Identity & Systems Architecture Showcase */}
          <div className="w-full">
            <InteractiveIdentityShowcase />
          </div>
        </div>
      </section>

      {/* FEATURED IT PROJECTS SECTION (Highlighting Ongoing & Completed) */}
      <section className="py-24 border-t border-[#E0DACE] dark:border-[#3A332E] bg-[#E0DACE]/10 dark:bg-[#2C241B]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold uppercase tracking-widest text-[#E84634]">
                <Code2 size={16} />
                <span>Teknologi Informasi &amp; Rekayasa Sistem</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight text-[#E84634]">
                Featured IT Projects<span className="text-[#E84634]">.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#E84634]/80 mt-2 max-w-xl font-light">
                Sorotan inisiatif perangkat lunak aktif dan sistem komputasi terdistribusi yang telah selesai diimplementasikan.
              </p>
            </div>
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#E84634] hover:opacity-75 transition-opacity pb-1 border-b-2 border-[#E84634]"
            >
              <span>Buka Halaman Proyek TI Lengkap ({itProjects.length})</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {/* Ongoing Projects Spotlight */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#E0DACE] dark:border-[#3A332E]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Sedang Dikerjakan (In Progress)
                  </span>
                </div>
                <span className="text-xs font-medium text-[#E84634]/60">Fase Pengembangan</span>
              </div>

              {ongoingProjects.map((p) => (
                <div 
                  key={p.id}
                  className="bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E] hover:border-[#E84634]/60 rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-[#E84634]/80">{p.category}</span>
                      <span className="font-mono text-[#E84634]/60">{p.timeline}</span>
                    </div>

                    <h3 className="text-xl font-serif-display font-bold text-[#E84634] mb-2 leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#4A3F35] dark:text-[#E0DACE] line-clamp-3 mb-4 leading-relaxed">
                      {p.description}
                    </p>

                    {p.progressPercentage && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[11px] font-semibold text-amber-700 dark:text-amber-300 mb-1">
                          <span>Progress</span>
                          <span>{p.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-amber-500/20 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${p.progressPercentage}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 text-[#4A3F35] dark:text-[#E0DACE]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link 
                    to="/projects" 
                    className="text-xs font-bold uppercase tracking-wider text-[#E84634] hover:underline flex items-center gap-1 pt-3 border-t border-[#E0DACE]/60 dark:border-[#3A332E]/60"
                  >
                    Pelajari Selengkapnya <ArrowUpRight size={13} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Completed Projects Spotlight */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#E0DACE] dark:border-[#3A332E]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Selesai Dikerjakan (Delivered)
                  </span>
                </div>
                <span className="text-xs font-medium text-[#E84634]/60">Produksi &amp; Rilis</span>
              </div>

              {completedProjects.map((p) => (
                <div 
                  key={p.id}
                  className="bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E] hover:border-[#E84634]/60 rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-[#E84634]/80">{p.category}</span>
                      <span className="font-mono text-[#E84634]/60">{p.timeline}</span>
                    </div>

                    <h3 className="text-xl font-serif-display font-bold text-[#E84634] mb-2 leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#4A3F35] dark:text-[#E0DACE] line-clamp-3 mb-4 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 text-[#4A3F35] dark:text-[#E0DACE]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link 
                    to="/projects" 
                    className="text-xs font-bold uppercase tracking-wider text-[#E84634] hover:underline flex items-center gap-1 pt-3 border-t border-[#E0DACE]/60 dark:border-[#3A332E]/60"
                  >
                    Cek Arsitektur &amp; Demo <ArrowUpRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL COMPETENCIES / CORE ARCHITECTURE */}
      <section className="py-20 border-t border-[#E0DACE] dark:border-[#3A332E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="max-w-2xl mb-12 px-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E84634] block mb-2">
              Kemampuan Teknis &amp; Rekayasa
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-display font-bold tracking-tight text-[#E84634]">
              Core Technical Competencies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            <div className="p-6 rounded-2xl bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E]">
              <div className="flex items-center gap-2 mb-3 text-[#E84634]">
                <Cpu size={18} />
                <h3 className="font-serif-display font-bold text-base">Frontend Architecture</h3>
              </div>
              <p className="text-xs text-[#4A3F35] dark:text-[#E0DACE] leading-relaxed mb-4">
                High-performance SPAs and SSR apps with typed interfaces, accessible components, and smooth 60fps canvas graphics.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['React 19', 'TypeScript', 'Tailwind', 'Next.js', 'Canvas API'].map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 text-[#4A3F35] dark:text-[#E0DACE]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E]">
              <div className="flex items-center gap-2 mb-3 text-[#E84634]">
                <Terminal size={18} />
                <h3 className="font-serif-display font-bold text-base">Backend &amp; Microservices</h3>
              </div>
              <p className="text-xs text-[#4A3F35] dark:text-[#E0DACE] leading-relaxed mb-4">
                Scalable REST, gRPC, and WebSocket backends designed with rate-limiting, modular service boundaries, and caching.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Node.js', 'Python FastAPI', 'Go (Golang)', 'Express', 'Redis'].map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 text-[#4A3F35] dark:text-[#E0DACE]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E]">
              <div className="flex items-center gap-2 mb-3 text-[#E84634]">
                <Database size={18} />
                <h3 className="font-serif-display font-bold text-base">Databases &amp; Cloud</h3>
              </div>
              <p className="text-xs text-[#4A3F35] dark:text-[#E0DACE] leading-relaxed mb-4">
                Relational schema modeling, real-time NoSQL synchronization, time-series telemetry storage, and containerization.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['PostgreSQL', 'TimescaleDB', 'Firestore', 'Docker', 'Git/CI'].map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 text-[#4A3F35] dark:text-[#E0DACE]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAF5] dark:bg-[#1E1A18] border border-[#E0DACE] dark:border-[#3A332E]">
              <div className="flex items-center gap-2 mb-3 text-[#E84634]">
                <ShieldCheck size={18} />
                <h3 className="font-serif-display font-bold text-base">AI &amp; Zero-Trust</h3>
              </div>
              <p className="text-xs text-[#4A3F35] dark:text-[#E0DACE] leading-relaxed mb-4">
                Integrating multimodal LLMs into operational workflows, WebAuthn biometrics, and secure RBAC policy layers.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Gemini SDK', 'WebAuthn', 'JWT Auth', 'Prompt Eng', 'RBAC'].map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E0DACE]/40 dark:bg-[#3A332E]/40 text-[#4A3F35] dark:text-[#E0DACE]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Editorial Work (Curated Journal) */}
      <section className="py-24 border-t border-[#E0DACE] dark:border-[#3A332E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 px-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight text-[#E84634]">Curated Space</h2>
              <p className="text-[#E84634] font-medium italic pb-1">A selection of stories and visual projects crafted carefully over time.</p>
            </div>
            <Link to="/curated" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#E84634] hover:opacity-75 transition-opacity">
              Lihat Semua Galeri &rarr;
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-6 lg:gap-8 pb-8 snap-x px-4 [&::-webkit-scrollbar]:hidden">
            {featuredWorks.length > 0 ? featuredWorks.map((work) => (
              <Link key={work.id} to="/curated" className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                <div className="aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-5 relative rounded-[1.5rem] shadow-sm">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#E84634] transition-colors leading-relaxed">
                    {work.title}
                  </h3>
                </div>
              </Link>
            )) : (
              <>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">A Mother-Daughter Reunion In The French Countryside</h3>
                </div>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">A Heartbreak-Healing Solo Trip To The Greek Islands</h3>
                </div>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">A September In Sicily For The Couple Who Love Long Dinners</h3>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Recent Posts / Reading List */}
      <section className="py-24 border-t border-[#E0DACE] dark:border-[#3A332E]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight text-[#E84634]">Reading List</h2>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#E84634] hover:opacity-70 transition-colors">
              Lihat Semua Tulisan &rarr;
            </Link>
          </div>

          <div className="space-y-10">
            {recentPosts.map((post) => (
              <article key={post.id} className="group">
                {post.url ? (
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-[#E0DACE] dark:border-[#3A332E] pb-6">
                      <h3 className="text-xl md:text-2xl font-serif-display font-medium text-[#E84634] group-hover:opacity-70 transition-opacity flex items-center gap-3">
                        {post.iconUrl && (
                          <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                        {post.title}
                        <ExternalLink size={16} className="text-[#E84634]/50 group-hover:text-[#E84634] transition-colors" />
                      </h3>
                      <div className="flex items-center gap-4 text-sm shrink-0">
                        <span className="text-[#E84634]/70 uppercase tracking-widest text-xs font-bold">{getDomain(post.url)}</span>
                        <time className="text-[#E84634]/60 font-serif-display italic text-lg">{post.date}</time>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-[#E0DACE] dark:border-[#3A332E] pb-6">
                      <h3 className="text-xl md:text-2xl font-serif-display font-medium text-[#E84634] group-hover:opacity-70 transition-opacity flex items-center gap-3">
                        {post.iconUrl && (
                          <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                        {post.title}
                      </h3>
                      <time className="text-[#E84634]/60 font-serif-display italic text-lg shrink-0">{post.date}</time>
                    </div>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Media */}
      <section className="py-24 border-t border-[#E0DACE] dark:border-[#3A332E]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight text-[#E84634]">Watch &amp; Listen</h2>
            </div>
            <Link to="/media" className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#E84634] hover:opacity-70 transition-colors">
              Lihat Semua &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {recentMedia.map((item) => {
              const thumbnail = getMediaThumbnail(item.url, item.thumbnailUrl);
              return (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {thumbnail && (
                      <div className="w-full sm:w-32 aspect-[3/4] sm:aspect-square shrink-0 bg-[#E0DACE]/30 dark:bg-[#3A332E]/30 relative rounded-2xl overflow-hidden group-hover:opacity-90 transition-opacity shadow-sm">
                        <img 
                          src={thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLElement;
                            if (target.parentElement) {
                              target.parentElement.style.display = 'none';
                            }
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 w-full pt-2">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-xl font-serif-display font-medium text-[#E84634] group-hover:opacity-70 transition-colors leading-snug">{item.title}</h3>
                        <ExternalLink size={16} className="text-[#E84634]/50 group-hover:text-[#E84634] transition-colors shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-[#E84634]/70">
                        <span className="capitalize">{item.category || 'video'}</span>
                        <span className="opacity-50">&middot;</span>
                        <span>{item.platform}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-[#E84634]/80 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
