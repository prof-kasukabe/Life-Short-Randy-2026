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

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#EAE6DF] dark:bg-[#12100E] p-2 sm:p-4 lg:p-6 transition-colors duration-300">
          <div className="flex-grow flex flex-col bg-[#FAFAF7] dark:bg-[#191614] rounded-2xl sm:rounded-[1.75rem] shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] relative w-full max-w-[1380px] mx-auto border border-[#E2DDD5] dark:border-[#2C2623] overflow-x-hidden">
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
