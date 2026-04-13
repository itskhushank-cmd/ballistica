/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import MarkingCatalog from './components/MarkingCatalog';
import BulletMatcher from './components/BulletMatcher';
import ExportButton from './components/ExportButton';
import { Microscope, Database, LayoutDashboard, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

type Tab = 'home' | 'marking' | 'matcher';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  // Shared state for export
  const [markingData, setMarkingData] = useState<any>(null);
  const [matcherData, setMatcherData] = useState<any>({
    filters: { caliber: '', lands: '', twist: '', landWidth: '' },
    results: []
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / height) * 100;
      const progressBar = document.getElementById("progress-bar");
      if (progressBar) progressBar.style.width = `${progress}%`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-lab-bg selection:bg-brand-primary/30">
      <div className="fixed top-0 left-0 h-1 bg-brand-primary z-[100] transition-all duration-150 shadow-[0_0_10px_#3b82f6]" id="progress-bar"></div>
      
      <Header />

      {/* Intelligence Dashboard Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6 h-full">
            <button
              onClick={() => setActiveTab('home')}
              className={cn(
                "relative h-full px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                activeTab === 'home' ? "text-brand-primary" : "text-lab-muted hover:text-white"
              )}
            >
              <HomeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
              {activeTab === 'home' && (
                <motion.div 
                  layoutId="nav-underline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary shadow-[0_0_10px_#3b82f6]" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('marking')}
              className={cn(
                "relative h-full px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                activeTab === 'marking' ? "text-brand-primary" : "text-lab-muted hover:text-white"
              )}
            >
              <Microscope className="w-4 h-4" />
              <span className="hidden sm:inline">🔬 Marking Catalog</span>
              {activeTab === 'marking' && (
                <motion.div 
                  layoutId="nav-underline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary shadow-[0_0_10px_#3b82f6]" 
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('matcher')}
              className={cn(
                "relative h-full px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                activeTab === 'matcher' ? "text-brand-primary" : "text-lab-muted hover:text-white"
              )}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">🎯 Bullet Matcher</span>
              {activeTab === 'matcher' && (
                <motion.div 
                  layoutId="nav-underline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary shadow-[0_0_10px_#3b82f6]" 
                />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-lab-muted uppercase tracking-wider">System Active</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Dashboard Header */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <LayoutDashboard className="w-5 h-5 text-brand-primary" />
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.3em]">Intelligence Dashboard</span>
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight text-white">
            {activeTab === 'home' ? 'Central Hub' : activeTab === 'marking' ? 'Visual Intelligence' : 'Data Intelligence'}
          </h2>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {activeTab === 'home' ? (
              <Home onNavigate={setActiveTab} />
            ) : activeTab === 'marking' ? (
              <MarkingCatalog onAnalysisComplete={setMarkingData} initialData={markingData} />
            ) : (
              <BulletMatcher onSearchUpdate={setMatcherData} initialData={matcherData} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Global Actions */}
        {activeTab !== 'home' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 flex justify-end"
          >
            <ExportButton 
              activeTab={activeTab} 
              data={activeTab === 'marking' ? { analysis: markingData } : matcherData} 
            />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
