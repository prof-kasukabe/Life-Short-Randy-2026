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
    title: 'High Scalability — Distributed Systems Case Studies',
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
        pageTitle={`Knowledge Vault (${bookmarks.length})`}
        pageSubtitle="Curated references on AI Research, Software Architecture, Design Philosophy, and Digital Media."
        breadcrumbCategory="Bookmarks"
        tabs={tabs}
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search bookmarks..."
      >
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {filteredBookmarks.map((item, idx) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-xs font-mono text-[#71717A] dark:text-zinc-500 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm sm:text-base font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] transition-colors truncate">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-[#71717A] dark:text-zinc-500 shrink-0 pl-7 sm:pl-0">
                <span className="text-[#E84634] font-semibold">
                  {item.category || 'General'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Globe size={11} />
                  <span>{getDomain(item.url)}</span>
                </span>
                <ExternalLink
                  size={12}
                  className="text-[#71717A] group-hover:text-[#E84634] shrink-0"
                />
              </div>
            </a>
          ))}
        </div>
      </BoardPageLayout>
    </>
  );
}
