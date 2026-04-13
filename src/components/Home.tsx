import React from 'react';
import { Microscope, Database, ArrowRight, Shield, Target, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (tab: 'marking' | 'matcher') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative space-y-12 py-6 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-5xl mx-auto relative z-10 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-brand-cyan text-[10px] font-bold uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(34,211,238,0.1)] animate-pulse"
        >
          <Cpu className="w-3.5 h-3.5" />
          Neural-Link Vision Active
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
          >
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text text-glow">
              Ballistica
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-sm text-lab-muted max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-[0.2em]">
              Forensic Pattern Recognition & Firearm Identification System
            </p>
          </motion.div>
        </div>
      </section>

      {/* Module Selection */}
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto relative z-10 px-4"
      >
        {/* Marking Catalog Card */}
        <motion.div
          variants={item}
          onClick={() => onNavigate('marking')}
          className="group relative glass-card-interactive p-10 flex flex-col h-full cursor-pointer overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 p-10 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500">
            <Microscope className="w-64 h-64 text-blue-400" />
          </div>
          
          <div className="mb-8 p-4 bg-blue-600 rounded-2xl w-fit shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform duration-500">
            <Microscope className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-black mb-4 text-white group-hover:text-brand-primary transition-colors uppercase tracking-tight">Marking Catalog</h2>
          <p className="text-base text-lab-muted mb-10 flex-1 leading-relaxed">
            Automated headstamp analysis using neural-link vision. Identify manufacturers and calibers with surgical precision.
          </p>
          
          <div className="flex items-center gap-3 text-xs text-brand-primary font-black uppercase tracking-widest group-hover:gap-5 transition-all duration-300">
            Initialize Vision Scanner <ArrowRight className="w-5 h-5" />
          </div>
          
          <div className="mt-10 grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[9px] text-lab-muted uppercase font-bold tracking-widest">Protocol</p>
              <p className="text-xs font-bold text-white uppercase">Visual ID // SCAN</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-lab-muted uppercase font-bold tracking-widest">Engine</p>
              <p className="text-xs font-bold text-white uppercase">Gemini 3 Flash</p>
            </div>
          </div>
        </motion.div>

        {/* Bullet Matcher Card */}
        <motion.div
          variants={item}
          onClick={() => onNavigate('matcher')}
          className="group relative glass-card-interactive p-10 flex flex-col h-full cursor-pointer overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 p-10 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500">
            <Database className="w-64 h-64 text-cyan-400" />
          </div>
          
          <div className="mb-8 p-4 bg-cyan-500 rounded-2xl w-fit shadow-lg shadow-cyan-500/40 group-hover:scale-110 transition-transform duration-500">
            <Database className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-black mb-4 text-white group-hover:text-brand-cyan transition-colors uppercase tracking-tight">Bullet Matcher</h2>
          <p className="text-base text-lab-muted mb-10 flex-1 leading-relaxed">
            Comprehensive GRC reference library. Cross-reference physical measurements against global forensic standards.
          </p>
          
          <div className="flex items-center gap-3 text-xs text-brand-cyan font-black uppercase tracking-widest group-hover:gap-5 transition-all duration-300">
            Query Intelligence DB <ArrowRight className="w-5 h-5" />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[9px] text-lab-muted uppercase font-bold tracking-widest">Database</p>
              <p className="text-xs font-bold text-white uppercase">GRC Standard</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-lab-muted uppercase font-bold tracking-widest">Records</p>
              <p className="text-xs font-bold text-white uppercase">12,000+ Verified</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Interactive Feature Bar */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="bg-slate-50 rounded-3xl p-8 flex flex-wrap items-center justify-around gap-8 border border-lab-border shadow-inner">
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-lab-text uppercase tracking-widest">Secure Analysis</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-lab-text uppercase tracking-widest">Precision Match</span>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-lab-text uppercase tracking-widest">Global Library</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
