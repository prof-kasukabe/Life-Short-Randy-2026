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
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFBF7]/80 dark:bg-[#1E1A18]/80 backdrop-blur-md border-b border-[#4A3F35]/10 dark:border-[#FDFBF7]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-serif-display tracking-tight text-[#2C241B] dark:text-[#FDFBF7] flex items-center gap-1 group">
              Randy<span className="text-[#E07A5F] group-hover:scale-125 transition-transform inline-block">.</span>
            </NavLink>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#E07A5F] font-semibold'
                      : 'text-[#4A3F35]/70 dark:text-[#E8E2D9]/70 hover:text-[#E07A5F] dark:hover:text-[#E07A5F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon size={16} />
                    <span className="hidden xl:inline-block">{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E07A5F] rounded-full animate-in fade-in zoom-in duration-200" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#4A3F35]/70 hover:text-[#E07A5F] hover:bg-[#E07A5F]/10 dark:text-[#E8E2D9]/70 dark:hover:text-[#E07A5F] transition-colors ml-2 xl:ml-0"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#4A3F35]/70 hover:text-[#E07A5F] hover:bg-[#E07A5F]/10 dark:text-[#E8E2D9]/70 dark:hover:text-[#E07A5F] transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-[#4A3F35]/70 hover:text-[#E07A5F] dark:text-[#E8E2D9]/70 dark:hover:text-[#E07A5F] hover:bg-[#E07A5F]/10 transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
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
                      ? 'bg-[#E07A5F]/10 text-[#E07A5F] font-semibold'
                      : 'text-[#4A3F35]/80 dark:text-[#E8E2D9]/80 hover:bg-[#4A3F35]/5 dark:hover:bg-[#FDFBF7]/5'
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
