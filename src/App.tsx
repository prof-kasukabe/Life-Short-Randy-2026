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

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}
