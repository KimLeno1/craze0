import React, { useState } from 'react';
import { ViewState } from '../types';
import { Home, Search, LayoutGrid, Gift, MoreHorizontal, X, User, Camera, Flame, Gamepad2, Banknote, Smartphone, Trophy, Zap } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenCategories: () => void;
  onOpenSearch: () => void;
  isAuthenticated?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onOpenCategories, onOpenSearch, isAuthenticated }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moreItems = [
    { id: ViewState.PROFILE, icon: <User size={24} />, label: 'My Profile', desc: 'Archiver Dossier & Settings' },
    { id: ViewState.SOCIAL, icon: <Camera size={24} />, label: 'Circuit Feed', desc: 'Social Transmission Matrix' },
    { id: ViewState.FAMOUS, icon: <Flame size={24} />, label: 'Velocity Heat', desc: 'Real-time Demand Matrix' },
    { id: ViewState.GAME_SHOWROOM, icon: <Gamepad2 size={24} />, label: 'Playroom', desc: 'Arcade Arena & Rewards' },
    { id: ViewState.PAY_FOR_ME, icon: <Banknote size={24} />, label: 'Pay For Me', desc: 'External Sponsorship Protocol' },
    { id: ViewState.TRY_ON, icon: <Smartphone size={24} />, label: 'AI Try On', desc: 'Spatial Materializer' },
    { id: ViewState.HALL_OF_FAME, icon: <Trophy size={24} />, label: 'Hall of Fame', desc: 'Apex Archiver Rankings' },
    { id: ViewState.CONTACT, icon: <Zap size={24} />, label: 'Comms', desc: 'Direct Uplink Channel' },
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
          <div className="absolute bottom-[100px] left-4 right-4 bg-black border border-white/10 p-10 shadow-3xl animate-in slide-in-from-bottom-10 duration-500 max-h-[75vh] overflow-y-auto scrollbar-hide rounded-[2rem]">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#1a73e8] uppercase tracking-[0.5em]">Terminal Expansion</span>
                <div className="text-[8px] font-black text-zinc-800 uppercase tracking-[1em]">V2.5_STABLE</div>
              </div>
              <button 
                onClick={() => setIsMoreOpen(false)}
                className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-full hover:bg-[#1a73e8] hover:text-white transition-all"
              >
                <X size={18} strokeWidth={3} />
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
                  className="flex items-center gap-8 p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#1a73e8]/30 transition-all text-left group rounded-2xl"
                >
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#1a73e8] group-hover:scale-110 transition-transform rounded-xl">
                    {item.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-serif italic text-white group-hover:text-[#1a73e8] transition-colors">{item.label}</div>
                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.desc}</div>
                  </div>
                  <div className="text-zinc-800 group-hover:text-[#1a73e8] transition-colors font-serif italic text-2xl">→</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[120] pb-safe px-2 py-4 glass border-t border-white/5 flex justify-around items-center rounded-t-[2.5rem] md:rounded-t-[3.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-full duration-700 h-20">
        
        {/* Left Side Items */}
        <div className="flex flex-1 justify-around items-center">
          {isAuthenticated ? (
            <button
              onClick={onOpenCategories}
              className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative group ${
                currentView === ViewState.CATEGORIES ? 'text-[#1a73e8]' : 'text-white hover:text-zinc-300'
              }`}
            >
              <LayoutGrid size={22} strokeWidth={2.5} className={`transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${currentView === ViewState.CATEGORIES ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-opacity duration-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${currentView === ViewState.CATEGORIES ? 'opacity-100' : 'opacity-60'}`}>
                Sectors
              </span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate(ViewState.PROFILE)}
              className="flex flex-col items-center gap-1.5 transition-all duration-500 relative group text-white hover:text-[#1a73e8]"
            >
              <User size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              <span className="text-[8px] font-black uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100 transition-opacity drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Login
              </span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="flex flex-col items-center gap-1.5 transition-all duration-500 relative group text-white hover:text-zinc-300"
          >
            <Search size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
            <span className="text-[8px] font-black uppercase tracking-[0.15em] opacity-60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              Search
            </span>
          </button>
        </div>

        {/* Central Floating Button */}
        <div className="relative w-20 flex justify-center">
          <button
            onClick={() => onNavigate(ViewState.LOBBY)}
            className={`absolute -top-12 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_#1a73e866] hover:shadow-[0_0_40px_#1a73e899] hover:scale-110 active:scale-95 transition-all duration-500 group ${
              currentView === ViewState.LOBBY ? 'bg-[#1a73e8] text-white' : 'bg-white text-black'
            }`}
          >
            <Home size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-500" />
            <div className={`absolute -bottom-7 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
              currentView === ViewState.LOBBY ? 'text-[#1a73e8]' : 'text-white'
            }`}>
              Home
            </div>
          </button>
        </div>

        {/* Right Side Items */}
        <div className="flex flex-1 justify-around items-center">
          <button
            onClick={() => onNavigate(ViewState.BUNDLES)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative group ${
              currentView === ViewState.BUNDLES ? 'text-[#1a73e8]' : 'text-white hover:text-zinc-300'
            }`}
          >
            <Gift size={22} strokeWidth={2.5} className={`transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${currentView === ViewState.BUNDLES ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-opacity duration-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${currentView === ViewState.BUNDLES ? 'opacity-100' : 'opacity-60'}`}>
              Kits
            </span>
          </button>

          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative group ${
              isMoreOpen ? 'text-[#1a73e8]' : 'text-white hover:text-zinc-300'
            }`}
          >
            <MoreHorizontal size={22} strokeWidth={2.5} className={`transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${isMoreOpen ? 'rotate-90' : 'group-hover:scale-110'}`} />
            <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-opacity duration-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${isMoreOpen ? 'opacity-100' : 'opacity-60'}`}>
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;