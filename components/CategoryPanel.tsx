
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
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Side Panel Drawer */}
      <div className={`fixed top-0 left-0 h-full w-full sm:max-w-sm bg-zinc-950 z-[210] shadow-2xl transition-transform duration-500 ease-out border-r border-white/5 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <header className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-black">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif italic text-white tracking-tighter">Aesthetic Sectors</h2>
              <div className="text-[7px] sm:text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Sector_Index_v2.5</div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            >
              <span className="text-lg">✕</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-6 sm:p-8 space-y-8 sm:space-y-10">
              
              {/* Categories List */}
              <div className="space-y-4 sm:space-y-6">
                <div className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Sector</div>
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          onClose();
                        }}
                        className={`w-full group flex items-center justify-between p-3 sm:p-4 border transition-all ${
                          isActive ? 'bg-[#EC4899] border-[#EC4899] text-white' : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 overflow-hidden border border-white/10">
                            <img src={cat.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          </div>
                          <div className="text-left">
                            <span className="block text-[10px] sm:text-xs font-black uppercase tracking-widest">{cat.label}</span>
                            <span className="text-[7px] sm:text-[8px] font-mono opacity-40 uppercase tracking-widest">Sector_{cat.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="text-[8px] sm:text-[10px] font-mono opacity-40">{cat.count}</span>
                          <span className="text-base sm:text-lg opacity-20 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Global Archive Link */}
              <button 
                onClick={() => {
                  onSelectCategory('All');
                  onClose();
                }}
                className="w-full py-4 sm:py-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all text-center space-y-1 sm:space-y-2 group"
              >
                <div className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">Global Inventory</div>
                <div className="text-[7px] sm:text-[8px] font-mono text-zinc-800 uppercase tracking-[0.5em]">Access_All_Silhouettes</div>
              </button>

            </div>
          </div>

          {/* Footer Actions */}
          <footer className="p-6 sm:p-8 bg-black border-t border-white/5">
            <button 
              onClick={() => {
                onNavigate(ViewState.PROFILE);
                onClose();
              }}
              className="w-full py-4 sm:py-5 bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-[#EC4899] hover:text-white transition-all flex items-center justify-center gap-3 sm:gap-4"
            >
              <span>View My Dossier</span>
              <span className="text-base sm:text-lg">→</span>
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default CategoryPanel;
