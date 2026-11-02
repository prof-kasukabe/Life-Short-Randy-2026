import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, BookOpen } from 'lucide-react';
import { PortfolioItem } from '../types';

interface SpineTheme {
  spineBg: string;
  spineText: string;
  spineMuted: string;
  coverBg: string;
  coverText: string;
  accent: string;
  border: string;
}

const SPINE_THEMES: SpineTheme[] = [
  {
    // Warm Aged Ivory
    spineBg: '#E5DEC9',
    spineText: '#2A2521',
    spineMuted: '#6E655B',
    coverBg: '#E5DEC9',
    coverText: '#231F1C',
    accent: '#C83E2B',
    border: '#C7BFA8',
  },
  {
    // Vintage Cobalt Blue
    spineBg: '#1B4D89',
    spineText: '#F4EFE6',
    spineMuted: '#A7C2E4',
    coverBg: '#184377',
    coverText: '#F4EFE6',
    accent: '#E8C574',
    border: '#133660',
  },
  {
    // Deep Charcoal / Obsidian
    spineBg: '#272523',
    spineText: '#EDE6D8',
    spineMuted: '#9A9286',
    coverBg: '#1F1D1B',
    coverText: '#EDE6D8',
    accent: '#D93829',
    border: '#3A3734',
  },
  {
    // Oxblood Crimson
    spineBg: '#7E2B25',
    spineText: '#F5EBDC',
    spineMuted: '#D6A9A3',
    coverBg: '#6E231E',
    coverText: '#F5EBDC',
    accent: '#E8B86D',
    border: '#591B17',
  },
  {
    // Forest Pine Green
    spineBg: '#1E564A',
    spineText: '#F1ECE1',
    spineMuted: '#9CC4BA',
    coverBg: '#19473D',
    coverText: '#F1ECE1',
    accent: '#E29E52',
    border: '#133830',
  },
];

export interface VerbalArchiveItem extends PortfolioItem {
  subtitle?: string;
  year?: string;
  duration?: string;
}

