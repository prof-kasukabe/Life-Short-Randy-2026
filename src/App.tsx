/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Portfolio } from './pages/Portfolio';
import { ITProjects } from './pages/ITProjects';
import { Blog } from './pages/Blog';
import { Media } from './pages/Media';
import { Bookmarks } from './pages/Bookmarks';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { DitherTool } from './pages/DitherTool';
import { CreativeScratch } from './pages/CreativeScratch';

const MOUNTAIN_BACKDROP_URL =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#D6D3CE] dark:bg-[#09090B] transition-colors duration-300">
          {/* Atmospheric Monochrome Mountain Backdrop */}
          <div
            aria-hidden="true"
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat grayscale contrast-110 scale-[1.02] pointer-events-none"
            style={{ backgroundImage: `url(${MOUNTAIN_BACKDROP_URL})` }}
          />
          <div
            aria-hidden="true"
            className="fixed inset-0 z-0 bg-gradient-to-b from-white/55 via-white/35 to-[#EAE6DF]/85 dark:from-black/65 dark:via-black/50 dark:to-[#09090B]/90 backdrop-blur-[2px] pointer-events-none transition-colors duration-300"
          />

          {/* Foreground Shell */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<ITProjects />} />
                <Route path="/it-projects" element={<ITProjects />} />
                <Route path="/curated" element={<Portfolio />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/media" element={<Media />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/tools/dither" element={<DitherTool />} />
                <Route path="/tools/scratch" element={<CreativeScratch />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}
