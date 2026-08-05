import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import avatarReading from '../assets/images/avatar_reading_1785947012435.jpg';

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
        setBlogData(data.reverse());
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    return blogData.filter((post) => {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (post.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, blogData]);

  return (
    <div className="pt-32 pb-32 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
      <Helmet>
        <title>Curated Writings - Randy's Minimalist Portfolio</title>
        <meta name="description" content="Long stories about life after reading, curated reflections, and notes." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
        <div className="shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#FDFBF7] dark:border-[#2C241B] shadow-xl rotate-[-3deg] hover:rotate-3 transition-transform">
            <img src={avatarReading} alt="Randy Avatar - Reading" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif-display tracking-tight mb-6 text-[#2C241B] dark:text-[#FDFBF7] leading-tight flex items-center gap-4">
            Curated Reading
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light max-w-xl leading-relaxed">
            Reflections, notes, and observations.
          </p>
        </div>
      </div>

      <div className="relative mb-16">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-8 pr-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-transparent text-lg placeholder-zinc-500 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
        />
      </div>

      <div className="space-y-12">
        {filteredPosts.map((post) => (
          <article key={post.id} className="group">
            {post.url ? (
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
                  <h2 className="text-xl md:text-2xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors flex items-center gap-3">
                    {post.iconUrl && (
                      <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                    )}
                    {post.title}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 dark:text-zinc-700 group-hover:text-orange-500 transition-colors"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  </h2>
                  <div className="flex items-center gap-4 text-sm shrink-0">
                    <span className="text-zinc-500 dark:text-zinc-400">{getDomain(post.url)}</span>
                    <time className="text-zinc-400 dark:text-zinc-500 font-serif-display italic">{post.date}</time>
                  </div>
                </div>
              </a>
            ) : (
              <Link to={`/blog/${post.id}`} className="block">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
                  <h2 className="text-xl md:text-2xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors flex items-center gap-3">
                    {post.iconUrl && (
                      <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                    )}
                    {post.title}
                  </h2>
                  <time className="text-sm text-zinc-400 dark:text-zinc-500 font-serif-display italic shrink-0">{post.date}</time>
                </div>
              </Link>
            )}
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No articles found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
}
