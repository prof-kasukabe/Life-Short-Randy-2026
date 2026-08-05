import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ZoomIn, Palette } from 'lucide-react';
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

  const uniqueCategories = new Map();
  portfolioData.forEach(item => {
    const cat = (item.category || '').trim();
    if (cat && !uniqueCategories.has(cat.toLowerCase())) {
      uniqueCategories.set(cat.toLowerCase(), cat);
    }
  });
  const categories = ['All', ...Array.from(uniqueCategories.values())];

  const filteredData = useMemo(() => {
    return portfolioData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const itemCat = (item.category || '').trim();
      const matchesCategory = activeCategory === 'All' || itemCat.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, portfolioData]);

  return (
    <div className="pt-32 pb-32 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
      <Helmet>
        <title>Curated Portfolio - Randy</title>
        <meta name="description" content="A Long stories about life after reading" />
      </Helmet>
      
      <div className="max-w-3xl mb-20">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif-display tracking-tight mb-6 text-[#2C241B] dark:text-[#FDFBF7] leading-tight flex items-center gap-4">
          <Palette className="text-[#E07A5F]" size={48} />
          Curated Works
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-xl leading-relaxed">
          A selection of stories and visual projects crafted carefully over time.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-sm font-medium transition-all px-1 border-b-2 ${
                activeCategory === category
                  ? 'border-orange-500 text-zinc-900 dark:text-zinc-50'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <Search size={16} className="text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-8 pr-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-transparent placeholder-zinc-500 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 sm:text-sm transition-all"
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-16">
        {filteredData.map((item) => (
          <div key={item.id} className="group relative">
            <div 
              className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-6 cursor-pointer relative rounded-sm"
              onClick={() => setLightboxItem(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <ZoomIn className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300" size={32} />
              </div>
            </div>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors flex items-center gap-2 mb-1">
                  {item.iconUrl && (
                    <img src={item.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                  )}
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{item.category}</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">{item.description}</p>
              </div>
              {item.date && (
                <time className="text-sm text-zinc-400 dark:text-zinc-500 font-serif-display italic shrink-0">{item.date}</time>
              )}
            </div>
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
          className="fixed inset-0 z-[100] bg-[#FDFBF7]/95 dark:bg-[#1E1A18]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          onClick={() => setLightboxItem(null)}
        >
          <Helmet>
            <title>{lightboxItem.title} - Randy's Portfolio</title>
            <meta name="description" content={lightboxItem.description} />
          </Helmet>
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-[#4A3F35]/70 hover:text-[#E07A5F] dark:text-[#E8E2D9]/70 dark:hover:text-[#E07A5F] bg-[#4A3F35]/5 hover:bg-[#E07A5F]/10 dark:bg-[#FDFBF7]/5 dark:hover:bg-[#E07A5F]/10 rounded-full transition-colors cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); setLightboxItem(null); }}
          >
            <X size={24} />
          </button>
          
          <div 
            className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-6xl w-full gap-8 lg:gap-16 cursor-default" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Text Content (Left on Desktop, Bottom on Mobile) */}
            <div className="w-full lg:w-1/2 max-w-lg flex flex-col justify-center text-left">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                {lightboxItem.category && (
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F] bg-[#E07A5F]/10 px-3 py-1.5 rounded-full">
                    {lightboxItem.category}
                  </span>
                )}
                {lightboxItem.date && (
                  <span className="text-sm font-medium text-[#4A3F35]/60 dark:text-[#E8E2D9]/60">
                    {lightboxItem.date}
                  </span>
                )}
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display tracking-tight text-[#2C241B] dark:text-[#FDFBF7] mb-6 leading-tight">
                {lightboxItem.title}
              </h3>
              <p className="text-lg text-[#4A3F35]/80 dark:text-[#E8E2D9]/80 leading-relaxed">
                {lightboxItem.description}
              </p>
            </div>

            {/* Image Content (Right on Desktop, Top on Mobile) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-[#4A3F35]/10 dark:ring-[#FDFBF7]/10 bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5">
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
