import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BookmarkItem } from '../types';
import { Search, ChevronRight, ChevronDown, Bookmark } from 'lucide-react';
import avatarBookmarks from '../assets/images/avatar_bookmarks_1785947037175.jpg';

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bookmarks'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BookmarkItem[];
        setBookmarks(items.reverse());
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bookmarksByCategory = filteredBookmarks.reduce<Record<string, BookmarkItem[]>>((acc, bookmark) => {
    let category = (bookmark.category || 'Uncategorized').trim();
    // Find if a category with the same lowercase string already exists
    const existingKey = Object.keys(acc).find(key => key.toLowerCase() === category.toLowerCase());
    if (existingKey) {
      category = existingKey;
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(bookmark);
    return acc;
  }, {});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const totalBookmarks = bookmarks.length;

  return (
    <div className="pt-24 pb-32 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Bookmarks - Randy's Minimalist Portfolio</title>
        <meta name="description" content="My curated list of bookmarks." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="shrink-0">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#FDFBF7] dark:border-[#2C241B] shadow-xl rotate-[-3deg] hover:rotate-3 transition-transform">
            <img src={avatarBookmarks} alt="Randy Avatar - Bookmarks" className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F] dark:text-[#E07A5F] mb-2 block">Resource Directory</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#2C241B] dark:text-[#FDFBF7] flex items-center gap-3">
            My {totalBookmarks} Bookmarks
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400">
            On AI Research, Business, Software, and Digital Media
          </p>
        </div>
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search title or URL..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-full"></div>
          ))}
        </div>
      ) : Object.keys(bookmarksByCategory).length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No bookmarks found.</p>
      ) : (
        <div className="space-y-4">
          {(Object.entries(bookmarksByCategory) as [string, BookmarkItem[]][]).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
            <div key={category} className="border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between py-2 text-left group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{category}</span>
                  <span className="text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full text-xs font-semibold">({items.length})</span>
                </div>
                <div className="text-zinc-400 group-hover:text-orange-500 transition-colors">
                  {expandedCategories[category] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </button>
              
              {expandedCategories[category] && (
                <div className="mt-4 pl-4 border-l-2 border-orange-500/40 space-y-3">
                  {items.map(item => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group p-2.5 rounded-lg hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 transition-all"
                    >
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate mt-1">
                        {item.url}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
