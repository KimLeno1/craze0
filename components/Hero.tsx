
import React from 'react';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <section className="relative h-[95vh] overflow-hidden flex items-center px-6 md:px-12 bg-black">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-40 filter grayscale scale-110" 
          alt="Fashion Model"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Season 01: The New Tokyo Drop</span>
        </div>
        
        <h1 className="text-7xl md:text-[11rem] font-serif italic leading-[0.8] tracking-tighter mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Command <br/><span className="not-italic font-sans font-black text-[#EC4899] glow-text uppercase">Attention.</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium mb-12 text-zinc-400 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          The high-fashion circuit doesn't wait. Secure your place in the archives with our most technical drop yet.
        </p>
        
        <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
          <button 
            onClick={onShopNow}
            className="px-14 py-6 bg-[#EC4899] text-white text-[11px] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(236,72,153,0.4)]"
          >
            Claim Yours
          </button>
          <button className="hidden md:block px-14 py-6 border border-white/20 text-white text-[11px] uppercase tracking-[0.4em] font-black hover:bg-white/10 transition-all">
            View Tiers
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden md:flex items-center gap-12 text-white/20 text-[10px] font-black uppercase tracking-[0.5em] rotate-90 origin-right">
        <span>Archives // 2025</span>
        <div className="w-24 h-[1px] bg-white/10"></div>
        <span>Authorized Personnel Only</span>
      </div>
    </section>
  );
};

export default Hero;
