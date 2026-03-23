
import React from 'react';
import { Category, ViewState } from '../types';

interface CategoriesProps {
  onSelectCategory: (category: Category) => void;
  onNavigate: (view: ViewState) => void;
}

const CATEGORY_DATA = [
  { id: 'Apparel', label: 'Archival Apparel', icon: '🧥', img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800' },
  { id: 'Accessories', label: 'Tactical Gear', icon: '🎒', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800' },
  { id: 'Beauty', label: 'Synthetic Esthetics', icon: '🧪', img: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=800' },
  { id: 'Home', label: 'Habitat Objects', icon: '🏮', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800' },
];

const Categories: React.FC<CategoriesProps> = ({ onSelectCategory, onNavigate }) => {
  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-500 pb-32">
      <header>
        <h1 className="text-5xl font-serif italic text-white">The <span className="text-[#EC4899] not-italic font-sans font-black">SECTORS</span></h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Filter the archival database by category.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {CATEGORY_DATA.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => {
              onSelectCategory(cat.id as Category);
              onNavigate(ViewState.FAMOUS);
            }}
            className="group relative h-48 rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 hover:border-[#EC4899]/30 transition-all"
          >
            <img src={cat.img} className="w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            <div className="absolute inset-0 p-10 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-4xl">{cat.icon}</span>
                <h3 className="text-2xl font-serif italic text-white">{cat.label}</h3>
                <p className="text-[8px] font-black uppercase tracking-widest text-[#EC4899]">Access Authorized</p>
              </div>
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                <span className="text-white">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
