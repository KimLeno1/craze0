
import React from 'react';
import { ViewState, UserStats, Page } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  stats: UserStats;
  onCartOpen: () => void;
  onNavigatePage: (page: Page) => void;
  onNavigateView: (view: ViewState) => void;
  currentPage: Page;
  currentView: ViewState;
  dropTime: number;
  onOpenCategories?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  wishlistCount,
  onCartOpen,
  onNavigateView, 
  currentView,
  dropTime,
  onOpenCategories
}) => {
  const minutes = Math.floor(dropTime / 60);
  const seconds = dropTime % 60;

  const navItems = [
    { label: 'Heat', view: ViewState.FAMOUS },
    { label: 'Synergy Kits', view: ViewState.BUNDLES, highlight: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 glass z-50 border-b border-white/5">
      <div className="h-20 px-6 md:px-10 flex items-center justify-between">
        {/* Left: Identity & Desktop Nav */}
        <div className="flex items-center gap-8">
          <button 
            onClick={onOpenCategories}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 glass rounded-xl border-white/10 hover:bg-white/5 transition-all group active:scale-95"
          >
            <div className="w-5 h-0.5 bg-white group-hover:bg-[#EC4899] transition-colors"></div>
            <div className="w-5 h-0.5 bg-white group-hover:bg-[#EC4899] transition-colors"></div>
            <div className="w-3 h-0.5 bg-white group-hover:bg-[#EC4899] self-start ml-2.5 transition-colors"></div>
          </button>

          <div 
            className="flex flex-col cursor-pointer group"
            onClick={() => onNavigateView(ViewState.LOBBY)}
          >
            <div className="text-xl font-serif italic tracking-tighter leading-none text-white">
              CLOSET<span className="text-[#EC4899] font-sans font-black not-italic ml-0.5 glow-text">CRAZE</span>
            </div>
            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1">New Tokyo // V.2.5</div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 ml-4">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigateView(item.view)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                  currentView === item.view 
                    ? 'text-white' 
                    : 'text-zinc-500 hover:text-zinc-300'
                } ${item.highlight ? 'bg-white/5 px-4 rounded-full border border-white/10' : ''}`}
              >
                {item.label}
                {currentView === item.view && !item.highlight && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EC4899] shadow-[0_0_10px_#EC4899]"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Drop Timer */}
        <div className="hidden lg:flex flex-col items-center">
          <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest mb-1">Thermal Drop Window</span>
          <span className="text-sm font-mono font-bold text-white leading-none">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Wishlist Button */}
          <button 
            onClick={() => onNavigateView(ViewState.WISHLIST)}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all group ${
              currentView === ViewState.WISHLIST ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'
            }`}
          >
            <span className="text-lg">💖</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EC4899] rounded-full text-[8px] font-black flex items-center justify-center text-white border border-black shadow-[0_0_8px_#EC4899]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Profile Button */}
          <button 
            onClick={() => onNavigateView(ViewState.PROFILE)}
            className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-lg border transition-all ${
              currentView === ViewState.PROFILE ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'
            }`}
          >
            👤
          </button>

          {/* Cart Button */}
          <button 
            onClick={onCartOpen}
            className="group relative flex items-center gap-3 bg-white text-black px-5 py-2.5 rounded-full hover:bg-[#EC4899] hover:text-white transition-all shadow-xl active:scale-95"
          >
            <span className="text-sm">🛍️</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{cartCount}</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-black flex items-center justify-center text-white animate-bounce border-2 border-black">
                !
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
