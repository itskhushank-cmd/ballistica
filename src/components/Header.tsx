import React from 'react';
import { Shield, Activity, Cpu } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl z-[60]">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-primary/20 blur-lg rounded-lg group-hover:bg-brand-primary/40 transition-all" />
            <div className="relative p-2 bg-white/5 border border-white/10 rounded-lg">
              <Shield className="w-5 h-5 text-brand-primary shadow-[0_0_10px_#3b82f6]" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase">
              Ballistica
            </h1>
            <p className="text-[9px] text-brand-cyan uppercase tracking-[0.3em] font-bold">
              Forensic Intelligence System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-lab-muted uppercase tracking-widest font-bold">Core Status</span>
              <span className="text-[10px] text-emerald-400 font-mono">ENCRYPTED // STABLE</span>
            </div>
            <div className="p-2 bg-white/5 border border-white/10 rounded-full">
              <Cpu className="w-4 h-4 text-lab-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
