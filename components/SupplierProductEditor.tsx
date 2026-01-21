
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';

interface SupplierProductEditorProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const CATEGORIES: Category[] = ['Apparel', 'Accessories', 'Beauty', 'Home'];

const SupplierProductEditor: React.FC<SupplierProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'Apparel',
    description: '',
    details: [],
    inStock: true,
    stockCount: 0,
    tags: []
  });

  const [detailInput, setDetailInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (product) {
      // We explicitly pull only the allowed fields to prevent accidental hype manipulation
      setFormData({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        description: product.description,
        details: product.details,
        inStock: product.inStock,
        stockCount: product.stockCount,
        tags: product.tags
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addDetail = () => {
    if (detailInput.trim()) {
      setFormData({ ...formData, details: [...(formData.details || []), detailInput.trim()] });
      setDetailInput('');
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim().toUpperCase()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: (formData.tags || []).filter(t => t !== tagToRemove) });
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-zinc-950 border border-[#f59e0b]/20 w-full max-w-4xl rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.05)] flex flex-col max-h-[90vh]">
        <header className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif italic text-white">
              {product ? 'Modify_Uplink_Data' : 'Register_New_Silhouette'}
            </h2>
            <p className="text-[9px] font-black text-[#f59e0b] uppercase tracking-[0.4em]">Node Supply Ledger v3.0</p>
          </div>
          <button 
            onClick={onCancel}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-500/20 transition-all text-white"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scrollbar-hide font-mono">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest border-l-2 border-[#f59e0b] pl-3">Logistics Meta</div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Product Designation</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] transition-all outline-none"
                  placeholder="ITEM_NAME_STRING"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Base Valuation (GH₵)</label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Inventory Depth</label>
                  <input 
                    type="number"
                    required
                    value={formData.stockCount}
                    onChange={e => setFormData({...formData, stockCount: Number(e.target.value)})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Visual Uplink (Image URL)</label>
                <input 
                  type="url"
                  required
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] outline-none"
                />
                {formData.image && (
                   <div className="mt-4 aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 opacity-50">
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                   </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-zinc-700 pl-3">Design Intel</div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Dossier Snippet</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:border-[#f59e0b] transition-all outline-none resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block px-1">Neural Tags</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    placeholder="ADD_TAG..."
                    className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-3 text-[10px] text-white focus:border-[#f59e0b] outline-none"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button type="button" onClick={addTag} className="w-12 h-12 bg-[#f59e0b] text-black rounded-2xl flex items-center justify-center font-black">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map(tag => (
                    <span 
                      key={tag} 
                      onClick={() => removeTag(tag)}
                      className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] px-3 py-1 rounded-full text-[8px] font-black uppercase cursor-pointer hover:bg-red-500/20 hover:text-red-500 transition-all"
                    >
                      #{tag} ✕
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-4">
                 <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Read Only // Market Protocol</div>
                 <div className="grid grid-cols-2 gap-4 opacity-30 grayscale">
                    <div className="space-y-1">
                       <span className="text-[8px] block">Velocity Heat</span>
                       <span className="text-xs font-black">ENCRYPTED</span>
                    </div>
                    <div className="text-right space-y-1">
                       <span className="text-[8px] block">Global Hype</span>
                       <span className="text-xs font-black">SYSTEM_AUTH</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </form>

        <footer className="p-8 border-t border-white/5 flex gap-4 shrink-0">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-5 bg-zinc-900 text-zinc-500 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
          >
            Abort_Sync
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="flex-[2] py-5 bg-[#f59e0b] text-black rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl"
          >
            Authorize_Uplink
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SupplierProductEditor;
