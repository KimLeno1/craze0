
import React from 'react';
import { Bundle } from '../types';

interface BundlesProps {
  bundles: Bundle[];
  onAddBundle: (bundle: Bundle) => void;
}

const Bundles: React.FC<BundlesProps> = ({ bundles, onAddBundle }) => {
  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in duration-500 pb-32 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
             <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.5em]">Synergy Protocol</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-serif italic text-white tracking-tighter leading-none">Kits</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-sm leading-relaxed">
            Curated archives of synchronized silhouettes. Optimized for high-velocity acquisition.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-[10px] font-black text-zinc-800 uppercase tracking-[1em]">VAULT_CLEARANCE_ACTIVE</span>
        </div>
      </header>

      <div className="divide-y divide-white/5">
        {bundles.map((bundle, idx) => {
          const originalTotal = bundle.products.reduce((acc, p) => acc + p.originalPrice, 0);
          const savings = originalTotal - bundle.bundlePrice;
          const discountPercent = Math.round((savings / originalTotal) * 100);

          return (
            <div key={bundle.id} className="group py-24 space-y-12 hover:bg-white/[0.01] transition-all duration-500 px-4">
              <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl md:text-7xl font-serif italic text-white/20 group-hover:text-white/40 transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-serif italic text-white group-hover:text-[#00D1FF] transition-colors">{bundle.name}</h2>
                  </div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] max-w-lg leading-relaxed">
                    {bundle.description}
                  </p>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="flex items-center justify-end gap-4">
                    <span className="text-zinc-700 line-through font-mono text-xl">GH₵{originalTotal}</span>
                    <span className="text-4xl font-mono text-white">GH₵{bundle.bundlePrice}</span>
                  </div>
                  <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.4em]">
                    Yield: -{discountPercent}% Efficiency
                  </div>
                </div>
              </div>

              <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
                {bundle.products.map(p => (
                  <div key={p.id} className="min-w-[280px] md:min-w-[320px] aspect-[3/4] overflow-hidden bg-black border border-white/5 snap-center group/card relative">
                    <img src={p.image} className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-1000" alt={p.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <div className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{p.name}</div>
                      <div className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1">{p.category}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => onAddBundle(bundle)}
                  className="h-16 px-16 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-green-500 hover:text-white active:bg-green-700 transition-all shadow-2xl active:scale-95"
                >
                  Acquire Synergy Kit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bundles;
