import React, { useState } from 'react';
import { ViewState } from '../types';
import { Home, Search, Package, MoreHorizontal, User, LayoutGrid } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenCategories: () => void;
  onOpenSearch: () => void;
  isAuthenticated: boolean;
  onLogin: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  currentView, 
  onNavigate, 
  onOpenCategories, 
  onOpenSearch,
  isAuthenticated,
  onLogin
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moreItems = [
    { id: ViewState.PROFILE, icon: '👤', label: 'My Profile', desc: 'Archiver Dossier & Settings' },
    { id: ViewState.SOCIAL, icon: '💬', label: 'Social', desc: 'Archiver Community Gallery' },
    { id: ViewState.PRICE_ANOMALY, icon: '⚡', label: 'Global Reduction', desc: 'Limited Time Anomaly Active' },
    { id: ViewState.FAMOUS, icon: '🔥', label: 'Velocity Heat', desc: 'Real-time Demand Matrix' },
    { id: ViewState.GAME_SHOWROOM, icon: '🎮', label: 'Playroom', desc: 'Arcade Arena & Rewards' },
    { id: ViewState.PAY_FOR_ME, icon: '💸', label: 'Pay For Me', desc: 'External Sponsorship Protocol' },
    { id: ViewState.TRY_ON, icon: '🤳', label: 'AI Try On', desc: 'Spatial Materializer' },
    { id: ViewState.STYLIST, icon: '🧠', label: 'Neural Stylist', desc: 'AI Style Synthesis' },
    { id: ViewState.HALL_OF_FAME, icon: '🏆', label: 'Hall of Fame', desc: 'Apex Archiver Rankings' },
    { id: ViewState.CONTACT, icon: '🔌', label: 'Comms', desc: 'Direct Uplink Channel' },
  ];

  const NavItem = ({ id, icon: Icon, label, action, isActive }: any) => (
    <button
      onClick={action}
      className={`flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300 ${
        isActive ? 'text-[#005a64]' : 'text-zinc-400 hover:text-zinc-600'
      }`}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive && label === 'Home' ? 'currentColor' : 'none'} />
      <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <>
      {/* More Menu Overlay */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-[110] animate-in fade-in duration-500">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="absolute bottom-[100px] left-4 right-4 bg-black border border-white/10 p-10 shadow-3xl animate-in slide-in-from-bottom-10 duration-500 max-h-[75vh] overflow-y-auto scrollbar-hide rounded-[2rem]">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.5em]">Terminal Expansion</span>
                <div className="text-[8px] font-black text-zinc-800 uppercase tracking-[1em]">V2.5_STABLE</div>
              </div>
              <button 
                onClick={() => setIsMoreOpen(false)}
                className="w-12 h-12 bg-white text-black flex items-center justify-center text-xs font-black hover:bg-[#00D1FF] hover:text-white transition-all rounded-full"
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
                  className="flex items-center gap-8 p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#00D1FF]/30 transition-all text-left group rounded-2xl"
                >
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform rounded-xl">
                    {item.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-serif italic text-white group-hover:text-[#00D1FF] transition-colors">{item.label}</div>
                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.desc}</div>
                  </div>
                  <div className="text-zinc-800 group-hover:text-[#00D1FF] transition-colors font-serif italic text-2xl">→</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[120] pb-safe bg-white flex justify-around items-center rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] h-20 animate-in slide-in-from-bottom-full duration-700">
        {!isAuthenticated ? (
          <NavItem 
            id="LOGIN" 
            icon={User} 
            label="Login" 
            action={onLogin} 
            isActive={false} 
          />
        ) : (
          <NavItem 
            id={ViewState.CATEGORIES} 
            icon={LayoutGrid} 
            label="Category" 
            action={onOpenCategories} 
            isActive={currentView === ViewState.CATEGORIES} 
          />
        )}
        
        <NavItem 
          id="SEARCH" 
          icon={Search} 
          label="Search" 
          action={onOpenSearch} 
          isActive={false} 
        />

        {/* Floating Center Button - Now Home */}
        <div className="relative flex-1 flex justify-center h-full">
          <button
            onClick={() => onNavigate(ViewState.LOBBY)}
            className={`absolute -top-8 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-white ${
              currentView === ViewState.LOBBY ? 'bg-[#005a64] text-white' : 'bg-[#ffcc00] text-[#005a64]'
            }`}
          >
            <Home size={32} />
          </button>
          <span className={`absolute bottom-2 text-[10px] font-bold tracking-tight ${
            currentView === ViewState.LOBBY ? 'text-[#005a64]' : 'text-zinc-400'
          }`}>
            Home
          </span>
        </div>

        <NavItem 
          id={ViewState.BUNDLES} 
          icon={Package} 
          label="Kits" 
          action={() => onNavigate(ViewState.BUNDLES)} 
          isActive={currentView === ViewState.BUNDLES} 
        />

        <NavItem 
          id="MORE" 
          icon={MoreHorizontal} 
          label="More" 
          action={() => setIsMoreOpen(!isMoreOpen)} 
          isActive={isMoreOpen} 
        />
      </nav>
    </>
  );
};

export default BottomNav;