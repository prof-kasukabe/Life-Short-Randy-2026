import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MediaItem } from '../types';
import { Tv, Headphones, ExternalLink, PlaySquare } from 'lucide-react';
import { getMediaThumbnail } from '../lib/media';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';

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
      
      <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
        <div className="shrink-0 animate-[float_6s_ease-in-out_infinite]">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#FDFBF7] dark:border-[#2C241B] shadow-xl rotate-3 hover:rotate-6 transition-transform">
            <img src={avatarImg} alt="Randy Avatar - Media" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif-display tracking-tight mb-6 text-[#E84634] dark:text-[#E84634] leading-tight flex items-center gap-4">
            Watch &amp; Listen
          </h1>
          <p className="text-xl text-[#E84634] dark:text-[#E84634] font-light max-w-xl leading-relaxed">
            My curated list of podcasts, talks, and YouTube videos.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-16 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4 overflow-x-auto">
        <button 
          onClick={() => setFilter('all')}
          className={`text-sm font-medium transition-all px-1 border-b-2 whitespace-nowrap -mb-[18px] ${filter === 'all' ? 'border-orange-500 text-[#E84634] dark:text-[#E84634]' : 'border-transparent text-[#E84634] hover:text-[#E84634] dark:text-[#E84634] dark:hover:text-[#E84634]'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('video')}
          className={`text-sm font-medium transition-all px-1 border-b-2 whitespace-nowrap flex items-center gap-1.5 -mb-[18px] ${filter === 'video' ? 'border-orange-500 text-[#E84634] dark:text-[#E84634]' : 'border-transparent text-[#E84634] hover:text-[#E84634] dark:text-[#E84634] dark:hover:text-[#E84634]'}`}
        >
          <Tv size={14} />
          Videos
        </button>
        <button 
          onClick={() => setFilter('audio')}
          className={`text-sm font-medium transition-all px-1 border-b-2 whitespace-nowrap flex items-center gap-1.5 -mb-[18px] ${filter === 'audio' ? 'border-orange-500 text-[#E84634] dark:text-[#E84634]' : 'border-transparent text-[#E84634] hover:text-[#E84634] dark:text-[#E84634] dark:hover:text-[#E84634]'}`}
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
        <p className="text-[#E84634] dark:text-[#E84634] font-light">No media items found in this category.</p>
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
                      <h3 className="text-lg font-medium text-[#E84634] dark:text-[#E84634] group-hover:text-orange-500 transition-colors leading-snug">{item.title}</h3>
                      <ExternalLink size={16} className="text-[#E84634] dark:text-[#E84634] group-hover:text-orange-500 transition-colors shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-[#E84634] dark:text-[#E84634]">
                      <span className="capitalize">{item.category || 'video'}</span>
                      <span className="text-[#E84634] dark:text-[#E84634]">&middot;</span>
                      <span>{item.platform}</span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-[#E84634] dark:text-[#E84634] line-clamp-2 leading-relaxed">{item.description}</p>
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
