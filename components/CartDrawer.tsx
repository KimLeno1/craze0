
import React, { useState, useEffect } from 'react';
import { CartItem, ViewState } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onNavigate?: (view: ViewState) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onNavigate }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalOriginal = items.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const efficiency = totalOriginal > 0 ? Math.round(((totalOriginal - subtotal) / totalOriginal) * 100) : 0;
  
  // Loss Aversion: De-materialization Counter
  const [expiry, setExpiry] = useState(600); // 10 minutes

  useEffect(() => {
    if (!isOpen || items.length === 0) return;
    const timer = setInterval(() => setExpiry(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [isOpen, items]);

  const min = Math.floor(expiry / 60);
  const sec = expiry % 60;
  const isCritical = expiry < 60;

  const handleStartCheckout = () => {
    onClose();
    if (onNavigate) onNavigate(ViewState.CHECKOUT);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Terminal Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-[#050505] z-[210] shadow-[-30px_0_100px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border-l border-white/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col relative overflow-hidden">
          
          {/* Background Technical Grid */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#EC4899]/5 via-transparent to-transparent pointer-events-none"></div>

          {/* Header Area */}
          <header className="relative z-10 px-8 py-10 md:px-12 flex justify-between items-start border-b border-white/5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${items.length > 0 ? 'bg-[#EC4899] animate-pulse' : 'bg-zinc-800'}`}></span>
                <span className="text-[10px] font-black text-[#EC4899] uppercase tracking-[0.4em]">Inventory Terminal // V.2.5</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-white tracking-tighter leading-none">Your Haul</h2>
              <div className="flex gap-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-2">
                <span>Status: {items.length > 0 ? 'Syncing...' : 'Idle'}</span>
                <span>•</span>
                <span>Buffer: {items.length}/20 Slots</span>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white text-xl hover:bg-[#EC4899] hover:border-[#EC4899] transition-all hover:rotate-90"
            >
              ✕
            </button>
          </header>

          {/* Loss Aversion Timer */}
          {items.length > 0 && (
            <div className={`relative z-10 mx-8 md:mx-12 mt-8 p-6 rounded-3xl border transition-all duration-500 flex items-center justify-between overflow-hidden ${isCritical ? 'bg-red-950/20 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-zinc-950 border-white/5'}`}>
               <div className="space-y-1">
                  <div className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-red-500' : 'text-zinc-500'}`}>
                    {isCritical ? 'Dematerialization Imminent' : 'Signal Stability Window'}
                  </div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
                    Unconfirmed silhouettes will return to global archives.
                  </p>
               </div>
               <div className={`text-3xl font-mono font-black tracking-tighter ${isCritical ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {min}:{sec.toString().padStart(2, '0')}
               </div>
               
               {/* Animated Progress Bar */}
               <div className="absolute bottom-0 left-0 h-0.5 bg-zinc-800 w-full">
                  <div 
                    className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-[#EC4899]'}`} 
                    style={{ width: `${(expiry / 600) * 100}%` }}
                  ></div>
               </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-12 scrollbar-hide relative z-10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
                <div className="text-9xl mb-10 grayscale brightness-50">🎒</div>
                <div className="space-y-4">
                  <p className="text-zinc-500 uppercase text-[12px] font-black tracking-[0.5em]">The Void Archive is Empty</p>
                  <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-widest max-w-[240px] leading-relaxed mx-auto italic">
                    Initialize acquisition protocol by selecting silhouettes from the main database.
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="mt-12 px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#EC4899] hover:text-white transition-all shadow-2xl"
                >
                  Return to Circuit
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="group flex flex-col md:flex-row gap-8 animate-in slide-in-from-right-12 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Image with Heat Indicator */}
                  <div className="w-full md:w-36 aspect-[3/4] bg-zinc-900 overflow-hidden relative border border-white/10 rounded-2xl">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                    <div className="absolute top-3 left-3 flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899] shadow-[0_0_8px_#EC4899] animate-pulse"></div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <div className="text-[9px] font-black text-[#EC4899] uppercase tracking-widest">Sector_{item.category}</div>
                           <h3 className="text-xl font-serif italic text-white tracking-tight">{item.name}</h3>
                        </div>
                        <button 
                          onClick={() => onRemove(item.id)} 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm border border-transparent hover:border-red-500/20"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-black border border-white/5 rounded-xl px-4 py-2 gap-6">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-lg text-zinc-600 hover:text-white transition-colors">-</button>
                          <span className="text-xs font-mono font-black text-white">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-lg text-zinc-600 hover:text-white transition-colors">+</button>
                        </div>
                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Quantity</div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-end">
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">ID Reference</span>
                          <span className="text-[10px] font-mono font-bold text-zinc-500 block">ARCH-CC-0{item.id}-TX</span>
                       </div>
                       <div className="text-right">
                          <span className="text-zinc-600 text-xs font-mono line-through block tracking-tighter opacity-50">GH₵{item.originalPrice * item.quantity}</span>
                          <span className="text-2xl font-mono font-black text-white leading-none">GH₵{item.price * item.quantity}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer Area */}
          {items.length > 0 && (
            <footer className="relative z-10 bg-black border-t border-white/5 p-8 md:p-12 space-y-8 shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
              
              {/* Efficiency Dashboard */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 border border-white/5 p-5 rounded-3xl flex flex-col items-center">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Acquisition efficiency</span>
                  <span className="text-xl font-mono font-black text-[#EC4899]">{efficiency}%</span>
                </div>
                <div className="bg-zinc-950 border border-white/5 p-5 rounded-3xl flex flex-col items-center">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Reserved Valuation</span>
                  <span className="text-xl font-mono font-black text-white">GH₵{subtotal}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleStartCheckout}
                  className="w-full py-8 bg-white text-black text-[12px] font-black uppercase tracking-[0.5em] rounded-3xl hover:bg-[#EC4899] hover:text-white transition-all shadow-[0_0_50px_rgba(236,72,153,0.3)] group relative overflow-hidden"
                >
                  <span className="relative z-10">Initialize Uplink Acquisition</span>
                  <div className="absolute inset-0 bg-[#EC4899] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                
                <div className="flex items-center justify-between px-2">
                   <div className="flex gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                      <span className="text-[8px] font-black uppercase tracking-widest">STRIPE.ENC</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">APPLE.PAY</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">CRYPTO.V1</span>
                   </div>
                   <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em] italic">Encrypted via CC_Vault_Pro</span>
                </div>
              </div>

              {/* Loss aversion footer tip */}
              <div className="pt-4 text-center">
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed">
                   Notice: Abandoned hauls are subject to global heat re-allocation. <br/> silouhettes are not guaranteed until uplink is finalized.
                </p>
              </div>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
