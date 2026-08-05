import React from 'react';
import { Helmet } from 'react-helmet-async';
import { User } from 'lucide-react';
import avatarAbout from '../assets/images/avatar_about_1785946988505.jpg';

export function About() {
  return (
    <div className="pt-24 pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>About - Randy</title>
        <meta name="description" content="I'm Randy, a curious explorer of the web with a background in IT." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row gap-12 items-start mb-12">
        <div className="shrink-0">
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#FDFBF7] dark:border-[#2C241B] shadow-xl rotate-[-3deg] hover:rotate-3 transition-transform">
            <img src={avatarAbout} alt="Randy Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F] dark:text-[#E07A5F] mb-2 block">Biography</span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#2C241B] dark:text-[#FDFBF7] flex items-center gap-3">
              About Me<span className="text-[#E07A5F]">.</span>
            </h1>
          </div>
          
          <div className="space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p className="text-xl font-light text-[#4A3F35] dark:text-[#E8E2D9]">
              Hello! I'm <strong className="font-semibold text-[#E07A5F] dark:text-[#E07A5F]">Randy</strong>. I am a digital explorer who constantly seeks new knowledge and loves building refined web experiences.
            </p>
        <p>
          With a background in IT (Teknik Informatika), my interests span across various disciplines including coding, design, artificial intelligence, books, and life itself. I enjoy blending technical skills with creative thinking to build interesting and meaningful projects.
        </p>
        <p>
          I believe that learning is a lifelong journey. Whether I'm diving into a new programming language, reading a thought-provoking book, or exploring the latest advancements in AI, I'm always looking for ways to expand my horizons and create things that matter.
        </p>
      </div>
      </div>
        
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
