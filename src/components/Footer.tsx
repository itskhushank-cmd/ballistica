import React from 'react';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
              <Shield className="w-5 h-5 text-brand-primary" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">Ballistica</span>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-[10px] font-bold text-lab-muted uppercase tracking-[0.5em] text-glow">
              Made by Isha, Bipna, and Khushank
            </p>
            <p className="text-[9px] text-slate-600 uppercase tracking-widest">
              Advanced Forensic Ballistics Intelligence Suite // v2.4.0
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-lab-muted hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </button>
            <button className="text-lab-muted hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </button>
            <button className="text-lab-muted hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-8 border-t border-white/5 w-full text-center">
            <p className="text-[8px] text-slate-700 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Ballistica Intelligence. All rights reserved. Proprietary forensic technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
