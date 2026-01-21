
import React from 'react';
import { UserStats, ViewState } from '../types';
import { USER_ACHIEVEMENTS } from '../data/extendedMock';

interface ProfileProps {
  stats: UserStats;
  onNavigate: (view: ViewState) => void;
  onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, onNavigate, onLogout }) => {
  const unlockedCount = USER_ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalProgress = Math.round((USER_ACHIEVEMENTS.reduce((acc, a) => acc + (a.progress / a.goal), 0) / USER_ACHIEVEMENTS.length) * 100);

  return (
    <div className="p-8 md:p-16 space-y-16 pb-40 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#EC4899] glow-text animate-pulse"></div>
             <span className="text-[10px] font-black text-[#EC4899] uppercase tracking-[0.4em]">Archiver Terminal</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">
            The <span className="text-white not-italic font-sans font-black uppercase glow-text">Dossier</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Identity Hash: CC_ARCH_0912 // Sector 7 Analysis</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-zinc-950 px-8 py-4 rounded-3xl border border-white/5 flex flex-col items-center min-w-[140px]">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Circuit Rank</span>
              <span className="text-2xl font-mono font-black text-[#EC4899]">LEVEL {unlockedCount + 1}</span>
           </div>
           <div className="bg-zinc-950 px-8 py-4 rounded-3xl border border-white/5 flex flex-col items-center min-w-[140px]">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Sync Completion</span>
              <span className="text-2xl font-mono font-black text-white">{totalProgress}%</span>
           </div>
        </div>
      </header>

      {/* Identity Overview */}
      <section className="glass p-10 md:p-16 rounded-[4rem] border-white/10 space-y-10 relative overflow-hidden group">
        {/* Background Visuals */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-[20rem] font-black text-white pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          {stats.selectedPath?.charAt(0) || 'C'}
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3.5rem] bg-gradient-to-tr from-[#EC4899] to-purple-600 p-1 shadow-[0_0_50px_rgba(236,72,153,0.3)]">
            <div className="w-full h-full bg-black rounded-[3.3rem] flex items-center justify-center text-6xl">
              {stats.selectedPath === 'VOID' ? '🌑' : stats.selectedPath === 'LUXE' ? '💎' : '⚡'}
            </div>
          </div>
          
          <div className="space-y-6 text-center md:text-left flex-1">
            <div className="space-y-1">
              <h2 className="text-4xl md:text-6xl font-serif italic text-white tracking-tight">
                {stats.selectedPath === 'VOID' ? 'The Void Minimalist' : stats.selectedPath === 'LUXE' ? 'The Ethereal Heir' : 'The Style Vanguard'}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                <span className="text-[#EC4899] text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-[#EC4899]/10 rounded-full border border-[#EC4899]/20">
                  Protocol: Active
                </span>
                <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-zinc-900 rounded-full border border-white/5">
                  Clearance: Tier_Alpha
                </span>
              </div>
            </div>
            
            <p className="text-zinc-500 text-xs md:text-sm font-medium uppercase tracking-tighter leading-relaxed max-w-xl italic">
              "Your silhouette choices have prioritized high-velocity heat and archival scarcity. Current trajectory suggests a shift toward the Void sector."
            </p>

            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="px-8 py-4 bg-zinc-900 text-zinc-400 border border-white/5 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white transition-all shadow-xl"
                >
                  Logout Terminal
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reputation Matrix Grid */}
      <section className="space-y-10">
        <div className="flex items-center gap-6">
          <h3 className="text-2xl font-serif italic text-white whitespace-nowrap">Reputation Matrix</h3>
          <div className="h-px w-full bg-zinc-900"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USER_ACHIEVEMENTS.map(ach => {
            const progressPercent = (ach.progress / ach.goal) * 100;
            return (
              <div 
                key={ach.id} 
                className={`relative group glass p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                  ach.unlocked 
                  ? 'border-[#EC4899]/30 bg-zinc-900/40' 
                  : 'border-white/5 bg-zinc-950/20 grayscale hover:grayscale-[0.5]'
                }`}
              >
                {/* Progress Bar Background */}
                <div className="absolute bottom-0 left-0 h-1 bg-zinc-900 w-full">
                   <div 
                     className={`h-full transition-all duration-1000 ${ach.unlocked ? 'bg-[#EC4899]' : 'bg-zinc-700'}`} 
                     style={{ width: `${progressPercent}%` }}
                   ></div>
                </div>

                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className={`text-4xl transition-transform duration-500 group-hover:scale-110 ${ach.unlocked ? 'drop-shadow-[0_0_10px_#EC4899]' : ''}`}>
                    {ach.unlocked ? ach.icon : '🔒'}
                  </div>
                  {ach.unlocked && (
                    <span className="text-[8px] font-black text-[#EC4899] uppercase tracking-widest border border-[#EC4899]/30 px-2 py-0.5 rounded">Unlocked</span>
                  )}
                </div>

                <div className="space-y-2 relative z-10">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-[#EC4899] transition-colors">
                    {ach.unlocked ? ach.title : 'Signal_Encrypted'}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight leading-relaxed line-clamp-2 italic">
                    {ach.unlocked || ach.progress > 0 ? ach.description : 'Analyze circuit to decrypt protocol requirements.'}
                  </p>
                </div>

                <div className="mt-8 flex justify-between items-center relative z-10">
                   <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Synchronization</div>
                   <div className="text-[10px] font-mono font-black text-zinc-400">
                     {ach.progress} <span className="text-zinc-700">/</span> {ach.goal}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Global Influence Section */}
      <section className="bg-red-950/10 border border-red-500/20 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl animate-pulse">📢</div>
          <div className="space-y-1">
            <h4 className="text-xl font-serif italic text-white">Market Influence</h4>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Your Rep Matrix accounts for 0.04% of global trend volatility.</p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(ViewState.FAMOUS)}
          className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#EC4899] hover:text-white transition-all shadow-xl"
        >
          Increase Influence
        </button>
      </section>
    </div>
  );
};

export default Profile;
