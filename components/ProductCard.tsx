
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
  const isHighHeat = product.hypeScore > 85;
  const demandWidth = Math.min(100, (product.viewers / 200) * 100);

  return (
    <div className="group relative flex flex-col h-full animate-in fade-in duration-700">
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-black cursor-pointer mb-6"
        onClick={() => onClick(product)}
      >
        <img 
          src={product.image} alt={product.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
        />
        
        {/* Minimal Overlays */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isNew && (
            <div className="bg-white text-black px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em]">New</div>
          )}
          {isHighHeat && (
            <div className="bg-[#EC4899] text-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em]">Heat</div>
          )}
        </div>

        {/* Choice Hub */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-[2px] hidden sm:flex">
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="h-12 px-8 bg-white text-black text-[9px] uppercase tracking-[0.4em] font-black hover:bg-[#EC4899] hover:text-white transition-all"
            >
              Acquire
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
              className={`w-12 h-12 flex items-center justify-center border transition-all ${
                isWishlisted ? 'bg-[#EC4899] border-[#EC4899] text-white' : 'bg-black/50 border-white/20 text-white hover:bg-white hover:text-black'
              }`}
            >
              {isWishlisted ? '💖' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1" onClick={() => onClick(product)}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
          <div className="space-y-1 flex-1">
            <h3 className="text-base sm:text-lg font-serif italic text-white group-hover:text-[#EC4899] transition-colors leading-tight truncate">{product.name}</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[7px] sm:text-[8px] font-black uppercase tracking-widest">
              <span className="text-emerald-500">{product.category}</span>
              <div className="hidden sm:block w-1 h-1 bg-zinc-800 rounded-full"></div>
              {product.appeal && (
                <>
                  <span className="text-purple-500">{product.appeal}</span>
                  <div className="hidden sm:block w-1 h-1 bg-zinc-800 rounded-full"></div>
                </>
              )}
              <span className={isHighHeat ? 'text-[#EC4899]' : 'text-zinc-600'}>{demandWidth.toFixed(0)}% Demand</span>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {product.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[6px] sm:text-[7px] font-black text-orange-500 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]">#{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
            <div className="text-base sm:text-lg font-mono tracking-tighter text-white">GH₵{product.price}</div>
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="sm:hidden px-4 py-2 bg-white text-black text-[7px] font-black uppercase tracking-widest rounded-lg active:bg-[#EC4899] active:text-white transition-all"
            >
              Acquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
