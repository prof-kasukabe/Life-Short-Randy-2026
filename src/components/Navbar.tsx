import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Moon,
  Sun,
  Menu,
  X,
  Home,
  User,
  Palette,
  BookOpen,
  PlaySquare,
  Bookmark,
  Mail,
  Code2,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import avatarImg from '../assets/images/avatar_male_icon_1785945271495.jpg';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: User },
    { name: 'Projects', path: '/projects', icon: Code2 },
    { name: 'Curated', path: '/curated', icon: Palette },
    { name: 'Reading', path: '/blog', icon: BookOpen },
    { name: 'Media', path: '/media', icon: PlaySquare },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Contact', path: '/contact', icon: Mail }
  ];

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4">
      <div className="max-w-5xl mx-auto rounded-2xl bg-white/80 dark:bg-[#0D0D0F]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg px-4 sm:px-5">
        <div className="flex items-center justify-between h-13 sm:h-14 gap-3">
          {/* Left: Minimalist Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src={avatarImg}
              alt="Randy Ardiansyah"
              className="w-7 h-7 rounded-full object-cover border border-[#E84634]/50 group-hover:scale-105 transition-transform"
            />
            <span className="text-lg font-serif-display font-bold tracking-tight text-[#18181B] dark:text-white">
              Randy<span className="text-[#E84634]">.</span>
            </span>
          </Link>

          {/* Center: Clean Typographic Nav Links */}
          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-[#E84634] dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#E84634]'
                      : 'text-[#52525B] dark:text-zinc-400 hover:text-[#18181B] dark:hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right: Quick Tools & Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/tools/dither"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-[#18181B] dark:text-zinc-200 hover:border-[#E84634]/60 hover:text-[#E84634] transition-colors"
            >
              <Sparkles size={12} className="text-[#E84634]" />
              <span>Lab</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-[#52525B] dark:text-zinc-300 hover:text-[#E84634] hover:border-[#E84634]/60 transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-[#18181B] dark:text-zinc-200 hover:text-[#E84634] transition-colors"
              aria-label="Open Menu"
            >
              {isOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-black/10 dark:border-white/10 py-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        isActive
                          ? 'bg-[#E84634] text-white border-[#E84634] font-semibold'
                          : 'bg-black/[0.02] dark:bg-white/[0.03] text-[#18181B] dark:text-zinc-200 border-black/10 dark:border-white/10'
                      }`
                    }
                  >
                    <Icon size={14} />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-black/10 dark:border-white/10 flex gap-2">
              <Link
                to="/tools/dither"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-medium bg-black/[0.04] dark:bg-white/[0.05] text-[#E84634]"
              >
                Dither Studio
              </Link>
              <Link
                to="/tools/scratch"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-medium bg-black/[0.04] dark:bg-white/[0.05] text-[#E84634]"
              >
                Creative Scratch
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
