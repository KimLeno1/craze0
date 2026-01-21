
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  onAddToCart, 
  onToggleWishlist,
  isWishlisted 
}) => {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  // Simulated dynamic "watching" count for FOMO
  const watchingCount = Math.floor(product.viewers / 10) + 2;

  return (
    <div className="group relative">
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-6 border border-white/5 cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-40"
        />
        
        {/* Psychological Trigger: High Discount */}
        {discountPercent > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-[#EC4899] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">-{discountPercent}% OFF</span>
            </div>
          </div>
        )}

        {/* Competition Indicator: FOMO */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
              {watchingCount} Watching
            </span>
          </div>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-full group-hover:translate-y-0 transition-all duration-500 p-6 bg-black/40 backdrop-blur-sm">
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#EC4899] mb-5 text-center">Protocol: High Demand Priority</div>
          
          <div className="flex w-full gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 py-4 bg-white text-black text-[9px] uppercase tracking-[0.2em] font-black hover:bg-[#EC4899] hover:text-white transition-all shadow-xl active:scale-95"
            >
              Add to Bag
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all active:scale-90 ${
                isWishlisted 
                ? 'bg-[#EC4899] border-[#EC4899] text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
                : 'bg-black/50 border-white/20 text-white hover:bg-white hover:text-black'
              }`}
            >
              {isWishlisted ? '💖' : '🤍'}
            </button>
          </div>
        </div>

        {/* Scarcity Badge */}
        {product.stockCount <= 5 && product.stockCount > 0 && (
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
             <div className="px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest animate-pulse border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
               Critical Stock: {product.stockCount} Left
             </div>
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white border-y border-white/20 py-4 px-8">Vault Closed</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-4" onClick={() => onClick(product)}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#EC4899] transition-colors">{product.name}</h3>
            {product.isNew && <span className="text-[8px] text-[#EC4899] font-black">NEW</span>}
          </div>
          
          {/* Enhanced Tag Chips immediately below the name */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-[7px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 group-hover:text-zinc-100 group-hover:border-[#EC4899]/30 transition-all"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{product.category}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-black font-mono tracking-tighter text-white block">GH₵{product.price}</span>
          <span className="text-[10px] font-mono text-zinc-600 line-through">GH₵{product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
