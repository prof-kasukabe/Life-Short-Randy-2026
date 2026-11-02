import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  User,
  GraduationCap,
  Cpu,
  Compass,
  Terminal,
  Database,
  ShieldCheck,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import randyImg from '../assets/images/randy.jpeg';
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';
import { GenerativeParticleCanvas } from '../components/GenerativeParticleCanvas';

export function About() {
  const [activeTab, setActiveTab] = useState<string>('biography');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tabs: BoardTabItem[] = [
    { id: 'biography', label: 'Contributor Dossier', icon: User },
    { id: 'journey', label: 'Career & Academic', icon: GraduationCap, badge: 4 },
    { id: 'competencies', label: 'Technical Stack', icon: Cpu, badge: 4 },
    { id: 'canvas', label: 'Identity Engine', icon: Sparkles }
  ];

  const milestones = [
    {
      num: '01',
      title: 'Lifelong Learner & AI Enthusiast',
      period: 'Ongoing',
      subtitle: 'The Digital Frontier & Vibe Coding',
      description:
        'Passionate about utilizing AI and vibe coding workflows to accelerate learning and exploration across software architecture, UI/UX, AI systems, and digital craftsmanship.',
      tag: 'Active Focus'
    },
    {
      num: '02',
      title: "Master's Degree Scholarship",
      period: '2024',
      subtitle: 'Postgraduate Studies',
      description:
        "Awarded a scholarship to pursue a Master's degree, furthering my academic journey and deepening my expertise in technology, systems thinking, and innovation.",
      tag: 'Academic'
    },
    {
      num: '03',
      title: 'Journey Explorer & Bootcamps',
      period: '2023 – 2024',
      subtitle: 'Kampus Mengajar · LearningX · Ruangguru Camp',
      description:
        'Participated in Kampus Mengajar and LearningX Independent Study in 2023, followed by the Ruangguru Camp in 2024 to broaden practical engineering and collaborative skills.',
      tag: 'Fellowship'
    },
    {
      num: '04',
      title: 'Bachelor of Informatics Engineering',
      period: 'Foundation',
      subtitle: 'Software Engineering & Web Development',
      description:
        "Graduated with a Bachelor's degree in Informatics Engineering, focusing on full-stack web development, distributed architectures, and human-centered interface design.",
      tag: 'Degree'
    }
  ].filter(
    (m) =>
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>About — Randy | Interactive Dossier</title>
        <meta
          name="description"
          content="I'm Randy, a software engineer and digital realist exploring modern web architecture and AI workflows."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="Contributor Profile"
        pageSubtitle="Self-taught digital explorer, software engineer, and grounded realist."
        breadcrumbCategory="About"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search bio or milestones..."
        headerRightSlot={
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] bg-white dark:bg-[#24201D] text-[11px] font-medium text-[#E84634] hover:border-[#E84634] transition-colors"
          >
            <span>Get in touch</span>
            <ArrowUpRight size={11} />
          </Link>
        }
      >
        {/* TAB 1: BIOGRAPHY & DOSSIER */}
        {activeTab === 'biography' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Portrait Card */}
            <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] p-4 flex flex-col justify-between">
              <div className="aspect-[4/4.3] w-full rounded-xl overflow-hidden border border-[#E0DACE]/60 dark:border-[#3A332E] mb-4">
                <img
                  src={randyImg}
                  alt="Randy Ardiansyah"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#E84634] font-semibold mb-1">
                  RANDY ARDIANSYAH
                </div>
                <h3 className="text-xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-1">
                  Software Engineer &amp; Digital Realist
                </h3>
                <p className="text-xs text-[#6E655B] dark:text-[#A39B8F]">
                  Indonesia Bagian Selatan · Full-Stack &amp; AI Systems
                </p>
              </div>
            </div>

            {/* Right Narrative & Quick Matrix */}
            <div className="lg:col-span-8 flex flex-col justify-between gap-4">
              <div className="rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] p-6">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#E84634] font-semibold mb-2">
                  01 · Editorial Biography
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-4 leading-snug">
                  Diving deeper into the process, embracing the discomfort, and bending fate to create meaningful digital systems.
                </h3>
                <p className="text-sm sm:text-base text-[#4A3F35] dark:text-[#D8D0C5] leading-relaxed mb-4">
                  Hello, I&apos;m <strong>Randy</strong>—a self-taught digital explorer and a grounded realist with a background in Informatics Engineering. By integrating modern AI workflows into software engineering, I build refined full-stack web experiences faster while focusing deeply on tactile, intentional interactions.
                </p>
                <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed">
                  Whether architecting distributed backend services, designing minimalist editorial interfaces, or curating long-form reflections in <em>The Late 20s</em>, my work balances technical rigor with human calm.
                </p>
              </div>

              {/* 3 Pillar Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div
                  onClick={() => setActiveTab('journey')}
                  className="p-4 rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] hover:border-[#E84634] transition-all cursor-pointer"
                >
                  <div className="text-[10px] font-mono text-[#E84634] font-bold mb-1">01 · ACADEMIC</div>
                  <div className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-1">
                    Master&apos;s Scholar
                  </div>
                  <p className="text-xs text-[#6E655B] dark:text-[#A39B8F]">
                    2024 Postgraduate Scholarship &amp; B.Eng in Informatics.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('competencies')}
                  className="p-4 rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] hover:border-[#E84634] transition-all cursor-pointer"
                >
                  <div className="text-[10px] font-mono text-[#E84634] font-bold mb-1">02 · ENGINEERING</div>
                  <div className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-1">
                    Full-Stack &amp; AI
                  </div>
                  <p className="text-xs text-[#6E655B] dark:text-[#A39B8F]">
                    React 19, TypeScript, Go, FastAPI, PostgreSQL &amp; Gemini.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('canvas')}
                  className="p-4 rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] hover:border-[#E84634] transition-all cursor-pointer"
                >
                  <div className="text-[10px] font-mono text-[#E84634] font-bold mb-1">03 · PHILOSOPHY</div>
                  <div className="text-base font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-1">
                    Digital Realism
                  </div>
                  <p className="text-xs text-[#6E655B] dark:text-[#A39B8F]">
                    Calm technology, intentional typography &amp; high-craft tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAREER & ACADEMIC TIMELINE */}
        {activeTab === 'journey' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map((m) => (
              <div
                key={m.num}
                className="rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] p-5 flex flex-col justify-between min-h-[195px]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-[#2A2521] dark:text-[#F5F2EB]">{m.num}</span>
                    <span className="text-[#E84634] font-semibold">{m.period}</span>
                  </div>
                  <h3 className="text-xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-1">
                    {m.title}
                  </h3>
                  <div className="text-xs font-medium text-[#E84634]/80 mb-2">{m.subtitle}</div>
                  <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#E0DACE]/50 dark:border-[#2E2824] flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#E84634]/12 text-[#E84634] font-semibold">
                    {m.tag}
                  </span>
                  <span className="text-[#6E655B] dark:text-[#A39B8F]">Verified Milestone</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: TECHNICAL COMPETENCIES */}
        {activeTab === 'competencies' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29]">
              <div className="flex items-center gap-2 mb-2 text-[#E84634]">
                <Cpu size={17} />
                <h3 className="font-serif-display font-bold text-lg text-[#2A2521] dark:text-[#F5F2EB]">
                  Frontend Architecture
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed mb-4">
                High-performance SPAs and SSR apps with typed interfaces, accessible components, and smooth 60fps canvas graphics.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['React 19', 'TypeScript', 'Tailwind CSS', 'Next.js', 'HTML5 Canvas'].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E84634]/10 text-[#E84634] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29]">
              <div className="flex items-center gap-2 mb-2 text-[#E84634]">
                <Terminal size={17} />
                <h3 className="font-serif-display font-bold text-lg text-[#2A2521] dark:text-[#F5F2EB]">
                  Backend &amp; Microservices
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed mb-4">
                Scalable REST, gRPC, and WebSocket backends designed with rate-limiting, modular service boundaries, and caching.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Node.js', 'Python FastAPI', 'Go (Golang)', 'Express', 'Redis'].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E84634]/10 text-[#E84634] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29]">
              <div className="flex items-center gap-2 mb-2 text-[#E84634]">
                <Database size={17} />
                <h3 className="font-serif-display font-bold text-lg text-[#2A2521] dark:text-[#F5F2EB]">
                  Databases &amp; Cloud
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed mb-4">
                Relational schema modeling, real-time NoSQL synchronization, time-series telemetry storage, and containerization.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['PostgreSQL', 'TimescaleDB', 'Firebase Firestore', 'Docker', 'CI/CD'].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E84634]/10 text-[#E84634] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29]">
              <div className="flex items-center gap-2 mb-2 text-[#E84634]">
                <ShieldCheck size={17} />
                <h3 className="font-serif-display font-bold text-lg text-[#2A2521] dark:text-[#F5F2EB]">
                  AI &amp; Zero-Trust Security
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed mb-4">
                Integrating multimodal LLMs into operational workflows, WebAuthn biometrics, and secure RBAC policy layers.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Gemini SDK', 'WebAuthn', 'JWT Auth', 'Agentic Workflows', 'RBAC'].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E84634]/10 text-[#E84634] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTERACTIVE IDENTITY CANVAS */}
        {activeTab === 'canvas' && <GenerativeParticleCanvas />}
      </BoardPageLayout>
    </>
  );
}
