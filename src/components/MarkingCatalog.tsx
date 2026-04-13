import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Maximize2, 
  Zap,
  Terminal,
  Crosshair,
  Scan,
  Focus
} from 'lucide-react';
import { analyzeCartridgeImage } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
}

const HOTSPOTS: Hotspot[] = [
  { id: 'fp', x: 50, y: 50, label: 'Firing Pin Impression', description: 'The mark left by the firing pin striking the primer. Shape and depth can identify specific firearm models.' },
  { id: 'bf', x: 30, y: 40, label: 'Breech Face Marks', description: 'Microscopic striations transferred from the breech face to the cartridge case during firing.' },
  { id: 'ej', x: 75, y: 25, label: 'Ejector Marks', description: 'Marks created when the ejector pushes the spent cartridge case out of the firearm.' },
];

interface MarkingCatalogProps {
  onAnalysisComplete: (data: any) => void;
  initialData?: any;
}

export default function MarkingCatalog({ onAnalysisComplete, initialData }: MarkingCatalogProps) {
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(initialData?.analysis || null);
  const [error, setError] = useState<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [consoleText, setConsoleText] = useState<string[]>([]);

  const addToConsole = (text: string) => {
    setConsoleText(prev => [...prev, `> ${text}`].slice(-8));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError(null);
        addToConsole(`IMAGE LOADED: ${file.name.toUpperCase()}`);
        addToConsole("INITIALIZING NEURAL-LINK SCAN...");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  const analyzeImage = async () => {
    if (!image) return;

    setAnalyzing(true);
    setError(null);
    setConsoleText([]);
    addToConsole("ESTABLISHING SECURE CONNECTION...");
    
    try {
      addToConsole("EXTRACTING VISUAL FEATURES...");
      const base64Data = image.split(',')[1];
      
      const data = await analyzeCartridgeImage(base64Data);
      
      addToConsole("DECODING NEURAL PATTERNS...");
      
      setAnalysis(data);
      onAnalysisComplete({ image, analysis: data });
      addToConsole("ANALYSIS COMPLETE. INTEGRITY VERIFIED.");
    } catch (err) {
      setError("Analysis failed. Check system connection.");
      addToConsole("ERROR: NEURAL-LINK INTERRUPTED.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Scanner Panel */}
      <div className="lg:col-span-7 space-y-8">
        <div className="glass-card p-2 overflow-hidden relative group">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
            <Scan className="w-3 h-3 text-brand-cyan" />
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest">Scanner Viewport</span>
          </div>

          <div 
            {...getRootProps()} 
            className={cn(
              "relative aspect-[4/3] max-h-[400px] rounded-xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden",
              isDragActive ? "border-brand-primary bg-brand-primary/5" : "border-white/10 hover:border-white/30 bg-slate-900/50",
              image ? "border-none" : ""
            )}
          >
            <input {...getInputProps()} />
            
            {image ? (
              <div className="relative w-full h-full group/img">
                <img src={image} alt="Evidence" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
                
                {/* Scanner Beam */}
                {analyzing && <div className="scanner-line" />}
                
                {/* Hotspot Markers */}
                {analysis && !analyzing && HOTSPOTS.map((spot) => (
                  <motion.button
                    key={spot.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(spot);
                    }}
                    className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center z-30"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  >
                    <div className="absolute inset-0 bg-brand-primary/30 rounded-full animate-ping" />
                    <div className="relative w-4 h-4 bg-brand-primary rounded-full border-2 border-white shadow-[0_0_15px_#3b82f6] flex items-center justify-center">
                      <Focus className="w-2 h-2 text-white" />
                    </div>
                  </motion.button>
                ))}

                {/* Heatmap Overlay (Faked for visual) */}
                {analysis && !analyzing && (
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.5),transparent_70%)]" />
                )}
              </div>
            ) : (
              <div className="text-center p-12 space-y-6">
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 bg-brand-primary/10 rounded-full animate-pulse" />
                  <Upload className="w-10 h-10 text-brand-primary relative z-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-black text-white uppercase tracking-tight">Initialize Scanner</p>
                  <p className="text-sm text-lab-muted max-w-xs mx-auto">
                    Drop high-resolution evidence image or click to browse local storage
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-center gap-4">
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-lab-muted">JPG</div>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-lab-muted">PNG</div>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-lab-muted">RAW</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {image && !analysis && !analyzing && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={analyzeImage}
            className="lab-button-primary w-full py-4 text-sm"
          >
            <Zap className="w-4 h-4" />
            Execute Neural Analysis
          </motion.button>
        )}

        {/* Live Console */}
        <div className="glass-card p-6 bg-black/40 border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Analysis Console</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="font-mono text-[11px] space-y-1.5 min-h-[80px]">
            {consoleText.length === 0 && (
              <p className="text-slate-600 italic">Waiting for input...</p>
            )}
            {consoleText.map((line, i) => (
              <motion.p 
                key={i} 
                initial={{ opacity: 0, x: -5 }} 
                animate={{ opacity: 1, x: 0 }}
                className="terminal-text"
              >
                {line}
              </motion.p>
            ))}
            {analyzing && (
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-emerald-400 align-middle ml-1"
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Intelligence Panel */}
      <div className="lg:col-span-5 space-y-8">
        <AnimatePresence mode="wait">
          {analysis ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="glass-card p-8 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Crosshair className="w-32 h-32 text-white" />
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Intelligence Report</h3>
                  <div className="px-3 py-1 bg-brand-primary/20 border border-brand-primary/30 rounded-full">
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Match Confirmed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-lab-muted uppercase font-bold tracking-[0.2em]">Caliber Identification</p>
                    <p className="text-xl font-black text-white">{analysis.caliber || 'Unknown'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] text-lab-muted uppercase font-bold tracking-[0.2em]">Manufacturer</p>
                    <p className="text-xl font-black text-white">{analysis.manufacturer || 'Unknown'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-lab-muted uppercase font-bold tracking-[0.2em]">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.confidence || 0}%` }}
                            className="h-full bg-brand-primary shadow-[0_0_10px_#3b82f6]"
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-white">{analysis.confidence || 0}%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-lab-muted uppercase font-bold tracking-[0.2em]">Condition</p>
                      <p className="text-xs font-bold text-white uppercase">{analysis.condition || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] text-lab-muted uppercase font-bold tracking-[0.2em] mb-2">Executive Summary</p>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{analysis.summary}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Hotspot Details */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-4 h-4 text-brand-cyan" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Forensic Hotspots</h4>
                </div>
                
                <div className="space-y-3">
                  {HOTSPOTS.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => setActiveHotspot(spot)}
                      className={cn(
                        "w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between group",
                        activeHotspot?.id === spot.id 
                          ? "bg-brand-primary/10 border-brand-primary/30" 
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          activeHotspot?.id === spot.id ? "bg-brand-primary animate-pulse" : "bg-slate-600"
                        )} />
                        <span className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">{spot.label}</span>
                      </div>
                      <Maximize2 className="w-3 h-3 text-lab-muted group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card opacity-50">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-lab-muted" />
              </div>
              <p className="text-sm text-lab-muted uppercase tracking-[0.2em] font-bold">Awaiting Evidence Upload</p>
              <p className="text-xs text-slate-600 mt-2">Upload a headstamp image to begin automated forensic analysis.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Hotspot Modal */}
      <AnimatePresence>
        {activeHotspot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveHotspot(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-card p-8 max-w-md w-full shadow-[0_0_50px_rgba(59,130,246,0.2)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-brand-primary/20 rounded-xl">
                  <Focus className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{activeHotspot.label}</h3>
                  <p className="text-[10px] text-brand-cyan uppercase font-bold tracking-widest">Forensic Marker ID: {activeHotspot.id.toUpperCase()}</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-8">
                {activeHotspot.description}
              </p>
              <button
                onClick={() => setActiveHotspot(null)}
                className="lab-button-secondary w-full"
              >
                Close Viewport
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
