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
    <header className="sticky top-0 z-50 bg-[#FAFAF7]/90 dark:bg-[#191614]/90 backdrop-blur-md border-b border-[#E2DDD5] dark:border-[#2C2623]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          {/* Left: Minimalist Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src={avatarImg}
              alt="Randy"
              className="w-7 h-7 rounded-full object-cover border border-[#E84634]/40 group-hover:scale-105 transition-transform"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif-display font-bold tracking-tight text-[#231F1C] dark:text-[#F5F2EB]">
                Randy<span className="text-[#E84634]">.</span>
              </span>
              <span className="hidden xl:inline-block text-[10px] font-mono uppercase tracking-widest text-[#7A7267] dark:text-[#9E9589]">
                Late 20s
              </span>
            </div>
          </Link>

          {/* Center: Clean Figma-Style Segmented Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#F0ECE4]/80 dark:bg-[#221E1B] border border-[#E2DDD5]/80 dark:border-[#2E2824]">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-[#191614] text-[#E84634] font-semibold shadow-2xs'
                      : 'text-[#5C544B] dark:text-[#B8AFA3] hover:text-[#231F1C] dark:hover:text-white'
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border border-[#E2DDD5] dark:border-[#2E2824] bg-white/70 dark:bg-[#221E1B] text-[#231F1C] dark:text-[#F5F2EB] hover:border-[#E84634] hover:text-[#E84634] transition-colors"
            >
              <Sparkles size={12} className="text-[#E84634]" />
              <span>Dither Lab</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[#E2DDD5] dark:border-[#2E2824] bg-white/70 dark:bg-[#221E1B] text-[#5C544B] dark:text-[#B8AFA3] hover:text-[#E84634] hover:border-[#E84634] transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full border border-[#E2DDD5] dark:border-[#2E2824] bg-white/70 dark:bg-[#221E1B] text-[#231F1C] dark:text-[#F5F2EB] hover:text-[#E84634] transition-colors"
              aria-label="Open Menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#E2DDD5] dark:border-[#2C2623] bg-[#FAFAF7] dark:bg-[#191614] px-4 pt-3 pb-5">
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
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      isActive
                        ? 'bg-[#E84634] text-white border-[#E84634] font-semibold'
                        : 'bg-white dark:bg-[#221E1B] text-[#231F1C] dark:text-[#F5F2EB] border-[#E2DDD5] dark:border-[#2E2824]'
                    }`
                  }
                >
                  <Icon size={15} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-[#E2DDD5] dark:border-[#2C2623] flex gap-2">
            <Link
              to="/tools/dither"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2 rounded-xl text-xs font-mono uppercase tracking-wider bg-[#F0ECE4] dark:bg-[#221E1B] text-[#E84634] font-semibold"
            >
              Dither Studio
            </Link>
            <Link
              to="/tools/scratch"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2 rounded-xl text-xs font-mono uppercase tracking-wider bg-[#F0ECE4] dark:bg-[#221E1B] text-[#E84634] font-semibold"
            >
              Creative Scratch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
