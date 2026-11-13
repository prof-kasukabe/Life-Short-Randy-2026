import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  User,
  GraduationCap,
  Cpu,
  Terminal,
  Database,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';
import { GenerativeParticleCanvas } from '../components/GenerativeParticleCanvas';

export function About() {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openToCollab, setOpenToCollab] = useState<boolean>(true);
  const [aiWorkflows, setAiWorkflows] = useState<boolean>(true);

  const tabs: BoardTabItem[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'journey', label: 'Experience', icon: GraduationCap, badge: 4 },
    { id: 'competencies', label: 'Tech Stack', icon: Cpu, badge: 4 },
    { id: 'canvas', label: 'Identity', icon: Sparkles }
  ];

  const milestones = [
    {
      num: '01',
      title: 'Lifelong Learner & AI Enthusiast',
      period: 'Ongoing',
      subtitle: 'The Digital Frontier & Vibe Coding',
      description:
        'Utilizing AI and vibe coding workflows to accelerate learning and exploration across software architecture, UI/UX, AI systems, and digital craftsmanship.',
      tag: 'Active Focus'
    },
    {
      num: '02',
      title: "Master's Degree Scholarship",
      period: '2024',
      subtitle: 'Postgraduate Studies',
      description:
        "Awarded a scholarship to pursue a Master's degree, furthering academic research and deepening expertise in technology, systems thinking, and innovation.",
      tag: 'Academic'
    },
    {
      num: '03',
      title: 'Journey Explorer & Bootcamps',
      period: '2023 – 2024',
      subtitle: 'Kampus Mengajar · LearningX · Ruangguru Camp',
      description:
        'Participated in Kampus Mengajar and LearningX Independent Study in 2023, followed by the Ruangguru Camp in 2024 to sharpen practical full-stack engineering skills.',
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
        <title>About — Randy Ardiansyah</title>
        <meta
          name="description"
          content="I'm Randy, a software engineer and digital realist exploring modern web architecture and AI workflows."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="Randy Ardiansyah"
        pageSubtitle="Self-taught digital explorer, software engineer, and grounded realist crafting calm, high-impact digital systems."
        breadcrumbCategory="About & Dossier"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={activeTab === 'journey' ? searchQuery : undefined}
        onSearchChange={activeTab === 'journey' ? setSearchQuery : undefined}
        searchPlaceholder="Filter milestones..."
      >
        {/* TAB 1: PROFILE DOSSIER (2-column key-value layout matching reference screenshot) */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Key-Value Rows */}
            <div className="divide-y divide-black/10 dark:divide-white/10">
              <div className="py-4 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400">
                  Full Name
                </div>
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#18181B] dark:text-zinc-200 font-medium">
                    Randy
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#18181B] dark:text-zinc-200 font-medium">
                    Ardiansyah
                  </div>
                </div>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400">
                  Contact Email
                </div>
                <div className="md:col-span-8">
                  <a
                    href="mailto:randyeef00@gmail.com"
                    className="block px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 hover:border-[#E84634]/60 text-xs sm:text-sm text-[#18181B] dark:text-zinc-100 transition-colors"
                  >
                    randyeef00@gmail.com
                  </a>
                </div>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400">
                  Handle &amp; Publication
                </div>
                <div className="md:col-span-8">
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#18181B] dark:text-zinc-300">
                    <span>@randyeef · The Late 20s</span>
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  </div>
                </div>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400 pt-1">
                  Manifesto
                </div>
                <div className="md:col-span-8">
                  <div className="px-4 py-3 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#3F3F46] dark:text-zinc-300 leading-relaxed">
                    Diving deeper into the process, embracing discomfort, and bending fate to create meaningful digital systems. Integrating AI into software craft without losing human calm.
                  </div>
                </div>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400 pt-1">
                  Current Focus
                </div>
                <div className="md:col-span-8 space-y-3.5">
                  <button
                    type="button"
                    onClick={() => setOpenToCollab(!openToCollab)}
                    className="w-full flex items-start gap-3 text-left cursor-pointer group"
                  >
                    <span
                      className={`mt-0.5 w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                        openToCollab ? 'bg-[#E84634]' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          openToCollab ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-[#18181B] dark:text-zinc-100">
                        Open for Software &amp; Product Collaborations
                      </div>
                      <div className="text-xs text-[#71717A] dark:text-zinc-500">
                        Full-stack web systems, architecture consulting, and interactive UI.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiWorkflows(!aiWorkflows)}
                    className="w-full flex items-start gap-3 text-left cursor-pointer group"
                  >
                    <span
                      className={`mt-0.5 w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                        aiWorkflows ? 'bg-[#E84634]' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          aiWorkflows ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-[#18181B] dark:text-zinc-100">
                        AI-Augmented Engineering &amp; Vibe Coding
                      </div>
                      <div className="text-xs text-[#71717A] dark:text-zinc-500">
                        Building intelligent pipelines and rapid product iterations with Gemini SDK.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <Link
                to="/projects"
                className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/12 bg-black/[0.03] dark:bg-white/[0.04] hover:border-[#E84634]/60 text-xs font-medium text-[#18181B] dark:text-zinc-200 transition-colors"
              >
                Explore Projects
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#0D0D0F] text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Start a Conversation</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: EXPERIENCE & ACADEMIC */}
        {activeTab === 'journey' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {milestones.map((m) => (
              <div
                key={m.num}
                className="rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 p-5 flex flex-col justify-between min-h-[185px]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-[#18181B] dark:text-zinc-200">{m.num}</span>
                    <span className="text-[#E84634] font-semibold">{m.period}</span>
                  </div>
                  <h3 className="text-xl font-serif-display font-bold text-[#18181B] dark:text-white mb-1">
                    {m.title}
                  </h3>
                  <div className="text-xs font-medium text-[#71717A] dark:text-zinc-400 mb-2">
                    {m.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-[#71717A] dark:text-zinc-500">
                  <span className="text-[#E84634] font-semibold">{m.tag}</span>
                  <span>Milestone</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: TECH STACK */}
        {activeTab === 'competencies' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                icon: Cpu,
                title: 'Frontend Architecture',
                desc: 'High-performance SPAs and SSR apps with typed interfaces, accessible components, and smooth 60fps canvas graphics.',
                stack: 'React 19 · TypeScript · Tailwind CSS · Next.js · Canvas'
              },
              {
                icon: Terminal,
                title: 'Backend & Microservices',
                desc: 'Scalable REST, gRPC, and WebSocket backends designed with rate-limiting, modular service boundaries, and caching.',
                stack: 'Node.js · Python FastAPI · Go · Express · Redis'
              },
              {
                icon: Database,
                title: 'Databases & Cloud',
                desc: 'Relational schema modeling, real-time NoSQL synchronization, time-series telemetry storage, and containerization.',
                stack: 'PostgreSQL · TimescaleDB · Firestore · Docker · CI/CD'
              },
              {
                icon: ShieldCheck,
                title: 'AI & Zero-Trust Security',
                desc: 'Integrating multimodal LLMs into operational workflows, WebAuthn biometrics, and secure RBAC policy layers.',
                stack: 'Gemini SDK · WebAuthn · JWT · Agentic Pipelines · RBAC'
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-[#E84634]">
                      <Icon size={16} />
                      <h3 className="font-serif-display font-bold text-lg text-[#18181B] dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-black/10 dark:border-white/10 text-[11px] font-mono text-[#71717A] dark:text-zinc-400">
                    {item.stack}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: IDENTITY ENGINE */}
        {activeTab === 'canvas' && <GenerativeParticleCanvas />}
      </BoardPageLayout>
    </>
  );
}
