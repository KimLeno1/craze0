
import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenCategories: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onOpenCategories }) => {
  const items = [
    { id: ViewState.LOBBY, icon: '🏠', label: 'Home', action: () => onNavigate(ViewState.LOBBY) },
    { id: 'SECTORS', icon: '⊞', label: 'Sectors', action: onOpenCategories },
    { id: ViewState.TRENDS, icon: '🛰️', label: 'Intel', action: () => onNavigate(ViewState.TRENDS) },
    { id: ViewState.FAMOUS, icon: '🔥', label: 'Heat', action: () => onNavigate(ViewState.FAMOUS) },
    { id: ViewState.BUNDLES, icon: '🎁', label: 'Kits', action: () => onNavigate(ViewState.BUNDLES) },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] pb-safe px-4 py-4 glass border-t border-white/5 flex justify-around items-center rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-full duration-700">
      {items.map((item) => {
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
    </nav>
  );
};

export default BottomNav;
