import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MediaItem } from '../types';
import { Tv, Headphones, ExternalLink, PlaySquare } from 'lucide-react';
import { getMediaThumbnail } from '../lib/media';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';

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

export function Media() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(FALLBACK_MEDIA);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'media'));
        if (!querySnapshot.empty) {
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as MediaItem[];
          setMediaItems(items.reverse());
        }
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };
    fetchMedia();
  }, []);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      const cat = (item.category || 'video').trim().toLowerCase();
      const matchesFilter = filter === 'all' || cat === filter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.platform || '').toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [mediaItems, filter, searchQuery]);

  const tabs: BoardTabItem[] = [
    { id: 'all', label: 'All Media', icon: PlaySquare, badge: mediaItems.length },
    {
      id: 'video',
      label: 'Videos',
      icon: Tv,
      badge: mediaItems.filter((i) => (i.category || 'video').toLowerCase() === 'video').length
    },
    {
      id: 'audio',
      label: 'Audio & Podcasts',
      icon: Headphones,
      badge: mediaItems.filter((i) => (i.category || '').toLowerCase() === 'audio').length
    }
  ];

  return (
    <>
      <Helmet>
        <title>Watch &amp; Listen — Randy</title>
        <meta
          name="description"
          content="My curated list of videos and audio, including podcasts and YouTube channels."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="Watch & Listen"
        pageSubtitle="Curated talks, technical streams, podcasts, and the official Late20s soundtrack."
        breadcrumbCategory="Media"
        tabs={tabs}
        activeTab={filter}
        onTabChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search media..."
      >
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
                  Spotify Official Playlist
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
                      Open <ExternalLink size={10} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </BoardPageLayout>
    </>
  );
}
