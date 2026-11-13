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

const MAIN_BACKDROP_URL = '/assets/aistudio/965599976383598027_49586ffd.jpeg';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#D6D3CE] dark:bg-[#09090B] transition-colors duration-300">
          {/* Main Atmospheric Artwork Backdrop */}
          <div
            aria-hidden="true"
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-[1.01] pointer-events-none"
            style={{ backgroundImage: `url(${MAIN_BACKDROP_URL})` }}
          />
          <div
            aria-hidden="true"
            className="fixed inset-0 z-0 bg-gradient-to-b from-white/35 via-white/25 to-[#EAE6DF]/75 dark:from-black/45 dark:via-black/35 dark:to-[#09090B]/80 pointer-events-none transition-colors duration-300"
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
