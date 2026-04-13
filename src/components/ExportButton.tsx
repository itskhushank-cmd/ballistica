import React, { useState } from 'react';
import { FileDown, Eye, X, CheckCircle2, Shield, Printer, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';

interface ExportButtonProps {
  activeTab: 'marking' | 'matcher';
  data: any;
}

export default function ExportButton({ activeTab, data }: ExportButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = () => {
    setIsExporting(true);
    const doc = new jsPDF();
    
    const title = activeTab === 'marking' ? 'Forensic Headstamp Analysis Report' : 'GRC Reference Match Report';
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`System: Ballistica Forensic Intelligence`, 20, 37);
    
    if (activeTab === 'marking' && data.analysis?.analysis) {
      const analysis = data.analysis.analysis;
      doc.text(`Caliber: ${analysis.caliber}`, 20, 50);
      doc.text(`Manufacturer: ${analysis.manufacturer}`, 20, 57);
      doc.text(`Confidence: ${analysis.confidence}%`, 20, 64);
      doc.text(`Condition: ${analysis.condition}`, 20, 71);
      doc.text(`Summary: ${analysis.summary}`, 20, 78, { maxWidth: 170 });
    } else if (activeTab === 'matcher' && data.results) {
      doc.text(`Search Parameters:`, 20, 50);
      doc.text(`Caliber: ${data.filters.caliber || 'N/A'}`, 30, 57);
      doc.text(`Lands: ${data.filters.lands || 'N/A'}`, 30, 64);
      
      doc.text(`Top Matches:`, 20, 80);
      data.results.slice(0, 5).forEach((item: any, index: number) => {
        doc.text(`${index + 1}. ${item.manufacturer} ${item.model} (${item.matchPercentage}%)`, 30, 90 + (index * 7));
      });
    }

    doc.setFontSize(10);
    doc.text('Made by Isha, Bipna, and Khushank', 20, 280);
    
    doc.save(`ballistica_report_${Date.now()}.pdf`);
    
    setTimeout(() => {
      setIsExporting(false);
      setShowPreview(false);
    }, 1000);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPreview(true)}
        className="lab-button-secondary gap-3"
      >
        <Eye className="w-4 h-4" />
        Preview Intelligence Report
      </motion.button>

      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(59,130,246,0.2)]"
            >
              {/* Report Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-brand-primary/20 rounded-lg">
                    <Shield className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Report Preview</h3>
                    <p className="text-[10px] text-brand-cyan uppercase font-bold tracking-widest">Ballistica Intelligence Export</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-lab-muted" />
                </button>
              </div>

              {/* Report Content */}
              <div className="flex-1 overflow-y-auto p-12 bg-white text-slate-900 font-sans">
                <div className="max-w-2xl mx-auto space-y-12">
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8">
                    <div>
                      <h1 className="text-4xl font-black uppercase tracking-tighter">Ballistica</h1>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Forensic Intelligence System</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold uppercase">Official Report</p>
                      <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h2 className="text-xl font-black uppercase border-l-4 border-slate-900 pl-4">
                      {activeTab === 'marking' ? 'Visual Identification Analysis' : 'GRC Reference Library Results'}
                    </h2>

                    {activeTab === 'marking' ? (
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">Caliber</p>
                            <p className="text-lg font-bold">{data.analysis?.analysis?.caliber || 'N/A'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">Manufacturer</p>
                            <p className="text-lg font-bold">{data.analysis?.analysis?.manufacturer || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">Confidence</p>
                            <p className="text-lg font-bold">{data.analysis?.analysis?.confidence || 0}%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">Condition</p>
                            <p className="text-lg font-bold">{data.analysis?.analysis?.condition || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <p className="text-[10px] font-bold uppercase text-slate-500">Analysis Summary</p>
                          <p className="text-sm leading-relaxed italic text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            {data.analysis?.analysis?.summary || 'No analysis data available.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">Caliber</p>
                            <p className="text-sm font-bold">{data.filters.caliber || 'Any'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">Lands</p>
                            <p className="text-sm font-bold">{data.filters.lands || 'Any'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">Twist</p>
                            <p className="text-sm font-bold">{data.filters.twist || 'Any'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">Width</p>
                            <p className="text-sm font-bold">{data.filters.landWidth || 'Any'}mm</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-[10px] font-bold uppercase text-slate-500">Top Intelligence Matches</p>
                          <div className="space-y-2">
                            {data.results?.slice(0, 5).map((item: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-sm font-bold">{item.manufacturer} {item.model}</span>
                                <span className="text-sm font-mono font-bold text-blue-600">{item.matchPercentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-12 border-t border-slate-200 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold uppercase text-slate-400">Digital Signature</p>
                      <p className="text-[10px] font-mono text-slate-500">BALLISTICA-SECURE-ID-{Date.now()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-slate-900">Made by Isha, Bipna, and Khushank</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Footer Actions */}
              <div className="p-6 border-t border-white/10 bg-black/50 flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-lab-muted">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-lab-muted">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="lab-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={generatePDF}
                    disabled={isExporting}
                    className="lab-button-primary min-w-[180px]"
                  >
                    {isExporting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        Finalize & Export
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
