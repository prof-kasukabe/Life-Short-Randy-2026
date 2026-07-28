import React from 'react';
import { Github, Twitter, Linkedin, Instagram, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
            <span>&copy; {currentYear} Randy</span>
            <span className="text-orange-500 font-bold">&middot;</span>
            <span>All rights reserved.</span>
            <span className="text-zinc-300 dark:text-zinc-700">&middot;</span>
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors"
            >
              <Shield size={13} className="text-orange-500" />
              <span>Admin</span>
            </Link>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter size={19} />
            </a>
            <a href="#" className="text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              <span className="sr-only">GitHub</span>
              <Github size={19} />
            </a>
            <a href="#" className="text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin size={19} />
            </a>
            <a href="#" className="text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram size={19} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
