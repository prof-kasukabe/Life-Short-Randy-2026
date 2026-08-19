import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ZoomIn, Palette } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem, VisualItem } from '../types';
import { Helmet } from 'react-helmet-async';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';

export function Portfolio() {
  const [activeSpace, setActiveSpace] = useState<'verbal' | 'visual'>('verbal');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [visualLightboxItem, setVisualLightboxItem] = useState<VisualItem | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [visualData, setVisualData] = useState<VisualItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioSnap, visualSnap] = await Promise.all([
          getDocs(collection(db, 'portfolios')),
          getDocs(collection(db, 'visuals'))
        ]);
        
        const pData = portfolioSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PortfolioItem[];
        setPortfolioData(pData.reverse());

        const vData = visualSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as VisualItem[];
        setVisualData(vData.reverse());
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
      
      <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
        <div className="shrink-0 animate-[float_6s_ease-in-out_infinite]">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#FDFBF7] dark:border-[#2C241B] shadow-xl rotate-3 hover:rotate-6 transition-transform">
            <img src={avatarImg} alt="Randy Avatar - Curated" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="max-w-3xl flex-1">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif-display tracking-tight mb-6 text-[#E84634] dark:text-[#E84634] leading-tight flex items-center gap-4">
            Curated Space
          </h1>
          <p className="text-xl text-[#E84634] dark:text-[#E84634] font-light max-w-xl leading-relaxed mb-6">
            A selection of stories and visual projects crafted carefully over time.
          </p>

          <div className="flex gap-4 border-b border-[#E0DACE] dark:border-[#3A332E] pb-4 mb-4">
            <button
              onClick={() => setActiveSpace('verbal')}
              className={`text-lg font-serif-display font-medium px-2 py-1 transition-colors ${activeSpace === 'verbal' ? 'text-[#E84634] border-b-2 border-[#E84634]' : 'text-[#E84634]/60 hover:text-[#E84634]'}`}
            >
              Curated Verbal
            </button>
            <button
              onClick={() => setActiveSpace('visual')}
              className={`text-lg font-serif-display font-medium px-2 py-1 transition-colors ${activeSpace === 'visual' ? 'text-[#E84634] border-b-2 border-[#E84634]' : 'text-[#E84634]/60 hover:text-[#E84634]'}`}
            >
              Curated Visual
            </button>
          </div>
        </div>
      </div>

      {activeSpace === 'verbal' ? (
        <>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-sm font-medium transition-all px-1 border-b-2 ${
                    activeCategory === category
                      ? 'border-orange-500 text-[#E84634] dark:text-[#E84634]'
                      : 'border-transparent text-[#E84634] hover:text-[#E84634] dark:text-[#E84634] dark:hover:text-[#E84634]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <Search size={16} className="text-[#E84634]" />
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
                    <h3 className="text-xl font-medium text-[#E84634] dark:text-[#E84634] group-hover:text-orange-500 transition-colors flex items-center gap-2 mb-1">
                      {item.iconUrl && (
                        <img src={item.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                      )}
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3 text-sm text-[#E84634] dark:text-[#E84634]">
                      <span>{item.category}</span>
                    </div>
                    <p className="text-sm text-[#E84634] dark:text-[#E84634] line-clamp-3 leading-relaxed">{item.description}</p>
                  </div>
                  {item.date && (
                    <time className="text-sm text-[#E84634] dark:text-[#E84634] font-serif-display italic shrink-0">{item.date}</time>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-24 text-[#E84634]">
              No projects found matching your criteria.
            </div>
          )}
        </>
      ) : (
        <>
          {/* Visual Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-16">
            {visualData.map((item) => (
              <div key={item.id} className="group relative">
                <div 
                  className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-6 cursor-pointer relative rounded-sm"
                  onClick={() => setVisualLightboxItem(item)}
                >
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.mediaUrl}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={item.title || 'Visual Project'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <ZoomIn className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300" size={32} />
                  </div>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    {item.title && (
                      <h3 className="text-xl font-medium text-[#E84634] dark:text-[#E84634] group-hover:text-orange-500 transition-colors flex items-center gap-2 mb-1">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-[#E84634] dark:text-[#E84634] line-clamp-3 leading-relaxed mt-2">{item.description}</p>
                    )}
                  </div>
                  {item.date && (
                    <time className="text-sm text-[#E84634] dark:text-[#E84634] font-serif-display italic shrink-0">{item.date}</time>
                  )}
                </div>
              </div>
            ))}
          </div>
          {visualData.length === 0 && (
            <div className="text-center py-24 text-[#E84634]">
              No visual projects uploaded yet.
            </div>
          )}
        </>
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
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-[#E84634]/70 hover:text-[#E84634] dark:text-[#E84634]/70 dark:hover:text-[#E84634] bg-[#4A3F35]/5 hover:bg-[#E07A5F]/10 dark:bg-[#FDFBF7]/5 dark:hover:bg-[#E07A5F]/10 rounded-full transition-colors cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); setLightboxItem(null); }}
          >
            <X size={24} />
          </button>
          
          <div 
            className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-6xl w-full gap-8 lg:gap-16 cursor-default" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Text Content */}
            <div className="w-full lg:w-1/2 max-w-lg flex flex-col justify-center text-left">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                {lightboxItem.category && (
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] bg-[#E07A5F]/10 px-3 py-1.5 rounded-full">
                    {lightboxItem.category}
                  </span>
                )}
                {lightboxItem.date && (
                  <span className="text-sm font-medium text-[#E84634]/60 dark:text-[#E84634]/60">
                    {lightboxItem.date}
                  </span>
                )}
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display tracking-tight text-[#E84634] dark:text-[#E84634] mb-6 leading-tight">
                {lightboxItem.title}
              </h3>
              <p className="text-lg text-[#E84634]/80 dark:text-[#E84634]/80 leading-relaxed overflow-y-auto max-h-[30vh] lg:max-h-[50vh] pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#4A3F35]/20 dark:[&::-webkit-scrollbar-thumb]:bg-[#FDFBF7]/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {lightboxItem.description}
              </p>
            </div>
            {/* Image Content */}
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

      {/* Visual Lightbox */}
      {visualLightboxItem && (
        <div 
          className="fixed inset-0 z-[100] bg-[#FDFBF7]/95 dark:bg-[#1E1A18]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          onClick={() => setVisualLightboxItem(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-[#E84634]/70 hover:text-[#E84634] dark:text-[#E84634]/70 dark:hover:text-[#E84634] bg-[#4A3F35]/5 hover:bg-[#E07A5F]/10 dark:bg-[#FDFBF7]/5 dark:hover:bg-[#E07A5F]/10 rounded-full transition-colors cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); setVisualLightboxItem(null); }}
          >
            <X size={24} />
          </button>
          
          <div 
            className="flex flex-col-reverse lg:flex-row items-center justify-center max-w-6xl w-full gap-8 lg:gap-16 cursor-default" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full lg:w-1/2 max-w-lg flex flex-col justify-center text-left">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display tracking-tight text-[#E84634] dark:text-[#E84634] mb-6 leading-tight">
                {visualLightboxItem.title}
              </h3>
              {visualLightboxItem.description && (
                <p className="text-lg text-[#E84634]/80 dark:text-[#E84634]/80 leading-relaxed overflow-y-auto max-h-[30vh] lg:max-h-[50vh] pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#4A3F35]/20 dark:[&::-webkit-scrollbar-thumb]:bg-[#FDFBF7]/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {visualLightboxItem.description}
                </p>
              )}
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-[#4A3F35]/10 dark:ring-[#FDFBF7]/10 bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5">
                {visualLightboxItem.mediaType === 'video' ? (
                  <video
                    src={visualLightboxItem.mediaUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={visualLightboxItem.mediaUrl}
                    alt={visualLightboxItem.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
