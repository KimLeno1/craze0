
import React, { useState, useEffect } from 'react';
import { CartItem, ViewState, OrderStatus, PromoCode } from '../types';

interface CheckoutViewProps {
  items: CartItem[];
  onComplete: (orderDetails: any) => void;
  onCancel: () => void;
  balances: { coins: number; gems: number; rep: number };
  activePromo?: PromoCode | null;
  rank?: any;
}

const REGIONS = [
  { id: 'accra', name: 'Greater Accra', icon: '🏛️', cities: ['Accra', 'Tema', 'Madina', 'Adenta', 'Ashaiman'] },
  { id: 'ashanti', name: 'Ashanti', icon: '🏺', cities: ['Kumasi', 'Obuasi', 'Ejisu', 'Konongo', 'Mampong'] },
  { id: 'western', name: 'Western', icon: '⚓', cities: ['Sekondi-Takoradi', 'Tarkwa', 'Axim', 'Elubo'] },
  { id: 'central', name: 'Central', icon: '🏰', cities: ['Cape Coast', 'Winneba', 'Kasoa', 'Saltpond'] },
  { id: 'eastern', name: 'Eastern', icon: '⛰️', cities: ['Koforidua', 'Nkawkaw', 'Nsawam', 'Akosombo'] },
  { id: 'northern', name: 'Northern', icon: '🕌', cities: ['Tamale', 'Yendi', 'Savelugu'] },
  { id: 'volta', name: 'Volta', icon: '🌊', cities: ['Ho', 'Hohoe', 'Kpando', 'Aflao'] },
  { id: 'bono', name: 'Bono', icon: '🌳', cities: ['Sunyani', 'Berekum', 'Dormaa Ahenkro'] },
  { id: 'bono-east', name: 'Bono East', icon: '🌽', cities: ['Techiman', 'Kintampo', 'Nkoranza'] },
  { id: 'ahafo', name: 'Ahafo', icon: '💎', cities: ['Goaso', 'Mim', 'Bechem'] },
  { id: 'upper-east', name: 'Upper East', icon: '🌞', cities: ['Bolgatanga', 'Bawku', 'Navrongo'] },
  { id: 'upper-west', name: 'Upper West', icon: '🏹', cities: ['Wa', 'Jirapa', 'Tumu'] },
  { id: 'savannah', name: 'Savannah', icon: '🐘', cities: ['Damongo', 'Buipe', 'Salaga'] },
  { id: 'north-east', name: 'North East', icon: '🛡️', cities: ['Nalerigu', 'Gambaga', 'Walewale'] },
  { id: 'oti', name: 'Oti', icon: '🛶', cities: ['Dambai', 'Jasikan', 'Nkwanta'] },
  { id: 'western-north', name: 'Western North', icon: '🌲', cities: ['Sefwi Wiawso', 'Enchi', 'Bibiani'] }
];

