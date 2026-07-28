import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { MediaItem } from '../types';
import { Tv, Headphones, ExternalLink } from 'lucide-react';
import { getMediaThumbnail } from '../lib/media';

export function Media() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'video' | 'audio'>('all');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaQuery = query(collection(db, 'media'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(mediaQuery);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MediaItem[];
        setMediaItems(items);
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const filteredMedia = filter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => (item.category || 'video') === filter);

  return (
    <div className="pt-24 pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Watch & Listen - Randy's Minimalist Portfolio</title>
        <meta name="description" content="My curated list of videos and audio, including podcasts and YouTube channels." />
      </Helmet>
      
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Audio &amp; Video</span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">Watch &amp; Listen</h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400">
          My curated list of podcasts, talks, and YouTube videos.
        </p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4 overflow-x-auto">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${filter === 'all' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('video')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${filter === 'video' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          <Tv size={14} />
          Videos (YouTube)
        </button>
        <button 
          onClick={() => setFilter('audio')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${filter === 'audio' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          <Headphones size={14} />
          Audio (Podcasts)
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No media items found in this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredMedia.map((item) => {
            const thumbnail = getMediaThumbnail(item.url, item.thumbnailUrl);
            return (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block p-5 sm:p-6 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl hover:border-orange-500/50 transition-all bg-white dark:bg-zinc-950 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {thumbnail && (
                    <div className="w-full sm:w-32 aspect-video shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 relative group-hover:scale-[1.02] transition-transform shadow-xs">
                      <img 
                        src={thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.parentElement) {
                            target.parentElement.style.display = 'none';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
                        {(item.category || 'video') === 'video' ? <Tv size={16} /> : <Headphones size={16} />}
                      </div>
                      <ExternalLink size={16} className="text-zinc-400 group-hover:text-orange-500 transition-colors shrink-0" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-1.5 text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">{item.title}</h3>
                    <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                      <span className="font-semibold text-orange-600 dark:text-orange-400 capitalize">{item.category || 'video'}</span>
                      <span>&middot;</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.platform}</span>
                      {item.date && (
                        <>
                          <span>&middot;</span>
                          <time>{item.date}</time>
                        </>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
