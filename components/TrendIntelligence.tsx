import React, { useState, useEffect } from 'react';
import { getTrendIntelligence } from '../services/geminiService';
import { TrendReport, UserStats } from '../types';

interface TrendIntelligenceProps {
  stats: UserStats;
}

const TrendIntelligence: React.FC<TrendIntelligenceProps> = ({ stats }) => {
  const [report, setReport] = useState<TrendReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const fetchTrends = async () => {
    setIsLoading(true);
    setScanProgress(0);
    try {
      const result = await getTrendIntelligence(stats.selectedPath || 'CYBER');
      setReport(result);
    } catch (error) {
      console.error("Trend sync failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [stats.selectedPath]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setScanProgress(prev => (prev < 98 ? prev + Math.random() * 5 : prev));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-40">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Global Market Intelligence</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter leading-tight">
          Trend <span className="text-white not-italic font-sans font-black uppercase glow-text">Oracle</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-md">
          Real-time analysis of global aesthetic volatility using Global Circuit Analysis.
        </p>
      </header>

      {isLoading ? (
        <div className="glass p-16 rounded-[4rem] border-white/5 space-y-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
          <div className="relative z-10 space-y-6">
            <div className="text-8xl animate-pulse">🛰️</div>
            <div className="space-y-4">
              <div className="text-[11px] font-black uppercase tracking-[1em] text-blue-400">Syncing_Satellite_Feeds</div>
              <div className="w-full max-w-md mx-auto h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" 
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-[8px] text-zinc-600 font-mono">Bypassing Regional Firewalls... {Math.floor(scanProgress)}%</p>
            </div>
          </div>
        </div>
      ) : report ? (
        <div className="space-y-10">
          <div className="glass p-10 md:p-16 rounded-[4rem] border-blue-500/20 shadow-[0_0_80px_rgba(59,130,246,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 text-blue-500/5 text-[20rem] font-serif italic pointer-events-none group-hover:scale-110 transition-transform duration-1000 select-none">T</div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">
                  Market Verdict: VERIFIED
                </span>
                <span className="text-zinc-700 text-[8px] uppercase tracking-widest font-mono">Timestamp: {new Date().toLocaleTimeString()}</span>
              </div>
              
              <div className="text-zinc-100 font-serif text-2xl md:text-3xl leading-relaxed italic whitespace-pre-line">
                &ldquo;{report.text}&rdquo;
              </div>

              <div className="h-px w-24 bg-blue-500/30"></div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Source Feeds</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {report.sources.map((src, i) => (
                    <a 
                      key={i} 
                      href={src.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group/link"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-xs group-hover/link:bg-blue-500/20 group-hover/link:text-blue-400 transition-colors">🌐</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">{src.title}</div>
                        <div className="text-[8px] text-zinc-600 truncate">{src.uri}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="text-4xl">💡</div>
              <div className="space-y-1">
                <h4 className="text-lg font-serif italic text-white">Actionable Intel</h4>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  These insights suggest high volatility in your sector. Scarcity multipliers may apply.
                </p>
              </div>
            </div>
            <button 
              onClick={fetchTrends}
              className="px-8 py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95"
            >
              Re-Scan Signal
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TrendIntelligence;