import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Menu, X, Home, User, Palette, BookOpen, PlaySquare, Bookmark, Mail, Settings } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: User },
    { name: 'Curated', path: '/curated', icon: Palette },
    { name: 'Reading List', path: '/blog', icon: BookOpen },
    { name: 'Media', path: '/media', icon: PlaySquare },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF5]/90 dark:bg-[#1E1A18]/90 backdrop-blur-md border-b border-[#E0DACE] dark:border-[#3A332E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-1 justify-between items-center w-full">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-serif-display uppercase tracking-widest transition-all ${
                    isActive
                      ? 'text-[#E84634] font-bold'
                      : 'text-[#E84634]/70 hover:text-[#E84634]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#E84634]/70 hover:text-[#E84634] transition-colors ml-4"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Header (Shows Logo since links are hidden) */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <NavLink to="/" className="text-2xl font-serif-display tracking-tight text-[#E84634] flex items-center gap-1 group">
              Randy.
            </NavLink>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-[#E84634]/70 hover:text-[#E84634] transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </button>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-[#E84634]/70 hover:text-[#E84634] transition-colors"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#4A3F35]/10 dark:border-[#FDFBF7]/10 bg-[#FDFBF7]/95 dark:bg-[#1E1A18]/95 backdrop-blur-lg">
          <div className="px-3 pt-3 pb-4 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E07A5F]/10 text-[#E84634] font-semibold'
                      : 'text-[#E84634]/80 dark:text-[#E84634]/80 hover:bg-[#4A3F35]/5 dark:hover:bg-[#FDFBF7]/5'
                  }`
                }
              >
                <link.icon size={18} />
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
