import React from 'react';
import { Helmet } from 'react-helmet-async';
import { User } from 'lucide-react';
import randyImg from '../assets/images/randy.jpeg';

export function About() {
  return (
    <div className="pt-24 pb-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>About - Randy</title>
        <meta name="description" content="I'm Randy, a curious explorer of the web with a background in IT." />
      </Helmet>
      
      <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-start">
        
        {/* RIGHT COLUMN: Full Image */}
        <div className="w-full lg:w-2/5 shrink-0 animate-[float_6s_ease-in-out_infinite] lg:sticky lg:top-32">
          <div className="group w-full aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden border-4 border-[#FDFBF7] dark:border-[#2C241B] shadow-xl rotate-2 hover:rotate-4 hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer">
            <img src={randyImg} alt="Randy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
          </div>
        </div>
        
        {/* LEFT COLUMN: Biography & Career */}
        <div className="w-full lg:w-3/5 flex flex-col">
          
          {/* Biography Section */}
          <div className="mb-16">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] dark:text-[#E84634] mb-2 block">Biography</span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#E84634] dark:text-[#E84634] flex items-center gap-3">
                About Me<span className="text-[#E84634]">.</span>
              </h1>
            </div>
            
            <div className="space-y-6 text-lg leading-relaxed text-[#E84634] dark:text-[#E84634]">
              <p className="text-xl font-light text-[#E84634] dark:text-[#E84634]">
                Hello, I'm <strong className="font-semibold text-[#E84634] dark:text-[#E84634]">Randy</strong>—a self-taught digital explorer and a grounded realist. By integrating AI into my creative process, I build refined web experiences faster while diving deeper into meaningful interactions.
              </p>
            </div>
          </div>
          
          {/* Career & Learning Section */}
          <div className="pt-10 border-t border-[#4A3F35]/10 dark:border-[#FDFBF7]/10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] mb-2 block">Career &amp; Learning</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#E84634] dark:text-[#E84634] mb-8">Journey &amp; Background</h2>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5 border border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 hover:border-[#E07A5F]/40 dark:hover:border-[#E07A5F]/40 transition-all">
                <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                  <h3 className="text-xl font-bold text-[#E84634] dark:text-[#E84634]">Lifelong Learner &amp; AI Enthusiast</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E07A5F]/10 text-[#E84634]">Ongoing</span>
                </div>
                <p className="text-sm font-semibold text-[#E84634]/70 dark:text-[#E84634]/70 mb-2">The Digital Frontier &amp; Vibe Coding</p>
                <p className="text-base text-[#E84634]/80 dark:text-[#E84634]/80">Passionate about utilizing AI like "vibe coding" to accelerate learning and exploration. Constantly seeking new knowledge across software architecture, UI/UX, AI systems, and digital craftsmanship.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5 border border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 hover:border-[#E07A5F]/40 dark:hover:border-[#E07A5F]/40 transition-all">
                <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                  <h3 className="text-xl font-bold text-[#E84634] dark:text-[#E84634]">Master's Degree Scholarship</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E07A5F]/10 text-[#E84634]">2024</span>
                </div>
                <p className="text-sm font-semibold text-[#E84634]/70 dark:text-[#E84634]/70 mb-2">Postgraduate Studies</p>
                <p className="text-base text-[#E84634]/80 dark:text-[#E84634]/80">Awarded a scholarship to pursue a Master's degree, furthering my academic journey and deepening my expertise in technology and innovation.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5 border border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 hover:border-[#E07A5F]/40 dark:hover:border-[#E07A5F]/40 transition-all">
                <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                  <h3 className="text-xl font-bold text-[#E84634] dark:text-[#E84634]">Journey Explorer</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#4A3F35]/10 dark:bg-[#FDFBF7]/10 text-[#E84634]/70 dark:text-[#E84634]/70">2023 &ndash; 2024</span>
                </div>
                <p className="text-sm font-semibold text-[#E84634]/70 dark:text-[#E84634]/70 mb-2">Programs &amp; Bootcamps</p>
                <p className="text-base text-[#E84634]/80 dark:text-[#E84634]/80">Participated in Kampus Mengajar (Campus Teaching) and LearningX Independent Study in 2023, followed by the Ruangguru Camp in 2024, to broaden my horizons and practical skills.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#4A3F35]/5 dark:bg-[#FDFBF7]/5 border border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 hover:border-[#E07A5F]/40 dark:hover:border-[#E07A5F]/40 transition-all">
                <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                  <h3 className="text-xl font-bold text-[#E84634] dark:text-[#E84634]">Bachelor of Informatics Engineering</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#4A3F35]/10 dark:bg-[#FDFBF7]/10 text-[#E84634]/70 dark:text-[#E84634]/70">Foundation</span>
                </div>
                <p className="text-sm font-semibold text-[#E84634]/70 dark:text-[#E84634]/70 mb-2">Software Engineering &amp; Web Development</p>
                <p className="text-base text-[#E84634]/80 dark:text-[#E84634]/80">Graduated with a Bachelor's degree, focusing on software engineering, web development, full-stack engineering, design, and several related disciplines.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
