import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MediaItem } from '../types';
import { Tv, Headphones, ExternalLink, PlaySquare } from 'lucide-react';
import { getMediaThumbnail } from '../lib/media';

export function Media() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'video' | 'audio'>('all');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'media'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MediaItem[];
        setMediaItems(items.reverse());
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
    : mediaItems.filter(item => (item.category || 'video').trim().toLowerCase() === filter);

  return (
    <div className="pt-32 pb-32 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
      <Helmet>
        <title>Watch & Listen - Randy's Minimalist Portfolio</title>
        <meta name="description" content="My curated list of videos and audio, including podcasts and YouTube channels." />
      </Helmet>
      
      <div className="max-w-3xl mb-20">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif-display tracking-tight mb-6 text-[#2C241B] dark:text-[#FDFBF7] leading-tight flex items-center gap-4">
          <PlaySquare className="text-[#E07A5F]" size={48} />
          Watch &amp; Listen
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-xl leading-relaxed">
          My curated list of podcasts, talks, and YouTube videos.
        </p>
      </div>

      <div className="flex gap-3 mb-16 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4 overflow-x-auto">
        <button 
          onClick={() => setFilter('all')}
          className={`text-sm font-medium transition-all px-1 border-b-2 whitespace-nowrap -mb-[18px] ${filter === 'all' ? 'border-orange-500 text-zinc-900 dark:text-zinc-50' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('video')}
          className={`text-sm font-medium transition-all px-1 border-b-2 whitespace-nowrap flex items-center gap-1.5 -mb-[18px] ${filter === 'video' ? 'border-orange-500 text-zinc-900 dark:text-zinc-50' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'}`}
        >
          <Tv size={14} />
          Videos
        </button>
        <button 
          onClick={() => setFilter('audio')}
          className={`text-sm font-medium transition-all px-1 border-b-2 whitespace-nowrap flex items-center gap-1.5 -mb-[18px] ${filter === 'audio' ? 'border-orange-500 text-zinc-900 dark:text-zinc-50' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'}`}
        >
          <Headphones size={14} />
          Audio
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-sm"></div>
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400 font-light">No media items found in this category.</p>
      ) : (
        <div className="grid gap-12 sm:grid-cols-2 lg:gap-16">
          {filteredMedia.map((item) => {
            const thumbnail = getMediaThumbnail(item.url, item.thumbnailUrl);
            return (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {thumbnail && (
                    <div className="w-full sm:w-32 aspect-video shrink-0 bg-zinc-100 dark:bg-zinc-900 relative group-hover:opacity-90 transition-opacity">
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
                    </div>
                  )}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors leading-snug">{item.title}</h3>
                      <ExternalLink size={16} className="text-zinc-300 dark:text-zinc-700 group-hover:text-orange-500 transition-colors shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="capitalize">{item.category || 'video'}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">&middot;</span>
                      <span>{item.platform}</span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{item.description}</p>
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