export const DEFAULT_VERBAL_ARCHIVE: VerbalArchiveItem[] = [
  {
    id: 'v-1',
    title: 'The Observer',
    subtitle: 'PENGAMAT SENJA / 静かな観察者',
    category: 'Reflections',
    date: '2021',
    year: '2021',
    duration: '6 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    description:
      'An intimate meditation on standing still while the digital world accelerates. Notes on solitude, observation, and finding clarity in the quiet margins of everyday routines.',
  },
  {
    id: 'v-2',
    title: 'The Fallen Birds',
    subtitle: 'BURUNG GUGUR / 落ちた鳥',
    category: 'Essays',
    date: '2021',
    year: '2021',
    duration: '8 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    description:
      'On creative false starts, unfinished manuscripts, and the beauty of ideas that never reached production—yet shaped every system built thereafter.',
  },
  {
    id: 'v-3',
    title: 'Light in the Storm',
    subtitle: 'CAHAYA BADAI / 嵐の中の光',
    category: 'Philosophy',
    date: '2022',
    year: '2022',
    duration: '5 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    description:
      'Navigating the turbulence of your late twenties: when ambition meets reality, and discipline becomes the lighthouse that keeps craft anchored.',
  },
  {
    id: 'v-4',
    title: 'The Long Tide',
    subtitle: 'PASANG PANJANG / 長い潮',
    category: 'Essays',
    date: '2022',
    year: '2022',
    duration: '7 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
    description:
      'Why enduring software and meaningful prose both obey slow, tidal rhythms rather than the frantic cycles of overnight trends.',
  },
  {
    id: 'v-5',
    title: 'A Quiet War',
    subtitle: 'PERANG SUNYI / 静かな戦争',
    category: 'Reflections',
    date: '2023',
    year: '2023',
    duration: '9 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    description:
      'The internal negotiation between perfectionism and shipping. A chronicle of late-night debugging sessions and the quiet resolve required to finish.',
  },
  {
    id: 'v-6',
    title: 'Red Door',
    subtitle: 'PINTU MERAH / 赤い扉',
    category: 'Fiction',
    date: '2023',
    year: '2023',
    duration: '11 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    description:
      'A short narrative exploring memory as an architectural space—where every room holds a conversation we wished we had lingered in a little longer.',
  },
  {
    id: 'v-7',
    title: 'The Silent Valley',
    subtitle: 'LEMBAH SUNYI / 静かな谷',
    category: 'Reflections',
    date: '2024',
    year: '2024',
    duration: '10 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    description:
      'Returning to foundational principles after years of complexity. A reflection on minimalism, silence, and the landscapes that restore creative focus.',
  },
  {
    id: 'v-8',
    title: 'The Blue Hour',
    subtitle: 'JAM BIRU / 青い時間',
    category: 'Notes',
    date: '2024',
    year: '2024',
    duration: '4 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
    description:
      'Field notes written between 4:30 AM and dawn—when the city is asleep and thoughts arrange themselves with rare geometric precision.',
  },
  {
    id: 'v-9',
    title: 'River of Salt',
    subtitle: 'SUNGAI GARAM / 塩の川',
    category: 'Philosophy',
    date: '2025',
    year: '2025',
    duration: '7 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    description:
      'Diving deeper into the process, embracing discomfort, and learning how resilience is forged through friction, patience, and deliberate practice.',
  },
  {
    id: 'v-10',
    title: 'The Last Summer',
    subtitle: 'MUSIM PANAS TERAKHIR / 最後の夏',
    category: 'Fiction',
    date: '2025',
    year: '2025',
    duration: '12 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80',
    description:
      'An anthology of departures and new beginnings at the threshold of adulthood—capturing the warmth of nostalgia without losing sight of tomorrow.',
  },
  {
    id: 'v-11',
    title: 'The Green Road',
    subtitle: 'JALAN HIJAU / 緑の道',
    category: 'Essays',
    date: '2026',
    year: '2026',
    duration: '6 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    description:
      'Choosing the unpaved path in software craftsmanship and personal growth: why slow, organic mastery outlasts synthetic shortcuts.',
  },
  {
    id: 'v-12',
    title: 'Noon in Ashes',
    subtitle: 'TENGAH HARI / 灰の正午',
    category: 'Notes',
    date: '2026',
    year: '2026',
    duration: '5 MIN READ',
    imageUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=900&q=80',
    description:
      'On rebuilding after burnout: stripping away non-essential noise to rediscover the core craft that made us fall in love with building.',
  },
];

interface CuratedVerbalShelfProps {
  items: PortfolioItem[];
  searchQuery?: string;
}