const CheckoutView: React.FC<CheckoutViewProps> = ({ items, onComplete, onCancel, balances, activePromo }) => {
  const [step, setStep] = useState<'GEO_ZONING' | 'LOGISTICS' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS'>('GEO_ZONING');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    region: '',
    city: '',
    verificationPhrase: ''
  });

  const rawSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalShipping = items.reduce((acc, item) => acc + ((item.shippingFee || 0) * item.quantity), 0);
  
  // Calculate Savings
  let promoDiscount = 0;
  if (activePromo) {
    if (activePromo.type === 'PERCENT') {
      promoDiscount = Math.floor(rawSubtotal * (activePromo.value / 100));
    } else {
      promoDiscount = Math.min(rawSubtotal, activePromo.value);
    }
  }
  
  const finalTotal = Math.floor(rawSubtotal - promoDiscount + totalShipping);
  const availableCities = REGIONS.find(r => r.name === formData.region)?.cities || [];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'GEO_ZONING') setStep('LOGISTICS');
    else if (step === 'LOGISTICS') setStep('PAYMENT');
  };

  const handleFinalize = () => {
    if (!formData.verificationPhrase) {
      alert("Terminal Lock: Verification phrase required.");
      return;
    }
    setStep('PROCESSING');
    setTimeout(() => setStep('SUCCESS'), 3000);
  };

  if (step === 'PROCESSING') {
    return (
      <div className="fixed inset-0 z-[250] bg-black flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="relative">
          <div className="w-16 h-16 sm:w-24 sm:h-24 border-4 border-[#00D1FF]/20 border-t-[#00D1FF] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl">⚡</div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif italic text-white mt-8 sm:mt-12 tracking-tighter uppercase">Encrypting Haul...</h2>
        <p className="text-[7px] sm:text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] mt-4">Bypassing Regional Gateways</p>
      </div>
    );
  }

  if (step === 'SUCCESS') {
    return (
      <div className="fixed inset-0 z-[250] bg-[#020202] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-3xl sm:text-5xl mb-6 sm:mb-8 mx-auto shadow-[0_0_50px_rgba(34,197,94,0.2)]">✓</div>
        <h1 className="text-4xl sm:text-7xl font-serif italic text-white mb-4 sm:mb-6 tracking-tighter leading-none">Haul Secured.</h1>
        <p className="text-zinc-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] mb-12 sm:mb-16">Inventory allocated to Node_{formData.city.toUpperCase()}</p>
        <button onClick={() => onComplete({ 
          ...formData, 
          items: items.map(item => ({
            ...item,
            customizationDetails: item.customizationData // Map to customizationDetails for order consistency
          })), 
          total: finalTotal 
        })} className="w-full sm:w-auto px-10 sm:px-20 py-6 sm:py-8 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-[9px] sm:text-[10px] hover:bg-[#00D1FF] hover:text-white transition-all shadow-3xl active:scale-95">Return to Circuit</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#020202] flex flex-col lg:flex-row animate-in fade-in duration-500 overflow-y-auto">
      {/* Commerce Panel (Sidebar) */}
      <div className="w-full lg:w-[400px] bg-zinc-950 p-6 sm:p-8 flex flex-col gap-6 sm:gap-10 border-l border-white/5 order-2 lg:order-2 shrink-0">
         <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif italic text-white">Haul Analysis</h2>
            <div className="h-px w-10 bg-[#00D1FF]"></div>
         </div>

         <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {items.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 sm:gap-4 items-center bg-black/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                 <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src={item.image} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="text-[8px] sm:text-[9px] font-black text-white uppercase truncate">{item.name}</div>
                    <div className="text-[6px] sm:text-[7px] text-zinc-600 font-black uppercase mt-1">
                      {item.isBundle ? 'Synergy Kit' : `Size: ${item.selectedSize || 'OS'}`} // Qty: {item.quantity}
                    </div>
                 </div>
                 <div className="text-[9px] sm:text-[10px] font-mono font-black text-white whitespace-nowrap">GH₵{item.price * item.quantity}</div>
              </div>
            ))}
         </div>

         <div className="pt-6 sm:pt-8 border-t border-white/5 space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
               <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-600">
                  <span>Gross Valuation</span>
                  <span className="text-zinc-400">GH₵{rawSubtotal}</span>
               </div>
               <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-blue-500">
                  <span>Logistics Protocol</span>
                  <span>+ GH₵{totalShipping}</span>
               </div>
               {activePromo && (
                 <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-green-500 animate-pulse">
                    <span>Promo Applied [{activePromo.code}]</span>
                    <span>- GH₵{promoDiscount}</span>
                 </div>
               )}
            </div>

            <div className="flex flex-col items-end">
               <span className="text-[8px] sm:text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.5em] mb-1">Final Settlement</span>
               <div className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tighter">GH₵{finalTotal}</div>
            </div>
         </div>
      </div>

      {/* Logic Panel (Main Flow) */}
      <div className="flex-1 p-6 sm:p-8 lg:p-12 order-1 flex flex-col">
        <div className="max-w-3xl mx-auto w-full space-y-8 sm:space-y-12">
          {/* Progress Indication */}
          <div className="flex items-center gap-4 sm:gap-6">
            {['GEO_ZONING', 'LOGISTICS', 'PAYMENT'].map((s, idx) => {
              const isActive = step === s;
              const isPast = ['LOGISTICS', 'PAYMENT', 'SUCCESS'].includes(step) && s === 'GEO_ZONING' || (step === 'PAYMENT' && s === 'LOGISTICS');
              return (
                <div key={s} className="flex items-center gap-4 sm:gap-6 flex-1 last:flex-none">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-[10px] sm:text-xs font-black border transition-all duration-500 ${isActive ? 'bg-white text-black border-white shadow-[0_0_30px_white/20]' : isPast ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-zinc-950 text-zinc-800 border-white/5'}`}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  {idx < 2 && <div className={`h-px flex-1 transition-all duration-700 ${isPast ? 'bg-green-500/30' : 'bg-zinc-900'}`}></div>}
                </div>
              );
            })}
          </div>

          {step === 'GEO_ZONING' && (
            <div className="space-y-8 sm:space-y-10 animate-in slide-in-from-bottom-6 duration-700 pb-20">
               <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-3xl sm:text-5xl font-serif italic text-white leading-none tracking-tighter">Regional Zoning</h2>
                  <p className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Calibrate manufacturing node location across Ghana</p>
               </div>

               <div className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {REGIONS.map(r => {
                      const isSelected = formData.region === r.name;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setFormData({...formData, region: r.name, city: ''})}
                          className={`p-3 sm:p-4 rounded-2xl sm:rounded-[1.5rem] border transition-all duration-500 flex flex-col items-center gap-2 group ${isSelected ? 'bg-white border-white' : 'bg-zinc-950 border-white/5 hover:border-white/20'}`}
                        >
                          <span className={`text-xl sm:text-2xl transition-transform group-hover:scale-110 ${isSelected ? 'grayscale-0' : 'grayscale opacity-40'}`}>{r.icon}</span>
                          <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-center ${isSelected ? 'text-black' : 'text-zinc-500'}`}>{r.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {formData.region && (
                    <div className="space-y-3 sm:space-y-4 animate-in slide-in-from-top-4 duration-500">
                       <label className="text-[8px] sm:text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Sector City Node</label>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                          {availableCities.map(city => {
                            const isSelected = formData.city === city;
                            return (
                              <button
                                key={city}
                                onClick={() => setFormData({...formData, city})}
                                className={`py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl border transition-all duration-300 text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${isSelected ? 'bg-[#00D1FF] border-[#00D1FF] text-white shadow-[0_0_20px_rgba(0,209,255,0.3)]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'}`}
                              >
                                {city}
                              </button>
                            );
                          })}
                       </div>
                    </div>
                  )}
               </div>

               <button 
                onClick={() => setStep('LOGISTICS')} 
                disabled={!formData.region || !formData.city} 
                className="w-full py-6 sm:py-8 bg-white text-black rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase text-[10px] sm:text-[12px] tracking-[0.4em] hover:bg-[#00D1FF] hover:text-white transition-all disabled:opacity-20 active:scale-95 shadow-2xl relative overflow-hidden group"
               >
                 <span className="relative z-10">Authorize Zone Link</span>
                 <div className="absolute inset-0 bg-[#00D1FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
               </button>
            </div>
          )}

          {step === 'LOGISTICS' && (
            <form onSubmit={handleNextStep} className="space-y-8 sm:space-y-10 animate-in slide-in-from-bottom-6 duration-700 pb-20">
               <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-3xl sm:text-5xl font-serif italic text-white leading-none tracking-tighter">Logistics Protocol</h2>
                  <p className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Designate Physical Handover Point</p>
               </div>
               
               <div className="space-y-4 sm:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[8px] sm:text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Archiver Name</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-white/10 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-[10px] sm:text-xs font-black text-white focus:border-[#00D1FF] outline-none placeholder:text-zinc-800" placeholder="LEGAL_IDENTIFIER" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] sm:text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Uplink (Phone)</label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-950 border border-white/10 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-[10px] sm:text-xs font-black text-white focus:border-[#00D1FF] outline-none placeholder:text-zinc-800" placeholder="+233 XX XXX XXXX" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] sm:text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Spatial Coordinates</label>
                    <textarea required rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-zinc-950 border border-white/10 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-[10px] sm:text-xs font-black text-white focus:border-[#00D1FF] outline-none resize-none placeholder:text-zinc-800" placeholder="STREET / APARTMENT / LANDMARK" />
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                 <button type="button" onClick={() => setStep('GEO_ZONING')} className="w-full sm:flex-1 py-4 sm:py-6 bg-zinc-900 text-zinc-500 rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:text-white transition-all">Back</button>
                 <button type="submit" className="w-full sm:flex-[2] py-6 sm:py-8 bg-white text-black rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase text-[10px] sm:text-[12px] tracking-[0.4em] hover:bg-[#00D1FF] hover:text-white transition-all shadow-2xl active:scale-95">Validate Protocol</button>
               </div>
            </form>
          )}

          {step === 'PAYMENT' && (
            <div className="space-y-8 sm:space-y-12 animate-in slide-in-from-bottom-6 duration-700 pb-20">
               <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-3xl sm:text-5xl font-serif italic text-white leading-none tracking-tighter">Identity Sync</h2>
                  <p className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Confirm Security Signature for Settlement</p>
               </div>

               <div className="bg-zinc-950 border border-white/5 p-6 sm:p-10 rounded-[2rem] sm:rounded-[4rem] space-y-6 sm:space-y-8">
                  <div className="flex justify-between text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    <span>Dest Node</span>
                    <span className="text-white">{formData.city}, {formData.region}</span>
                  </div>
                  <div className="flex justify-between text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 border-t border-white/5 pt-4 sm:pt-6">
                    <span>Authorized Value</span>
                    <span className="text-[#00D1FF] font-mono text-lg sm:text-xl">GH₵{finalTotal}</span>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-3 sm:space-y-4">
                    <label className="text-[8px] sm:text-[9px] font-black text-zinc-600 uppercase tracking-widest block px-2 text-center">Verify Secret Phrase</label>
                    <input type="password" required value={formData.verificationPhrase} onChange={e => setFormData({...formData, verificationPhrase: e.target.value})} className="w-full bg-black border border-white/10 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-xs sm:text-sm text-center font-black text-white focus:border-[#00D1FF] outline-none" placeholder="••••••••••••" />
                  </div>
               </div>

               <div className="flex flex-col gap-4 sm:gap-6">
                 <button onClick={handleFinalize} className="w-full py-6 sm:py-10 bg-[#00D1FF] text-white rounded-[2rem] sm:rounded-[3rem] font-black uppercase text-xs sm:text-sm tracking-[0.5em] hover:bg-white hover:text-[#00D1FF] transition-all shadow-[0_0_80px_rgba(0,209,255,0.3)] active:scale-95">
                   Finalize Acquisition Handshake
                 </button>
                 <button onClick={() => setStep('LOGISTICS')} className="text-[8px] sm:text-[10px] font-black text-zinc-700 hover:text-white uppercase tracking-[0.5em] transition-colors mx-auto underline decoration-zinc-800 underline-offset-8">Review Protocol Steps</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
