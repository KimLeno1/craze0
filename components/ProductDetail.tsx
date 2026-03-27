import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, UserStats, RankBenefits } from '../types';
import { databaseService } from '../services/databaseService';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  stats: UserStats;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize?: string, customizationData?: Record<string, string>) => void;
  onUpdateSynergy: (synergy: string) => void;
  onToggleWishlist: (product: Product) => void;
  onProductClick: (product: Product) => void;
  isInWishlist: boolean;
  rank: RankBenefits;
  limitedOfferEnd?: number | null;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  stats,
  allProducts,
  onClose, 
  onAddToCart, 
  onToggleWishlist,
  onProductClick,
  isInWishlist,
  rank,
  limitedOfferEnd
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [isMaterializing, setIsMaterializing] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [customizationData, setCustomizationData] = useState<Record<string, string>>({});
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!limitedOfferEnd) return;
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.floor((limitedOfferEnd - Date.now()) / 1000));
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [limitedOfferEnd]);
  
  const activeViewers = useMemo(() => Math.floor(product.viewers / 4) + 12 + Math.floor(Math.random() * 5), [product.viewers]);

  // Rank-based price calculation
  const totalPotentialSaving = product.originalPrice - (product.isCustom ? (product.priceRange?.min || 0) : product.price);
  const realizedSaving = totalPotentialSaving * rank.discountMultiplier;
  const rankAdjustedPrice = Math.floor(product.originalPrice - realizedSaving);
  const rankSavingsAmount = product.originalPrice - rankAdjustedPrice;

  const handleAddToCart = () => {
    if (product.isCustom && !showCustomForm) {
      setShowCustomForm(true);
      return;
    }

    if (product.isCustom) {
      // Validate customization
      const missingFields = product.customizationFields?.filter(f => f.required && !customizationData[f.id]);
      if (missingFields && missingFields.length > 0) {
        alert(`Please complete the customization: ${missingFields[0].label} is required.`);
        return;
      }
    }

    onAddToCart({ ...product, price: rankAdjustedPrice }, selectedSize, product.isCustom ? customizationData : undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (stats.aiTryOnsUsedToday >= rank.aiTryOnLimit) {
      alert(`Status restricted. ${rank.tier} daily limit reached.`);
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      setIsMaterializing(true);
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setTryOnResult(event.target?.result as string);
          setIsMaterializing(false);
        };
        reader.readAsDataURL(file);
      }, 2800);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (detailContainerRef.current) {
        const scroll = detailContainerRef.current.scrollTop;
        setScrollOpacity(Math.min(scroll / 400, 1));
      }
    };
    const container = detailContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    
    // Track view
    if (stats.userId) {
      databaseService.trackAction(stats.userId, product.id, 'view');
    }

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [product.id, stats.userId]);

  const similarProducts = useMemo(() => {
    return allProducts
      .filter(p => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
      .slice(0, 4);
  }, [allProducts, product]);

  return (
    <div 
      ref={detailContainerRef}
      className="fixed inset-0 z-[150] bg-[#050505] flex flex-col lg:flex-row animate-in fade-in duration-700 overflow-y-auto lg:overflow-hidden font-sans text-white scroll-smooth"
    >
      {/* Minimal Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-8 md:py-8 transition-all duration-500"
        style={{ backgroundColor: `rgba(5, 5, 5, ${scrollOpacity})` }}
      >
        <button 
          onClick={onClose} 
          className="group flex items-center gap-3 md:gap-4 text-white/50 hover:text-white transition-colors"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-colors">
            <span className="text-lg md:text-xl">←</span>
          </div>
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Back to Archive</span>
        </button>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/40">{activeViewers} Live</span>
          </div>
          <button 
            onClick={() => onToggleWishlist(product)}
            className={`text-lg md:text-xl transition-transform active:scale-90 ${isInWishlist ? 'text-[#00D1FF]' : 'text-white/20 hover:text-white/50'}`}
          >
            {isInWishlist ? '✦' : '✧'}
          </button>
        </div>
      </header>

      {/* Visual Section (Left) */}
      <div className="w-full lg:w-[55%] h-[60vh] md:h-[70vh] lg:h-full relative bg-[#0a0a0a] overflow-hidden shrink-0">
        {isMaterializing && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin mb-6"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Materializing Silhouette</span>
          </div>
        )}

        {tryOnResult && (
          <div className="absolute inset-0 z-30 animate-in fade-in duration-1000">
            <img src={tryOnResult} className="w-full h-full object-cover" alt="Try On" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <button 
              onClick={() => setTryOnResult(null)}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 px-8 py-3 glass rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Reset View
            </button>
          </div>
        )}

        <img 
          src={product.image} 
          className={`w-full h-full object-cover transition-all duration-[2s] ${tryOnResult ? 'opacity-0 scale-110' : 'opacity-100'}`} 
          alt={product.name} 
        />
        
        {product.price < product.originalPrice && (
          <div className="absolute top-24 left-8 md:top-32 md:left-12 bg-red-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl z-10 animate-pulse flex items-center gap-3">
            <span>Limited Time Offer</span>
            {limitedOfferEnd && timeLeft && (
              <span className="font-mono border-l border-white/20 pl-3">{timeLeft}</span>
            )}
          </div>
        )}
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>

        {/* Try On Trigger */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group flex items-center gap-4 md:gap-6"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-xl md:text-2xl group-hover:bg-white group-hover:text-black transition-all">
              📸
            </div>
            <div className="text-left">
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/40 mb-1">Neural Try-On</p>
              <p className="text-[10px] md:text-xs font-medium italic text-white/60">Project onto your silhouette</p>
            </div>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        </div>
      </div>

      {/* Content Section (Right) */}
      <div className="w-full lg:w-[45%] bg-[#050505] flex flex-col relative z-10">
        <div className="flex-1 p-8 md:p-12 lg:p-20 lg:pt-40 space-y-12 md:space-y-16 overflow-y-auto custom-scrollbar">
          
          {/* Header Info */}
          <section className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-[8px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em] md:tracking-[0.5em]">Sector {product.category}</span>
                {product.appeal && (
                  <>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                    <span className="text-[8px] md:text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] md:tracking-[0.5em]">{product.appeal}</span>
                  </>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif italic text-white tracking-tighter leading-none">
                {product.name}
              </h1>
              
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-2 md:px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-[7px] md:text-[8px] font-black text-orange-500 uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.3)]">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-4 md:gap-6">
              <span className="text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tighter">
                {product.isCustom 
                  ? `GH₵${product.priceRange?.min} - GH₵${product.priceRange?.max}` 
                  : `GH₵${rankAdjustedPrice}`
                }
              </span>
              {product.price < product.originalPrice && (
                <span className="text-base md:text-lg font-mono text-white/20 line-through">GH₵{product.originalPrice}</span>
              )}
              <div className="px-2 md:px-3 py-1 rounded-full border border-[#00D1FF]/30 text-[8px] md:text-[9px] font-bold text-[#00D1FF] uppercase tracking-widest">
                {product.isCustom ? 'Custom Order' : `-${Math.round((1 - rankAdjustedPrice/product.originalPrice) * 100)}% Rank Benefit`}
              </div>
            </div>
          </section>

          {/* Customization Form */}
          {showCustomForm && product.isCustom && (
            <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.4em]">Customization Form</span>
                <button 
                  onClick={() => setShowCustomForm(false)}
                  className="text-[9px] font-black text-zinc-500 uppercase hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <div className="space-y-6 bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem]">
                {product.customizationFields?.map(field => (
                  <div key={field.id} className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === 'text' && (
                      <input 
                        type="text"
                        value={customizationData[field.id] || ''}
                        onChange={e => setCustomizationData({...customizationData, [field.id]: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-xs text-white focus:border-amber-500 transition-all outline-none"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    )}

                    {field.type === 'select' && (
                      <select 
                        value={customizationData[field.id] || ''}
                        onChange={e => setCustomizationData({...customizationData, [field.id]: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-xs text-white focus:border-amber-500 transition-all outline-none appearance-none"
                      >
                        <option value="">Select Option</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {field.type === 'color' && (
                      <div className="flex items-center gap-4">
                        <input 
                          type="color"
                          value={customizationData[field.id] || '#000000'}
                          onChange={e => setCustomizationData({...customizationData, [field.id]: e.target.value})}
                          className="w-12 h-12 bg-transparent border-none cursor-pointer"
                        />
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">{customizationData[field.id] || '#000000'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Description */}
          <section className="space-y-6">
            <div className="h-px w-12 bg-white/20"></div>
            <p className="text-lg lg:text-xl font-medium text-white/70 leading-relaxed tracking-tight">
              {product.description}
            </p>
          </section>

          {/* Size Selection */}
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Configuration</span>
              <button className="text-[9px] font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[80px] h-14 rounded-xl font-mono text-xs font-bold transition-all border ${
                    selectedSize === size 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          {/* Scarcity & Rank Info */}
          <section className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-2">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Availability</span>
              <p className="text-sm font-bold text-white">Only {product.stockCount} left in vault</p>
            </div>
            <div className="p-6 rounded-2xl border border-[#00D1FF]/10 bg-[#00D1FF]/[0.02] space-y-2">
              <span className="text-[9px] font-bold text-[#00D1FF] uppercase tracking-widest">Privilege</span>
              <p className="text-sm font-bold text-white">{rank.tier} Clearance</p>
            </div>
          </section>

          {/* Similar Items */}
          {similarProducts.length > 0 && (
            <section className="space-y-8 pt-12 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Similar Silhouettes</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {similarProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    isWishlisted={false} // Would need wishlist state here for full accuracy
                    onAddToCart={() => onAddToCart(p)}
                    onToggleWishlist={onToggleWishlist}
                    onClick={() => onProductClick(p)} 
                    saleTimerEnd={p.price < p.originalPrice ? limitedOfferEnd : null}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

          {/* Action Bar */}
          <div className="p-6 md:p-12 border-t border-white/5 bg-[#050505] sticky bottom-0 z-20">
            <button 
              onClick={handleAddToCart}
              className={`w-full h-16 md:h-20 rounded-2xl font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs transition-all active:scale-[0.98] shadow-2xl ${
                showCustomForm 
                ? 'bg-amber-500 text-black hover:bg-white' 
                : 'bg-white text-black hover:bg-[#00D1FF] hover:text-white'
              }`}
            >
              {showCustomForm ? 'Confirm Customization' : (product.isCustom ? 'Configure Silhouette' : 'Initialize Acquisition')}
            </button>
            <p className="text-center mt-4 md:mt-6 text-[8px] md:text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
              Secure checkout via neural link • Global logistics GH₵{product.shippingFee}
            </p>
          </div>
      </div>
    </div>
  );
};

export default ProductDetail;