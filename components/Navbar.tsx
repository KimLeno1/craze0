
import React from 'react';
import { UserStats, ViewState } from '../types';

interface NavbarProps {
  stats: UserStats;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  logoUrl: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, logoUrl }) => {
  const navItems = [
    { label: 'Shop', view: ViewState.FAMOUS, icon: '🛍️' },
    { label: 'Vault', view: ViewState.BUNDLES, icon: '🎁' },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => onNavigate(ViewState.LOBBY)}
        >
          <div className="relative">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-12 h-12 rounded-xl border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-12 h-12 bg-zinc-900 rounded-xl animate-pulse border border-white/5" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-serif italic tracking-tighter leading-none text-white">
              CLOSET<span className="text-[#EC4899] font-sans font-black not-italic ml-0.5">CRAZE</span>
            </div>
            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1">Est. 2025 • New Tokyo</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 items-center">
          {navItems.map((item) => (
            <button 
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`relative group px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                currentView === item.view ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-[#EC4899] transition-all duration-300 ${
                currentView === item.view ? 'opacity-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'
              }`}></span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => onNavigate(ViewState.PROFILE)}
            className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xl cursor-pointer hover:bg-[#EC4899]/10 transition-colors"
          >
            👤
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
