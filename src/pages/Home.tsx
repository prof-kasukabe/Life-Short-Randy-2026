import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Compass,
  Code2,
  Cpu,
  ArrowUpRight,
  BookOpen,
  PlaySquare,
  ExternalLink,
  Library,
  LayoutGrid,
  ArrowLeft
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
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';

type WorkspaceTab = 'verbal' | 'reading' | 'media' | 'identity' | 'projects' | 'tools';

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
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('verbal');
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

  const tabs: BoardTabItem[] = [
    { id: 'verbal', label: 'Curated Verbal', icon: Library, badge: verbalCount },
    { id: 'reading', label: 'Reading List', icon: BookOpen, badge: recentPosts.length },
    { id: 'media', label: 'Watch & Listen', icon: PlaySquare, badge: recentMedia.length },
    { id: 'projects', label: 'IT Projects', icon: Code2, badge: itProjects.length },
    { id: 'identity', label: 'Identity', icon: Cpu },
    { id: 'tools', label: 'Lab', icon: Sparkles, badge: 2 }
  ];

  const routeMap: Record<WorkspaceTab, string> = {
    verbal: '/curated',
    reading: '/blog',
    media: '/media',
    identity: '/about',
    projects: '/projects',
    tools: '/tools/dither'
  };

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

  return (
    <>
      <Helmet>
        <title>Randy Ardiansyah | The Late 20s — Software Engineer &amp; Digital Realist</title>
        <meta
          name="description"
          content="Randy Ardiansyah — Software Engineer & Digital Realist. Explore Curated Verbal, Reading List, Watch & Listen, and IT Projects."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="The Late 20s"
        pageSubtitle="Diving deeper into the process, embracing the discomfort, and bending fate to create meaningful digital systems."
        breadcrumbCategory="Overview"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id as WorkspaceTab);
          setSelectedBlogPreview(null);
        }}
        searchQuery={quickSearch}
        onSearchChange={setQuickSearch}
        searchPlaceholder="Filter current view..."
        stageRightSlot={
          <div className="flex items-center gap-1.5">
            {activeTab === 'verbal' && (
              <div className="inline-flex items-center p-0.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-[#161618]">
                <button
                  type="button"
                  onClick={() => setVerbalViewMode('shelf')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase transition-all cursor-pointer ${
                    verbalViewMode === 'shelf'
                      ? 'bg-[#E84634] text-white font-semibold'
                      : 'text-[#71717A] dark:text-zinc-400 hover:text-[#E84634]'
                  }`}
                >
                  3D
                </button>
                <button
                  type="button"
                  onClick={() => setVerbalViewMode('board')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase transition-all cursor-pointer ${
                    verbalViewMode === 'board'
                      ? 'bg-[#E84634] text-white font-semibold'
                      : 'text-[#71717A] dark:text-zinc-400 hover:text-[#E84634]'
                  }`}
                >
                  <LayoutGrid size={10} />
                  <span>Grid</span>
                </button>
              </div>
            )}

            <Link
              to={routeMap[activeTab]}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-[#161618] hover:border-[#E84634]/60 text-[11px] font-medium text-[#18181B] dark:text-zinc-200 transition-colors"
              title="Open dedicated page"
            >
              <span className="hidden sm:inline">Expand</span>
              <ArrowUpRight size={12} className="text-[#E84634]" />
            </Link>
          </div>
        }
      >
        {/* 1. CURATED VERBAL */}
        {activeTab === 'verbal' && (
          <>
            {verbalViewMode === 'shelf' ? (
              <CuratedVerbalShelf items={featuredWorks} searchQuery={quickSearch} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {allVerbalItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setVerbalViewMode('shelf')}
                    className="group rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 hover:border-[#E84634]/70 p-4 flex flex-col justify-between min-h-[165px] transition-all cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A] dark:text-zinc-500 mb-2">
                        <span className="font-bold text-[#18181B] dark:text-zinc-300">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span>{item.date || '2026'}</span>
                      </div>
                      <h3 className="text-lg font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] transition-colors leading-snug mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#52525B] dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-[#71717A] dark:text-zinc-500">
                      <span className="text-[#E84634] font-semibold">
                        {item.category || 'Verbal'}
                      </span>
                      <span className="group-hover:text-[#E84634]">Inspect 3D &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 2. READING LIST */}
        {activeTab === 'reading' && (
          <>
            {selectedBlogPreview ? (
              <div className="rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 p-5 sm:p-7">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-black/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedBlogPreview(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E84634] hover:underline cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Reading List</span>
                  </button>
                  <span className="text-xs font-serif-display italic text-[#71717A] dark:text-zinc-400">
                    {selectedBlogPreview.date} · {selectedBlogPreview.readTime || '5 min read'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#18181B] dark:text-white mb-3">
                  {selectedBlogPreview.title}
                </h3>
                <p className="text-sm sm:text-base text-[#3F3F46] dark:text-zinc-300 leading-relaxed whitespace-pre-line mb-6">
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#0D0D0F] text-xs font-semibold"
                    >
                      <span>Read External ({getDomain(selectedBlogPreview.url)})</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <Link
                      to={`/blog/${selectedBlogPreview.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#0D0D0F] text-xs font-semibold"
                    >
                      <span>Open Full Article</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-black/10 dark:divide-white/10">
                {filteredPosts.map((post, idx) => (
                  <article
                    key={post.id}
                    onClick={() => setSelectedBlogPreview(post)}
                    className="group py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="text-xs font-mono text-[#71717A] dark:text-zinc-500 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] transition-colors leading-snug">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-xs text-[#52525B] dark:text-zinc-400 line-clamp-1 mt-0.5">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#71717A] dark:text-zinc-500 shrink-0 pl-7 sm:pl-0">
                      <span>{post.url ? getDomain(post.url) : 'Journal'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime || '5m'}</span>
                      <span aria-hidden="true">·</span>
                      <time className="text-[#18181B] dark:text-zinc-300">{post.date}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* 3. WATCH & LISTEN */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={avatarImg}
                  alt="Late20s Playlist"
                  className="w-12 h-12 rounded-xl object-cover border border-black/10 dark:border-white/10"
                />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#1DB954] font-bold">
                    Spotify Curated Playlist
                  </div>
                  <h3 className="text-lg font-serif-display font-bold text-[#18181B] dark:text-white">
                    Late20s — Curated by Randy
                  </h3>
                  <p className="text-xs text-[#52525B] dark:text-zinc-400">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredMedia.map((item, idx) => {
                const thumbnail = getMediaThumbnail(item.url, item.thumbnailUrl);
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 hover:border-[#E84634]/70 overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div>
                      {thumbnail && (
                        <div className="w-full aspect-video bg-zinc-900 overflow-hidden relative">
                          <img
                            src={thumbnail}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-3.5">
                        <div className="text-[10px] font-mono text-[#71717A] dark:text-zinc-500 mb-1">
                          {String(idx + 1).padStart(2, '0')} · {item.category || 'Media'}
                        </div>
                        <h4 className="text-sm font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] transition-colors line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-[#52525B] dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-3.5 pb-3 pt-1 flex items-center justify-between text-[11px] font-mono text-[#71717A] dark:text-zinc-500">
                      <span className="text-[#E84634] font-semibold">{item.platform}</span>
                      <span className="flex items-center gap-1 group-hover:text-[#E84634]">
                        Play <ExternalLink size={10} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. IT PROJECTS */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredProjects.map((p) => {
              const isOngoing = p.status === 'in_progress';
              return (
                <Link
                  key={p.id}
                  to="/projects"
                  className="group rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 hover:border-[#E84634]/70 p-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span
                        className={`font-semibold uppercase ${
                          isOngoing ? 'text-amber-500' : 'text-emerald-500'
                        }`}
                      >
                        {isOngoing ? 'In Progress' : 'Delivered'}
                      </span>
                      <span className="text-[#71717A] dark:text-zinc-500">{p.timeline}</span>
                    </div>

                    <h3 className="text-lg font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] transition-colors mb-1.5 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#52525B] dark:text-zinc-400 line-clamp-2 mb-3">
                      {p.description}
                    </p>
                  </div>

                  <div>
                    {isOngoing && p.progressPercentage && (
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] font-mono text-amber-500 mb-1">
                          <span>Completion</span>
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

                    <div className="pt-2 border-t border-black/10 dark:border-white/10 text-[11px] font-mono text-[#71717A] dark:text-zinc-500 truncate">
                      {p.techStack.slice(0, 4).join(' · ')}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 5. IDENTITY CANVAS */}
        {activeTab === 'identity' && <GenerativeParticleCanvas />}

        {/* 6. CREATIVE LAB */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Link
              to="/tools/dither"
              className="group p-5 rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 hover:border-[#E84634]/70 transition-all flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#E84634]/12 text-[#E84634] flex items-center justify-center mb-3.5">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-xl font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] mb-1.5">
                  Lumina Dither Studio
                </h3>
                <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400 leading-relaxed">
                  Interactive client-side Floyd-Steinberg, Atkinson, and Bayer matrix retro dithering laboratory for images and visual art.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E84634] mt-4 inline-flex items-center gap-1">
                Launch Dither Tool <ArrowUpRight size={13} />
              </span>
            </Link>

            <Link
              to="/tools/scratch"
              className="group p-5 rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 hover:border-[#E84634]/70 transition-all flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#E84634]/12 text-[#E84634] flex items-center justify-center mb-3.5">
                  <Compass size={18} />
                </div>
                <h3 className="text-xl font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] mb-1.5">
                  Creative Scratch Pad
                </h3>
                <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400 leading-relaxed">
                  Freeform interactive canvas playground for sketching ideas, visual experiments, and tactile strokes.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E84634] mt-4 inline-flex items-center gap-1">
                Launch Creative Scratch <ArrowUpRight size={13} />
              </span>
            </Link>
          </div>
        )}
      </BoardPageLayout>
    </>
  );
}
