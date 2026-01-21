
import React from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-12">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      <div className="relative bg-[#09090B] w-full max-w-7xl h-full md:h-fit md:max-h-[90vh] flex flex-col md:flex-row shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/5">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-20 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[#EC4899] hover:text-white transition-all shadow-lg text-white"
        >
          ✕
        </button>

        <div className="w-full md:w-3/5 h-[40vh] md:h-auto overflow-hidden relative">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#EC4899] px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  URGENT: {discountPercent}% VALUE SECURED
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-16 overflow-y-auto bg-[#09090B]">
          <div className="space-y-12">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-[10px] font-black text-[#EC4899] uppercase tracking-[0.4em]">{product.category} // ARCHIVE SKU-{product.id}</div>
                <div className="text-[10px] font-black text-zinc-600 uppercase">Tier 01 // ARCHIVED</div>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-6 leading-[0.85] tracking-tighter text-white">{product.name}</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags?.map(tag => (
                  <span key={tag} className="bg-zinc-900 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-baseline gap-4">
                <div className="text-4xl font-mono font-black tracking-tighter text-white">GH₵{product.price}</div>
                <div className="text-xl font-mono text-zinc-600 line-through">GH₵{product.originalPrice}</div>
              </div>
            </div>

            <div className="space-y-8">
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md uppercase font-bold tracking-tight italic">
                "{product.description}"
              </p>
              <div className="grid grid-cols-1 gap-4">
                {product.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    <span className="w-4 h-[1px] bg-[#EC4899]" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>

            {/* Psychological Trigger: Scarcity */}
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">⚠️</span>
                <div>
                   <div className="text-[10px] font-black text-red-500 uppercase tracking-widest text-left">Inventory Critical</div>
                   <div className="text-[11px] font-bold text-white uppercase text-left">Only {product.stockCount} units remaining in New Tokyo.</div>
                </div>
              </div>
              <div className="text-[10px] font-black text-red-500 animate-pulse">Rarity 10/10</div>
            </div>

            <div className="pt-8 space-y-4">
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={!product.inStock}
                  className={`flex-[3] py-7 text-[12px] uppercase tracking-[0.4em] font-black transition-all shadow-2xl relative overflow-hidden group ${
                    product.inStock 
                    ? 'bg-white text-black hover:bg-[#EC4899] hover:text-white' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <span className="relative z-10">{product.inStock ? 'Initialize Acquisition' : 'Archive Locked'}</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                
                {onToggleWishlist && (
                  <button 
                    onClick={() => onToggleWishlist(product)}
                    className={`flex-1 rounded-2xl border flex items-center justify-center text-xl transition-all ${
                      isWishlisted 
                      ? 'bg-[#EC4899] border-[#EC4899] text-white shadow-lg' 
                      : 'bg-transparent border-white/10 text-zinc-400 hover:border-white/30'
                    }`}
                  >
                    {isWishlisted ? '💖' : '🤍'}
                  </button>
                )}
              </div>
              <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                Secured Checkout Protected by CC Protocol 2.5
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
