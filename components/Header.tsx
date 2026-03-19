
import React from 'react';
import { ViewState, UserStats, Page } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  notificationCount: number;
  stats: UserStats;
  onCartOpen: () => void;
  onNotificationOpen: () => void;
  onNavigatePage: (page: Page) => void;
  onNavigateView: (view: ViewState) => void;
  currentPage: Page;
  currentView: ViewState;
  dropTime: number;
  onOpenCategories?: () => void;
  theme?: 'dark' | 'light';
  rep: number;
  handle: string;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  wishlistCount,
  notificationCount,
  onCartOpen,
  onNotificationOpen,
  onNavigateView, 
  currentView,
  onOpenCategories,
  theme
}) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b h-16 md:h-20 px-4 md:px-10 flex items-center justify-between transition-colors duration-500 ${
      theme === 'dark' ? 'glass border-white/5' : 'bg-white/80 backdrop-blur-md border-zinc-200'
    }`}>
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onOpenCategories}
          className={`w-9 h-9 md:w-10 md:h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all group active:scale-95 ${
            theme === 'dark' ? 'glass border-white/10 hover:bg-white/5' : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200'
          }`}
        >
          <div className={`w-4 md:w-5 h-0.5 transition-colors ${theme === 'dark' ? 'bg-white group-hover:bg-[#1a73e8]' : 'bg-black group-hover:bg-[#1a73e8]'}`}></div>
          <div className={`w-2.5 md:w-3 h-0.5 self-start ml-2 md:ml-2.5 transition-colors ${theme === 'dark' ? 'bg-white group-hover:bg-[#1a73e8]' : 'bg-black group-hover:bg-[#1a73e8]'}`}></div>
        </button>

        <div onClick={() => onNavigateView(ViewState.LOBBY)} className="flex flex-col cursor-pointer group">
          <div className={`text-lg md:text-xl font-serif italic tracking-tighter leading-none group-hover:glow-text transition-all ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            CLOSET<span className="text-[#1a73e8] font-sans font-black not-italic ml-0.5">KRAZE</span>
          </div>
          <div className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500 mt-1">New Tokyo // v2.5</div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={onNotificationOpen}
          className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full border transition-all flex items-center justify-center ${
            theme === 'dark' ? 'border-white/10 text-zinc-500 hover:text-white' : 'border-zinc-200 text-zinc-400 hover:text-black'
          }`}
        >
          <span className="text-sm md:text-base">🔔</span>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-[#1a73e8] rounded-full text-[7px] md:text-[8px] font-black flex items-center justify-center text-white border border-black animate-pulse">{notificationCount}</span>
          )}
        </button>

        <button 
          onClick={() => onNavigateView(ViewState.WISHLIST)}
          className={`w-9 h-9 md:w-10 md:h-10 rounded-full border transition-all flex items-center justify-center ${
            currentView === ViewState.WISHLIST 
            ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') 
            : (theme === 'dark' ? 'border-white/10 text-zinc-500 hover:text-white' : 'border-zinc-200 text-zinc-400 hover:text-black')
          }`}
        >
          <span className="text-sm md:text-base">💖</span>
        </button>

        <button 
          onClick={onCartOpen}
          className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full border transition-all flex items-center justify-center active:scale-95 ${
            theme === 'dark' ? 'border-white/10 text-zinc-500 hover:text-white hover:bg-white/5' : 'border-zinc-200 text-zinc-400 hover:text-black hover:bg-zinc-100'
          }`}
        >
          <span className="text-base md:text-lg">🛍️</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-[#1a73e8] rounded-full text-[7px] md:text-[8px] font-black flex items-center justify-center text-white border border-black animate-pulse">{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Header;
