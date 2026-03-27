
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  saleTimerEnd?: number | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  onAddToCart, 
  onToggleWishlist,
  isWishlisted,
  saleTimerEnd
}) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('');

  React.useEffect(() => {
    if (!saleTimerEnd) return;
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.floor((saleTimerEnd - Date.now()) / 1000));
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [saleTimerEnd]);

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isOnSale = product.price < product.originalPrice;
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
          className="w-full h-full object-cover grayscale-0 transition-all duration-1000"
        />
        
        {/* Minimal Overlays */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isNew && (
            <div className="bg-white text-black px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em]">New</div>
          )}
          {isHighHeat && (
            <div className="bg-[#00D1FF] text-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em]">Heat</div>
          )}
          {isOnSale && (
            <div className="bg-red-600 text-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] animate-pulse flex items-center gap-1.5">
              <span>Sale</span>
              {saleTimerEnd && timeLeft && (
                <span className="font-mono border-l border-white/20 pl-1.5">{timeLeft}</span>
              )}
            </div>
          )}
        </div>

        {/* Choice Hub - Always Visible Now */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-[1px] hidden sm:flex">
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="h-10 px-6 bg-white text-black text-[8px] uppercase tracking-[0.3em] font-black hover:bg-[#00D1FF] hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              Acquire
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
              className={`w-10 h-10 flex items-center justify-center border transition-all ${
                isWishlisted ? 'bg-[#00D1FF] border-[#00D1FF] text-white' : 'bg-black/50 border-white/20 text-white hover:bg-white hover:text-black'
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
            <h3 className="text-base sm:text-lg font-serif italic text-[#00D1FF] leading-tight truncate">{product.name}</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[7px] sm:text-[8px] font-black uppercase tracking-widest">
              <span className="text-emerald-500">{product.category}</span>
              <div className="hidden sm:block w-1 h-1 bg-zinc-800 rounded-full"></div>
              {product.appeal && (
                <>
                  <span className="text-blue-500">{product.appeal}</span>
                  <div className="hidden sm:block w-1 h-1 bg-zinc-800 rounded-full"></div>
                </>
              )}
              <span className={isHighHeat ? 'text-[#00D1FF]' : 'text-zinc-600'}>{demandWidth.toFixed(0)}% Demand</span>
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
              className="sm:hidden px-4 py-2 bg-white text-black text-[7px] font-black uppercase tracking-widest rounded-lg active:bg-[#00D1FF] active:text-white transition-all"
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
