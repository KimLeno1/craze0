import React, { useState } from 'react';
import { Product, ViewState, RankBenefits } from '../types';
import ProductCard from './ProductCard';

interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  onProductClick: (p: Product) => void;
  onNavigate?: (view: ViewState) => void;
  rank: RankBenefits;
}

const WishlistView: React.FC<WishlistViewProps> = ({ 
  products, 
  wishlistIds, 
  onAddToCart, 
  onToggleWishlist,
  onProductClick,
  onNavigate,
  rank
}) => {
  const [searchHandle, setSearchHandle] = useState('');
  const wishlistItems = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="p-8 md:p-16 space-y-16 animate-in fade-in duration-1000 pb-40 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#EC4899] glow-text animate-pulse"></div>
             <span className="text-[10px] font-black text-[#EC4899] uppercase tracking-[0.4em]">{rank.tier} Archive</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">
            The Saved <span className="text-white not-italic font-sans font-black uppercase glow-text">Circuit</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">
            Retention: {typeof rank.wishlistRetentionDays === 'number' ? `${rank.wishlistRetentionDays} Days` : 'PERMANENT'} // {wishlistItems.length} Identifiers
          </p>
        </div>
        
        {rank.canSeeOtherWishlists && (
          <div className="space-y-3 w-full md:w-auto">
             <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest text-center md:text-right">Social Oracle Access Active</p>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={searchHandle}
                  onChange={e => setSearchHandle(e.target.value)}
                  placeholder="USER_HANDLE_OR_ID"
                  className="bg-zinc-950 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-white focus:border-[#EC4899] outline-none w-40"
                />
                <button className="bg-white text-black px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#EC4899] hover:text-white transition-all">Scan</button>
             </div>
          </div>
        )}
      </header>

      {wishlistItems.length === 0 ? (
        <div className="py-40 text-center flex flex-col items-center gap-10 bg-zinc-950/20 rounded-[4rem] border border-dashed border-white/5">
          <div className="text-8xl opacity-10 animate-bounce">📦</div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.6em] italic">Archive terminal empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {wishlistItems.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              isWishlisted={true}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onClick={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistView;