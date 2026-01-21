
import React, { useState } from 'react';

interface LandingScreenProps {
  onComplete: (archetype: string) => void;
  onAdminAccess?: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onComplete, onAdminAccess }) => {
  const [view, setView] = useState<'SPLASH' | 'AUTH'>('SPLASH');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);

  const handleAdminClick = () => {
    const nextClicks = adminClicks + 1;
    if (nextClicks >= 5) {
      onAdminAccess?.();
      setAdminClicks(0);
    } else {
      setAdminClicks(nextClicks);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simulate authentication delay
    setTimeout(() => {
      setIsAuthenticating(false);
      onComplete('CYBER'); // Default archetype after auth
    }, 1200);
  };

  if (view === 'SPLASH') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-50 scale-110 animate-[pulse_8s_infinite] blur-[2px]" 
            alt="Fashion Editorial" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        {/* Brand Content */}
        <div className="relative z-10 max-w-4xl space-y-12 animate-in fade-in zoom-in-95 duration-1000">
          <div className="space-y-4">
            <div className="inline-block px-6 py-2 border border-[#EC4899]/30 rounded-full bg-black/50 backdrop-blur-md mb-8">
              <span className="text-[10px] font-black text-[#EC4899] uppercase tracking-[0.6em]">Circuit Est. 2025</span>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-serif italic text-white leading-none tracking-tighter">
              CLOSET<br/>
              <span className="not-italic font-sans font-black text-white glow-text uppercase select-none">
                <span className="cursor-default" onClick={handleAdminClick}>C</span>RAZE
              </span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-lg font-medium uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed mt-6">
              The high-octane fashion circuit <br/> is now in session.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => setView('AUTH')}
              className="group relative px-20 py-8 bg-white text-black rounded-full font-black uppercase tracking-[0.5em] text-xs hover:bg-[#EC4899] hover:text-white transition-all shadow-2xl active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Enter the Circuit</span>
              <div className="absolute inset-0 bg-[#EC4899] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            <button 
              onClick={() => onAdminAccess?.()}
              className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.4em] px-10 py-5 border border-white/10 rounded-full hover:bg-white/5 transition-all active:scale-95"
            >
              Terminal Access
            </button>
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute bottom-10 left-10 text-[8px] font-black uppercase tracking-[0.5em] text-zinc-700 hidden md:block">AUTHORIZED ACCESS ONLY // SECTOR_01</div>
        <div className="absolute bottom-10 right-10 text-[8px] font-black uppercase tracking-[0.5em] text-zinc-700 hidden md:block">CC_PROTO_v2.5</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#020202] flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-700">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-20 scale-105 blur-sm" 
          alt="Fashion Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-transparent"></div>
      </div>

      {/* Floating Particles/Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EC4899]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>

      {/* Auth Panel Card */}
      <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-12 duration-700">
        <div className="bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-black/50">
          
          {/* Brand Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif italic text-white leading-none tracking-tighter mb-4">
              CLOSET<br/>
              <span className="not-italic font-sans font-black text-white glow-text uppercase select-none">
                <span className="cursor-default" onClick={handleAdminClick}>C</span>RAZE
              </span>
            </h1>
            <div className="h-px w-12 bg-[#EC4899] mx-auto mt-6 mb-4"></div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Identity Authentication Required</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-black/50 p-1.5 rounded-2xl mb-10 border border-white/5">
            <button 
              onClick={() => setAuthMode('LOGIN')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'LOGIN' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthMode('SIGNUP')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'SIGNUP' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <label className="absolute left-6 -top-2 px-2 bg-[#0a0a0c] text-[8px] font-black text-zinc-500 uppercase tracking-widest z-10 group-focus-within:text-[#EC4899] transition-colors">
                  Identity Handle
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="name@archivers.net"
                  className="w-full bg-transparent border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:outline-none focus:border-[#EC4899] transition-all placeholder:text-zinc-800"
                />
              </div>

              <div className="relative group">
                <label className="absolute left-6 -top-2 px-2 bg-[#0a0a0c] text-[8px] font-black text-zinc-500 uppercase tracking-widest z-10 group-focus-within:text-[#EC4899] transition-colors">
                  Security Phrase
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:outline-none focus:border-[#EC4899] transition-all placeholder:text-zinc-800"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isAuthenticating}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all shadow-xl active:scale-95 overflow-hidden group relative ${
                isAuthenticating ? 'bg-zinc-900 text-zinc-600' : 'bg-white text-black hover:bg-[#EC4899] hover:text-white'
              }`}
            >
              <span className="relative z-10">
                {isAuthenticating ? 'Decrypting...' : authMode === 'LOGIN' ? 'Initialize Uplink' : 'Register Profile'}
              </span>
              {!isAuthenticating && (
                <div className="absolute inset-0 bg-[#EC4899] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setView('SPLASH')}
              className="text-zinc-700 hover:text-white text-[8px] font-black uppercase tracking-[0.5em] transition-colors"
            >
              ← Return to Main Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
