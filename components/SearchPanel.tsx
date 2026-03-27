import React, { useState, useMemo } from 'react';
import { Product } from '../types';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductSelect: (p: Product) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  onProductSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      (p.appeal && p.appeal.toLowerCase().includes(query)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    ).slice(0, 12);
  }, [searchQuery, products]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-zinc-950 z-[310] shadow-2xl transition-transform duration-500 ease-out border-l border-white/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <header className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-black">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tighter">Search Archive</h2>
              <div className="text-[7px] sm:text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em]">Neural_Query_Interface</div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            >
              <span className="text-lg">✕</span>
            </button>
          </header>

          <div className="p-6 sm:p-8 bg-zinc-900/30">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter silhouette name or style..."
                className="w-full bg-black border border-white/10 rounded-2xl py-4 sm:py-5 pl-12 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00D1FF] transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 sm:p-8">
            {searchQuery ? (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex justify-between items-center">
                  <div className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Matches Found</div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-[#00D1FF]">{filteredProducts.length} Results</div>
                </div>
                
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {filteredProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onProductSelect(product);
                          onClose();
                        }}
                        className="group space-y-3 text-left"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-zinc-900 border border-white/5 relative">
                          <img src={product.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                            {product.appeal}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-white uppercase tracking-widest truncate">{product.name}</div>
                          <div className="text-[9px] font-mono text-zinc-600">GH₵{product.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 space-y-4">
                    <div className="text-4xl opacity-20">📡</div>
                    <p className="text-xs text-zinc-600 italic">No silhouettes matched your neural query.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Suggested Queries</div>
                  <div className="flex flex-wrap gap-2">
                    {['Old Money', 'Cyber', 'Techwear', 'Classic', 'Minimalist'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-4 py-2 bg-white/5 border border-white/5 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:border-[#00D1FF] hover:text-white transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl space-y-4">
                  <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest">Archive Tip</div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Use specific style archetypes like "Old Money" or "Streets" to filter the global archive more effectively.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPanel;
