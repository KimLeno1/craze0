
import React from 'react';
import { Product, UserStats, ViewState } from '../types';
import ProductCard from './ProductCard';

interface HomeLobbyProps {
  products: Product[];
  stats: UserStats;
  wishlist: string[];
  onNavigate: (view: ViewState) => void;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onCompleteQuest: (questId: string) => void;
}

const HomeLobby: React.FC<HomeLobbyProps> = ({ 
  products, 
  wishlist,
  onNavigate, 
  onAddToCart, 
  onToggleWishlist,
  onProductClick
}) => {
  const newArrivals = products.slice(0, 4);
  const trending = products.filter(p => p.hypeScore > 85).slice(0, 3);
  
  return (
    <div className="bg-[#050505] animate-in fade-in duration-1000 pb-40">
      {/* Live Trend Signal Ticker */}
      <div className="bg-blue-600/10 border-y border-blue-500/20 py-3 overflow-hidden">
        <div className="animate-[marquee_30s_linear_infinite] whitespace-nowrap flex gap-12 text-[9px] font-black uppercase tracking-[0.4em] text-blue-400">
          <span>Aesthetic Shift Detected: {products[0].category} Demand +24%</span>
          <span>// New Tokyo Sector 01 Signals High Velocity</span>
          <span>// Regional Stock Critical for SKU_1</span>
          <span>// Neural Intel Upload Complete</span>
          <span>// SS25 Trends Synchronizing with Global Feeds</span>
        </div>
      </div>

      {/* Editorial Hero */}
      <section className="relative h-[85vh] md:h-screen w-full overflow-hidden flex flex-col justify-end px-6 md:px-20 pb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" 
            alt="Editorial Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        </div>

        <div className="relative z-10 space-y-8 max-w-5xl">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
            <span>SS25 COLLECTION</span>
            <span className="w-1 h-1 bg-zinc-500 rounded-full"></span>
            <span className="text-white">OUTERWEAR SPECIALS</span>
          </div>
          
          <h1 className="text-6xl md:text-[10rem] font-serif italic text-white leading-[0.85] tracking-tighter">
            The New <br/> <span className="text-white not-italic font-sans font-black uppercase">STANDARD.</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8 pt-10">
            <button 
              onClick={() => onNavigate(ViewState.FAMOUS)}
              className="group h-16 px-14 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full hover:bg-pink-500 hover:text-white transition-all shadow-2xl active:scale-95 text-[10px] flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <span className="relative z-10">Shop Collection</span>
            </button>
            <button 
              onClick={() => onNavigate(ViewState.TRENDS)}
              className="px-10 py-6 border border-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 hover:border-blue-500 transition-all"
            >
              Analyze Market Intel
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-32 space-y-16">
        <div className="flex justify-between items-end border-b border-white/5 pb-10">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight">New Arrivals</h2>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Curated Weekly // Sector 01</p>
          </div>
          <button 
            onClick={() => onNavigate(ViewState.FAMOUS)}
            className="text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest border-b border-zinc-800 transition-colors pb-1"
          >
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {newArrivals.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              isWishlisted={wishlist.includes(p.id)}
              onAddToCart={() => onAddToCart(p.id)}
              onToggleWishlist={onToggleWishlist}
              onClick={() => onProductClick(p)} 
            />
          ))}
        </div>
      </section>

      {/* Scarcity Ticker */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-red-950/10 border border-red-500/20 rounded-[3rem] mb-20">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-10">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl animate-pulse">⚠️</div>
               <div>
                  <h3 className="text-2xl font-serif italic text-white">Vault Criticality</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Global stock levels dropping faster than predicted.</p>
               </div>
            </div>
            <button 
              onClick={() => onNavigate(ViewState.FLASH)}
              className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-red-600 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)]"
            >
              Secure Final Drops
            </button>
         </div>
      </section>

      {/* Trending Now Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-serif italic text-white">Trending in New Tokyo</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Velocity Heat Exceeding 85%</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {trending.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              isWishlisted={wishlist.includes(p.id)}
              onAddToCart={() => onAddToCart(p.id)}
              onToggleWishlist={onToggleWishlist}
              onClick={() => onProductClick(p)} 
            />
          ))}
        </div>
      </section>
      
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default HomeLobby;
