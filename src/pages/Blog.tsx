import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, FileText, ExternalLink, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BlogPost } from '../types';
import { blogData as fallbackBlogs } from '../data';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function Blog() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [blogData, setBlogData] = useState<BlogPost[]>(fallbackBlogs);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as BlogPost[];
          setBlogData(data.reverse());
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    return blogData.filter((post) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'external' ? Boolean(post.url) : !post.url);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        (post.content || '').toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [searchQuery, blogData, activeTab]);

  const tabs: BoardTabItem[] = [
    { id: 'all', label: 'All Writings', icon: BookOpen, badge: blogData.length },
    {
      id: 'notes',
      label: 'Journal & Essays',
      icon: FileText,
      badge: blogData.filter((p) => !p.url).length
    },
    {
      id: 'external',
      label: 'External',
      icon: ExternalLink,
      badge: blogData.filter((p) => Boolean(p.url)).length
    }
  ];

  return (
    <>
      <Helmet>
        <title>Curated Reading List — Randy</title>
        <meta
          name="description"
          content="Long stories about life after reading, curated reflections, and notes."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="Curated Reading List"
        pageSubtitle="Reflections, notes, and observations on software, minimalism, and life after reading."
        breadcrumbCategory="Reading List"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id);
          setSelectedPost(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search articles..."
      >
        {selectedPost ? (
          <div className="rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E84634] hover:underline cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Reading List</span>
              </button>
              <span className="text-xs font-serif-display italic text-[#71717A] dark:text-zinc-400">
                {selectedPost.date} · {selectedPost.readTime || '5 min read'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#18181B] dark:text-white mb-4">
              {selectedPost.title}
            </h3>

            <p className="text-sm sm:text-base text-[#3F3F46] dark:text-zinc-300 leading-relaxed whitespace-pre-line mb-6">
              {selectedPost.content ||
                selectedPost.excerpt ||
                'Reflections and field notes written by Randy Ardiansyah on minimalist engineering, calm technology, and deliberate creative systems.'}
            </p>

            <div className="flex items-center gap-3">
              {selectedPost.url ? (
                <a
                  href={selectedPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#0D0D0F] text-xs font-semibold"
                >
                  <span>Open Original ({getDomain(selectedPost.url)})</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <Link
                  to={`/blog/${selectedPost.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#0D0D0F] text-xs font-semibold"
                >
                  <span>Open Full Reader</span>
                  <ArrowUpRight size={13} />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {filteredPosts.map((post, idx) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="text-xs font-mono text-[#71717A] dark:text-zinc-500 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs text-[#52525B] dark:text-zinc-400 line-clamp-1 mt-0.5">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-[#71717A] dark:text-zinc-500 shrink-0 pl-7 sm:pl-0">
                  <span>{post.url ? getDomain(post.url) : 'Journal'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime || '5m'}</span>
                  <span aria-hidden="true">·</span>
                  <time className="text-[#18181B] dark:text-zinc-300">{post.date}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </BoardPageLayout>
    </>
  );
}
