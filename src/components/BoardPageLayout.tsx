import React from 'react';
import { Search, ArrowUpRight } from 'lucide-react';

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5">
      {/* 1. Minimalist Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#E84634] font-semibold">
            <span>{breadcrumbCategory}</span>
            <span className="opacity-40">/</span>
            <span className="text-[#7A7267] dark:text-[#9E9589]">Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold tracking-tight text-[#231F1C] dark:text-[#F5F2EB] leading-none">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E655B] dark:text-[#A39B8F] max-w-2xl leading-relaxed pt-1">
            {pageSubtitle}
          </p>
        </div>

        {/* Right Header Slot or Subtle Spotify Pill */}
        <div className="flex items-center gap-2.5 self-start md:self-end shrink-0">
          {headerRightSlot || (
            <a
              href="https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5?si=JUVlCAjzQ6ew20AQH2H7Wg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#221E1B] border border-[#E2DDD5] dark:border-[#2E2824] hover:border-[#E84634]/60 text-xs transition-all shadow-2xs group"
            >
              <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
              <span className="font-serif-display font-bold text-[#231F1C] dark:text-[#F5F2EB]">
                Late20s
              </span>
              <span className="text-[11px] text-[#7A7267] dark:text-[#9E9589]">Spotify</span>
              <ArrowUpRight
                size={12}
                className="text-[#7A7267] group-hover:text-[#E84634] transition-colors"
              />
            </a>
          )}
        </div>
      </div>

      {/* 2. Modern Figma-Style Unified Control Bar (Segmented Tabs + Search) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-2 rounded-2xl bg-[#F2EFE9]/90 dark:bg-[#211D1A] border border-[#E2DDD5] dark:border-[#2E2824]">
        {/* Segmented Domain Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-0.5 lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white dark:bg-[#161311] text-[#231F1C] dark:text-[#F5F2EB] font-semibold shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-[#6E655B] dark:text-[#A39B8F] hover:text-[#231F1C] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} className="text-[#E84634]" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-[#E84634]/15 text-[#E84634] font-bold'
                        : 'bg-black/5 dark:bg-white/5 text-[#7A7267] dark:text-[#9E9589]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Controls: Extra Filter Slot + Search Input */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
          {stageRightSlot}

          {onSearchChange !== undefined && (
            <div className="relative flex-1 sm:w-60">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7267] dark:text-[#9E9589]"
              />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#161311] border border-[#E2DDD5] dark:border-[#2E2824] focus:border-[#E84634] text-xs text-[#231F1C] dark:text-[#F5F2EB] placeholder-[#7A7267] outline-none transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Optional Secondary Pill Filter Bar (if sidebarExtraSlot provided) */}
      {sidebarExtraSlot && (
        <div className="px-1">{sidebarExtraSlot}</div>
      )}

      {/* 3. Main Responsive Stage Container */}
      <div className="w-full rounded-2xl sm:rounded-[1.5rem] bg-white/75 dark:bg-[#1D1917]/90 border border-[#E2DDD5] dark:border-[#2C2623] p-4 sm:p-6 shadow-xs">
        {children}
      </div>
    </div>
  );
}
