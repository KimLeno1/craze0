import React, { useState, useEffect } from 'react';
import { CartItem, ViewState, PromoCode, RankBenefits } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClear: () => void;
  onNavigate?: (view: ViewState) => void;
  surgeTimerEnd: number | null;
  activePromo?: PromoCode | null;
  rank: RankBenefits;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity, 
  onClear, 
  onNavigate,
  surgeTimerEnd,
  activePromo,
  rank
}) => {
  const subtotalProductsMarket = items.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const totalShipping = items.reduce((acc, item) => acc + ((item.shippingFee || 0) * item.quantity), 0);
  
  // Calculate total potential discount allowed by the system (Market Price - Current Shop Price)
  const totalAllowedDiscount = items.reduce((acc, item) => acc + ((item.originalPrice - item.price) * item.quantity), 0);
  
  // Realize only a portion of that discount based on rank
  const realizedDiscount = totalAllowedDiscount * rank.discountMultiplier;
  
  // Base price after Rank Discount
  let baseValuation = subtotalProductsMarket - realizedDiscount;
  
  // Velocity Surge Logic (Applies extra 10% to the already rank-calculated price)
  const [surgeTimeRemaining, setSurgeTimeRemaining] = useState<number>(0);
  const isSurgeActive = surgeTimeRemaining > 0;
  if (isSurgeActive) {
    baseValuation = baseValuation * 0.9;
  }
  
  // Apply Promo Fragment
  if (activePromo) {
    if (activePromo.type === 'PERCENT') {
      baseValuation = baseValuation * (1 - activePromo.value / 100);
    } else {
      baseValuation = Math.max(0, baseValuation - activePromo.value);
    }
  }

  const finalValuation = Math.floor(baseValuation + totalShipping);
  const efficiency = subtotalProductsMarket > 0 ? Math.round(((subtotalProductsMarket + totalShipping - finalValuation) / (subtotalProductsMarket + totalShipping)) * 100) : 0;
  
  const [expiry, setExpiry] = useState(600); // 10 minutes
  useEffect(() => {
    if (!isOpen || items.length === 0) return;
    const timer = setInterval(() => {
      setExpiry(prev => (prev > 0 ? prev - 1 : 0));
      if (surgeTimerEnd) {
        const remaining = Math.max(0, Math.floor((surgeTimerEnd - Date.now()) / 1000));
        setSurgeTimeRemaining(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, items, surgeTimerEnd]);

  const min = Math.floor(expiry / 60);
  const sec = expiry % 60;
  const sMin = Math.floor(surgeTimeRemaining / 60);
  const sSec = surgeTimeRemaining % 60;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full md:max-w-xl bg-[#050505] z-[210] shadow-[-30px_0_100px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border-l border-white/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          <header className="relative z-10 px-6 py-8 md:px-12 md:py-10 flex justify-between items-start border-b border-white/5">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${items.length > 0 ? 'bg-[#00D1FF] animate-pulse' : 'bg-zinc-800'}`}></span>
                <span className="text-[8px] md:text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.3em] md:tracking-[0.4em]">{rank.tier} Archive Terminal</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif italic text-white tracking-tighter leading-none">Your Haul</h2>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full glass border-white/10 flex items-center justify-center text-white hover:bg-[#00D1FF] transition-all hover:rotate-90"
            >✕</button>
          </header>

          {isSurgeActive && items.length > 0 && (
            <div className="mx-6 md:mx-12 mt-4 md:mt-6 p-3 md:p-4 bg-[#00D1FF] rounded-2xl flex items-center justify-between shadow-[0_0_30px_rgba(0,209,255,0.3)] animate-in slide-in-from-top-4 duration-500">
               <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-xl md:text-2xl animate-bounce">⚡</div>
                  <div className="flex flex-col">
                    <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Velocity Surge</span>
                    <span className="text-[7px] md:text-[8px] font-bold text-white/80 uppercase">Extra 10% Decisive Bonus</span>
                  </div>
               </div>
               <div className="text-xl md:text-2xl font-mono font-black text-white">{sMin}:{sSec.toString().padStart(2, '0')}</div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 md:py-10 space-y-10 md:space-y-12 scrollbar-hide relative z-10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-7xl md:text-9xl mb-8 md:mb-10 grayscale brightness-50">🎒</div>
                <button onClick={onClose} className="mt-8 md:mt-12 px-8 md:px-12 py-4 md:py-5 bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-2xl hover:bg-[#00D1FF] hover:text-white transition-all">Return to Circuit</button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.id}-${item.selectedSize}`} className="group flex flex-row gap-4 md:gap-8 animate-in slide-in-from-right-12 duration-500">
                  <div className="w-24 md:w-36 aspect-[3/4] bg-zinc-900 overflow-hidden relative border border-white/10 rounded-xl md:rounded-2xl shrink-0">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="text-[7px] md:text-[9px] font-black text-[#00D1FF] uppercase tracking-widest">
                              {item.isBundle ? 'Synergy Kit' : `Sector_${item.category}`}
                            </div>
                            <h3 className="text-base md:text-xl font-serif italic text-white tracking-tight leading-tight">{item.name}</h3>
                            {item.customizationData && Object.keys(item.customizationData).length > 0 && (
                              <div className="space-y-0.5 mt-1">
                                {Object.entries(item.customizationData).map(([fieldId, value]) => {
                                  const field = item.customizationFields?.find(f => f.id === fieldId);
                                  return (
                                    <div key={fieldId} className="flex items-center gap-1.5 md:gap-2">
                                      <span className="text-[6px] md:text-[7px] font-black text-zinc-500 uppercase tracking-widest">{field?.label || 'Custom'}:</span>
                                      {field?.type === 'color' ? (
                                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full border border-white/20" style={{ backgroundColor: value }}></div>
                                      ) : (
                                        <span className="text-[7px] md:text-[8px] font-bold text-amber-500 uppercase">{value}</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                        <button onClick={() => onRemove(item.id)} className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all text-xs md:text-sm">✕</button>
                      </div>
                      <div className="flex items-center bg-black border border-white/5 rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2 gap-4 md:gap-6 w-fit">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-base md:text-lg text-zinc-600 hover:text-white">-</button>
                        <span className="text-[10px] md:text-xs font-mono font-black text-white">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-base md:text-lg text-zinc-600 hover:text-white">+</button>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-8 flex justify-between items-end">
                       <span className="text-[7px] md:text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">+ GH₵{item.shippingFee * item.quantity}</span>
                       <div className="text-right">
                          <span className="text-zinc-600 text-[10px] md:text-xs font-mono line-through block">GH₵{item.originalPrice * item.quantity}</span>
                          <span className="text-lg md:text-2xl font-mono font-black text-white leading-none">GH₵{Math.floor(item.originalPrice - ((item.originalPrice - item.price) * rank.discountMultiplier)) * item.quantity}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <footer className="relative z-10 bg-black border-t border-white/5 p-6 md:p-12 space-y-6 md:space-y-8 shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-zinc-950 border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col items-center">
                  <span className="text-[7px] md:text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Rank Yield</span>
                  <span className="text-lg md:text-xl font-mono font-black text-[#00D1FF]">{efficiency}% Eff.</span>
                </div>
                <div className="bg-zinc-950 border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col items-center">
                  <span className="text-[7px] md:text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Valuation</span>
                  <div className="flex flex-col items-center">
                    <span className="text-lg md:text-xl font-mono font-black text-white">GH₵{finalValuation}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => { onClose(); if (onNavigate) onNavigate(ViewState.CHECKOUT); }} className="w-full py-6 md:py-8 bg-white text-black text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] rounded-2xl md:rounded-3xl hover:bg-[#00D1FF] hover:text-white transition-all shadow-[0_0_50px_rgba(0,209,255,0.3)]">
                Initialize Acquisition
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;