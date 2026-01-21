
import React from 'react';
import { Product, ViewState } from '../types';
import ProductCard from './ProductCard';

interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  onProductClick: (p: Product) => void;
  onNavigate?: (view: ViewState) => void;
}

const WishlistView: React.FC<WishlistViewProps> = ({ 
  products, 
  wishlistIds, 
  onAddToCart, 
  onToggleWishlist,
  onProductClick,
  onNavigate
}) => {
  const wishlistItems = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="p-8 md:p-16 space-y-16 animate-in fade-in duration-1000 pb-40 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#EC4899] glow-text animate-pulse"></div>
             <span className="text-[10px] font-black text-[#EC4899] uppercase tracking-[0.4em]">Personalized Archives</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">
            The Saved <span className="text-white not-italic font-sans font-black uppercase glow-text">Circuit</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">High-Priority Acquisition Buffer // {wishlistItems.length} Identifiers</p>
        </div>
        
        {wishlistItems.length > 0 && (
          <div className="bg-zinc-950 px-8 py-4 rounded-3xl border border-white/5 flex flex-col items-center">
             <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Vault Value</span>
             <span className="text-2xl font-mono font-black text-white">
               GH₵{wishlistItems.reduce((acc, p) => acc + p.price, 0)}
             </span>
          </div>
        )}
      </header>

      {wishlistItems.length === 0 ? (
        <div className="py-40 text-center flex flex-col items-center gap-10 bg-zinc-950/20 rounded-[4rem] border border-dashed border-white/5">
          <div className="text-8xl opacity-10 animate-bounce">📦</div>
          <div className="space-y-4">
            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.6em] italic">Archive terminal empty.</p>
            <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-widest max-w-xs mx-auto">No silhouettes currently flagged for acquisition.</p>
          </div>
          <button 
            onClick={() => onNavigate?.(ViewState.FAMOUS)}
            className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#EC4899] hover:text-white transition-all shadow-3xl active:scale-95"
          >
            Scan The Heat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {wishlistItems.map(p => (
            <div key={p.id} className="relative group">
              <div className="absolute -top-4 -left-4 z-20">
                <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-pink-500/30 text-[8px] font-black text-pink-500 uppercase tracking-widest">
                  Priority_Locked
                </div>
              </div>
              <ProductCard 
                product={p} 
                isWishlisted={true}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                onClick={onProductClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Psychological Scarcity Reminder */}
      {wishlistItems.length > 0 && (
        <section className="mt-32 p-10 bg-red-950/10 border border-red-500/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="text-4xl">⚠️</div>
            <div className="space-y-1">
              <h4 className="text-xl font-serif italic text-white">Acquisition Warning</h4>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-relaxed">
                Silhouettes in your circuit are not reserved. Stock levels are volatile.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate?.(ViewState.FAMOUS)}
            className="text-[10px] font-black text-white border-b border-white/20 hover:border-[#EC4899] pb-1 transition-all uppercase tracking-widest"
          >
            Check Global Heat Levels
          </button>
        </section>
      )}
    </div>
  );
};

export default WishlistView;
