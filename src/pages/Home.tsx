import React, { useState, useEffect } from 'react';
import { ArrowRight, Tv, Headphones, ExternalLink, MapPin, Sparkles, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem, BlogPost, MediaItem } from '../types';
import { Helmet } from 'react-helmet-async';
import { getMediaThumbnail } from '../lib/media';

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
        const portfoliosSnapshot = await getDocs(query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'), limit(2)));
        const works = portfoliosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PortfolioItem[];
        setFeaturedWorks(works);

        const blogsSnapshot = await getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(2)));
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
      <section className="flex-grow flex items-center pt-24 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex flex-wrap items-center gap-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold backdrop-blur-sm shadow-2xs hover:border-orange-500/40 transition-all">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span>Available for Collaboration</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-medium backdrop-blur-sm">
                <MapPin size={13} className="text-orange-500" />
                <span>Indonesia Bagian Selatan</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-medium backdrop-blur-sm">
                <Sparkles size={13} className="text-orange-500" />
                <span>IT Explorer &amp; Craftsman</span>
              </div>
            </div>
            
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-none">
              Randy<span className="text-orange-500">.</span>
            </h1>
            
            <p className="text-2xl sm:text-3xl font-light text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed tracking-tight mb-10">
              A curious explorer of the endless web &amp; digital craftsman.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/curated"
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm rounded-full transition-all shadow-sm hover:shadow-orange-500/25"
              >
                View Works <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-zinc-200/70 hover:bg-zinc-200 dark:bg-zinc-800/70 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-sm rounded-full transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-20 bg-zinc-100/60 dark:bg-zinc-900/30 border-y border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Portfolio</span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Selected Works</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">A Long stories about life after reading.</p>
            </div>
            <Link to="/curated" className="hidden sm:inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {featuredWorks.map((work) => (
              <Link key={work.id} to="/curated" className="group block p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all shadow-sm">
                <div className="aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 mb-5 relative">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-zinc-900/90 text-orange-600 dark:text-orange-400 backdrop-blur-sm border border-orange-500/20">
                    {work.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2 mb-2">
                  {work.iconUrl && (
                    <img src={work.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                  )}
                  {work.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{work.category}</span>
                  {work.date && (
                    <>
                      <span className="text-orange-500">&middot;</span>
                      <time>{work.date}</time>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 sm:hidden">
             <Link to="/curated" className="inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400">
              View all works <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Articles</span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Latest Readings</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Thoughts on design, coding, and development.</p>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="space-y-6">
            {recentPosts.map((post) => (
              <article key={post.id} className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 transition-all">
                {post.url ? (
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2">
                        {post.iconUrl && (
                          <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                        {post.title}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 group-hover:text-orange-500 transition-all"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 shrink-0">
                        <span className="truncate max-w-[180px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full text-xs font-medium">{getDomain(post.url)}</span>
                        <time>{post.date}</time>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2">
                        {post.iconUrl && (
                          <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                        {post.title}
                      </h3>
                      <time className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0">{post.date}</time>
                    </div>
                  </Link>
                )}
              </article>
            ))}
          </div>
          <div className="mt-8 sm:hidden">
             <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400">
              View all posts <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Media */}
      <section className="py-20 bg-zinc-100/60 dark:bg-zinc-900/30 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Curated Media</span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Watch &amp; Listen</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Handpicked podcasts, videos, and talks.</p>
            </div>
            <Link to="/media" className="hidden sm:inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {recentMedia.map((item) => {
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
          <div className="mt-8 sm:hidden">
             <Link to="/media" className="inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400">
              View all media <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
