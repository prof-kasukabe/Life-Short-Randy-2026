import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BlogPost } from '../types';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

export function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable > 0) {
        setScrollProgress((scrollY / totalScrollable) * 100);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="pt-24 pb-32 max-w-3xl mx-auto px-4 text-center">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="pt-24 pb-32 max-w-3xl mx-auto px-4 text-center">
        <Helmet>
          <title>Post Not Found - Randy's Minimalist Portfolio</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-[#E84634] hover:text-[#E84634] dark:hover:text-[#E84634] underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <div 
        className="fixed top-0 left-0 h-1 bg-[#E84634] z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      <article className="pt-24 pb-32 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Helmet>
        <title>{post.title} - Randy's Blog</title>
        <meta name="description" content={post.content ? post.content.substring(0, 150) : post.title} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content ? post.content.substring(0, 150) : post.title} />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <Link to="/blog" className="inline-flex items-center text-sm font-medium text-[#E84634] hover:text-[#E84634] dark:hover:text-[#E84634] transition-colors mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to Blog
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{post.title}</h1>
        <div className="flex items-center gap-4 text-[#E84634]">
          <time>{post.date}</time>
        </div>
      </header>
      
      <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-[#E84634] dark:text-[#E84634]">
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        ) : null}
      </div>
    </article>
    </>
  );
}
