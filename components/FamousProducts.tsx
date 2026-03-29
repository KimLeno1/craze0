import React from 'react';
import { Product } from '../types';

interface FamousProductsProps {
  products: Product[];
  wishlist: string[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  limitedOfferEnd?: number | null;
}

const FamousProducts: React.FC<FamousProductsProps> = ({ 
  products, 
  wishlist,
  onProductClick, 
  onAddToCart,
  onToggleWishlist,
  limitedOfferEnd
}) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('');

  React.useEffect(() => {
    if (!limitedOfferEnd) return;
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.floor((limitedOfferEnd - Date.now()) / 1000));
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [limitedOfferEnd]);

  const sorted = [...products].sort((a, b) => {
    const scoreA = (a.hypeScore || 0) + (a.velocityScore || 0) + (a.isHallOfFame ? 100 : 0);
    const scoreB = (b.hypeScore || 0) + (b.velocityScore || 0) + (b.isHallOfFame ? 100 : 0);
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen bg-[#050505] animate-in fade-in duration-1000 pb-40">
      {/* Hero Header */}
      <header className="relative min-h-[50vh] md:h-[60vh] flex flex-col justify-center px-6 md:px-20 overflow-hidden border-b border-white/5 py-20 md:py-0">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]"></div>
          <img 
            src={sorted[0]?.image} 
            className="w-full h-full object-cover blur-3xl scale-110" 
            alt="Background" 
          />
        </div>

        <div className="relative z-10 space-y-6 md:space-y-8 max-w-5xl">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-[#00D1FF] text-[8px] font-black text-white uppercase tracking-[0.5em] animate-pulse">
              Live Matrix Active
            </div>
            <div className="h-px w-12 md:w-20 bg-white/20"></div>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] hidden sm:inline">Sector_Global_Synced</span>
          </div>
          
          <h1 className="text-6xl md:text-[12rem] font-serif italic text-white tracking-tighter leading-[0.8] mix-blend-difference">
            Velocity<span className="text-[#00D1FF] not-italic font-sans text-2xl md:text-4xl align-top ml-2 md:ml-4">Heat</span>
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 pt-4 md:pt-8">
            <p className="text-zinc-400 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] max-w-sm leading-relaxed">
              Real-time demand aggregation from the global archive. High heat indicates imminent de-materialization of physical stock.
            </p>
            <div className="flex gap-8 md:gap-10">
              <div className="space-y-1">
                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Active_Archivers</div>
                <div className="text-xl md:text-2xl font-mono text-white">1,204</div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">System_Load</div>
                <div className="text-xl md:text-2xl font-mono text-emerald-500">Nominal</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Premium List */}
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="divide-y divide-white/5">
          {sorted.map((p, idx) => (
            <div 
              key={p.id}
              className="group py-12 md:py-24 flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-16 items-start transition-all duration-700"
            >
              {/* Index & Heat Indicator */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6 w-full lg:w-auto">
                <div className="text-5xl md:text-7xl font-serif italic text-zinc-900 group-hover:text-white/10 transition-colors leading-none">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="space-y-2">
                  <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Heat_Index</div>
                  <div className="h-1 w-full bg-zinc-900 overflow-hidden rounded-full">
                    <div 
                      className="h-full bg-[#00D1FF] shadow-[0_0_10px_#00D1FF]" 
                      style={{ width: `${p.velocityScore}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] font-mono text-[#00D1FF]">{p.velocityScore}%</div>
                </div>
              </div>
              
              {/* Product Visual */}
              <div 
                className="lg:col-span-4 w-full aspect-[3/4] overflow-hidden bg-zinc-900 relative cursor-pointer rounded-3xl md:rounded-none"
                onClick={() => onProductClick(p)}
              >
                <img 
                  src={p.image} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out" 
                  alt={p.name}
                />
                {p.isHallOfFame && (
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-amber-500 text-black px-3 md:px-4 py-1 text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-2xl z-10">
                    Elite_Archive // Hall of Fame
                  </div>
                )}
                {p.price < p.originalPrice && (
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-red-600 text-white px-3 md:px-4 py-1 text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-2xl z-10 animate-pulse flex items-center gap-2">
                    <span>Sale</span>
                    {limitedOfferEnd && timeLeft && (
                      <span className="font-mono border-l border-white/20 pl-2">{timeLeft}</span>
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 md:p-8">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">View_Dossier</span>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="lg:col-span-6 space-y-6 md:space-y-10 w-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className="text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em]">{p.category}</span>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                    {p.appeal && (
                      <>
                        <span className="text-[9px] md:text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em]">{p.appeal}</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                      </>
                    )}
                    <span className="text-[9px] md:text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">{p.gender}</span>
                  </div>
                  
                  <h3 
                    className="text-4xl md:text-7xl font-serif italic text-white group-hover:text-[#00D1FF] transition-colors cursor-pointer leading-tight tracking-tighter" 
                    onClick={() => onProductClick(p)}
                  >
                    {p.name}
                  </h3>

                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                      {p.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-[7px] md:text-[8px] font-black text-orange-500 uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.3)]">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-zinc-500 text-xs md:text-sm font-medium leading-relaxed max-w-md line-clamp-2">
                  {p.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 md:pt-8 border-t border-white/5 gap-6">
                  <div className="space-y-1">
                    <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Acquisition_Cost</div>
                    <div className="flex items-baseline gap-3">
                      <div className="text-2xl md:text-3xl font-mono text-white">GH₵{p.price}</div>
                      {p.price < p.originalPrice && (
                        <div className="text-sm md:text-base font-mono text-zinc-700 line-through">GH₵{p.originalPrice}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => onAddToCart(p)}
                      className="flex-1 sm:flex-none h-14 md:h-16 px-8 md:px-12 bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] hover:bg-green-500 hover:text-white active:bg-green-700 transition-all active:scale-95"
                    >
                      Acquire
                    </button>
                    <button 
                      onClick={() => onToggleWishlist(p)}
                      className={`w-14 h-14 md:w-16 md:h-16 border transition-all flex items-center justify-center ${
                        wishlist.includes(p.id) 
                        ? 'bg-[#00D1FF] border-[#00D1FF] text-white' 
                        : 'border-white/10 text-zinc-500 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {wishlist.includes(p.id) ? '✦' : '✧'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamousProducts;