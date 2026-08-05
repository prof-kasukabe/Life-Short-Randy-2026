import React, { useState } from 'react';
import { Mail, MapPin, Github, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      // Reset form
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <Helmet>
        <title>Contact - Randy</title>
        <meta name="description" content="Get in touch with me for freelance projects or full-time opportunities." />
      </Helmet>
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 bg-orange-600 text-white px-6 py-3 rounded-full shadow-xl">
            <CheckCircle2 size={20} className="text-white" />
            <span className="font-semibold text-sm">Message sent successfully!</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E07A5F] dark:text-[#E07A5F] mb-2 block">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-[#2C241B] dark:text-[#FDFBF7] flex items-center gap-3">
            <Mail className="text-[#E07A5F]" size={40} />
            Let's Connect<span className="text-[#E07A5F]">.</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 max-w-md leading-relaxed">
            I'm currently open for interesting collaborations, web projects, or technical conversations. 
            Send a note and I'll respond as soon as possible!
          </p>

          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group">
              <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full">
                <Mail size={20} />
              </div>
              <a href="mailto:randyeef00@gmail.com" className="text-lg font-medium">randyeef00@gmail.com</a>
            </div>
            <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
              <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full">
                <MapPin size={20} />
              </div>
              <span className="text-lg font-medium">Indonesia Bagian Selatan</span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">Follow &amp; Join</h2>
            <div className="flex gap-3">
              <a href="#" className="p-3 bg-zinc-100 dark:bg-zinc-900/80 rounded-full hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800/60">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-3 bg-zinc-100 dark:bg-zinc-900/80 rounded-full hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800/60">
                <Github size={18} />
              </a>
              <a href="#" className="p-3 bg-zinc-100 dark:bg-zinc-900/80 rounded-full hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800/60">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 lg:p-10 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-zinc-50">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none text-sm"
                placeholder="How can I help you?"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-orange-500/25 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
