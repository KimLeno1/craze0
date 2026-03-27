import React, { useState, useEffect } from 'react';
import { Product, UserStats, ViewState, UserPreferences } from '../types';
import ProductCard from './ProductCard';
import LimitedTimeOfferBanner from './LimitedTimeOfferBanner';
import { LIVE_SOCIAL_FEED } from '../data/socialProofData';
import { databaseService } from '../services/databaseService';
import { StyleQuiz } from './StyleQuiz';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HomeLobbyProps {
  userId: string;
  products: Product[];
  stats: UserStats;
  userHandle: string;
  socialPosts: any[];
  wishlist: string[];
  onNavigate: (view: ViewState) => void;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onCompleteQuest: (questId: string) => void;
  limitedOfferEnd?: number | null;
  onResetLimitedOffer?: () => void;
  isAuthenticated?: boolean;
  tutorialFinished?: boolean;
  userPrefs?: UserPreferences | null;
}

const HomeLobby: React.FC<HomeLobbyProps> = ({ 
  userId,
  products = [], 
  stats,
  userHandle,
  socialPosts = [],
  wishlist = [],
  onNavigate, 
  onAddToCart, 
  onToggleWishlist,
  onProductClick,
  limitedOfferEnd,
  onResetLimitedOffer,
  isAuthenticated = false,
  tutorialFinished = false,
  userPrefs = null
}) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    const init = async () => {
      // Recommendations Logic
      if (userPrefs) {
        const recs = await databaseService.getRecommendations(userId);
        setRecommendations(recs);
      }
    };
    init();
  }, [userId, userPrefs]);

  const handleQuizComplete = async (prefs: UserPreferences) => {
    const recs = await databaseService.getRecommendations(userId);
    setRecommendations(recs);
  };

  const newArrivals = products.slice(0, 4);
  const featured = products.find(p => p && p.hypeScore > 95) || products[0];

  if (!featured) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00D1FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hallOfFameProducts = products.filter(p => p.isHallOfFame).slice(0, 3);
  
  return (
    <div className="bg-[#050505] animate-in fade-in duration-1000 pb-40">
      {/* Limited Time Offer Banner */}
      {limitedOfferEnd && onResetLimitedOffer && (
        <LimitedTimeOfferBanner 
          endTime={limitedOfferEnd} 
          onReset={onResetLimitedOffer} 
          onAction={() => onNavigate(ViewState.PRICE_ANOMALY)} 
        />
      )}

      {/* High-Octane Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] flex flex-col justify-center px-6 sm:px-12 md:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 md:opacity-40 grayscale" 
            alt="Hero Image"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 sm:via-black/60 md:via-black/40 to-transparent"></div>
          
          {/* Animated Scan Lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-full h-px bg-[#00D1FF]/20 top-0 animate-[scan_8s_linear_infinite]"></div>
            <div className="absolute w-full h-px bg-[#00D1FF]/10 top-0 animate-[scan_12s_linear_infinite_2s]"></div>
          </div>
        </div>

        <div className="relative z-10 space-y-4 sm:space-y-6 md:space-y-8 max-w-5xl">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-px w-8 md:w-12 bg-[#00D1FF]"></div>
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[#00D1FF]">
              Welcome back, {userHandle} // Season 01
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-[11rem] font-serif italic text-white leading-[0.9] md:leading-[0.85] tracking-tighter">
            Style <br/> <span className="text-white not-italic font-sans font-black uppercase glow-text">Unlocked.</span>
          </h1>
          
          <p className="text-zinc-500 text-[9px] sm:text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-[240px] sm:max-w-xs md:max-w-md leading-relaxed">
            Acquire limited archival silhouettes through high-tier gamified drops. Optimized for the elite archiver.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 pt-4">
            <button 
              onClick={() => onNavigate(ViewState.FAMOUS)}
              className="h-12 sm:h-14 md:h-16 px-8 md:px-12 bg-white text-black font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] sm:text-[9px] md:text-[10px] hover:bg-[#00D1FF] hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Shop the Drop
            </button>
            <button 
              onClick={() => onNavigate(ViewState.PRICE_ANOMALY)}
              className="h-12 sm:h-14 md:h-16 px-8 md:px-10 bg-red-600 text-white text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] active:scale-95 border border-red-600"
            >
              Global Reduction
            </button>
          </div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="rotate-90 origin-right text-[10px] font-black text-zinc-800 uppercase tracking-[1.5em] whitespace-nowrap">
            STATUS_ACQUISITION_PROTOCOL_ACTIVE
          </div>
        </div>
      </section>

      {/* Pulse of the Circuit: Live Social Feed */}
      <div className="bg-zinc-950 border-y border-white/5 py-4 sm:py-6 overflow-hidden relative">
        <div className="flex gap-8 sm:gap-12 animate-[marquee_50s_linear_infinite] whitespace-nowrap px-6 items-center">
          {LIVE_SOCIAL_FEED.map((event, idx) => (
            <div key={idx} className="flex items-center gap-3 sm:gap-4 group cursor-default">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
              <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest">@{event.user}</span>
              <span className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-widest">
                {event.type === 'PURCHASE' ? 'Secured' : 'Reserved'} <span className="text-zinc-400">{event.productName || 'Archive Silhouette'}</span>
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono text-zinc-800">[{event.timestamp}]</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {LIVE_SOCIAL_FEED.map((event, idx) => (
            <div key={`dup-${idx}`} className="flex items-center gap-3 sm:gap-4 group cursor-default">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
              <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest">@{event.user}</span>
              <span className="text-[9px] sm:text-[10px] text-zinc-600 uppercase tracking-widest">
                {event.type === 'PURCHASE' ? 'Secured' : 'Reserved'} <span className="text-zinc-400">{event.productName || 'Archive Silhouette'}</span>
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono text-zinc-800">[{event.timestamp}]</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-12 md:px-20 py-16 sm:py-20 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 sm:mb-12 md:mb-20 gap-4 sm:gap-6 md:gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#00D1FF] rounded-full"></div>
              <span className="text-[9px] md:text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.4em] md:tracking-[0.5em]">Live Drop</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-serif italic text-white tracking-tighter">New Arrivals</h2>
          </div>
          <div className="h-px flex-1 bg-white/5 mx-10 hidden md:block"></div>
          <button 
            onClick={() => onNavigate(ViewState.FAMOUS)}
            className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all group"
          >
            View_All <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {newArrivals.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              isWishlisted={wishlist.includes(p.id)}
              onAddToCart={() => onAddToCart(p.id)}
              onToggleWishlist={onToggleWishlist}
              onClick={() => onProductClick(p)} 
              saleTimerEnd={p.price < p.originalPrice ? limitedOfferEnd : null}
            />
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-12 md:px-20 py-16 sm:py-20 md:py-32 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 sm:mb-12 md:mb-20 gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-[9px] md:text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] md:tracking-[0.5em]">Neural Picks</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-serif italic text-white tracking-tighter">Recommended for You</h2>
            </div>
            <button 
              onClick={() => onNavigate(ViewState.PROFILE)}
              className="flex items-center gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all group"
            >
              <Sparkles className="w-4 h-4" />
              Update_Style_Protocol
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {recommendations.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                isWishlisted={wishlist.includes(p.id)}
                onAddToCart={() => onAddToCart(p.id)}
                onToggleWishlist={onToggleWishlist}
                onClick={() => onProductClick(p)} 
                saleTimerEnd={p.price < p.originalPrice ? limitedOfferEnd : null}
              />
            ))}
          </div>
        </section>
      )}

      {/* Flash Drop: Spotlight Section */}
      <section className="py-16 sm:py-20 md:py-40 border-y border-white/5 bg-[#080808] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00D1FF_0%,transparent_70%)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 sm:gap-12 md:gap-20">
          <div className="w-full md:w-1/2 aspect-[3/4] overflow-hidden bg-black border border-white/10 relative group rounded-2xl sm:rounded-3xl">
            <img src={featured?.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Featured" />
            <div className="absolute top-4 md:top-8 left-4 md:left-8 bg-[#00D1FF] text-white px-4 md:px-6 py-1 md:py-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl">
              High Heat // {featured?.hypeScore}%
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-6 md:space-y-10">
            <div className="space-y-3 md:space-y-4 text-center md:text-left">
              <span className="text-[9px] md:text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.4em] md:tracking-[0.5em]">Spotlight Archive</span>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">{featured?.name}</h2>
              <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                A masterpiece of structural engineering and aesthetic synergy. Limited to 50 units globally.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest">Acquisition Price</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-mono text-white">GH₵{featured?.price}</div>
              </div>
              <button 
                onClick={() => onProductClick(featured)}
                className="w-full md:w-auto h-12 sm:h-14 md:h-16 px-12 bg-white text-black font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] sm:text-[9px] md:text-[10px] hover:bg-[#00D1FF] hover:text-white transition-all shadow-2xl active:scale-95"
              >
                Secure Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scarcity Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-32">
         <div className="border border-white/5 p-6 sm:p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 text-center md:text-left bg-zinc-950/50 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[3rem]">
            <div className="space-y-3 sm:space-y-6">
               <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4">
                 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-ping"></div>
                 <h3 className="text-2xl sm:text-4xl md:text-6xl font-serif italic text-white tracking-tighter">Supply Depletion</h3>
               </div>
               <p className="text-zinc-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] max-w-md leading-relaxed">
                 Regional archives are reaching zero capacity. Secure your silhouette before global de-materialization.
               </p>
            </div>
            <button 
              onClick={() => onNavigate(ViewState.PRICE_ANOMALY)}
              className="w-full sm:w-auto h-12 sm:h-16 px-8 sm:px-16 bg-white text-black font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[8px] sm:text-[10px] hover:bg-[#00D1FF] hover:text-white transition-all active:scale-95"
            >
              Access Vault
            </button>
         </div>
      </section>

      {/* Hall of Fame Section */}
      {hallOfFameProducts.length > 0 && (
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-12 md:px-20 py-16 sm:py-20 md:py-32 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 sm:mb-12 md:mb-20 gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] md:tracking-[0.5em]">Hall of Fame</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-serif italic text-white tracking-tighter">Elite Archives</h2>
            </div>
            <button 
              onClick={() => onNavigate(ViewState.HALL_OF_FAME)}
              className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all group"
            >
              View_Full_Archive <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
            {hallOfFameProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => onProductClick(product)}
                className="group relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer"
              >
                <img src={product.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={product.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[7px] md:text-[8px] font-black text-amber-500 uppercase tracking-widest">{product.brand || 'Elite_Archive'}</div>
                    <div className="text-base sm:text-lg md:text-xl font-black text-white uppercase tracking-tighter">{product.name}</div>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10">
                    <span className="text-[10px] md:text-xs">🏆</span>
                    <span className="text-[9px] md:text-[10px] font-black text-white">{product.hypeScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scan { 0% { top: -10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
        .glow-text { text-shadow: 0 0 20px rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
};

export default HomeLobby;
