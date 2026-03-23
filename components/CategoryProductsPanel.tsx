import React, { useMemo } from 'react';
import { Product, Category } from '../types';

interface CategoryProductsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | 'All';
  products: Product[];
  onProductSelect: (p: Product) => void;
}

const CategoryProductsPanel: React.FC<CategoryProductsPanelProps> = ({ 
  isOpen, 
  onClose, 
  category, 
  products, 
  onProductSelect 
}) => {
  const filteredProducts = useMemo(() => {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
  }, [category, products]);

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
              <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tighter">{category === 'All' ? 'Global Archive' : `Sector: ${category}`}</h2>
              <div className="text-[7px] sm:text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em]">Inventory_Manifest_v4.0</div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            >
              <span className="text-lg">✕</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 sm:p-8">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex justify-between items-center">
                <div className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Available Silhouettes</div>
                <div className="text-[9px] sm:text-[10px] font-mono text-[#1a73e8]">{filteredProducts.length} Items</div>
              </div>
              
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
                      {product.isNew && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#1a73e8] text-[8px] font-black text-white uppercase tracking-widest">
                          New
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
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
            </div>
          </div>

          <footer className="p-8 bg-black border-t border-white/5">
            <div className="flex items-center justify-between text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em]">
              <span>Protocol_Active</span>
              <span>v4.0.2</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default CategoryProductsPanel;
