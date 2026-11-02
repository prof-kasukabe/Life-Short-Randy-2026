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
    { id: 'identity', label: 'Identity Canvas', icon: Cpu },
    { id: 'projects', label: 'IT Projects', icon: Code2, badge: itProjects.length },
    { id: 'tools', label: 'Creative Lab', icon: Sparkles, badge: 2 }
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
        <title>Randy | The Late 20s — Digital Realist &amp; Software Engineer</title>
        <meta
          name="description"
          content="Randy Ardiansyah — Software Engineer & Digital Realist. Explore Curated Verbal, Reading List, Watch & Listen, and IT Projects."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="The Late 20s"
        pageSubtitle="Diving deeper into the process, embracing the discomfort, and bending fate to create meaningful digital systems."
        breadcrumbCategory="Randy Ardiansyah"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id as WorkspaceTab);
          setSelectedBlogPreview(null);
        }}
        searchQuery={quickSearch}
        onSearchChange={setQuickSearch}
        searchPlaceholder="Search active view..."
        stageRightSlot={
          <div className="flex items-center gap-2">
            {activeTab === 'verbal' && (
              <div className="inline-flex items-center p-0.5 rounded-xl border border-[#E2DDD5] dark:border-[#2E2824] bg-white dark:bg-[#161311]">
                <button
                  type="button"
                  onClick={() => setVerbalViewMode('shelf')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-all cursor-pointer ${
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
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-all cursor-pointer ${
                    verbalViewMode === 'board'
                      ? 'bg-[#E84634] text-white font-semibold'
                      : 'text-[#6E655B] dark:text-[#A39B8F] hover:text-[#E84634]'
                  }`}
                >
                  <LayoutGrid size={11} />
                  <span>Grid</span>
                </button>
              </div>
            )}

            <Link
              to={routeMap[activeTab]}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E84634] text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <span className="hidden sm:inline">Full Page</span>
              <ArrowUpRight size={13} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {allVerbalItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setVerbalViewMode('shelf')}
                    className="group rounded-xl bg-[#FAFAF7] dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2C2623] hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[175px] transition-all cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7267] dark:text-[#9E9589] mb-2">
                        <span className="font-bold text-[#231F1C] dark:text-[#F5F2EB]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span>{item.date || '2026'}</span>
                      </div>
                      <h3 className="text-base font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-snug mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#E2DDD5]/60 dark:border-[#2C2623] flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#E84634]/12 text-[#E84634] font-semibold">
                        {item.category || 'Verbal'}
                      </span>
                      <span className="text-[#7A7267] group-hover:text-[#E84634]">
                        Inspect 3D &rarr;
                      </span>
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
              <div className="bg-[#FAFAF7] dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2C2623] rounded-2xl p-5 sm:p-7 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E2DDD5] dark:border-[#2C2623]">
                  <button
                    type="button"
                    onClick={() => setSelectedBlogPreview(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E84634] hover:underline cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Reading List</span>
                  </button>
                  <span className="text-xs font-serif-display italic text-[#7A7267] dark:text-[#9E9589]">
                    {selectedBlogPreview.date} · {selectedBlogPreview.readTime || '5 min read'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB] mb-3">
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E84634] text-white text-xs font-semibold"
                    >
                      <span>Read External ({getDomain(selectedBlogPreview.url)})</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <Link
                      to={`/blog/${selectedBlogPreview.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E84634] text-white text-xs font-semibold"
                    >
                      <span>Open Full Article</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
                      className="group rounded-xl bg-[#FAFAF7] dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2C2623] hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[175px] transition-all cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-mono font-bold text-[#231F1C] dark:text-[#F5F2EB]">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <time className="text-[11px] font-serif-display italic text-[#7A7267] dark:text-[#9E9589]">
                            {post.date}
                          </time>
                        </div>

                        <h3 className="text-base font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-snug mb-2">
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2">
                        <div
                          className={`w-full px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold flex items-center justify-between ${badgeClass}`}
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
            )}
          </>
        )}

        {/* 3. WATCH & LISTEN */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FAFAF7] dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2C2623] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={avatarImg}
                  alt="Late20s Playlist"
                  className="w-12 h-12 rounded-xl object-cover border border-[#E2DDD5] dark:border-[#2C2623]"
                />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#1DB954] font-bold">
                    Spotify Curated Playlist
                  </div>
                  <h3 className="text-lg font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB]">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredMedia.map((item, idx) => {
                const thumbnail = getMediaThumbnail(item.url, item.thumbnailUrl);
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl bg-[#FAFAF7] dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2C2623] hover:border-[#E84634] overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div>
                      {thumbnail && (
                        <div className="w-full aspect-video bg-[#E2DDD5]/30 dark:bg-[#221E1B] overflow-hidden relative">
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
                        <h4 className="text-sm font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors line-clamp-2 mb-1">
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
                      <span className="text-[#7A7267] flex items-center gap-1 group-hover:text-[#E84634]">
                        Play <ExternalLink size={10} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. IDENTITY CANVAS */}
        {activeTab === 'identity' && <GenerativeParticleCanvas />}

        {/* 5. IT PROJECTS */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProjects.map((p) => {
              const isOngoing = p.status === 'in_progress';
              return (
                <Link
                  key={p.id}
                  to="/projects"
                  className="group rounded-xl bg-[#FAFAF7] dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2C2623] hover:border-[#E84634] p-4 flex flex-col justify-between transition-all"
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
                      <span className="text-[#7A7267] dark:text-[#9E9589]">{p.timeline}</span>
                    </div>

                    <h3 className="text-base font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors mb-1.5 leading-snug">
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

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-[#E2DDD5]/60 dark:border-[#2C2623]">
                      {p.techStack.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E2DDD5]/50 dark:bg-[#221E1B] text-[#4A3F35] dark:text-[#D8D0C5]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* 6. CREATIVE LAB */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/tools/dither"
              className="group p-6 rounded-2xl bg-[#FAFAF7] dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2C2623] hover:border-[#E84634] transition-all flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E84634]/12 text-[#E84634] flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-2xl font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB] group-hover:text-[#E84634] mb-2">
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
              className="group p-6 rounded-2xl bg-[#FAFAF7] dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2C2623] hover:border-[#E84634] transition-all flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E84634]/12 text-[#E84634] flex items-center justify-center mb-4">
                  <Compass size={20} />
                </div>
                <h3 className="text-2xl font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB] group-hover:text-[#E84634] mb-2">
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
      </BoardPageLayout>
    </>
  );
}
