
import React, { useState, useMemo } from 'react';
import { Category, ViewState, Product } from '../types';

interface CategoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
  onNavigate: (view: ViewState) => void;
  activeCategory: Category;
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const CATEGORIES = [
  { id: 'All' as Category, label: 'All Products', count: '124', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=200' },
  { id: 'Apparel' as Category, label: 'Apparel', count: '48', img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=200' },
  { id: 'Accessories' as Category, label: 'Accessories', count: '32', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200' },
  { id: 'Beauty' as Category, label: 'Beauty', count: '18', img: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=200' },
  { id: 'Home' as Category, label: 'Home', count: '26', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200' },
];

const CategoryPanel: React.FC<CategoryPanelProps> = ({ 
  isOpen, 
  onClose, 
  onSelectCategory, 
  onNavigate,
  activeCategory,
  products,
  onProductSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [searchQuery, products]);

  const trendingProducts = useMemo(() => products.filter(p => p.hypeScore > 90).slice(0, 3), [products]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => {
          onClose();
          setSearchQuery('');
        }}
      />

      {/* Side Panel Drawer */}
      <div className={`fixed top-0 left-0 h-full w-full max-w-sm bg-zinc-950 z-[210] shadow-2xl transition-transform duration-500 ease-out border-r border-white/5 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Shop</h2>
            <button 
              onClick={() => {
                onClose();
                setSearchQuery('');
              }}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
          </header>

          {/* Search Bar */}
          <div className="p-6 border-b border-white/5">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#EC4899] transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {searchQuery ? (
              /* Search Results */
              <div className="p-6 space-y-6">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Search Results</div>
                {filteredProducts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onProductSelect(product);
                          onClose();
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-4 text-left group"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                          <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{product.name}</div>
                          <div className="text-[10px] text-zinc-500">GH₵{product.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xs text-zinc-500 italic">No products found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ) : (
              /* Standard Menu */
              <div className="p-6 space-y-10">
                {/* Main Categories List */}
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Categories</div>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectCategory(cat.id);
                            onNavigate(ViewState.FAMOUS);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                            isActive ? 'bg-[#EC4899]/10 text-[#EC4899]' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5">
                              <img src={cat.img} className="w-full h-full object-cover grayscale" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-tight">{cat.label}</span>
                          </div>
                          <span className="text-[10px] font-mono opacity-40">{cat.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Featured / Trending Section */}
                <div className="space-y-6">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Trending Now</div>
                  <div className="grid grid-cols-1 gap-4">
                    {trendingProducts.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => {
                          onProductSelect(p);
                          onClose();
                        }}
                        className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all text-left"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-[#EC4899] uppercase tracking-widest">🔥 Hot</div>
                          <div className="text-xs font-bold text-white leading-tight line-clamp-1">{p.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="p-6 bg-black border-t border-white/5">
            <button 
              onClick={() => {
                onNavigate(ViewState.PROFILE);
                onClose();
              }}
              className="w-full py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
            >
              <span>View My Dossier</span>
              <span>→</span>
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default CategoryPanel;
