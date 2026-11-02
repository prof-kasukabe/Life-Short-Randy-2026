import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Compass,
  Code2,
  Layers,
  CheckCircle2,
  Cpu,
  Database,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  BookOpen,
  PlaySquare,
  Search,
  PanelLeftClose,
  PanelLeft,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
  Bookmark,
  User,
  Mail,
  SlidersHorizontal,
  LayoutGrid,
  Library
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem, BlogPost, MediaItem, ITProject } from '../types';
import { itProjectsData, blogData as fallbackBlogs } from '../data';
import { Helmet } from 'react-helmet-async';
import { getMediaThumbnail } from '../lib/media';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';
import { GenerativeParticleCanvas } from '../components/GenerativeParticleCanvas';
import { CuratedVerbalShelf, DEFAULT_VERBAL_ARCHIVE } from '../components/CuratedVerbalShelf';
import { useTheme } from '../ThemeProvider';

type WorkspaceTab = 'identity' | 'verbal' | 'reading' | 'media' | 'projects' | 'tools';
type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const FALLBACK_MEDIA: MediaItem[] = [
  {
    id: 'm-1',
    title: 'The Architecture of Calm Technology & Digital Realism',
    category: 'video',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    date: 'Oct 2026',
    description: 'Deep dive into designing software systems that respect human attention and endure beyond hype cycles.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-2',
    title: 'Late20s — Curated Lo-Fi & Ambient Focus Session',
    category: 'audio',
    platform: 'Spotify',
    url: 'https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5?si=JUVlCAjzQ6ew20AQH2H7Wg',
    date: 'Sep 2026',
    description: 'Late-night coding and reading soundtrack curated by Randy Ardiansyah.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-3',
    title: 'Building Distributed Full-Stack Systems with Go & React 19',
    category: 'video',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    date: 'Aug 2026',
    description: 'Walkthrough of high-throughput telemetry ingestion, WebSockets, and 60fps canvas rendering.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-4',
    title: 'Notes on Solitude, Discipline & Software Craftsmanship',
    category: 'audio',
    platform: 'Podcast',
    url: 'https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5',
    date: 'Jul 2026',
    description: 'Audio monologue exploring the transition through the late twenties as an engineer and writer.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80'
  }
];

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('verbal');
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [quickSearch, setQuickSearch] = useState<string>('');
  const [verbalViewMode, setVerbalViewMode] = useState<'shelf' | 'board'>('shelf');
  const [selectedBlogPreview, setSelectedBlogPreview] = useState<BlogPost | null>(null);

  const [featuredWorks, setFeaturedWorks] = useState<PortfolioItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>(fallbackBlogs);
  const [recentMedia, setRecentMedia] = useState<MediaItem[]>(FALLBACK_MEDIA);
  const [itProjects, setItProjects] = useState<ITProject[]>(itProjectsData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfoliosSnapshot = await getDocs(
          query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'))
        );
        if (!portfoliosSnapshot.empty) {
          const works = portfoliosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as PortfolioItem[];
          setFeaturedWorks(works);
        }

        const blogsSnapshot = await getDocs(
          query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
        );
        if (!blogsSnapshot.empty) {
          const posts = blogsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as BlogPost[];
          setRecentPosts(posts);
        }

        const mediaSnapshot = await getDocs(
          query(collection(db, 'media'), orderBy('createdAt', 'desc'))
        );
        if (!mediaSnapshot.empty) {
          const media = mediaSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as MediaItem[];
          setRecentMedia(media);
        }

        const itSnap = await getDocs(collection(db, 'it_projects'));
        if (!itSnap.empty) {
          const dbProjects = itSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as ITProject[];
          const existingIds = new Set(dbProjects.map((p) => p.id));
          setItProjects([
            ...dbProjects,
            ...itProjectsData.filter((p) => !existingIds.has(p.id))
          ]);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchData();
  }, []);

  const verbalCount = Math.max(featuredWorks.length, DEFAULT_VERBAL_ARCHIVE.length);

  const domainTabs: {
    id: WorkspaceTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    fullRoute: string;
  }[] = [
    { id: 'verbal', label: 'Curated Verbal', icon: Library, badge: verbalCount, fullRoute: '/curated' },
    { id: 'reading', label: 'Reading List', icon: BookOpen, badge: recentPosts.length, fullRoute: '/blog' },
    { id: 'media', label: 'Watch & Listen', icon: PlaySquare, badge: recentMedia.length, fullRoute: '/media' },
    { id: 'identity', label: 'Identity & Canvas', icon: Cpu, fullRoute: '/about' },
    { id: 'projects', label: 'IT Projects', icon: Code2, badge: itProjects.length, fullRoute: '/projects' },
    { id: 'tools', label: 'Creative Lab', icon: Sparkles, badge: 2, fullRoute: '/tools/dither' }
  ];

  const currentTabMeta = domainTabs.find((t) => t.id === activeTab) || domainTabs[0];

  const handleCycleTab = (dir: -1 | 1) => {
    const idx = domainTabs.findIndex((t) => t.id === activeTab);
    const nextIdx = (idx + dir + domainTabs.length) % domainTabs.length;
    setActiveTab(domainTabs[nextIdx].id);
  };

  // Filtered collections based on sidebar Quick Search
  const filteredPosts = useMemo(() => {
    if (!quickSearch.trim()) return recentPosts;
    const q = quickSearch.toLowerCase();
    return recentPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.content || '').toLowerCase().includes(q)
    );
  }, [recentPosts, quickSearch]);

  const filteredMedia = useMemo(() => {
    if (!quickSearch.trim()) return recentMedia;
    const q = quickSearch.toLowerCase();
    return recentMedia.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q) ||
        (m.platform || '').toLowerCase().includes(q)
    );
  }, [recentMedia, quickSearch]);

  const filteredProjects = useMemo(() => {
    if (!quickSearch.trim()) return itProjects;
    const q = quickSearch.toLowerCase();
    return itProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  }, [itProjects, quickSearch]);

  const allVerbalItems = useMemo(() => {
    const merged =
      featuredWorks.length > 0
        ? [
            ...featuredWorks,
            ...DEFAULT_VERBAL_ARCHIVE.filter(
              (d) => !featuredWorks.some((f) => f.title.toLowerCase() === d.title.toLowerCase())
            )
          ]
        : DEFAULT_VERBAL_ARCHIVE;
    if (!quickSearch.trim()) return merged;
    const q = quickSearch.toLowerCase();
    return merged.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q)
    );
  }, [featuredWorks, quickSearch]);

  const viewportWidthClass =
    viewport === 'mobile'
      ? 'max-w-[430px]'
      : viewport === 'tablet'
      ? 'max-w-[860px]'
      : 'max-w-full';

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden px-3 sm:px-6 pb-3 sm:pb-5 pt-2 select-none">
      <Helmet>
        <title>Randy | The Late 20s — Interactive Workspace</title>
        <meta
          name="description"
          content="Randy Ardiansyah — Software Engineer & Digital Realist. Explore Curated Verbal, Reading List, Watch & Listen, and IT Projects in one unified workspace."
        />
      </Helmet>

      {/* Compact Top Headline & Viewport Switcher (BoardUI Header Style) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2.5 px-2 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-serif-display font-bold tracking-tight text-[#E84634] leading-none">
            The Late 20s
          </h1>
          <span className="hidden md:inline text-[#E84634]/35">·</span>
          <p className="hidden md:block text-xs font-sans-clean text-[#E84634]/80 truncate max-w-md">
            Diving deeper into the process, embracing discomfort, and crafting meaningful digital systems.
          </p>
        </div>

        {/* Desktop / Tablet / Mobile Switcher Pill */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#E0DACE]/45 dark:bg-[#2A2420] border border-[#E0DACE] dark:border-[#3A332E]">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-white dark:bg-[#1E1A18] text-[#E84634] shadow-sm font-semibold'
                : 'text-[#E84634]/65 hover:text-[#E84634]'
            }`}
          >
            <Monitor size={12} />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-white dark:bg-[#1E1A18] text-[#E84634] shadow-sm font-semibold'
                : 'text-[#E84634]/65 hover:text-[#E84634]'
            }`}
          >
            <Tablet size={12} />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-white dark:bg-[#1E1A18] text-[#E84634] shadow-sm font-semibold'
                : 'text-[#E84634]/65 hover:text-[#E84634]'
            }`}
          >
            <Smartphone size={12} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* OUTER BOARD-UI FRAME (Fills remaining height without page scrolling) */}
      <div
        className={`flex-1 min-h-0 w-full ${viewportWidthClass} mx-auto rounded-[1.5rem] border border-[#E0DACE] dark:border-[#3A332E] bg-white/80 dark:bg-[#171412]/90 backdrop-blur-md shadow-xl flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Top Domain Tabs Bar (Like Agentic chat | Image generation | Calendar | Live preview) */}
        <div className="h-12 px-3 sm:px-5 border-b border-[#E0DACE]/80 dark:border-[#2E2824] flex items-center justify-between gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0 bg-[#FAFAF5]/90 dark:bg-[#1B1815]">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {domainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedBlogPreview(null);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E84634]/15 text-[#E84634] font-semibold ring-1 ring-[#E84634]/30'
                      : 'text-[#4A3F35]/75 dark:text-[#E0DACE]/70 hover:text-[#E84634] hover:bg-[#E84634]/5'
                  }`}
                >
                  <Icon size={13} className="text-[#E84634]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={currentTabMeta.fullRoute}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] bg-white dark:bg-[#24201D] text-[11px] font-medium text-[#E84634] hover:border-[#E84634] transition-colors shadow-2xs"
            >
              <ExternalLink size={11} />
              <span className="hidden sm:inline">Live preview</span>
            </Link>
          </div>
        </div>

        {/* INNER 2-PANE WORKSPACE (Left Sidebar + Right Main Stage) */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* LEFT SIDEBAR */}
          {sidebarOpen && viewport !== 'mobile' && (
            <aside className="w-56 lg:w-60 shrink-0 border-r border-[#E0DACE]/80 dark:border-[#2E2824] bg-[#F6F4EE]/90 dark:bg-[#1B1815]/90 flex flex-col justify-between p-3 select-none">
              <div className="space-y-3">
                {/* User Identity Row */}
                <div className="flex items-center justify-between px-1.5 py-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={avatarImg}
                      alt="Randy Ardiansyah"
                      className="w-6 h-6 rounded-full object-cover border border-[#E84634]/40 shrink-0"
                    />
                    <span className="text-xs font-semibold text-[#2A2521] dark:text-[#F5F2EB] truncate">
                      Randy Ardiansyah
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-md text-[#6E655B] hover:text-[#E84634] transition-colors cursor-pointer"
                    title="Collapse Sidebar"
                  >
                    <PanelLeftClose size={14} />
                  </button>
                </div>

                {/* Quick Search Bar */}
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6E655B]"
                  />
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    placeholder="Quick Search"
                    className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-[#EAE6DC]/70 dark:bg-[#25211E] border border-transparent focus:border-[#E84634]/40 text-xs text-[#2A2521] dark:text-[#F5F2EB] placeholder-[#6E655B] outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono px-1 py-0.5 rounded bg-white/80 dark:bg-[#171412] text-[#6E655B] border border-[#E0DACE] dark:border-[#3A332E]">
                    ⌘K
                  </span>
                </div>

                {/* Sidebar Navigation List */}
                <nav className="space-y-0.5 pt-1">
                  {domainTabs.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setSelectedBlogPreview(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#E84634] text-white shadow-xs font-semibold'
                            : 'text-[#4A3F35] dark:text-[#D8D0C5] hover:bg-[#EAE6DC]/70 dark:hover:bg-[#25211E]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon size={14} className={isActive ? 'text-white' : 'text-[#E84634]'} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#E0DACE]/70 dark:bg-[#2A2420] text-[#6E655B] dark:text-[#A39B8F]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Sidebar Controls: Theme Switch, Quick Links, Spotify Card */}
              <div className="space-y-2.5 pt-3 border-t border-[#E0DACE]/80 dark:border-[#2E2824]">
                {/* Light / Dark Pill Switch */}
                <div className="inline-flex items-center p-0.5 rounded-full bg-[#EAE6DC] dark:bg-[#25211E] border border-[#E0DACE] dark:border-[#3A332E]">
                  <button
                    type="button"
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white text-[#E84634] shadow-2xs'
                        : 'text-[#6E655B] hover:text-[#E84634]'
                    }`}
                    aria-label="Light mode"
                  >
                    <Sun size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#171412] text-[#E84634] shadow-2xs'
                        : 'text-[#6E655B] hover:text-[#E84634]'
                    }`}
                    aria-label="Dark mode"
                  >
                    <Moon size={12} />
                  </button>
                </div>

                {/* Secondary Quick Routes */}
                <div className="space-y-0.5 text-xs text-[#6E655B] dark:text-[#A39B8F]">
                  <Link
                    to="/bookmarks"
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:text-[#E84634] transition-colors"
                  >
                    <Bookmark size={13} />
                    <span>Bookmarks</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:text-[#E84634] transition-colors"
                  >
                    <Mail size={13} />
                    <span>Contact &amp; Collab</span>
                  </Link>
                </div>

                {/* Spotify Late20s Mini Team Card (Matches bottom-left Board team card) */}
                <a
                  href="https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5?si=JUVlCAjzQ6ew20AQH2H7Wg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#231F1C] border border-[#E0DACE] dark:border-[#3A332E] hover:border-[#E84634]/60 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#E84634] text-white flex items-center justify-center font-serif-display font-bold text-sm shrink-0">
                      R.
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-[#2A2521] dark:text-[#F5F2EB] truncate">
                        Late20s · Spotify
                      </div>
                      <div className="text-[10px] text-[#6E655B] dark:text-[#A39B8F] truncate">
                        Curated by Randy
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={13}
                    className="text-[#6E655B] group-hover:text-[#E84634] shrink-0"
                  />
                </a>
              </div>
            </aside>
          )}

          {/* RIGHT MAIN WORKSPACE STAGE */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#FAFAF5] dark:bg-[#191614] overflow-hidden">
            {/* Stage Subheader: Breadcrumb + Title + Prev/Next Switcher + Primary CTA */}
            <div className="px-4 sm:px-6 py-3 border-b border-[#E0DACE]/80 dark:border-[#2E2824] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white/60 dark:bg-[#1E1A18]/60">
              <div className="flex items-center gap-2.5">
                {(!sidebarOpen || viewport === 'mobile') && (
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="p-1.5 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] hover:bg-[#E84634]/10 transition-colors cursor-pointer"
                    title="Show Sidebar"
                  >
                    <PanelLeft size={14} />
                  </button>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6E655B] dark:text-[#A39B8F]">
                    <span className="font-semibold text-[#E84634]">Randy.</span>
                    <span>&gt;</span>
                    <span>The Late 20s</span>
                    <span>&gt;</span>
                    <span className="text-[#2A2521] dark:text-[#F5F2EB] font-medium">
                      {currentTabMeta.label}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] leading-tight">
                    {currentTabMeta.label}
                  </h2>
                </div>
              </div>

              {/* Right Controls: View Switcher + Domain Prev/Next Pill + Action Button */}
              <div className="flex items-center gap-2">
                {activeTab === 'verbal' && (
                  <div className="inline-flex items-center p-0.5 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] bg-[#F5F2EB] dark:bg-[#24201D]">
                    <button
                      type="button"
                      onClick={() => setVerbalViewMode('shelf')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase transition-all cursor-pointer ${
                        verbalViewMode === 'shelf'
                          ? 'bg-[#E84634] text-white font-semibold'
                          : 'text-[#6E655B] dark:text-[#A39B8F] hover:text-[#E84634]'
                      }`}
                    >
                      3D Shelf
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerbalViewMode('board')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase transition-all cursor-pointer ${
                        verbalViewMode === 'board'
                          ? 'bg-[#E84634] text-white font-semibold'
                          : 'text-[#6E655B] dark:text-[#A39B8F] hover:text-[#E84634]'
                      }`}
                    >
                      Board Grid
                    </button>
                  </div>
                )}

                {/* Prev / Current / Next Domain Stepper (Matches `< August 2026 >`) */}
                <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] bg-white dark:bg-[#24201D] text-xs font-medium text-[#2A2521] dark:text-[#F5F2EB]">
                  <button
                    type="button"
                    onClick={() => handleCycleTab(-1)}
                    className="p-0.5 text-[#6E655B] hover:text-[#E84634] transition-colors cursor-pointer"
                    aria-label="Previous domain"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="min-w-[105px] text-center text-[11px] font-semibold">
                    {currentTabMeta.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCycleTab(1)}
                    className="p-0.5 text-[#6E655B] hover:text-[#E84634] transition-colors cursor-pointer"
                    aria-label="Next domain"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                <Link
                  to={currentTabMeta.fullRoute}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E84634] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                >
                  <span>Buka Halaman</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            {/* STAGE BODY (Internally scrollable if content overflows, keeping outer page locked) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E84634]/25">
              {/* 1. CURATED VERBAL TAB */}
              {activeTab === 'verbal' && (
                <div className="h-full flex flex-col">
                  {verbalViewMode === 'shelf' ? (
                    <CuratedVerbalShelf items={featuredWorks} searchQuery={quickSearch} />
                  ) : (
                    /* BoardUI Calendar-Style Matrix for Curated Verbal */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {allVerbalItems.map((item, idx) => (
                        <div
                          key={item.id}
                          onClick={() => setVerbalViewMode('shelf')}
                          className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE]/80 dark:border-[#332D29] hover:border-[#E84634] p-3.5 flex flex-col justify-between min-h-[175px] transition-all cursor-pointer shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#6E655B] dark:text-[#A39B8F] mb-2">
                              <span className="font-bold text-[#2A2521] dark:text-[#F5F2EB]">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span>{item.date || '2026'}</span>
                            </div>
                            <h3 className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-snug mb-1.5">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#E0DACE]/50 dark:border-[#2E2824] flex items-center justify-between text-[10px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-[#E84634]/12 text-[#E84634] font-semibold">
                              {item.category || 'Verbal'}
                            </span>
                            <span className="text-[#6E655B] dark:text-[#A39B8F] group-hover:text-[#E84634]">
                              Inspect 3D &rarr;
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. READING LIST TAB (BoardUI Calendar/Card Grid + Instant Reader) */}
              {activeTab === 'reading' && (
                <div className="h-full flex flex-col">
                  {selectedBlogPreview ? (
                    <div className="bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto w-full">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E0DACE] dark:border-[#332D29]">
                        <button
                          type="button"
                          onClick={() => setSelectedBlogPreview(null)}
                          className="text-xs font-mono uppercase tracking-wider text-[#E84634] hover:underline cursor-pointer"
                        >
                          &larr; Back to Reading Board
                        </button>
                        <span className="text-xs font-serif-display italic text-[#6E655B] dark:text-[#A39B8F]">
                          {selectedBlogPreview.date} · {selectedBlogPreview.readTime || '5 min read'}
                        </span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-4">
                        {selectedBlogPreview.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#4A3F35] dark:text-[#D8D0C5] leading-relaxed whitespace-pre-line mb-6">
                        {selectedBlogPreview.content ||
                          selectedBlogPreview.excerpt ||
                          'Reflections and field notes written by Randy Ardiansyah on minimalist engineering, calm technology, and deliberate creative systems.'}
                      </p>
                      <div className="flex items-center gap-3">
                        {selectedBlogPreview.url ? (
                          <a
                            href={selectedBlogPreview.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E84634] text-white text-xs font-semibold"
                          >
                            <span>Read External Source ({getDomain(selectedBlogPreview.url)})</span>
                            <ExternalLink size={13} />
                          </a>
                        ) : (
                          <Link
                            to={`/blog/${selectedBlogPreview.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E84634] text-white text-xs font-semibold"
                          >
                            <span>Open Full Article Page</span>
                            <ArrowUpRight size={13} />
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Board Column Headers (Like Sun / Mon / Tue / Wed in the BoardUI Calendar) */}
                      <div className="hidden lg:grid grid-cols-4 gap-3 px-2 pb-2 text-[11px] font-mono uppercase tracking-wider text-[#6E655B] dark:text-[#A39B8F]">
                        <span>01 · Essays &amp; Notes</span>
                        <span>02 · Architecture</span>
                        <span>03 · Reflections</span>
                        <span>04 · Field Journal</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {filteredPosts.map((post, idx) => {
                          const tagColors = [
                            'bg-[#E84634]/12 text-[#E84634]',
                            'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                            'bg-amber-500/15 text-amber-700 dark:text-amber-300',
                            'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                          ];
                          const badgeClass = tagColors[idx % tagColors.length];

                          return (
                            <article
                              key={post.id}
                              onClick={() => setSelectedBlogPreview(post)}
                              className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE]/80 dark:border-[#332D29] hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[170px] transition-all cursor-pointer shadow-2xs"
                            >
                              <div>
                                <div className="flex items-center justify-between text-xs mb-2">
                                  <span className="font-mono font-bold text-[#2A2521] dark:text-[#F5F2EB]">
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                  <time className="text-[11px] font-serif-display italic text-[#6E655B] dark:text-[#A39B8F]">
                                    {post.date}
                                  </time>
                                </div>

                                <h3 className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-snug mb-2">
                                  {post.title}
                                </h3>

                                {post.excerpt && (
                                  <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                  </p>
                                )}
                              </div>

                              <div className="mt-3 pt-2 flex flex-col gap-1">
                                <div
                                  className={`w-full px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center justify-between ${badgeClass}`}
                                >
                                  <span className="truncate">
                                    {post.url ? getDomain(post.url) : 'Randy Journal'}
                                  </span>
                                  <span>{post.readTime || '5m'}</span>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 3. WATCH & LISTEN TAB (BoardUI Media Matrix + Curated Spotify) */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  {/* Featured Spotify Strip */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={avatarImg}
                        alt="Late20s Playlist"
                        className="w-14 h-14 rounded-xl object-cover border border-[#E0DACE] dark:border-[#3A332E]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#1DB954] font-bold mb-0.5">
                          <span>Spotify Official Playlist</span>
                        </div>
                        <h3 className="text-xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB]">
                          Late20s — Curated by Randy
                        </h3>
                        <p className="text-xs text-[#6E655B] dark:text-[#A39B8F]">
                          Ambient focus, late-night coding sessions, and analog warmth.
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5?si=JUVlCAjzQ6ew20AQH2H7Wg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#1DB954] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0"
                    >
                      Listen on Spotify &rarr;
                    </a>
                  </div>

                  {/* Watch & Listen Board Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {filteredMedia.map((item, idx) => {
                      const thumbnail = getMediaThumbnail(item.url, item.thumbnailUrl);
                      return (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE]/80 dark:border-[#332D29] hover:border-[#E84634] overflow-hidden flex flex-col justify-between transition-all shadow-2xs"
                        >
                          <div>
                            {thumbnail && (
                              <div className="w-full aspect-video bg-[#E0DACE]/30 dark:bg-[#2A2420] overflow-hidden relative">
                                <img
                                  src={thumbnail}
                                  alt={item.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/65 text-white text-[10px] font-mono uppercase">
                                  {String(idx + 1).padStart(2, '0')} · {item.category || 'Media'}
                                </span>
                              </div>
                            )}
                            <div className="p-3.5">
                              <h4 className="text-sm font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors line-clamp-2 mb-1">
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="px-3.5 pb-3 pt-1 flex items-center justify-between text-[10px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-[#E84634]/12 text-[#E84634] font-semibold">
                              {item.platform}
                            </span>
                            <span className="text-[#6E655B] dark:text-[#A39B8F] flex items-center gap-1 group-hover:text-[#E84634]">
                              Play <ExternalLink size={10} />
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. IDENTITY & CANVAS TAB */}
              {activeTab === 'identity' && (
                <div className="space-y-4">
                  <GenerativeParticleCanvas />
                </div>
              )}

              {/* 5. IT PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredProjects.map((p) => {
                      const isOngoing = p.status === 'in_progress';
                      return (
                        <div
                          key={p.id}
                          className="rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE]/80 dark:border-[#332D29] hover:border-[#E84634] p-4 flex flex-col justify-between transition-all shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                              <span
                                className={`px-2 py-0.5 rounded font-bold uppercase ${
                                  isOngoing
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                }`}
                              >
                                {isOngoing ? 'In Progress' : 'Delivered'}
                              </span>
                              <span className="text-[#6E655B] dark:text-[#A39B8F]">{p.timeline}</span>
                            </div>

                            <h3 className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-1.5 leading-snug">
                              {p.title}
                            </h3>
                            <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 mb-3">
                              {p.description}
                            </p>
                          </div>

                          <div>
                            {isOngoing && p.progressPercentage && (
                              <div className="mb-3">
                                <div className="flex justify-between text-[10px] font-mono text-amber-600 dark:text-amber-400 mb-1">
                                  <span>Completion</span>
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

                            <div className="flex flex-wrap gap-1 pt-2 border-t border-[#E0DACE]/50 dark:border-[#2E2824]">
                              {p.techStack.slice(0, 4).map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E0DACE]/40 dark:bg-[#2A2420] text-[#4A3F35] dark:text-[#D8D0C5]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. CREATIVE LAB TAB */}
              {activeTab === 'tools' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/tools/dither"
                    className="group p-6 rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] hover:border-[#E84634] transition-all flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#E84634]/12 text-[#E84634] flex items-center justify-center mb-4">
                        <Sparkles size={20} />
                      </div>
                      <h3 className="text-2xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] mb-2">
                        Lumina Dither Studio
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed">
                        Interactive client-side Floyd-Steinberg, Atkinson, and Bayer matrix retro dithering laboratory for images and visual art.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E84634] mt-4 inline-flex items-center gap-1">
                      Launch Dither Tool <ArrowUpRight size={14} />
                    </span>
                  </Link>

                  <Link
                    to="/tools/scratch"
                    className="group p-6 rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] hover:border-[#E84634] transition-all flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#E84634]/12 text-[#E84634] flex items-center justify-center mb-4">
                        <Compass size={20} />
                      </div>
                      <h3 className="text-2xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] mb-2">
                        Creative Scratch Pad
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed">
                        Freeform interactive canvas playground for sketching ideas, visual experiments, and tactile strokes.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E84634] mt-4 inline-flex items-center gap-1">
                      Launch Creative Scratch <ArrowUpRight size={14} />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
