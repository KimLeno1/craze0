
import React, { useState, useEffect } from 'react';
import { CartItem, ViewState, OrderStatus } from '../types';

interface CheckoutViewProps {
  items: CartItem[];
  onComplete: (orderDetails: any) => void;
  onCancel: () => void;
  balances: { coins: number; gems: number; xp: number };
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ items, onComplete, onCancel, balances }) => {
  const [step, setStep] = useState<'LOGISTICS' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS'>('LOGISTICS');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: 'Neo Tokyo',
    sector: 'Sector 7'
  });

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalOriginal = items.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const efficiency = totalOriginal > 0 ? Math.round(((totalOriginal - subtotal) / totalOriginal) * 100) : 0;
  
  // Calculate gains
  const xpGained = Math.round(subtotal * 0.1);
  const coinsGained = Math.round(subtotal * 0.5);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'LOGISTICS') setStep('PAYMENT');
  };

  const handleFinalize = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
    }, 3000);
  };

  if (step === 'PROCESSING') {
    return (
      <div className="fixed inset-0 z-[250] bg-black flex flex-col items-center justify-center p-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-10 pointer-events-none">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-[#EC4899] rounded-sm animate-pulse" style={{ animationDelay: `${i * 0.01}s` }}></div>
          ))}
        </div>
        
        <div className="relative z-10 space-y-12 text-center">
          <div className="relative w-40 h-40 mx-auto">
             <div className="absolute inset-0 border-4 border-[#EC4899]/20 border-t-[#EC4899] rounded-full animate-spin"></div>
             <div className="absolute inset-4 border-4 border-blue-500/20 border-b-blue-500 rounded-full animate-spin-slow"></div>
             <div className="absolute inset-0 flex items-center justify-center text-5xl">🔐</div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-serif italic text-white tracking-tighter">Encrypting Transaction</h2>
            <div className="flex flex-col gap-2">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] animate-pulse">Uplink Status: AUTHENTICATING_CREDENTIALS</p>
               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">Bypassing Regional Firewalls... OK</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'SUCCESS') {
    return (
      <div className="fixed inset-0 z-[250] bg-[#020202] flex flex-col items-center justify-center p-6 overflow-hidden animate-in fade-in duration-1000">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#EC4899]/5 rounded-full blur-[150px] animate-pulse"></div>
        
        <div className="w-full max-w-2xl space-y-12 text-center relative z-10">
          <div className="space-y-4">
             <div className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-5xl mx-auto shadow-[0_0_50px_rgba(34,197,94,0.2)]">
               ✓
             </div>
             <div className="text-[11px] font-black text-green-500 uppercase tracking-[0.6em]">Protocol Success</div>
             <h1 className="text-6xl md:text-8xl font-serif italic text-white leading-none tracking-tighter">Haul Secured.</h1>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 grid grid-cols-2 gap-8">
             <div className="text-center space-y-2">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Rewards Allocated</div>
                <div className="text-2xl font-mono font-black text-[#EC4899]">+{xpGained} XP</div>
                <div className="text-2xl font-mono font-black text-yellow-500">+{coinsGained} COINS</div>
             </div>
             <div className="text-center space-y-2 border-l border-white/10">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Transaction ID</div>
                <div className="text-lg font-mono font-black text-white uppercase tracking-tighter">CC_TX_{Math.floor(Math.random() * 900000 + 100000)}</div>
                <div className="text-[8px] text-zinc-700 uppercase">Authorized at {new Date().toLocaleTimeString()}</div>
             </div>
          </div>

          <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed italic">
            "Your silhouette selection has been injected into the logistics pipeline. Expect regional de-materialization within 2-4 solar cycles."
          </p>

          <button 
            onClick={() => onComplete({ items, total: subtotal })}
            className="px-20 py-8 bg-white text-black rounded-full font-black uppercase tracking-[0.5em] text-xs hover:bg-[#EC4899] hover:text-white transition-all shadow-3xl active:scale-95"
          >
            Return to Circuit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#020202] flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden animate-in fade-in duration-500">
      
      {/* Commerce Panel (Right or Top) - Review */}
      <div className="w-full lg:w-2/5 bg-zinc-950 lg:order-2 p-8 md:p-16 flex flex-col gap-10 border-l border-white/5 overflow-y-auto h-fit lg:h-full">
         <header className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-serif italic text-white">Acquisition Summary</h2>
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Review Final Payload</p>
            </div>
            <button onClick={onCancel} className="text-zinc-700 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Abort</button>
         </header>

         <div className="space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-6 items-center bg-black/40 p-4 rounded-3xl border border-white/5">
                 <div className="w-16 h-20 rounded-xl overflow-hidden grayscale">
                    <img src={item.image} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                    <div className="text-[10px] font-black text-white uppercase truncate">{item.name}</div>
                    <div className="text-[8px] text-zinc-600 uppercase tracking-widest mt-1">{item.quantity} Unit(s) // Sector_{item.category}</div>
                 </div>
                 <div className="text-right">
                    <div className="text-xs font-mono font-black text-white">GH₵{item.price * item.quantity}</div>
                 </div>
              </div>
            ))}
         </div>

         <div className="space-y-6 pt-10 border-t border-white/5">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Network Efficiency</span>
               <span className="text-sm font-mono font-black text-[#EC4899]">+{efficiency}% Savings</span>
            </div>
            <div className="flex justify-between items-end">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Valuation</span>
               <span className="text-5xl font-mono font-black text-white tracking-tighter">GH₵{subtotal}</span>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
               <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                  <span className="text-zinc-500">Predicted Rewards</span>
                  <span className="text-blue-500">Verified</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">XP Allocation</span>
                  <span className="text-[11px] font-mono text-[#EC4899] font-black">+{xpGained} XP</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Coin Yield</span>
                  <span className="text-[11px] font-mono text-yellow-500 font-black">+{coinsGained} COINS</span>
               </div>
            </div>
         </div>
      </div>

      {/* Logic Panel (Left or Bottom) - Forms */}
      <div className="w-full lg:w-3/5 p-8 md:p-20 lg:order-1 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-xl mx-auto w-full space-y-16">
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all ${step === 'LOGISTICS' ? 'bg-white text-black border-white' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                 {step === 'LOGISTICS' ? '1' : '✓'}
              </div>
              <div className="h-px flex-1 bg-zinc-900"></div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all ${step === 'PAYMENT' ? 'bg-white text-black border-white' : 'bg-zinc-950 text-zinc-700 border-white/5'}`}>
                 2
              </div>
              <div className="h-px flex-1 bg-zinc-900"></div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-xl text-zinc-800">
                 ↯
              </div>
            </div>
          </div>

          {step === 'LOGISTICS' ? (
            <form onSubmit={handleNextStep} className="space-y-12 animate-in slide-in-from-left-8 duration-700">
               <div className="space-y-4">
                  <h2 className="text-4xl font-serif italic text-white">Logistics Protocol</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Specify Regional Delivery Coordinates</p>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest px-2">Archiver Name</label>
                       <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/10 p-6 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] transition-all outline-none"
                        placeholder="IDENT_01"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest px-2">Uplink Email</label>
                       <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/10 p-6 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] transition-all outline-none"
                        placeholder="ARCHIVE@NET.CORE"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest px-2">Physical Coordinates (Address)</label>
                     <input 
                      type="text" 
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 p-6 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] transition-all outline-none"
                      placeholder="DISTRICT 9, NEURAL PATHWAY 42"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest px-2">District / City</label>
                       <select 
                        className="w-full bg-zinc-950 border border-white/10 p-6 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] transition-all outline-none appearance-none"
                       >
                         <option>New Tokyo</option>
                         <option>Neo Berlin</option>
                         <option>The Void Delta</option>
                         <option>Emerald Heights</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest px-2">Regional Sector</label>
                       <select 
                        className="w-full bg-zinc-950 border border-white/10 p-6 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] transition-all outline-none appearance-none"
                       >
                         <option>Sector 7 (High Priority)</option>
                         <option>Sector 4 (Standard)</option>
                         <option>Void Outer-Rim</option>
                       </select>
                    </div>
                  </div>
               </div>

               <button 
                type="submit"
                className="w-full py-7 bg-white text-black rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-[#EC4899] hover:text-white transition-all shadow-2xl active:scale-95 group relative overflow-hidden"
               >
                 <span className="relative z-10">Proceed to Authentication</span>
                 <div className="absolute inset-0 bg-[#EC4899] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
               </button>
            </form>
          ) : (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
               <div className="space-y-4">
                  <button onClick={() => setStep('LOGISTICS')} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">← Return to Logistics</button>
                  <h2 className="text-4xl font-serif italic text-white">Authentication</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Finalize Financial Sync Protocol</p>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-zinc-950 border-2 border-[#EC4899] p-8 rounded-3xl flex items-center justify-between group cursor-pointer shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                       <div className="flex items-center gap-6">
                          <div className="text-4xl">💳</div>
                          <div className="space-y-1">
                             <div className="text-sm font-black text-white uppercase tracking-tight">Encrypted Neural-Pay</div>
                             <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Ending in •••• 9012</div>
                          </div>
                       </div>
                       <div className="w-6 h-6 rounded-full bg-[#EC4899] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                       </div>
                    </div>

                    <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl flex items-center justify-between opacity-40 hover:opacity-100 transition-all cursor-not-allowed">
                       <div className="flex items-center gap-6">
                          <div className="text-4xl">🪙</div>
                          <div className="space-y-1">
                             <div className="text-sm font-black text-white uppercase tracking-tight">Asset Liquidation (Crypto)</div>
                             <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Uplink required</div>
                          </div>
                       </div>
                       <div className="w-6 h-6 rounded-full border border-white/10"></div>
                    </div>
                  </div>
               </div>

               <button 
                onClick={handleFinalize}
                className="w-full py-8 bg-[#EC4899] text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-xs hover:bg-white hover:text-[#EC4899] transition-all shadow-[0_0_50px_rgba(236,72,153,0.3)] active:scale-95 group relative overflow-hidden"
               >
                 <span className="relative z-10">Finalize Uplink Acquisition</span>
                 <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
               </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CheckoutView;
