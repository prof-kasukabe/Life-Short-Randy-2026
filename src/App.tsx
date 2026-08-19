/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Portfolio } from './pages/Portfolio';
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
        <div className="flex flex-col min-h-screen bg-[#6E7B6D] dark:bg-[#2C302E] p-2 sm:p-6 md:p-10 transition-colors duration-300">
          <div className="flex-grow flex flex-col bg-[#FAFAF5] dark:bg-[#1E1A18] rounded-[2rem] overflow-hidden shadow-2xl relative w-full max-w-[1400px] mx-auto border border-[#E0DACE] dark:border-[#3A332E]">
            <Navbar />
            <main className="flex-grow">
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
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
            <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}
