import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Database, 
  Filter, 
  ChevronRight, 
  ShieldCheck, 
  Crosshair, 
  Target,
  Ruler,
  RotateCw,
  Zap
} from 'lucide-react';
import firearmsData from '../data/firearms.json';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Firearm {
  id: string;
  manufacturer: string;
  model: string;
  caliber: string;
  lands: number;
  grooves: number;
  twist: string;
  landWidth: number;
  notes: string;
}

interface BulletMatcherProps {
  onSearchUpdate: (data: any) => void;
  initialData?: any;
}

export default function BulletMatcher({ onSearchUpdate, initialData }: BulletMatcherProps) {
  const [filters, setFilters] = useState(initialData?.filters || {
    caliber: '',
    lands: '',
    twist: '',
    landWidth: ''
  });

  const [isSearching, setIsSearching] = useState(false);

  const results = useMemo(() => {
    if (!filters.caliber && !filters.lands && !filters.twist && !filters.landWidth) return [];
    
    return (firearmsData as Firearm[]).map(item => {
      let score = 0;
      let total = 0;

      if (filters.caliber) {
        total++;
        if (item.caliber.toLowerCase().includes(filters.caliber.toLowerCase())) score++;
      }
      if (filters.lands) {
        total++;
        if (item.lands === parseInt(filters.lands)) score++;
      }
      if (filters.twist) {
        total++;
        if (item.twist.toLowerCase() === filters.twist.toLowerCase()) score++;
      }
      if (filters.landWidth) {
        total++;
        const diff = Math.abs(item.landWidth - parseFloat(filters.landWidth));
        if (diff < 0.2) score++;
        else if (diff < 0.5) score += 0.5;
      }

      const matchPercentage = total > 0 ? Math.round((score / total) * 100) : 0;
      return { ...item, matchPercentage };
    }).filter(item => item.matchPercentage > 30)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [filters]);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchUpdate({ filters, results });
    }, 800);
  };

  return (
    <div className="space-y-12">
      {/* Search Interface */}
      <div className="glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
          <Database className="w-48 h-48 text-white" />
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-brand-primary/20 rounded-xl">
            <Filter className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Query Parameters</h3>
            <p className="text-[10px] text-brand-cyan uppercase font-bold tracking-widest">GRC Reference Library Access</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-lab-muted uppercase tracking-widest ml-1">Caliber</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lab-muted group-focus-within:text-brand-primary transition-colors">
                <Target className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. 9mm"
                className="lab-input w-full pl-12"
                value={filters.caliber}
                onChange={(e) => setFilters({ ...filters, caliber: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-lab-muted uppercase tracking-widest ml-1">Lands/Grooves</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lab-muted group-focus-within:text-brand-primary transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <input
                type="number"
                placeholder="e.g. 6"
                className="lab-input w-full pl-12"
                value={filters.lands}
                onChange={(e) => setFilters({ ...filters, lands: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-lab-muted uppercase tracking-widest ml-1">Twist Direction</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lab-muted group-focus-within:text-brand-primary transition-colors">
                <RotateCw className="w-4 h-4" />
              </div>
              <select
                className="lab-input w-full pl-12 appearance-none"
                value={filters.twist}
                onChange={(e) => setFilters({ ...filters, twist: e.target.value })}
              >
                <option value="">Select Twist</option>
                <option value="Right">Right</option>
                <option value="Left">Left</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-lab-muted uppercase tracking-widest ml-1">Land Width (mm)</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lab-muted group-focus-within:text-brand-primary transition-colors">
                <Ruler className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 2.5"
                className="lab-input w-full pl-12"
                value={filters.landWidth}
                onChange={(e) => setFilters({ ...filters, landWidth: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={isSearching}
            className="lab-button-primary min-w-[200px] relative overflow-hidden group"
          >
            {isSearching ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Execute Search</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Crosshair className="w-5 h-5 text-brand-cyan" />
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Intelligence Matches</h4>
          </div>
          <span className="text-[10px] font-mono text-lab-muted uppercase tracking-widest">
            {results.length} Potential Matches Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card-interactive p-6 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h5 className="text-xl font-black text-white group-hover:text-brand-primary transition-colors uppercase tracking-tight">{item.manufacturer} {item.model}</h5>
                      <p className="text-[10px] text-lab-muted uppercase font-bold tracking-widest mt-1">{item.manufacturer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-brand-primary">{item.matchPercentage}%</div>
                      <div className="text-[8px] text-lab-muted uppercase font-bold tracking-widest">Match Probability</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-lab-muted uppercase font-bold tracking-widest mb-1">Caliber</p>
                      <p className="text-sm font-bold text-white uppercase">{item.caliber}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-lab-muted uppercase font-bold tracking-widest mb-1">Lands</p>
                      <p className="text-sm font-bold text-white uppercase">{item.lands}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-lab-muted uppercase font-bold tracking-widest mb-1">Twist</p>
                      <p className="text-sm font-bold text-white uppercase">{item.twist}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-lab-muted uppercase font-bold tracking-widest mb-1">Land Width</p>
                      <p className="text-sm font-bold text-white uppercase">{item.landWidth}mm</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                      <span className="text-lab-muted">Confidence Index</span>
                      <span className="text-brand-primary">{item.matchPercentage}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.matchPercentage}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 glass-card flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-lab-muted" />
                </div>
                <p className="text-sm text-lab-muted uppercase tracking-[0.2em] font-bold">No Intelligence Data</p>
                <p className="text-xs text-slate-600 mt-2">Adjust your query parameters to find potential firearm matches.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
