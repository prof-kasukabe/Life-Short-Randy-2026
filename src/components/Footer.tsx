import React from 'react';
import { Github, Twitter, Linkedin, Instagram, Code2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E0DACE] dark:border-[#3A332E] py-12 px-6 sm:px-8 lg:px-12 bg-[#FAFAF5]/60 dark:bg-[#1E1A18]/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs sm:text-sm text-[#E84634]">
          <span className="font-serif-display font-bold text-base">Randy.</span>
          <span className="hidden sm:inline text-[#E84634]/40" aria-hidden="true">&middot;</span>
          <span className="font-sans-clean font-medium">Software Engineer &amp; Digital Realist</span>
          <span className="hidden sm:inline text-[#E84634]/40" aria-hidden="true">&middot;</span>
          <span className="text-[#E84634]/70">&copy; {currentYear} All rights reserved.</span>
        </div>

        {/* Quick Nav Links */}
        <nav aria-label="Footer Navigation" className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs font-serif-display uppercase tracking-widest text-[#E84634]/80">
          <Link to="/projects" className="hover:text-[#E84634] transition-colors">
            IT Projects
          </Link>
          <Link to="/curated" className="hover:text-[#E84634] transition-colors">
            Curated Space
          </Link>
          <Link to="/about" className="hover:text-[#E84634] transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-[#E84634] transition-colors">
            Contact
          </Link>
          <Link to="/admin" className="hover:text-[#E84634] transition-colors flex items-center gap-1 opacity-70 hover:opacity-100">
            <Shield size={12} />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Social Icons */}
        <div className="flex space-x-5 text-[#E84634]/70">
          <a 
            href="https://github.com/randyeef" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#E84634] transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={18} />
          </a>
          <a 
            href="#" 
            className="hover:text-[#E84634] transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={18} />
          </a>
          <a 
            href="#" 
            className="hover:text-[#E84634] transition-colors"
            aria-label="Twitter / X Profile"
          >
            <Twitter size={18} />
          </a>
          <a 
            href="#" 
            className="hover:text-[#E84634] transition-colors"
            aria-label="Instagram Profile"
          >
            <Instagram size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
}
