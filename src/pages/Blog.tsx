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
      label: 'External Publications',
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
        searchPlaceholder="Search articles & notes..."
      >
        {selectedPost ? (
          <div className="bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E0DACE] dark:border-[#332D29]">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E84634] hover:underline cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Reading Board</span>
              </button>
              <span className="text-xs font-serif-display italic text-[#6E655B] dark:text-[#A39B8F]">
                {selectedPost.date} · {selectedPost.readTime || '5 min read'}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-4">
              {selectedPost.title}
            </h3>

            <p className="text-sm sm:text-base text-[#4A3F35] dark:text-[#D8D0C5] leading-relaxed whitespace-pre-line mb-6">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E84634] text-white text-xs font-semibold"
                >
                  <span>Open Original ({getDomain(selectedPost.url)})</span>
                  <ExternalLink size={13} />
                </a>
              ) : (
                <Link
                  to={`/blog/${selectedPost.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E84634] text-white text-xs font-semibold"
                >
                  <span>Open Dedicated Reader Page</span>
                  <ArrowUpRight size={13} />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredPosts.map((post, idx) => {
              const tagColors = [
                'bg-[#E84634]/12 text-[#E84634]',
                'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                'bg-amber-500/15 text-amber-700 dark:text-amber-300',
                'bg-sky-500/15 text-sky-700 dark:text-sky-300'
              ];
              const badgeClass = tagColors[idx % tagColors.length];

              return (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE]/80 dark:border-[#332D29] hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[180px] transition-all cursor-pointer shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-[#2A2521] dark:text-[#F5F2EB]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <time className="text-[11px] font-serif-display italic text-[#6E655B] dark:text-[#A39B8F]">
                        {post.date}
                      </time>
                    </div>

                    <h3 className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634] transition-colors leading-snug mb-2">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-xs text-[#6E655B] dark:text-[#A39B8F] line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2">
                    <div
                      className={`w-full px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center justify-between ${badgeClass}`}
                    >
                      <span className="truncate">
                        {post.url ? getDomain(post.url) : 'Randy Journal'}
                      </span>
                      <span>{post.readTime || '5m'}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </BoardPageLayout>
    </>
  );
}