export function CuratedVerbalShelf({ items, searchQuery = '' }: CuratedVerbalShelfProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [focusedIndex, setFocusedIndex] = useState<number>(6);
  const [selectedItem, setSelectedItem] = useState<(VerbalArchiveItem & { theme: SpineTheme }) | null>(null);
  const [isReadingFull, setIsReadingFull] = useState<boolean>(false);
  const shelfRef = useRef<HTMLDivElement | null>(null);

  // Combine Firestore items with curated archive so the shelf is always rich and complete
  const baseCollection: VerbalArchiveItem[] = useMemo(() => {
    const normalizedFirestore: VerbalArchiveItem[] = items.map((item, idx) => ({
      ...item,
      subtitle: `${(item.category || 'ARCHIVE').toUpperCase()} / VOL. ${String(idx + 1).padStart(2, '0')}`,
      year: item.date || '2026',
      duration: `${Math.max(3, Math.min(12, Math.ceil((item.description?.length || 240) / 80)))} MIN READ`,
    }));

    if (normalizedFirestore.length === 0) {
      return DEFAULT_VERBAL_ARCHIVE;
    }

    // Merge user's Firestore items at the front/center alongside the archive volumes
    const existingTitles = new Set(normalizedFirestore.map((i) => i.title.toLowerCase()));
    const supplemental = DEFAULT_VERBAL_ARCHIVE.filter(
      (d) => !existingTitles.has(d.title.toLowerCase())
    );
    return [...normalizedFirestore, ...supplemental];
  }, [items]);

  // Extract unique categories for the top segmented filter bar
  const categories = useMemo(() => {
    const set = new Set<string>();
    baseCollection.forEach((item) => {
      if (item.category?.trim()) {
        set.add(item.category.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [baseCollection]);

  // Filter items by category and search query
  const filteredBase = useMemo(() => {
    return baseCollection.filter((item) => {
      const matchesCat =
        activeCategory === 'All' ||
        (item.category || '').trim().toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [baseCollection, activeCategory, searchQuery]);

  // Repeat shelf items if fewer than 14 so the horizontal VHS/Book rack looks full edge-to-edge like the reference
  const shelfVolumes = useMemo(() => {
    if (filteredBase.length === 0) return [];
    const list: (VerbalArchiveItem & { shelfKey: string; theme: SpineTheme })[] = [];
    const targetCount = Math.max(15, filteredBase.length);

    for (let i = 0; i < targetCount; i++) {
      const source = filteredBase[i % filteredBase.length];
      // Deterministic theme based on title hash + index so adjacent spines have rich variety
      const themeIndex =
        (source.title.length + i * 2) % SPINE_THEMES.length;
      list.push({
        ...source,
        shelfKey: `${source.id}-slot-${i}`,
        theme: SPINE_THEMES[themeIndex],
      });
    }
    return list;
  }, [filteredBase]);

  // Keep focusedIndex in bounds when filtering changes
  useEffect(() => {
    if (shelfVolumes.length > 0) {
      const mid = Math.min(Math.floor(shelfVolumes.length / 2), shelfVolumes.length - 1);
      setFocusedIndex(mid);
    } else {
      setFocusedIndex(0);
    }
  }, [activeCategory, searchQuery, shelfVolumes.length]);

  const activeVolume = shelfVolumes[focusedIndex] || shelfVolumes[0] || null;

  const handleStep = (dir: -1 | 1) => {
    if (shelfVolumes.length === 0) return;
    setFocusedIndex((prev) => {
      const next = (prev + dir + shelfVolumes.length) % shelfVolumes.length;
      // Smoothly scroll the shelf container to keep the active spine visible
      if (shelfRef.current) {
        const children = shelfRef.current.querySelectorAll('[data-spine-item]');
        const targetEl = children[next] as HTMLElement | undefined;
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
      return next;
    });
  };

  // DETAIL VIEW (Matches Screenshot 2: "The Silent Valley" split layout)
  if (selectedItem) {
    return (
      <div className="relative w-full min-h-[640px] py-8 px-4 sm:px-10 bg-[#F5F2EB] dark:bg-[#191614] border border-[#DFD9CE] dark:border-[#332D29] rounded-[1.5rem] shadow-inner transition-all duration-500">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <button
            type="button"
            onClick={() => {
              setSelectedItem(null);
              setIsReadingFull(false);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#2A2521]/40 dark:border-[#E5DEC9]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[#2A2521] dark:text-[#E5DEC9] hover:bg-[#E84634] hover:text-white hover:border-[#E84634] transition-colors cursor-pointer"
          >
            <span>CLOSE / TUTUP</span>
          </button>

          <div className="text-center">
            <div className="text-sm sm:text-base font-serif-display tracking-[0.25em] text-[#1D4C82] dark:text-[#E84634] font-bold uppercase">
              Curated Verbal
            </div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#2A2521]/60 dark:text-[#E5DEC9]/60">
              RANDY ARDIANSYAH
            </div>
          </div>

          <div className="hidden sm:block text-[10px] font-mono uppercase tracking-[0.2em] text-[#2A2521]/70 dark:text-[#E5DEC9]/70">
            ARCHIVE 2021—2026
          </div>
        </div>

        {/* Main 2-Column Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-5xl mx-auto my-auto py-4">
          {/* Left Column: Editorial Typography */}
          <div className="lg:col-span-6 flex flex-col items-start text-left order-2 lg:order-1">
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#1D4C82] dark:text-[#E84634] font-semibold mb-3">
              {selectedItem.subtitle || `${selectedItem.category} / ARCHIVE`}
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-[68px] font-serif-display text-[#1F1C1A] dark:text-[#F5F2EB] leading-[0.95] tracking-tight mb-6">
              {selectedItem.title}
            </h2>

            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#6E655B] dark:text-[#A39B8F] mb-6">
              <span>{selectedItem.year || selectedItem.date || '2026'}</span>
              <span>/</span>
              <span>{(selectedItem.category || 'ESSAY').toUpperCase()}</span>
              <span>/</span>
              <span>{selectedItem.duration || '6 MIN READ'}</span>
            </div>

            <div
              className={`text-sm sm:text-base font-serif-display text-[#3D3732] dark:text-[#D8D0C5] leading-relaxed mb-6 max-w-md ${
                isReadingFull ? '' : 'line-clamp-5'
              }`}
            >
              {selectedItem.description}
              {isReadingFull && (
                <p className="mt-4">
                  Every piece in this curated verbal archive represents a distinct chapter in thinking through systems, solitude, and deliberate creation. Written amidst late-night builds and quiet mornings, these notes preserve the human cadence behind digital artifacts.
                </p>
              )}
            </div>

            <p className="text-xs font-serif-display italic text-[#7A7167] dark:text-[#9A9086] mb-8">
              Written and curated by Randy Ardiansyah · Karya Tulis Terkurasi
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReadingFull(!isReadingFull)}
                className="px-5 py-2.5 border border-[#1D4C82]/50 dark:border-[#E84634]/60 text-[10px] font-mono uppercase tracking-[0.22em] text-[#1D4C82] dark:text-[#E84634] hover:bg-[#1D4C82] dark:hover:bg-[#E84634] hover:text-white transition-colors cursor-pointer"
              >
                {isReadingFull ? 'COLLAPSE TEXT / RINGKAS' : 'READ FULL NOTE / BACA CATATAN'}
              </button>
            </div>
          </div>

          {/* Right Column: High-Detail Vintage VHS / Book Cover Artifact */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end order-1 lg:order-2">
            <div
              className="relative w-[260px] sm:w-[310px] aspect-[2/3.1] rounded-[4px] p-5 flex flex-col justify-between select-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-[1.02]"
              style={{
                backgroundColor: selectedItem.theme.coverBg,
                color: selectedItem.theme.coverText,
                border: `2px solid ${selectedItem.theme.border}`,
              }}
            >
              {/* Distressed Vintage Edge & Paper Texture Overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0), radial-gradient(rgba(0,0,0,0.35) 1px, transparent 0)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 8px 8px',
                }}
              />
              <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-white/15 rounded-[3px]" />
              <div className="pointer-events-none absolute inset-[3px] border border-black/15" />

              {/* Cover Top Header & Title */}
              <div className="relative z-10 text-center pt-2">
                <div className="text-[8px] font-mono uppercase tracking-[0.28em] opacity-75 mb-2">
                  A RANDY ARDIANSYAH ARCHIVE
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif-display uppercase tracking-tight leading-[0.88] font-normal px-2">
                  {selectedItem.title}
                </h3>
              </div>

              {/* Cover Center/Bottom Artwork Window */}
              <div className="relative z-10 w-full h-[58%] mt-auto overflow-hidden rounded-[2px] border border-black/20">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover sepia-[0.25] contrast-[1.08] brightness-95"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                {/* Stamp Badge in Bottom Right Corner (Like [VHS]) */}
                <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 border border-white/70 bg-black/40 backdrop-blur-[1px] text-[9px] font-serif-display font-bold tracking-[0.18em] text-white uppercase">
                  VERBAL
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Credits */}
        <div className="flex items-center justify-between mt-12 pt-4 border-t border-[#2A2521]/10 dark:border-[#E5DEC9]/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#2A2521]/60 dark:text-[#E5DEC9]/60">
          <span>© RANDY ARDIANSYAH. ALL RIGHTS RESERVED.</span>
          <span>CURATED VERBAL EDITION</span>
        </div>
      </div>
    );
  }

  // SHELF VIEW (Matches Screenshot 1: Horizontal 3D VHS / Book Spine Rack)
  return (
    <div className="relative w-full py-8 px-3 sm:px-8 bg-[#F5F2EB] dark:bg-[#191614] border border-[#DFD9CE] dark:border-[#332D29] rounded-[1.5rem] shadow-inner overflow-hidden transition-colors duration-300">
      {/* Top Archival Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#2A2521]/70 dark:text-[#E5DEC9]/70 border border-[#2A2521]/30 dark:border-[#E5DEC9]/30 px-2.5 py-1">
          ARCHIVE / ARSIP
        </div>

        <div className="text-center">
          <div className="text-sm sm:text-base font-serif-display tracking-[0.25em] text-[#1D4C82] dark:text-[#E84634] font-bold uppercase">
            Curated Verbal
          </div>
          <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#2A2521]/60 dark:text-[#E5DEC9]/60">
            RANDY ARDIANSYAH
          </div>
        </div>

        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#2A2521]/70 dark:text-[#E5DEC9]/70">
          WORKS 2021—2026
        </div>
      </div>

      {/* Centered Segmented Category Filter Bar (Matches `All | 1950s | 1960s | 1970s | 1980s` box strip) */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex flex-wrap items-center border border-[#2A2521]/35 dark:border-[#E5DEC9]/30 bg-[#FAF8F3] dark:bg-[#221E1B]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] border-r last:border-r-0 border-[#2A2521]/25 dark:border-[#E5DEC9]/20 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1D4C82] dark:bg-[#E84634] text-white font-semibold'
                    : 'text-[#2A2521]/80 dark:text-[#E5DEC9]/80 hover:bg-[#2A2521]/5 dark:hover:bg-white/5'
                }`}
              >
                {cat === 'All' ? 'All / Semua' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Spine Rack Container */}
      {shelfVolumes.length > 0 ? (
        <>
          <div
            ref={shelfRef}
            className="relative flex items-center justify-start sm:justify-center gap-[3px] overflow-x-auto py-8 px-4 sm:px-6 [&::-webkit-scrollbar]:hidden select-none"
            style={{ perspective: '1600px' }}
          >
            {shelfVolumes.map((item, idx) => {
              const isFocused = idx === focusedIndex;

              return (
                <div
                  key={item.shelfKey}
                  data-spine-item
                  onMouseEnter={() => setFocusedIndex(idx)}
                  onClick={() => setSelectedItem(item)}
                  className="relative shrink-0 cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    width: isFocused ? '230px' : '54px',
                    height: '390px',
                    transformStyle: 'preserve-3d',
                    zIndex: isFocused ? 30 : 10,
                  }}
                >
                  {/* 3D Book / VHS Cassette Wrapper */}
                  <div
                    className="relative w-full h-full transition-transform duration-500 ease-out"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFocused
                        ? 'translateY(-6px) rotateY(-16deg)'
                        : 'translateY(0px) rotateY(0deg)',
                    }}
                  >
                    {/* SPINE FACE (Always visible on the left) */}
                    <div
                      className="absolute top-0 left-0 h-full flex flex-col items-center justify-between overflow-hidden rounded-[2px] shadow-[inset_3px_0_6px_rgba(255,255,255,0.22),inset_-3px_0_7px_rgba(0,0,0,0.35),0_14px_24px_rgba(0,0,0,0.28)]"
                      style={{
                        width: '54px',
                        backgroundColor: item.theme.spineBg,
                        color: item.theme.spineText,
                        border: `1px solid ${item.theme.border}`,
                        transformOrigin: 'left center',
                        transform: isFocused ? 'rotateY(-22deg)' : 'rotateY(0deg)',
                        transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    >
                      {/* Top Spine Thumbnail Vignette */}
                      <div className="w-full h-24 overflow-hidden relative border-b border-black/15 shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover sepia-[0.2] contrast-[1.08]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
                      </div>

                      {/* Vertical Rotated Title Along Spine */}
                      <div className="flex-1 flex items-center justify-center py-3 overflow-hidden">
                        <span
                          className="font-serif-display uppercase tracking-[0.16em] text-[13px] sm:text-[14px] font-medium whitespace-nowrap leading-none"
                          style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                          }}
                        >
                          {item.title.length > 22 ? `${item.title.slice(0, 22)}…` : item.title}
                        </span>
                      </div>

                      {/* Bottom Publisher & VHS/Archive Stamp */}
                      <div className="pb-2.5 pt-1 flex flex-col items-center gap-1 shrink-0 w-full">
                        <span
                          className="text-[7px] font-mono uppercase tracking-[0.22em]"
                          style={{ color: item.theme.spineMuted }}
                        >
                          RANDY
                        </span>
                        <span
                          className="px-1.5 py-[1px] text-[8px] font-serif-display font-bold tracking-[0.14em] uppercase border"
                          style={{
                            borderColor: item.theme.spineMuted,
                            color: item.theme.spineText,
                          }}
                        >
                          VRB
                        </span>
                      </div>

                      {/* Subtle Aged Crease Texture */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/20" />
                    </div>

                    {/* 3D FRONT COVER FACE (Revealed when hovered/focused, just like "RIVER OF SALT") */}
                    <div
                      className={`absolute top-0 left-[48px] h-full rounded-r-[3px] overflow-hidden flex flex-col justify-between p-4 transition-all duration-500 ease-out ${
                        isFocused
                          ? 'opacity-100 pointer-events-auto shadow-[16px_22px_38px_rgba(0,0,0,0.45)]'
                          : 'opacity-0 pointer-events-none'
                      }`}
                      style={{
                        width: '182px',
                        backgroundColor: item.theme.coverBg,
                        color: item.theme.coverText,
                        border: `1px solid ${item.theme.border}`,
                        transformOrigin: 'left center',
                        transform: isFocused ? 'rotateY(10deg)' : 'rotateY(75deg)',
                      }}
                    >
                      {/* Vintage Cover Grain & Inner Frame */}
                      <div className="pointer-events-none absolute inset-[3px] border border-current opacity-15" />

                      {/* Cover Header & Stacked Serif Title */}
                      <div className="relative z-10 text-center pt-1">
                        <div className="text-[7px] font-mono uppercase tracking-[0.22em] opacity-70 mb-1.5">
                          A RANDY ARDIANSYAH NOTE
                        </div>
                        <h4 className="font-serif-display text-2xl uppercase leading-[0.9] tracking-tight line-clamp-3">
                          {item.title}
                        </h4>
                      </div>

                      {/* Cover Illustration Window */}
                      <div className="relative z-10 w-full h-[54%] mt-auto overflow-hidden rounded-[2px] border border-black/20">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover sepia-[0.2] contrast-[1.08]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-1.5 right-1.5 px-1 py-[1px] border border-white/70 bg-black/45 text-[7px] font-serif-display font-bold tracking-[0.16em] text-white uppercase">
                          VERBAL
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Caption & Left/Right Arrow Controls (Matches `<-   River of Salt / SHIO NO KAWA / 1964   ->`) */}
          {activeVolume && (
            <div className="mt-6 pt-2 px-4 sm:px-10 flex items-center justify-between max-w-4xl mx-auto">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                aria-label="Previous volume"
                className="p-2 text-[#2A2521]/70 dark:text-[#E5DEC9]/70 hover:text-[#E84634] dark:hover:text-[#E84634] transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>

              <div
                onClick={() => setSelectedItem(activeVolume)}
                className="text-center cursor-pointer group px-4"
              >
                <h3 className="text-2xl sm:text-3xl font-serif-display text-[#1F1C1A] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-tight mb-1">
                  {activeVolume.title}
                </h3>
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1D4C82] dark:text-[#E84634] mb-0.5">
                  {activeVolume.subtitle || activeVolume.category}
                </div>
                <div className="text-[11px] font-serif-display text-[#6E655B] dark:text-[#A39B8F]">
                  {activeVolume.year || activeVolume.date || '2026'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStep(1)}
                aria-label="Next volume"
                className="p-2 text-[#2A2521]/70 dark:text-[#E5DEC9]/70 hover:text-[#E84634] dark:hover:text-[#E84634] transition-colors cursor-pointer"
              >
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-[#2A2521]/70 dark:text-[#E5DEC9]/70 font-serif-display text-lg">
          No curated verbal volumes found matching "{searchQuery}".
        </div>
      )}

      {/* Bottom Archival Strip */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#2A2521]/10 dark:border-[#E5DEC9]/10 text-[9px] font-mono uppercase tracking-[0.2em] text-[#2A2521]/55 dark:text-[#E5DEC9]/55 px-2">
        <span>© RANDY ARDIANSYAH. ALL RIGHTS RESERVED.</span>
        <span>CLICK ANY VOLUME TO INSPECT</span>
      </div>
    </div>
  );
}
