import React, { useState, useEffect } from 'react';
import { ArrowRight, Tv, Headphones, ExternalLink, MapPin, Sparkles, Compass, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem, BlogPost, MediaItem } from '../types';
import { Helmet } from 'react-helmet-async';
import { getMediaThumbnail } from '../lib/media';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';
import kudoGhibliImg from '../assets/images/kudo_ghibli.jpg';

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function Home() {
  const [featuredWorks, setFeaturedWorks] = useState<PortfolioItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [recentMedia, setRecentMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfoliosSnapshot = await getDocs(query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'), limit(6)));
        const works = portfoliosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PortfolioItem[];
        setFeaturedWorks(works);

        const blogsSnapshot = await getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3)));
        const posts = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
        setRecentPosts(posts);

        const mediaSnapshot = await getDocs(query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(2)));
        const media = mediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MediaItem[];
        setRecentMedia(media);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Randy | Minimalist Portfolio</title>
        <meta name="description" content="I'm Randy. Curious explorer of the endless web, constantly seeking new knowledge." />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full flex flex-col items-center text-center">
          
          <h1 className="text-[12vw] sm:text-[9vw] lg:text-[140px] font-serif-display font-bold tracking-tighter text-[#E84634] mb-4 leading-[0.9] w-full text-center">
            The Late 20s
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base font-sans-clean font-bold uppercase tracking-[0.2em] text-[#E84634] max-w-3xl leading-relaxed mb-12 px-4 flex flex-col items-center gap-3">
            <span>Many bask in the sunlight, but only a few endure the metamorphosis. Diving deeper into the process, embracing the discomfort, and bending fate—that is the true key to creating a masterpiece</span>
            <span className="opacity-70 text-[10px] sm:text-xs tracking-[0.3em]">Visual &middot; Coding &middot; Verbal</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10 px-4">
            <Link 
              to="/tools/dither" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E84634] text-[#E84634] hover:bg-[#E84634] hover:text-[#FDFBF7] dark:hover:text-[#1E1A18] font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full transition-colors"
            >
              <Sparkles size={16} />
              Dither Tool
            </Link>
            <Link 
              to="/tools/scratch" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E84634] text-[#E84634] hover:bg-[#E84634] hover:text-[#FDFBF7] dark:hover:text-[#1E1A18] font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full transition-colors"
            >
              <Compass size={16} />
              Visual Creative Scratch
            </Link>
            <a 
              href="https://scrapbox.io/WarenBergg1995/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E84634] text-[#E84634] hover:bg-[#E84634] hover:text-[#FDFBF7] dark:hover:text-[#1E1A18] font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full transition-colors"
            >
              <ExternalLink size={16} />
              Scrapbox
            </a>
          </div>

          <a 
            href="https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5?si=JUVlCAjzQ6ew20AQH2H7Wg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[340px] mx-auto mb-16 flex items-center justify-between p-2 border border-[#E0DACE] dark:border-[#3A332E] hover:border-[#E84634]/50 dark:hover:border-[#E84634]/50 bg-white/50 dark:bg-[#1E1A18]/50 backdrop-blur-sm rounded-2xl transition-all shadow-sm group overflow-hidden"
          >
            <div className="flex flex-col text-left pl-3 py-1">
              <div className="flex items-center gap-1.5 mb-1">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1DB954]" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.241 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E84634]/70">Spotify</span>
              </div>
              <span className="text-lg font-serif-display font-bold text-[#E84634] leading-none mb-1">Late20s</span>
              <span className="text-[11px] text-[#E84634]/60 font-medium">by Randy Ardiansyah</span>
            </div>
            <div className="w-[72px] h-[72px] shrink-0 rounded-[10px] overflow-hidden border border-[#E0DACE]/50 dark:border-[#3A332E]/50">
              <img 
                src={avatarImg} 
                alt="Late20s Playlist Cover" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>
          </a>

          <div className="w-full aspect-[4/3] sm:aspect-video rounded-[2rem] overflow-hidden relative shadow-lg">
            <img 
              src={kudoGhibliImg} 
              alt="My photo" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 border-t border-[#E0DACE] dark:border-[#3A332E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-16 px-4">
            <h2 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight text-[#E84634]">curated</h2>
            <p className="text-[#E84634] font-medium italic pb-1">A selection of stories and visual projects crafted carefully over time.</p>
          </div>
          
          <div className="flex overflow-x-auto gap-6 lg:gap-8 pb-12 snap-x px-4 [&::-webkit-scrollbar]:hidden">
            {featuredWorks.length > 0 ? featuredWorks.map((work) => (
              <Link key={work.id} to="/curated" className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                <div className="aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-6 relative rounded-[1.5rem] shadow-sm">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#E84634] transition-colors leading-relaxed">
                    {work.title}
                  </h3>
                </div>
              </Link>
            )) : (
              // Fallback content if database is empty to match the screenshot
              <>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">A Mother-Daughter Reunion In The French Countryside</h3>
                </div>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">A Heartbreak-Healing Solo Trip To The Greek Islands</h3>
                </div>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">A September In Sicily For The Couple Who Love Long Dinners</h3>
                </div>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">Finding Solitude Along The Ancient Trails Of Kyoto</h3>
                </div>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">Wandering Through The Hidden Markets Of Marrakech</h3>
                </div>
                <div className="group block shrink-0 snap-start w-[280px] sm:w-[320px]">
                  <div className="aspect-[3/4] overflow-hidden relative rounded-[1.5rem] shadow-sm mb-4">
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#E84634] text-center leading-relaxed">A Weekend Escape To The Untamed Coastlines Of Maine</h3>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-8 text-center flex items-center justify-between px-4">
            <Link to="/curated" className="inline-flex mx-auto text-sm font-medium tracking-widest uppercase text-[#E84634] hover:opacity-70 transition-opacity">
              view journal
            </Link>
            <div className="flex gap-2 text-[#E84634] font-bold">
              <span>←</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-24 border-t border-[#E0DACE] dark:border-[#3A332E]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
           <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight text-[#E84634]">recent journal</h2>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#E84634] hover:opacity-70 transition-colors">
              view all
            </Link>
          </div>

          <div className="space-y-12">
            {recentPosts.map((post) => (
              <article key={post.id} className="group">
                {post.url ? (
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-[#E0DACE] dark:border-[#3A332E] pb-6">
                      <h3 className="text-xl md:text-2xl font-serif-display font-medium text-[#E84634] group-hover:opacity-70 transition-opacity flex items-center gap-3">
                        {post.iconUrl && (
                          <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                        {post.title}
                        <ExternalLink size={16} className="text-[#E84634]/50 group-hover:text-[#E84634] transition-colors" />
                      </h3>
                      <div className="flex items-center gap-4 text-sm shrink-0">
                        <span className="text-[#E84634]/70 uppercase tracking-widest text-xs font-bold">{getDomain(post.url)}</span>
                        <time className="text-[#E84634]/60 font-serif-display italic text-lg">{post.date}</time>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-[#E0DACE] dark:border-[#3A332E] pb-6">
                      <h3 className="text-xl md:text-2xl font-serif-display font-medium text-[#E84634] group-hover:opacity-70 transition-opacity flex items-center gap-3">
                        {post.iconUrl && (
                          <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                        {post.title}
                      </h3>
                      <time className="text-[#E84634]/60 font-serif-display italic text-lg shrink-0">{post.date}</time>
                    </div>
                  </Link>
                )}
              </article>
            ))}
          </div>
          <div className="mt-12 sm:hidden text-center">
             <Link to="/blog" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#E84634]">
              view all posts
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Media */}
      <section className="py-24 border-t border-[#E0DACE] dark:border-[#3A332E]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif-display font-bold tracking-tight text-[#E84634]">watch &amp; listen</h2>
            </div>
            <Link to="/media" className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#E84634] hover:opacity-70 transition-colors">
              view all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {recentMedia.map((item) => {
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
                      <div className="w-full sm:w-32 aspect-[3/4] sm:aspect-square shrink-0 bg-[#E0DACE]/30 dark:bg-[#3A332E]/30 relative rounded-2xl overflow-hidden group-hover:opacity-90 transition-opacity shadow-sm">
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
                    <div className="flex-1 min-w-0 w-full pt-2">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-xl font-serif-display font-medium text-[#E84634] group-hover:opacity-70 transition-colors leading-snug">{item.title}</h3>
                        <ExternalLink size={16} className="text-[#E84634]/50 group-hover:text-[#E84634] transition-colors shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-[#E84634]/70">
                        <span className="capitalize">{item.category || 'video'}</span>
                        <span className="opacity-50">&middot;</span>
                        <span>{item.platform}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-[#E84634]/80 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          <div className="mt-12 sm:hidden text-center">
             <Link to="/media" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#E84634]">
              view all media
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
