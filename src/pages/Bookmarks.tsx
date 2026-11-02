import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BookmarkItem } from '../types';
import { Bookmark, Globe, ExternalLink, FolderKanban } from 'lucide-react';
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';

const FALLBACK_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'b-1',
    title: 'Calm Tech Institute — Principles of Quiet Attention',
    url: 'https://calmtech.com',
    category: 'Design & Philosophy'
  },
  {
    id: 'b-2',
    title: 'Google AI Studio & Gemini SDK Documentation',
    url: 'https://ai.google.dev',
    category: 'AI Research'
  },
  {
    id: 'b-3',
    title: 'React 19 Architecture & Compiler Deep Dive',
    url: 'https://react.dev',
    category: 'Software Engineering'
  },
  {
    id: 'b-4',
    title: 'Arkitektur Sistem Terdistribusi & High Scalability',
    url: 'https://highscalability.com',
    category: 'Software Engineering'
  },
  {
    id: 'b-5',
    title: 'Linear Method — Practices for Building High-Craft Software',
    url: 'https://linear.app/method',
    category: 'Design & Philosophy'
  },
  {
    id: 'b-6',
    title: 'Papers With Code — Machine Learning Benchmarks',
    url: 'https://paperswithcode.com',
    category: 'AI Research'
  }
];

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(FALLBACK_BOOKMARKS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bookmarks'));
        if (!querySnapshot.empty) {
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as BookmarkItem[];
          setBookmarks(items.reverse());
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };
    fetchBookmarks();
  }, []);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    bookmarks.forEach((b) => {
      const cat = (b.category || 'General').trim();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  }, [bookmarks]);

  const tabs: BoardTabItem[] = [
    { id: 'all', label: 'All Bookmarks', icon: Bookmark, badge: bookmarks.length },
    ...categories.map(([cat, count]) => ({
      id: cat,
      label: cat,
      icon: FolderKanban,
      badge: count
    }))
  ];

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const cat = (b.category || 'General').trim();
      const matchesCat = activeCategory === 'all' || cat === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [bookmarks, activeCategory, searchQuery]);

  return (
    <>
      <Helmet>
        <title>Bookmarks Directory — Randy</title>
        <meta
          name="description"
          content="Curated directory of bookmarks on AI Research, Software Engineering, and Digital Media."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle={`Knowledge Vault (${bookmarks.length} Bookmarks)`}
        pageSubtitle="Curated references on AI Research, Software Architecture, Design Philosophy, and Digital Media."
        breadcrumbCategory="Bookmarks"
        tabs={tabs}
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search title or domain..."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredBookmarks.map((item, idx) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE]/80 dark:border-[#332D29] hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[155px] transition-all shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6E655B] dark:text-[#A39B8F] mb-2">
                  <span className="font-bold text-[#2A2521] dark:text-[#F5F2EB]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="inline-flex items-center gap-1 truncate max-w-[130px]">
                    <Globe size={11} className="text-[#E84634] shrink-0" />
                    <span className="truncate">{getDomain(item.url)}</span>
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-snug mb-1.5">
                  {item.title}
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E0DACE]/50 dark:border-[#2E2824] flex items-center justify-between text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-[#E84634]/12 text-[#E84634] font-semibold truncate max-w-[150px]">
                  {item.category || 'General'}
                </span>
                <ExternalLink
                  size={12}
                  className="text-[#6E655B] group-hover:text-[#E84634] shrink-0"
                />
              </div>
            </a>
          ))}
        </div>
      </BoardPageLayout>
    </>
  );
}
