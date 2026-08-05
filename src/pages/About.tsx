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
        <p className="text-[#4A3F35]/80 dark:text-[#E8E2D9]/80">
          With a background in IT (Teknik Informatika), my interests span across various disciplines including coding, design, artificial intelligence, books, and life itself. I enjoy blending technical skills with creative thinking to build interesting and meaningful projects.
        </p>
        <p className="text-[#4A3F35]/80 dark:text-[#E8E2D9]/80">
          I believe that learning is a lifelong journey. Whether I'm diving into a new programming language, reading a thought-provoking book, or exploring the latest advancements in AI, I'm always looking for ways to expand my horizons and create things that matter.
        </p>
      </div>
      </div>
        
        <div className="pt-8 border-t border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 mt-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F] mb-2 block">Career &amp; Learning</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2C241B] dark:text-[#FDFBF7] mb-8">Journey &amp; Background</h2>
          
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5 border border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 hover:border-[#E07A5F]/40 dark:hover:border-[#E07A5F]/40 transition-all">
              <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                <h3 className="text-xl font-bold text-[#2C241B] dark:text-[#FDFBF7]">Lifelong Learner &amp; AI Enthusiast</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E07A5F]/10 text-[#E07A5F]">Ongoing</span>
              </div>
              <p className="text-sm font-semibold text-[#4A3F35]/70 dark:text-[#E8E2D9]/70 mb-2">The Digital Frontier &amp; Vibe Coding</p>
              <p className="text-base text-[#4A3F35]/80 dark:text-[#E8E2D9]/80">Passionate about utilizing AI like "vibe coding" to accelerate learning and exploration. Constantly seeking new knowledge across software architecture, UI/UX, AI systems, and digital craftsmanship.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5 border border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 hover:border-[#E07A5F]/40 dark:hover:border-[#E07A5F]/40 transition-all">
              <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                <h3 className="text-xl font-bold text-[#2C241B] dark:text-[#FDFBF7]">Master's Degree Scholarship</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E07A5F]/10 text-[#E07A5F]">2024</span>
              </div>
              <p className="text-sm font-semibold text-[#4A3F35]/70 dark:text-[#E8E2D9]/70 mb-2">Postgraduate Studies</p>
              <p className="text-base text-[#4A3F35]/80 dark:text-[#E8E2D9]/80">Awarded a scholarship to pursue a Master's degree, furthering my academic journey and deepening my expertise in technology and innovation.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5 border border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 hover:border-[#E07A5F]/40 dark:hover:border-[#E07A5F]/40 transition-all">
              <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                <h3 className="text-xl font-bold text-[#2C241B] dark:text-[#FDFBF7]">Journey Explorer</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#4A3F35]/10 dark:bg-[#FDFBF7]/10 text-[#4A3F35]/70 dark:text-[#E8E2D9]/70">2023 &ndash; 2024</span>
              </div>
              <p className="text-sm font-semibold text-[#4A3F35]/70 dark:text-[#E8E2D9]/70 mb-2">Programs &amp; Bootcamps</p>
              <p className="text-base text-[#4A3F35]/80 dark:text-[#E8E2D9]/80">Participated in Kampus Mengajar (Campus Teaching) and LearningX Independent Study in 2023, followed by the Ruangguru Camp in 2024, to broaden my horizons and practical skills.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5 border border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 hover:border-[#E07A5F]/40 dark:hover:border-[#E07A5F]/40 transition-all">
              <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                <h3 className="text-xl font-bold text-[#2C241B] dark:text-[#FDFBF7]">Bachelor of Informatics Engineering</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#4A3F35]/10 dark:bg-[#FDFBF7]/10 text-[#4A3F35]/70 dark:text-[#E8E2D9]/70">Foundation</span>
              </div>
              <p className="text-sm font-semibold text-[#4A3F35]/70 dark:text-[#E8E2D9]/70 mb-2">Web Development &amp; Design</p>
              <p className="text-base text-[#4A3F35]/80 dark:text-[#E8E2D9]/80">Graduated with a focus on web development, visual and verbal communication, logo design, and everything in between.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
