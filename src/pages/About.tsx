import React from 'react';
import { Helmet } from 'react-helmet-async';

export function About() {
  return (
    <div className="pt-24 pb-32 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>About - Randy</title>
        <meta name="description" content="I'm Randy, a curious explorer of the web with a background in IT." />
      </Helmet>
      
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Biography</span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">About Me<span className="text-orange-500">.</span></h1>
      </div>
      
      <div className="space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p className="text-xl font-light text-zinc-800 dark:text-zinc-200">
          Hello! I'm <strong className="font-semibold text-orange-600 dark:text-orange-400">Randy</strong>. I am a digital explorer who constantly seeks new knowledge and loves building refined web experiences.
        </p>
        <p>
          With a background in IT (Teknik Informatika), my interests span across various disciplines including coding, design, artificial intelligence, books, and life itself. I enjoy blending technical skills with creative thinking to build interesting and meaningful projects.
        </p>
        <p>
          I believe that learning is a lifelong journey. Whether I'm diving into a new programming language, reading a thought-provoking book, or exploring the latest advancements in AI, I'm always looking for ways to expand my horizons and create things that matter.
        </p>
        
        <div className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 mt-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Career &amp; Learning</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Journey &amp; Background</h2>
          
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 transition-all">
              <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Lifelong Learner &amp; Explorer</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">Ongoing</span>
              </div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">The Digital Frontier</p>
              <p className="text-base text-zinc-600 dark:text-zinc-400">Constantly seeking new knowledge across software architecture, UI/UX, AI systems, and digital craftsmanship.</p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 transition-all">
              <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">IT Student &amp; Enthusiast</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">Foundation</span>
              </div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Teknik Informatika</p>
              <p className="text-base text-zinc-600 dark:text-zinc-400">Building a strong foundation in computer science, algorithm design, and software engineering principles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
