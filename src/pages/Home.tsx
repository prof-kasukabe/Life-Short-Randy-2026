import React, { useState, useEffect } from 'react';
import { ArrowRight, Tv, Headphones, ExternalLink, MapPin, Sparkles, Compass, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem, BlogPost, MediaItem } from '../types';
import { Helmet } from 'react-helmet-async';
import { getMediaThumbnail } from '../lib/media';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';

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
      <section className="flex-grow flex items-center pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="max-w-2xl flex-1">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif-display font-medium tracking-tight text-[#2C241B] dark:text-[#FDFBF7] mb-8 leading-tight">
              Curious explorer of the <span className="italic text-[#E07A5F] dark:text-[#E07A5F]">endless web</span> & digital craftsman.
            </h1>
            
            <p className="text-xl sm:text-2xl font-light text-[#4A3F35] dark:text-[#E8E2D9] max-w-2xl leading-relaxed mb-12">
              I'm Randy. I observe, design, and build software with a focus on simplicity, usability, and aesthetics.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Link
                to="/curated"
                className="inline-flex items-center text-sm font-semibold tracking-wide uppercase bg-[#E07A5F] text-[#FDFBF7] px-8 py-4 rounded-[2rem] hover:scale-105 transition-transform"
              >
                View Works <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center text-sm font-semibold tracking-wide uppercase text-[#4A3F35] hover:text-[#E07A5F] dark:text-[#E8E2D9] transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="shrink-0 animate-[float_6s_ease-in-out_infinite]">
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-[#FDFBF7] dark:border-[#2C241B] shadow-xl rotate-3 hover:rotate-6 transition-transform">
              <img src={avatarImg} alt="Randy Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-serif-display text-zinc-900 dark:text-zinc-50">Selected Works</h2>
            </div>
            <Link to="/curated" className="hidden sm:inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {featuredWorks.map((work) => (
              <Link key={work.id} to="/curated" className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-6 relative rounded-sm">
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
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors flex items-center gap-2 mb-1">
                      {work.iconUrl && (
                        <img src={work.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                      )}
                      {work.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{work.category}</p>
                  </div>
                  {work.date && (
                    <span className="text-sm text-zinc-400 dark:text-zinc-500 font-serif-display italic">{work.date}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 sm:hidden text-center">
             <Link to="/curated" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              View all works <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
           <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-serif-display text-zinc-900 dark:text-zinc-50">Latest Readings</h2>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="space-y-12">
            {recentPosts.map((post) => (
              <article key={post.id} className="group">
                {post.url ? (
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
                      <h3 className="text-xl md:text-2xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors flex items-center gap-3">
                        {post.iconUrl && (
                          <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                        {post.title}
                        <ExternalLink size={16} className="text-zinc-300 dark:text-zinc-700 group-hover:text-orange-500 transition-colors" />
                      </h3>
                      <div className="flex items-center gap-4 text-sm shrink-0">
                        <span className="text-zinc-500 dark:text-zinc-400">{getDomain(post.url)}</span>
                        <time className="text-zinc-400 dark:text-zinc-500 font-serif-display italic">{post.date}</time>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
                      <h3 className="text-xl md:text-2xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors flex items-center gap-3">
                        {post.iconUrl && (
                          <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                        )}
                        {post.title}
                      </h3>
                      <time className="text-sm text-zinc-400 dark:text-zinc-500 font-serif-display italic shrink-0">{post.date}</time>
                    </div>
                  </Link>
                )}
              </article>
            ))}
          </div>
          <div className="mt-12 sm:hidden text-center">
             <Link to="/blog" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              View all posts <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Media */}
      <section className="py-24 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-serif-display text-zinc-900 dark:text-zinc-50">Watch &amp; Listen</h2>
            </div>
            <Link to="/media" className="hidden sm:inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
              View all <ArrowRight size={16} className="ml-1" />
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
          <div className="mt-12 sm:hidden text-center">
             <Link to="/media" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              View all media <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
