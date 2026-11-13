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
  const [fastResponse, setFastResponse] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3500);
      (e.target as HTMLFormElement).reset();
    }, 700);
  };

  const tabs: BoardTabItem[] = [
    { id: 'compose', label: 'Direct Dispatch', icon: Send },
    { id: 'channels', label: 'Channels', icon: Globe, badge: 4 },
    { id: 'scope', label: 'Collaboration', icon: Sparkles, badge: 3 }
  ];

  return (
    <>
      <Helmet>
        <title>Contact — Randy Ardiansyah</title>
        <meta
          name="description"
          content="Get in touch with Randy for software engineering projects, full-stack systems, or collaborations."
        />
      </Helmet>

      <BoardPageLayout
        pageTitle="Let's Connect"
        pageSubtitle="Open for software engineering collaborations, full-stack web architectures, or thoughtful technical conversations."
        breadcrumbCategory="Contact"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {showNotification && (
          <div className="mb-5 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md">
            <CheckCircle2 size={16} />
            <span>Message dispatched successfully! Randy will respond shortly.</span>
          </div>
        )}

        {/* TAB 1: DIRECT DISPATCH (2-column form rows matching screenshot aesthetic) */}
        {activeTab === 'compose' && (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="divide-y divide-black/10 dark:divide-white/10">
              <div className="py-4 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label
                  htmlFor="firstName"
                  className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400"
                >
                  Full Name
                </label>
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    id="firstName"
                    type="text"
                    required
                    placeholder="First name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 focus:border-[#E84634] outline-none text-xs sm:text-sm text-[#18181B] dark:text-zinc-100 placeholder-[#71717A] dark:placeholder-zinc-500"
                  />
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last name (optional)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 focus:border-[#E84634] outline-none text-xs sm:text-sm text-[#18181B] dark:text-zinc-100 placeholder-[#71717A] dark:placeholder-zinc-500"
                  />
                </div>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <label
                  htmlFor="email"
                  className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400"
                >
                  Your Email
                </label>
                <div className="md:col-span-8">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 focus:border-[#E84634] outline-none text-xs sm:text-sm text-[#18181B] dark:text-zinc-100 placeholder-[#71717A] dark:placeholder-zinc-500"
                  />
                </div>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400">
                  Recipient
                </div>
                <div className="md:col-span-8">
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-[#52525B] dark:text-zinc-300">
                    <span>randyeef00@gmail.com · Indonesia (UTC+7)</span>
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  </div>
                </div>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <label
                  htmlFor="message"
                  className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400 pt-2"
                >
                  Message / Brief
                </label>
                <div className="md:col-span-8">
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Tell me about your project, timeline, or collaboration idea..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-[#161618] border border-black/10 dark:border-white/10 focus:border-[#E84634] outline-none text-xs sm:text-sm text-[#18181B] dark:text-zinc-100 placeholder-[#71717A] dark:placeholder-zinc-500 resize-none"
                  />
                </div>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4 text-xs font-medium text-[#52525B] dark:text-zinc-400">
                  Preferences
                </div>
                <div className="md:col-span-8">
                  <button
                    type="button"
                    onClick={() => setFastResponse(!fastResponse)}
                    className="flex items-start gap-3 text-left cursor-pointer"
                  >
                    <span
                      className={`mt-0.5 w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                        fastResponse ? 'bg-[#E84634]' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          fastResponse ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-[#18181B] dark:text-zinc-100">
                        Request Async Technical Follow-Up
                      </div>
                      <div className="text-xs text-[#71717A] dark:text-zinc-500">
                        Receive architecture notes and availability directly via email.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <button
                type="reset"
                className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/12 bg-black/[0.03] dark:bg-white/[0.04] hover:border-[#E84634]/60 text-xs font-medium text-[#18181B] dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-[#0D0D0F] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CHANNELS */}
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
                tag: 'Open Source'
              },
              {
                num: '03',
                title: 'LinkedIn',
                handle: 'Randy Ardiansyah',
                href: 'https://linkedin.com',
                icon: Linkedin,
                tag: 'Professional'
              },
              {
                num: '04',
                title: 'Location',
                handle: 'Indonesia (UTC+7)',
                href: 'mailto:randyeef00@gmail.com',
                icon: MapPin,
                tag: 'Remote Ready'
              }
            ].map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.num}
                  href={ch.href}
                  target={ch.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 hover:border-[#E84634] p-4 flex flex-col justify-between min-h-[160px] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#71717A] dark:text-zinc-500 mb-3">
                      <span>{ch.num}</span>
                      <Icon size={16} className="text-[#E84634]" />
                    </div>
                    <h3 className="text-lg font-serif-display font-bold text-[#18181B] dark:text-white group-hover:text-[#E84634]">
                      {ch.title}
                    </h3>
                    <p className="text-xs font-mono text-[#52525B] dark:text-zinc-400 mt-1">
                      {ch.handle}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#E84634] font-semibold">{ch.tag}</span>
                    <ArrowUpRight size={12} className="text-[#E84634]" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* TAB 3: COLLABORATION SCOPE */}
        {activeTab === 'scope' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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
                className="rounded-xl bg-black/[0.02] dark:bg-[#161618] border border-black/10 dark:border-white/10 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[#E84634] mb-2">{s.num}</div>
                  <h3 className="text-xl font-serif-display font-bold text-[#18181B] dark:text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400 leading-relaxed">
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
