import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ZoomIn } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem } from '../types';
import { Helmet } from 'react-helmet-async';

export function Portfolio() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'portfolios'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PortfolioItem[];
        setPortfolioData(data.reverse());
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const categories = ['All', ...Array.from(new Set(portfolioData.map((item) => item.category)))];

  const filteredData = useMemo(() => {
    return portfolioData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, portfolioData]);

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Curated Portfolio - Randy</title>
        <meta name="description" content="A Long stories about life after reading" />
      </Helmet>
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Archive &amp; Works</span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">Curated Works</h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400">
          A Long stories about life after reading.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-full leading-5 bg-white dark:bg-zinc-950 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 sm:text-sm transition-all"
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredData.map((item) => (
          <div key={item.id} className="group relative p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-orange-500/50 transition-all shadow-sm">
            <div 
              className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 mb-4 cursor-pointer relative"
              onClick={() => setLightboxItem(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <ZoomIn className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300" size={32} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2 mb-1">
              {item.iconUrl && (
                <img src={item.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
              )}
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span className="text-orange-600 dark:text-orange-400">{item.category}</span>
              {item.date && (
                <>
                  <span>&middot;</span>
                  <time>{item.date}</time>
                </>
              )}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-24 text-zinc-500">
          No projects found matching your criteria.
        </div>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          onClick={() => setLightboxItem(null)}
        >
          <Helmet>
            <title>{lightboxItem.title} - Randy's Portfolio</title>
            <meta name="description" content={lightboxItem.description} />
          </Helmet>
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 rounded-full transition-colors cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); setLightboxItem(null); }}
          >
            <X size={24} />
          </button>
          <div className="flex flex-col items-center justify-center max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxItem.imageUrl}
              alt={lightboxItem.title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl cursor-default"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop';
              }}
            />
            <div className="mt-6 text-center text-zinc-100 max-w-2xl bg-zinc-900/80 p-6 rounded-xl border border-zinc-800 shadow-xl cursor-default w-full">
              <h3 className="text-2xl font-bold mb-2">{lightboxItem.title}</h3>
              <p className="text-sm font-medium text-zinc-400 mb-4">{lightboxItem.category}</p>
              <p className="text-base text-zinc-300 leading-relaxed">{lightboxItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
