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
      label: 'Videos & Talks',
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
        searchPlaceholder="Search videos or podcasts..."
      >
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
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#1DB954] font-bold mb-0.5">
                  Spotify Official Playlist
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

          {/* Media Cards Grid */}
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
