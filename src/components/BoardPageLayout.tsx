import React from 'react';
import {
  Search,
  Mail,
  MapPin,
  BadgeCheck,
  BarChart3,
  ArrowUpRight,
  Disc3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';

export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export interface BoardTabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

interface BoardPageLayoutProps {
  pageTitle: string;
  pageSubtitle: string;
  breadcrumbCategory: string;
  tabs: BoardTabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;
  headerRightSlot?: React.ReactNode;
  stageRightSlot?: React.ReactNode;
  sidebarExtraSlot?: React.ReactNode;
  children: React.ReactNode;
}

const BANNER_RIDGE_URL = '/assets/aistudio/965599976383598027_49586ffd.jpeg';

export function BoardPageLayout({
  pageTitle,
  pageSubtitle,
  breadcrumbCategory,
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  headerRightSlot,
  stageRightSlot,
  sidebarExtraSlot,
  children
}: BoardPageLayoutProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-1 flex flex-col">
      {/* Centered Floating Atmospheric Profile Card */}
      <div className="w-full rounded-[1.5rem] sm:rounded-[1.75rem] bg-[#FAFAF7]/95 dark:bg-[#0D0D0F]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col">
        {/* 1. Inner Top Panoramic Banner */}
        <div className="p-2.5 sm:p-3.5 pb-0">
          <div className="relative h-32 sm:h-44 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black">
            <img
              src={BANNER_RIDGE_URL}
              alt="Renaissance scholars analyzing code on a laptop"
              className="w-full h-full object-cover object-[center_32%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

            {/* Subtle Page Context Label on Banner Right */}
            <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/80">
              {breadcrumbCategory}
            </div>
          </div>
        </div>

        {/* 2. Overlapping Avatar + Action Buttons Row */}
        <div className="px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4 relative z-10">
            {/* Avatar with Vermilion Accent Badge */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[4px] sm:border-[5px] border-[#FAFAF7] dark:border-[#0D0D0F] bg-zinc-900 shadow-lg">
                <img
                  src={avatarImg}
                  alt="Randy Ardiansyah"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                title="Active — The Late 20s"
                className="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E84634] border-[2.5px] border-[#FAFAF7] dark:border-[#0D0D0F] flex items-center justify-center shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
            </div>

            {/* Top-Right Compact Utility Buttons (Matches Screenshot Button Cluster) */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {headerRightSlot ? (
                headerRightSlot
              ) : (
                <>
                  <a
                    href="https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5?si=JUVlCAjzQ6ew20AQH2H7Wg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/12 bg-black/[0.03] dark:bg-white/[0.04] hover:border-[#1DB954]/60 text-xs font-medium text-[#18181B] dark:text-zinc-200 transition-colors"
                    title="Listen to Late20s on Spotify"
                  >
                    <Disc3 size={13} className="text-[#1DB954]" />
                    <span className="hidden sm:inline">Late20s</span>
                  </a>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/12 bg-black/[0.03] dark:bg-white/[0.04] hover:border-[#E84634]/60 text-xs font-medium text-[#18181B] dark:text-zinc-200 transition-colors"
                  >
                    <BarChart3 size={13} className="text-[#E84634]" />
                    <span>Projects</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/12 bg-[#18181B] dark:bg-white text-white dark:text-[#0D0D0F] hover:opacity-90 text-xs font-semibold transition-opacity"
                  >
                    <span>Connect</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* 3. Identity & Editorial Title Block */}
          <div className="mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-serif-display font-bold tracking-tight text-[#18181B] dark:text-white leading-none">
                {pageTitle === 'The Late 20s' ? 'Randy Ardiansyah' : pageTitle}
              </h1>
              <BadgeCheck size={18} className="text-[#E84634] shrink-0" />
              {pageTitle === 'The Late 20s' && (
                <span className="text-xs font-serif-display italic text-[#71717A] dark:text-zinc-400 ml-1">
                  — The Late 20s
                </span>
              )}
            </div>

            {/* Quiet Unboxed Inline Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#52525B] dark:text-zinc-400 mb-2.5">
              <a
                href="mailto:randyeef00@gmail.com"
                className="inline-flex items-center gap-1.5 hover:text-[#E84634] transition-colors"
              >
                <Mail size={13} className="opacity-75" />
                <span>randyeef00@gmail.com</span>
              </a>
              <span className="text-black/20 dark:text-white/20" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="opacity-75" />
                <span>Indonesia Bagian Selatan</span>
              </span>
            </div>

            {/* Subtitle / Domain Focus Line */}
            <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400 leading-relaxed max-w-2xl">
              {pageSubtitle}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono text-[#71717A] dark:text-zinc-500">
              <span>Software Engineering</span>
              <span aria-hidden="true">·</span>
              <span>Product Systems</span>
              <span aria-hidden="true">·</span>
              <span>AI Workflows</span>
            </div>
          </div>

          {/* 4. Crisp Underline Tab Bar + Right Search / Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-5 sm:gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`relative inline-flex items-center gap-1.5 pb-3 pt-1 text-xs sm:text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#18181B] dark:text-white font-semibold'
                        : 'text-[#71717A] dark:text-zinc-500 hover:text-[#18181B] dark:hover:text-zinc-300'
                    }`}
                  >
                    <Icon
                      size={14}
                      className={isActive ? 'text-[#E84634]' : 'opacity-70'}
                    />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono ${
                          isActive
                            ? 'text-[#E84634] font-bold'
                            : 'text-[#A1A1AA] dark:text-zinc-600'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E84634] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Inline Right Controls */}
            {(stageRightSlot || onSearchChange !== undefined) && (
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pb-2.5 shrink-0">
                {stageRightSlot}
                {onSearchChange !== undefined && (
                  <div className="relative flex-1 sm:w-52">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] dark:text-zinc-500"
                    />
                    <input
                      type="text"
                      value={searchQuery || ''}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/[0.04] dark:bg-[#161618] border border-black/10 dark:border-white/10 focus:border-[#E84634]/70 text-xs text-[#18181B] dark:text-zinc-200 placeholder-[#71717A] dark:placeholder-zinc-500 outline-none transition-colors"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Optional Secondary Filter Row */}
        {sidebarExtraSlot && (
          <div className="px-5 sm:px-8 pt-4">{sidebarExtraSlot}</div>
        )}

        {/* 5. Main Stage Body */}
        <div className="p-5 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
