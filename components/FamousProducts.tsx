
import React from 'react';
import { Product } from '../types';

interface FamousProductsProps {
  products: Product[];
  wishlist: string[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
}

const FamousProducts: React.FC<FamousProductsProps> = ({ 
  products, 
  wishlist,
  onProductClick, 
  onAddToCart,
  onToggleWishlist
}) => {
  const sorted = [...products].sort((a, b) => b.velocityScore - a.velocityScore);

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in duration-500 pb-32 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter">Velocity <span className="text-[#EC4899] not-italic font-sans font-black uppercase glow-text">Heat</span></h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Algorithmic analysis of global demand per sector.</p>
        </div>
        <div className="bg-zinc-950 px-6 py-3 border border-white/5 rounded-2xl">
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Status</span>
          <span className="text-xs font-mono font-bold text-green-500 animate-pulse">● LIVE_FEED_SYNCED</span>
        </div>
      </header>

      <div className="space-y-4">
        {sorted.map((p, idx) => (
          <div 
            key={p.id}
            className="group glass p-6 rounded-[2rem] border-white/5 flex flex-col sm:flex-row items-center gap-8 hover:border-[#EC4899]/30 transition-all duration-500"
          >
            <div className="text-5xl font-serif italic text-zinc-900 group-hover:text-white transition-colors select-none">
              {String(idx + 1).padStart(2, '0')}
            </div>
            
            <div 
              className="w-32 aspect-square rounded-[1.5rem] overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
              onClick={() => onProductClick(p)}
            >
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>

            <div className="flex-1 space-y-4 cursor-pointer" onClick={() => onProductClick(p)}>
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">{p.name}</h3>
                <span className="text-[10px] bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20 px-2 py-1 rounded-full font-black">
                  POPULAR
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span>Velocity Heat</span>
                  <span className="text-[#EC4899]">{p.velocityScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#EC4899] to-purple-600 transition-all duration-1000" 
                    style={{ width: `${p.velocityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-white tracking-tighter">GH₵{p.price}</div>
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Authorized Price</div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleWishlist(p); }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                    wishlist.includes(p.id) ? 'bg-[#EC4899] border-[#EC4899] text-white shadow-lg shadow-[#EC4899]/20' : 'bg-black border-white/10 text-zinc-500 hover:text-white'
                  }`}
                >
                  {wishlist.includes(p.id) ? '💖' : '🤍'}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                  className="px-8 h-14 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#EC4899] hover:text-white transition-all shadow-xl active:scale-95"
                >
                  Bag It
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamousProducts;
