import React, { useState } from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenCategories: () => void;
  onOpenSearch: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onOpenCategories, onOpenSearch }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const primaryItems = [
    { id: ViewState.LOBBY, icon: '🏠', label: 'Home', action: () => onNavigate(ViewState.LOBBY) },
    { id: 'SEARCH', icon: '🔍', label: 'Search', action: onOpenSearch },
    { id: 'SECTORS', icon: '⊞', label: 'Sectors', action: onOpenCategories },
    { id: ViewState.BUNDLES, icon: '🎁', label: 'Kits', action: () => onNavigate(ViewState.BUNDLES) },
  ];

  const moreItems = [
    { id: ViewState.PROFILE, icon: '👤', label: 'My Profile', desc: 'Archiver Dossier & Settings' },
    { id: ViewState.SOCIAL, icon: '📸', label: 'Circuit Feed', desc: 'Social Transmission Matrix' },
    { id: ViewState.FAMOUS, icon: '🔥', label: 'Velocity Heat', desc: 'Real-time Demand Matrix' },
    { id: ViewState.GAME_SHOWROOM, icon: '🎮', label: 'Playroom', desc: 'Arcade Arena & Rewards' },
    { id: ViewState.PAY_FOR_ME, icon: '💸', label: 'Pay For Me', desc: 'External Sponsorship Protocol' },
    { id: ViewState.TRY_ON, icon: '🤳', label: 'AI Try On', desc: 'Spatial Materializer' },
    { id: ViewState.HALL_OF_FAME, icon: '🏆', label: 'Hall of Fame', desc: 'Apex Archiver Rankings' },
    { id: ViewState.CONTACT, icon: '🔌', label: 'Comms', desc: 'Direct Uplink Channel' },
  ];

  return (
    <>
      {/* More Menu Overlay */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-[110] animate-in fade-in duration-500">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="absolute bottom-[100px] left-4 right-4 bg-black border border-white/10 p-10 shadow-3xl animate-in slide-in-from-bottom-10 duration-500 max-h-[75vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#EC4899] uppercase tracking-[0.5em]">Terminal Expansion</span>
                <div className="text-[8px] font-black text-zinc-800 uppercase tracking-[1em]">V2.5_STABLE</div>
              </div>
              <button 
                onClick={() => setIsMoreOpen(false)}
                className="w-12 h-12 bg-white text-black flex items-center justify-center text-xs font-black hover:bg-[#EC4899] hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as ViewState);
                    setIsMoreOpen(false);
                  }}
                  className="flex items-center gap-8 p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#EC4899]/30 transition-all text-left group"
                >
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-serif italic text-white group-hover:text-[#EC4899] transition-colors">{item.label}</div>
                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.desc}</div>
                  </div>
                  <div className="text-zinc-800 group-hover:text-[#EC4899] transition-colors font-serif italic text-2xl">→</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[120] pb-safe px-4 py-4 glass border-t border-white/5 flex justify-around items-center rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-full duration-700">
        {primaryItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative group flex-1 ${
                isActive ? 'text-[#EC4899] scale-110' : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              <span className={`text-xl mb-0.5 transition-transform duration-500 ${isActive ? 'translate-y-[-2px]' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#EC4899] rounded-full shadow-[0_0_12px_#EC4899] animate-pulse"></div>
              )}
            </button>
          );
        })}

        {/* The More Trigger */}
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative group flex-1 ${
            isMoreOpen ? 'text-[#EC4899] scale-110' : 'text-zinc-600 hover:text-zinc-300'
          }`}
        >
          <span className={`text-xl mb-0.5 transition-transform duration-500 ${isMoreOpen ? 'rotate-90 text-[#EC4899]' : 'group-hover:scale-110'}`}>
            {isMoreOpen ? '✕' : '⋯'}
          </span>
          <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] transition-opacity duration-500 ${isMoreOpen ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
            More
          </span>
          {isMoreOpen && (
            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#EC4899] rounded-full shadow-[0_0_12px_#EC4899] animate-pulse"></div>
          )}
        </button>
      </nav>
    </>
  );
};

export default BottomNav;