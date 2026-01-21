
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';

interface AdminProductEditorProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const CATEGORIES: Category[] = ['Apparel', 'Accessories', 'Beauty', 'Home'];

const AdminProductEditor: React.FC<AdminProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'Apparel',
    description: '',
    details: [],
    inStock: true,
    viewers: 0,
    stockCount: 0,
    hypeScore: 50,
    velocityScore: 50,
    tags: []
  });

  const [detailInput, setDetailInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
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

  const removeDetail = (index: number) => {
    const newDetails = [...(formData.details || [])];
    newDetails.splice(index, 1);
    setFormData({ ...formData, details: newDetails });
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
    <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 overflow-y-auto">
      <div className="bg-[#0a0a0c] border border-white/10 w-full max-w-4xl rounded-[3rem] shadow-[0_0_100px_rgba(236,72,153,0.1)] flex flex-col max-h-[90vh]">
        <header className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-serif italic text-white">
              {product ? 'Modify_Silhouette' : 'Register_New_Silhouette'}
            </h2>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Archive Entry Mod_v2.5</p>
          </div>
          <button 
            onClick={onCancel}
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-red-500/20 transition-all text-white"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scrollbar-hide">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Basic Info */}
            <div className="space-y-6">
              <div className="text-[10px] font-black text-[#EC4899] uppercase tracking-widest border-l-2 border-[#EC4899] pl-3">Primary Identity</div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Designation</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Midnight Cyber Cloak"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#EC4899] transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Vault Price (GH₵)</label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#EC4899] transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Market Base (GH₵)</label>
                  <input 
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={e => setFormData({...formData, originalPrice: Number(e.target.value)})}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#EC4899] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Sector Allocation</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as Category})}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#EC4899] transition-all outline-none appearance-none"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Visual Asset Uplink (URL)</label>
                <input 
                  type="url"
                  required
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#EC4899] transition-all outline-none"
                />
                {formData.image && (
                  <div className="mt-4 aspect-[4/5] rounded-3xl overflow-hidden border border-white/5">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-50" />
                  </div>
                )}
              </div>
            </div>

            {/* Technical Specs */}
            <div className="space-y-8">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-l-2 border-blue-500 pl-3">Technical Intel</div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Dossier Description</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-blue-500 transition-all outline-none resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Structural Details</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={detailInput}
                    onChange={e => setDetailInput(e.target.value)}
                    placeholder="Add specification..."
                    className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-3 text-xs text-white focus:border-blue-500 outline-none"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDetail())}
                  />
                  <button type="button" onClick={addDetail} className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">+</button>
                </div>
                <div className="space-y-2">
                  {formData.details?.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-white/5 group">
                      <span className="text-[10px] text-zinc-400 font-mono">{detail}</span>
                      <button type="button" onClick={() => removeDetail(idx)} className="text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Neural Tags</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-3 text-xs text-white focus:border-blue-500 outline-none"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button type="button" onClick={addTag} className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map(tag => (
                    <span 
                      key={tag} 
                      onClick={() => removeTag(tag)}
                      className="bg-blue-600/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-[8px] font-black uppercase cursor-pointer hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 transition-all"
                    >
                      #{tag} ✕
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Inventory Depth</label>
                    <input 
                      type="number"
                      value={formData.stockCount}
                      onChange={e => setFormData({...formData, stockCount: Number(e.target.value)})}
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Hype Coefficient</label>
                    <input 
                      type="range"
                      min="0" max="100"
                      value={formData.hypeScore}
                      onChange={e => setFormData({...formData, hypeScore: Number(e.target.value)})}
                      className="w-full accent-[#EC4899]"
                    />
                    <div className="text-right text-[10px] font-mono text-[#EC4899]">{formData.hypeScore}%</div>
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
            Abort_Changes
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="flex-[2] py-5 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-[#EC4899] hover:text-white transition-all shadow-2xl"
          >
            Finalize_Entry
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminProductEditor;
