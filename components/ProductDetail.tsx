
import React from 'react';
import { Product, UserStats } from '../types';

interface ProductDetailProps {
  product: Product;
  stats: UserStats;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onUpdateSynergy: (synergy: string) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onClose, 
  onAddToCart, 
  onToggleWishlist,
  isInWishlist
}) => {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const activeViewers = Math.floor(product.viewers / 4) + 12;

  return (
    <div className="fixed inset-0 z-[150] bg-black flex flex-col md:flex-row animate-in fade-in duration-700 overflow-y-auto md:overflow-hidden">
      
      {/* Visual Immersive Zone */}
      <div className="w-full md:w-3/5 h-[70vh] md:h-full relative bg-zinc-950">
        <img 
          src={product.image} 
          className="w-full h-full object-cover opacity-80" 
          alt={product.name} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        
        <button 
          onClick={onClose} 
          className="absolute top-10 left-10 w-14 h-14 rounded-full glass flex items-center justify-center text-white text-xl z-20 hover:bg-white hover:text-black transition-all"
        >
          ←
        </button>

        <div className="absolute top-10 right-10 flex flex-col items-end gap-3 z-20">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {activeViewers} Watching
            </span>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 right-12 space-y-6">
          <h2 className="text-5xl md:text-8xl font-serif italic text-white tracking-tighter leading-none max-w-2xl">{product.name}</h2>
          <div className="flex flex-wrap gap-3">
            {product.tags?.map(tag => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 glass px-4 py-1.5 rounded-full border-white/5">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Commerce Zone */}
      <div className="w-full md:w-2/5 bg-[#050505] p-10 md:p-20 flex flex-col justify-center gap-12 border-l border-white/5">
        
        <section className="space-y-6">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4">Market Valuation</div>
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-zinc-600 text-lg font-mono line-through block tracking-tighter">GH₵{product.originalPrice}</span>
              <span className="text-6xl font-black font-mono tracking-tighter text-white">GH₵{product.price}</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Silhouette Intel</div>
          <p className="text-zinc-300 text-sm md:text-base italic font-serif leading-relaxed">
            "{product.description}"
          </p>
          <div className="grid grid-cols-1 gap-3 pt-4">
            {product.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full border border-pink-500/30"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{detail}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 pt-10 border-t border-white/5">
          <div className="flex gap-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-[4] h-20 bg-white text-black rounded-3xl font-black uppercase tracking-[0.4em] text-xs hover:bg-[#EC4899] hover:text-white transition-all shadow-3xl active:scale-95 group relative overflow-hidden"
            >
              <span className="relative z-10">Initialize Acquisition</span>
              <div className="absolute inset-0 bg-[#EC4899] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <button 
              onClick={() => onToggleWishlist(product)}
              className={`flex-1 h-20 rounded-3xl border flex items-center justify-center text-2xl transition-all ${
                isInWishlist ? 'bg-[#EC4899] border-[#EC4899] text-white' : 'bg-transparent border-white/10 text-zinc-500'
              }`}
            >
              {isInWishlist ? '💖' : '🤍'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
