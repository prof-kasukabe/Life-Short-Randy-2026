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
        <Link to="/blog" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="pt-24 pb-32 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{post.title} - Randy's Blog</title>
        <meta name="description" content={post.content ? post.content.substring(0, 150) : post.title} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content ? post.content.substring(0, 150) : post.title} />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <Link to="/blog" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to Blog
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{post.title}</h1>
        <div className="flex items-center gap-4 text-zinc-500">
          <time>{post.date}</time>
        </div>
      </header>
      
      <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-zinc-600 dark:text-zinc-400">
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        ) : null}
      </div>
    </article>
  );
}
