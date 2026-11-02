import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  CheckCircle2,
  Send,
  Globe,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BoardPageLayout, BoardTabItem } from '../components/BoardPageLayout';

export function Contact() {
  const [activeTab, setActiveTab] = useState<string>('compose');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3500);
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  const tabs: BoardTabItem[] = [
    { id: 'compose', label: 'Direct Dispatch', icon: Send },
    { id: 'channels', label: 'Channels & Socials', icon: Globe, badge: 4 },
    { id: 'scope', label: 'Collaboration Scope', icon: Sparkles, badge: 3 }
  ];

  return (
    <>
      <Helmet>
        <title>Contact — Randy | Collaboration Console</title>
        <meta
          name="description"
          content="Get in touch with Randy for software engineering projects, full-stack systems, or collaborations."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="Let's Connect"
        pageSubtitle="Open for software engineering collaborations, web systems, or technical conversations."
        breadcrumbCategory="Contact"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {showNotification && (
          <div className="mb-4 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md">
            <CheckCircle2 size={16} />
            <span>Message dispatched successfully! Randy will respond shortly.</span>
          </div>
        )}

        {activeTab === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Info Cards */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29]">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available for Projects</span>
                </div>
                <h3 className="text-2xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-2">
                  Direct Engineering &amp; Creative Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed mb-4">
                  Send a note regarding full-stack development, AI workflow integration, or creative web architecture.
                </p>

                <div className="space-y-2.5 pt-3 border-t border-[#E0DACE]/60 dark:border-[#332D29] text-xs">
                  <a
                    href="mailto:randyeef00@gmail.com"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#191614] hover:border-[#E84634] border border-transparent transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail size={15} className="text-[#E84634]" />
                      <span className="font-mono font-semibold text-[#2A2521] dark:text-[#F5F2EB]">
                        randyeef00@gmail.com
                      </span>
                    </div>
                    <ArrowUpRight size={13} className="text-[#E84634]" />
                  </a>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-[#191614]">
                    <MapPin size={15} className="text-[#E84634]" />
                    <span className="font-medium text-[#2A2521] dark:text-[#F5F2EB]">
                      Indonesia Bagian Selatan (UTC+7)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Message Form */}
            <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] p-5 sm:p-6">
              <h3 className="text-lg font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-4">
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[11px] font-mono uppercase tracking-wider text-[#6E655B] dark:text-[#A39B8F] mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF5] dark:bg-[#191614] border border-[#E0DACE] dark:border-[#332D29] focus:border-[#E84634] outline-none text-xs sm:text-sm text-[#2A2521] dark:text-[#F5F2EB]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-mono uppercase tracking-wider text-[#6E655B] dark:text-[#A39B8F] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="john@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF5] dark:bg-[#191614] border border-[#E0DACE] dark:border-[#332D29] focus:border-[#E84634] outline-none text-xs sm:text-sm text-[#2A2521] dark:text-[#F5F2EB]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[#6E655B] dark:text-[#A39B8F] mb-1.5"
                  >
                    Project Brief or Note
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Tell me about your project, timeline, or idea..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF5] dark:bg-[#191614] border border-[#E0DACE] dark:border-[#332D29] focus:border-[#E84634] outline-none text-xs sm:text-sm text-[#2A2521] dark:text-[#F5F2EB] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#E84634] hover:opacity-90 text-white font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Dispatching...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                num: '01',
                title: 'Electronic Mail',
                handle: 'randyeef00@gmail.com',
                href: 'mailto:randyeef00@gmail.com',
                icon: Mail,
                tag: 'Primary'
              },
              {
                num: '02',
                title: 'GitHub',
                handle: '@randyeef',
                href: 'https://github.com/randyeef',
                icon: Github,
                tag: 'Code & Open Source'
              },
              {
                num: '03',
                title: 'LinkedIn',
                handle: 'Randy Ardiansyah',
                href: '#',
                icon: Linkedin,
                tag: 'Professional Network'
              },
              {
                num: '04',
                title: 'Twitter / X',
                handle: '@randyeef',
                href: '#',
                icon: Twitter,
                tag: 'Thoughts & Updates'
              }
            ].map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.num}
                  href={ch.href}
                  target={ch.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[165px] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#6E655B] mb-3">
                      <span>{ch.num}</span>
                      <Icon size={16} className="text-[#E84634]" />
                    </div>
                    <h3 className="text-lg font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] group-hover:text-[#E84634]">
                      {ch.title}
                    </h3>
                    <p className="text-xs font-mono text-[#6E655B] dark:text-[#A39B8F] mt-1">
                      {ch.handle}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#E0DACE]/50 dark:border-[#2E2824] flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#E84634]/12 text-[#E84634] font-semibold">
                      {ch.tag}
                    </span>
                    <ArrowUpRight size={12} className="text-[#E84634]" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {activeTab === 'scope' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: '01',
                title: 'Full-Stack Web Systems',
                desc: 'End-to-end architecture using React 19, TypeScript, Node.js/Go, and cloud databases with responsive, high-craft UI.'
              },
              {
                num: '02',
                title: 'AI & Agentic Workflows',
                desc: 'Integrating multimodal LLMs, Gemini API pipelines, and intelligent automation into production products.'
              },
              {
                num: '03',
                title: 'Interactive & Editorial Web',
                desc: 'Custom HTML5 Canvas experiences, 3D shelves, generative shaders, and minimalist digital publications.'
              }
            ].map((s) => (
              <div
                key={s.num}
                className="rounded-xl bg-white dark:bg-[#211D1A] border border-[#E0DACE] dark:border-[#332D29] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[#E84634] mb-2">{s.num}</div>
                  <h3 className="text-xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('compose')}
                  className="mt-5 text-left text-xs font-mono font-bold uppercase tracking-wider text-[#E84634] hover:underline cursor-pointer"
                >
                  Inquire about {s.title} &rarr;
                </button>
              </div>
            ))}
          </div>
        )}
      </BoardPageLayout>
    </>
  );
}
