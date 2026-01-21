
import React from 'react';
import { Bundle } from '../types';

interface BundlesProps {
  bundles: Bundle[];
  onAddBundle: (bundle: Bundle) => void;
}

const Bundles: React.FC<BundlesProps> = ({ bundles, onAddBundle }) => {
  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in duration-500 pb-32 max-w-7xl mx-auto">
      <header className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter leading-none">Synergy <span className="text-[#EC4899] not-italic font-sans font-black uppercase">Kits</span></h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed max-w-md">
          Admin-curated archives of slow-moving silhouettes. Re-priced for high-velocity clearance.
        </p>
      </header>

      <div className="grid gap-12">
        {bundles.map(bundle => {
          const originalTotal = bundle.products.reduce((acc, p) => acc + p.originalPrice, 0);
          const savings = originalTotal - bundle.bundlePrice;
          const discountPercent = Math.round((savings / originalTotal) * 100);

          return (
            <div key={bundle.id} className="glass p-10 rounded-[3.5rem] border-white/5 space-y-10 relative overflow-hidden group shadow-3xl">
              {/* Discount Badge */}
              <div className="absolute top-0 right-0 bg-black border-l border-b border-white/10 px-8 py-4 rounded-bl-[2.5rem] z-10">
                <span className="text-xl font-mono font-black text-[#EC4899]">-{discountPercent}%</span>
              </div>

              <div className="space-y-3 relative z-10">
                <h2 className="text-4xl font-serif italic text-white leading-tight">{bundle.name}</h2>
                <p className="text-zinc-500 text-xs font-medium max-w-lg leading-relaxed italic opacity-80">"{bundle.description}"</p>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
                {bundle.products.map(p => (
                  <div key={p.id} className="min-w-[200px] aspect-[3/4] rounded-[2rem] overflow-hidden relative border border-white/5 snap-center group/card">
                    <img src={p.image} className="w-full h-full object-cover grayscale-[0.5] group-hover/card:grayscale-0 transition-all duration-700" alt={p.name} />
                    <div className="absolute inset-x-4 bottom-4 glass p-3 rounded-2xl border-white/10 translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all">
                      <div className="text-[8px] font-black text-white uppercase tracking-widest truncate">{p.name}</div>
                      <div className="text-[7px] font-bold text-zinc-500 uppercase tracking-tighter mt-0.5">{p.category}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10 border-t border-white/5 relative z-10">
                <div className="flex gap-12">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-500 uppercase block tracking-widest">Original Value</span>
                    <span className="text-xl font-mono font-black text-zinc-700 line-through">GH₵{originalTotal}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-pink-500 uppercase block tracking-widest">Vault Price</span>
                    <span className="text-4xl font-mono font-black text-white tracking-tighter">GH₵{bundle.bundlePrice}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => onAddBundle(bundle)}
                  className="px-16 py-6 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-[#EC4899] hover:text-white transition-all shadow-3xl active:scale-95 group"
                >
                  <span className="relative z-10">Acquire Synergy</span>
                </button>
              </div>
              
              {/* Background Accent */}
              <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-pink-500/5 blur-[100px] rounded-full group-hover:bg-pink-500/10 transition-colors duration-1000"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bundles;
