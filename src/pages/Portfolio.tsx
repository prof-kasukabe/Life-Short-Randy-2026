import React, { useState, useEffect, useMemo } from 'react';
import { Library, LayoutGrid, Palette, ArrowLeft } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem, VisualItem } from '../types';
import { Helmet } from 'react-helmet-async';
import { CuratedVerbalShelf, DEFAULT_VERBAL_ARCHIVE } from '../components/CuratedVerbalShelf';
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';

export function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>('verbal-shelf');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [visualData, setVisualData] = useState<VisualItem[]>([]);
  const [selectedVisual, setSelectedVisual] = useState<VisualItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioSnap, visualSnap] = await Promise.all([
          getDocs(collection(db, 'portfolios')),
          getDocs(collection(db, 'visuals'))
        ]);

        const pData = portfolioSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as PortfolioItem[];
        setPortfolioData(pData.reverse());

        const vData = visualSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as VisualItem[];
        setVisualData(vData.reverse());
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };
    fetchData();
  }, []);

  const allVerbalItems = useMemo(() => {
    const merged =
      portfolioData.length > 0
        ? [
            ...portfolioData,
            ...DEFAULT_VERBAL_ARCHIVE.filter(
              (d) => !portfolioData.some((f) => f.title.toLowerCase() === d.title.toLowerCase())
            )
          ]
        : DEFAULT_VERBAL_ARCHIVE;
    if (!searchQuery.trim()) return merged;
    const q = searchQuery.toLowerCase();
    return merged.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q)
    );
  }, [portfolioData, searchQuery]);

  const tabs: BoardTabItem[] = [
    { id: 'verbal-shelf', label: 'Curated Verbal (3D Shelf)', icon: Library, badge: allVerbalItems.length },
    { id: 'verbal-board', label: 'Verbal Board Grid', icon: LayoutGrid, badge: allVerbalItems.length },
    { id: 'visual', label: 'Curated Visual', icon: Palette, badge: visualData.length }
  ];

  return (
    <>
      <Helmet>
        <title>Curated Space — Randy</title>
        <meta
          name="description"
          content="A selection of stories and visual projects crafted carefully over time."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="Curated Space"
        pageSubtitle="A selection of stories, verbal volumes, and visual projects crafted carefully over time."
        breadcrumbCategory="Curated"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id);
          setSelectedVisual(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search volumes or visuals..."
      >
        {activeTab === 'verbal-shelf' && (
          <CuratedVerbalShelf items={portfolioData} searchQuery={searchQuery} />
        )}

        {activeTab === 'verbal-board' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {allVerbalItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveTab('verbal-shelf')}
                className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE]/80 dark:border-[#332D29] hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[185px] transition-all cursor-pointer shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#6E655B] dark:text-[#A39B8F] mb-2">
                    <span className="font-bold text-[#2A2521] dark:text-[#F5F2EB]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{item.date || '2026'}</span>
                  </div>
                  <h3 className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-snug mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#E0DACE]/50 dark:border-[#2E2824] flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#E84634]/12 text-[#E84634] font-semibold">
                    {item.category || 'Verbal'}
                  </span>
                  <span className="text-[#6E655B] dark:text-[#A39B8F] group-hover:text-[#E84634]">
                    Open 3D Shelf &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'visual' && (
          <>
            {selectedVisual ? (
              <div className="rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] p-6 max-w-4xl mx-auto">
                <button
                  type="button"
                  onClick={() => setSelectedVisual(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E84634] hover:underline mb-4 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Visual Board</span>
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 rounded-xl overflow-hidden bg-black/5 border border-[#E0DACE] dark:border-[#332D29]">
                    {selectedVisual.mediaType === 'video' ? (
                      <video
                        src={selectedVisual.mediaUrl}
                        className="w-full max-h-[380px] object-contain"
                        controls
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img
                        src={selectedVisual.mediaUrl}
                        alt={selectedVisual.title}
                        referrerPolicy="no-referrer"
                        className="w-full max-h-[380px] object-cover"
                      />
                    )}
                  </div>
                  <div className="lg:col-span-5 space-y-3">
                    <h3 className="text-2xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB]">
                      {selectedVisual.title || 'Visual Artifact'}
                    </h3>
                    {selectedVisual.date && (
                      <div className="text-xs font-mono text-[#E84634]">{selectedVisual.date}</div>
                    )}
                    {selectedVisual.description && (
                      <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed">
                        {selectedVisual.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : visualData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visualData.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedVisual(item)}
                    className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] hover:border-[#E84634] overflow-hidden cursor-pointer transition-all"
                  >
                    <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative">
                      {item.mediaType === 'video' ? (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-sm font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] truncate">
                        {item.title || 'Visual Study'}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-sm text-[#6E655B] dark:text-[#A39B8F]">
                No visual projects uploaded yet. Switch to Curated Verbal to explore the 3D Spine Shelf.
              </div>
            )}
          </>
        )}
      </BoardPageLayout>
    </>
  );
}
