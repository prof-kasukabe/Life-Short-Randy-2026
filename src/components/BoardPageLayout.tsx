import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  PanelLeftClose,
  PanelLeft,
  Search,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Bookmark,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
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

export function BoardPageLayout({
  pageTitle,
  pageSubtitle,
  breadcrumbCategory,
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Quick Search',
  headerRightSlot,
  stageRightSlot,
  sidebarExtraSlot,
  children
}: BoardPageLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const handleCycleTab = (dir: -1 | 1) => {
    if (tabs.length <= 1) return;
    const idx = tabs.findIndex((t) => t.id === activeTab);
    const nextIdx = (idx + dir + tabs.length) % tabs.length;
    onTabChange(tabs[nextIdx].id);
  };

  const viewportWidthClass =
    viewport === 'mobile'
      ? 'max-w-[430px]'
      : viewport === 'tablet'
      ? 'max-w-[880px]'
      : 'max-w-full';

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden px-3 sm:px-6 pb-3 sm:pb-5 pt-2 select-none">
      {/* Compact Top Headline & Viewport Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2.5 px-2 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-xl sm:text-2xl font-serif-display font-bold tracking-tight text-[#E84634] leading-none truncate">
            {pageTitle}
          </h1>
          <span className="hidden md:inline text-[#E84634]/35">·</span>
          <p className="hidden md:block text-xs font-sans-clean text-[#E84634]/80 truncate max-w-lg">
            {pageSubtitle}
          </p>
        </div>

        {/* Desktop / Tablet / Mobile Switcher Pill */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#E0DACE]/45 dark:bg-[#2A2420] border border-[#E0DACE] dark:border-[#3A332E] shrink-0">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-white dark:bg-[#1E1A18] text-[#E84634] shadow-sm font-semibold'
                : 'text-[#E84634]/65 hover:text-[#E84634]'
            }`}
          >
            <Monitor size={12} />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-white dark:bg-[#1E1A18] text-[#E84634] shadow-sm font-semibold'
                : 'text-[#E84634]/65 hover:text-[#E84634]'
            }`}
          >
            <Tablet size={12} />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-white dark:bg-[#1E1A18] text-[#E84634] shadow-sm font-semibold'
                : 'text-[#E84634]/65 hover:text-[#E84634]'
            }`}
          >
            <Smartphone size={12} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* OUTER BOARD-UI FRAME */}
      <div
        className={`flex-1 min-h-0 w-full ${viewportWidthClass} mx-auto rounded-[1.5rem] border border-[#E0DACE] dark:border-[#3A332E] bg-white/80 dark:bg-[#171412]/90 backdrop-blur-md shadow-xl flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Top Domain Tabs Bar */}
        <div className="h-12 px-3 sm:px-5 border-b border-[#E0DACE]/80 dark:border-[#2E2824] flex items-center justify-between gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0 bg-[#FAFAF5]/90 dark:bg-[#1B1815]">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E84634]/15 text-[#E84634] font-semibold ring-1 ring-[#E84634]/30'
                      : 'text-[#4A3F35]/75 dark:text-[#E0DACE]/70 hover:text-[#E84634] hover:bg-[#E84634]/5'
                  }`}
                >
                  <Icon size={13} className="text-[#E84634]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {headerRightSlot && <div className="flex items-center gap-2 shrink-0">{headerRightSlot}</div>}
        </div>

        {/* INNER 2-PANE WORKSPACE */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* LEFT SIDEBAR */}
          {sidebarOpen && viewport !== 'mobile' && (
            <aside className="w-56 lg:w-60 shrink-0 border-r border-[#E0DACE]/80 dark:border-[#2E2824] bg-[#F6F4EE]/90 dark:bg-[#1B1815]/90 flex flex-col justify-between p-3 select-none overflow-y-auto [&::-webkit-scrollbar]:hidden">
              <div className="space-y-3">
                {/* User Identity Row */}
                <div className="flex items-center justify-between px-1.5 py-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={avatarImg}
                      alt="Randy Ardiansyah"
                      className="w-6 h-6 rounded-full object-cover border border-[#E84634]/40 shrink-0"
                    />
                    <span className="text-xs font-semibold text-[#2A2521] dark:text-[#F5F2EB] truncate">
                      Randy Ardiansyah
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-md text-[#6E655B] hover:text-[#E84634] transition-colors cursor-pointer"
                    title="Collapse Sidebar"
                  >
                    <PanelLeftClose size={14} />
                  </button>
                </div>

                {/* Quick Search Bar */}
                {onSearchChange !== undefined && (
                  <div className="relative">
                    <Search
                      size={13}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6E655B]"
                    />
                    <input
                      type="text"
                      value={searchQuery || ''}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-[#EAE6DC]/70 dark:bg-[#25211E] border border-transparent focus:border-[#E84634]/40 text-xs text-[#2A2521] dark:text-[#F5F2EB] placeholder-[#6E655B] outline-none transition-all"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono px-1 py-0.5 rounded bg-white/80 dark:bg-[#171412] text-[#6E655B] border border-[#E0DACE] dark:border-[#3A332E]">
                      ⌘K
                    </span>
                  </div>
                )}

                {/* Sidebar Navigation List */}
                <nav className="space-y-0.5 pt-1">
                  {tabs.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#E84634] text-white shadow-xs font-semibold'
                            : 'text-[#4A3F35] dark:text-[#D8D0C5] hover:bg-[#EAE6DC]/70 dark:hover:bg-[#25211E]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon size={14} className={isActive ? 'text-white' : 'text-[#E84634]'} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#E0DACE]/70 dark:bg-[#2A2420] text-[#6E655B] dark:text-[#A39B8F]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {sidebarExtraSlot && <div className="pt-2">{sidebarExtraSlot}</div>}
              </div>

              {/* Bottom Sidebar Controls */}
              <div className="space-y-2.5 pt-3 mt-4 border-t border-[#E0DACE]/80 dark:border-[#2E2824]">
                <div className="inline-flex items-center p-0.5 rounded-full bg-[#EAE6DC] dark:bg-[#25211E] border border-[#E0DACE] dark:border-[#3A332E]">
                  <button
                    type="button"
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white text-[#E84634] shadow-2xs'
                        : 'text-[#6E655B] hover:text-[#E84634]'
                    }`}
                    aria-label="Light mode"
                  >
                    <Sun size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#171412] text-[#E84634] shadow-2xs'
                        : 'text-[#6E655B] hover:text-[#E84634]'
                    }`}
                    aria-label="Dark mode"
                  >
                    <Moon size={12} />
                  </button>
                </div>

                <div className="space-y-0.5 text-xs text-[#6E655B] dark:text-[#A39B8F]">
                  <Link
                    to="/bookmarks"
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:text-[#E84634] transition-colors"
                  >
                    <Bookmark size={13} />
                    <span>Bookmarks</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:text-[#E84634] transition-colors"
                  >
                    <Mail size={13} />
                    <span>Contact &amp; Collab</span>
                  </Link>
                </div>

                <a
                  href="https://open.spotify.com/playlist/4RflVxxz20wZ6RKGvVItp5?si=JUVlCAjzQ6ew20AQH2H7Wg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#231F1C] border border-[#E0DACE] dark:border-[#3A332E] hover:border-[#E84634]/60 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#E84634] text-white flex items-center justify-center font-serif-display font-bold text-sm shrink-0">
                      R.
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-[#2A2521] dark:text-[#F5F2EB] truncate">
                        Late20s · Spotify
                      </div>
                      <div className="text-[10px] text-[#6E655B] dark:text-[#A39B8F] truncate">
                        Curated by Randy
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={13}
                    className="text-[#6E655B] group-hover:text-[#E84634] shrink-0"
                  />
                </a>
              </div>
            </aside>
          )}

          {/* RIGHT MAIN WORKSPACE STAGE */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#FAFAF5] dark:bg-[#191614] overflow-hidden">
            {/* Stage Subheader */}
            <div className="px-4 sm:px-6 py-3 border-b border-[#E0DACE]/80 dark:border-[#2E2824] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white/60 dark:bg-[#1E1A18]/60">
              <div className="flex items-center gap-2.5">
                {(!sidebarOpen || viewport === 'mobile') && (
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="p-1.5 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] text-[#E84634] hover:bg-[#E84634]/10 transition-colors cursor-pointer"
                    title="Show Sidebar"
                  >
                    <PanelLeft size={14} />
                  </button>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6E655B] dark:text-[#A39B8F]">
                    <Link to="/" className="font-semibold text-[#E84634] hover:underline">
                      Randy.
                    </Link>
                    <span>&gt;</span>
                    <span>{breadcrumbCategory}</span>
                    <span>&gt;</span>
                    <span className="text-[#2A2521] dark:text-[#F5F2EB] font-medium">
                      {currentTab?.label}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-serif-display font-bold text-[#2A2521] dark:text-[#F5F2EB] leading-tight">
                    {currentTab?.label}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {stageRightSlot}

                {tabs.length > 1 && (
                  <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-[#E0DACE] dark:border-[#3A332E] bg-white dark:bg-[#24201D] text-xs font-medium text-[#2A2521] dark:text-[#F5F2EB]">
                    <button
                      type="button"
                      onClick={() => handleCycleTab(-1)}
                      className="p-0.5 text-[#6E655B] hover:text-[#E84634] transition-colors cursor-pointer"
                      aria-label="Previous tab"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="min-w-[95px] text-center text-[11px] font-semibold truncate">
                      {currentTab?.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCycleTab(1)}
                      className="p-0.5 text-[#6E655B] hover:text-[#E84634] transition-colors cursor-pointer"
                      aria-label="Next tab"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stage Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E84634]/25">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
