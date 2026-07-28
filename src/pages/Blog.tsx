import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
    <div className="pt-24 pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Curated Writings - Randy's Minimalist Portfolio</title>
        <meta name="description" content="Long stories about life after reading, curated reflections, and notes." />
      </Helmet>
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Notes &amp; Writings</span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">Curated Writings<span className="text-orange-500">.</span></h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400">
          Long stories about life after reading.
        </p>
      </div>

      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-4 py-3.5 border-b-2 border-zinc-200 dark:border-zinc-800 bg-transparent text-lg placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <article key={post.id} className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 transition-all shadow-sm">
            {post.url ? (
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2">
                    {post.iconUrl && (
                      <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                    )}
                    {post.title}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 group-hover:text-orange-500 transition-all"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 shrink-0">
                    <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">{getDomain(post.url)}</span>
                    <time>{post.date}</time>
                  </div>
                </div>
              </a>
            ) : (
              <Link to={`/blog/${post.id}`} className="block">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2">
                    {post.iconUrl && (
                      <img src={post.iconUrl} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                    )}
                    {post.title}
                  </h2>
                  <time className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0">{post.date}</time>
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
