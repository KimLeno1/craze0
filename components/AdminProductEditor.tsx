import React, { useState, useEffect } from 'react';
import { Product, Category, Gender } from '../types';

interface AdminProductEditorProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const CATEGORIES: Category[] = ['Apparel', 'Accessories', 'Beauty', 'Home'];
const GENDERS: Gender[] = ['MALE', 'FEMALE', 'UNISEX'];

const AdminProductEditor: React.FC<AdminProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    shippingFee: 0,
    image: '',
    category: 'Apparel',
    gender: 'UNISEX',
    description: '',
    details: [],
    inStock: true,
    viewers: 0,
    stockCount: 0,
    hypeScore: 50,
    velocityScore: 50,
    tags: [],
    sizes: [],
    isCustom: false,
    priceRange: { min: 0, max: 0 },
    customizationFields: []
  });

  const [detailInput, setDetailInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  
  // Customization Field State
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'select' | 'color'>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');

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

  const addSize = () => {
    if (sizeInput.trim()) {
      setFormData({ ...formData, sizes: [...(formData.sizes || []), sizeInput.trim().toUpperCase()] });
      setSizeInput('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData({ ...formData, sizes: (formData.sizes || []).filter(s => s !== sizeToRemove) });
  };

  const addCustomField = () => {
    if (newFieldName.trim()) {
      const options = newFieldOptions.split(',').map(o => o.trim()).filter(o => o);
      const newField = {
        id: `field-${Date.now()}`,
        label: newFieldName.trim(),
        type: newFieldType,
        required: true,
        options: newFieldType === 'select' ? options : undefined
      };
      setFormData({
        ...formData,
        customizationFields: [...(formData.customizationFields || []), newField]
      });
      setNewFieldName('');
      setNewFieldOptions('');
    }
  };

  const removeCustomField = (id: string) => {
    setFormData({
      ...formData,
      customizationFields: (formData.customizationFields || []).filter(f => f.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 overflow-y-auto">
      <div className="bg-[#0a0a0c] border border-white/10 w-full max-w-4xl rounded-[3rem] shadow-[0_0_100px_rgba(0,209,255,0.1)] flex flex-col max-h-[90vh]">
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
              <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest border-l-2 border-[#00D1FF] pl-3">Primary Identity</div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Designation</label>
                <input 
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Midnight Cyber Cloak"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#00D1FF] transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Available Price (GH₵)</label>
                  <input 
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#00D1FF] transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Logistics (Shipping GH₵)</label>
                  <input 
                    type="number"
                    required
                    value={formData.shippingFee || 0}
                    onChange={e => setFormData({...formData, shippingFee: Number(e.target.value)})}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#00D1FF] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Sector Allocation</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#00D1FF] transition-all outline-none appearance-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Sex Protocol</label>
                  <select 
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#00D1FF] transition-all outline-none appearance-none"
                  >
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest border-l-2 border-[#00D1FF] pl-3">Technical Intel</div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Dossier Description</label>
                <textarea 
                  rows={4}
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#00D1FF] transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Inventory Depth</label>
                    <input 
                      type="number"
                      value={formData.stockCount || 0}
                      onChange={e => setFormData({...formData, stockCount: Number(e.target.value)})}
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Hype Coefficient ({formData.hypeScore}%)</label>
                    <input 
                      type="range"
                      min="0" max="100"
                      value={formData.hypeScore || 0}
                      onChange={e => setFormData({...formData, hypeScore: Number(e.target.value)})}
                      className="w-full accent-[#00D1FF]"
                    />
                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-10 h-5 rounded-full p-1 transition-colors ${formData.isHallOfFame ? 'bg-amber-500' : 'bg-zinc-800'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${formData.isHallOfFame ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                        <input 
                          type="checkbox"
                          className="hidden"
                          checked={formData.isHallOfFame || false}
                          onChange={e => setFormData({...formData, isHallOfFame: e.target.checked})}
                        />
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Hall of Fame Status</span>
                      </label>
                    </div>
                 </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Visual Asset Uplink (URL)</label>
                <input 
                  type="url"
                  required
                  value={formData.image || ''}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-[#00D1FF] transition-all outline-none"
                />
              </div>

              {/* Custom Product Configuration */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest border-l-2 border-[#00D1FF] pl-3">Customization Protocol</div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.isCustom || false}
                      onChange={e => setFormData({...formData, isCustom: e.target.checked})}
                      className="w-5 h-5 rounded border-white/10 bg-zinc-900 text-[#00D1FF] focus:ring-[#00D1FF]"
                    />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Enable Customization</span>
                  </label>
                </div>

                {formData.isCustom && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Min Price (GH₵)</label>
                        <input 
                          type="number"
                          value={formData.priceRange?.min || 0}
                          onChange={e => setFormData({...formData, priceRange: { ...formData.priceRange!, min: Number(e.target.value) }})}
                          className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Max Price (GH₵)</label>
                        <input 
                          type="number"
                          value={formData.priceRange?.max || 0}
                          onChange={e => setFormData({...formData, priceRange: { ...formData.priceRange!, max: Number(e.target.value) }})}
                          className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Customization Form Builder</label>
                      
                      <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text"
                            placeholder="Field Label (e.g. Waist Size)"
                            value={newFieldName}
                            onChange={e => setNewFieldName(e.target.value)}
                            className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                          />
                          <select 
                            value={newFieldType}
                            onChange={e => setNewFieldType(e.target.value as any)}
                            className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                          >
                            <option value="text">Text Input</option>
                            <option value="select">Dropdown Select</option>
                            <option value="color">Color Picker</option>
                          </select>
                        </div>
                        
                        {newFieldType === 'select' && (
                          <input 
                            type="text"
                            placeholder="Options (comma separated: S, M, L)"
                            value={newFieldOptions}
                            onChange={e => setNewFieldOptions(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                          />
                        )}

                        <button 
                          type="button"
                          onClick={addCustomField}
                          className="w-full py-3 bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#00D1FF] hover:text-white transition-all"
                        >
                          Add Field to Form
                        </button>
                      </div>

                      <div className="space-y-2">
                        {formData.customizationFields?.map((field) => (
                          <div key={field.id} className="flex items-center justify-between bg-zinc-900/30 border border-white/5 px-6 py-4 rounded-2xl">
                            <div>
                              <span className="text-xs font-bold text-white uppercase">{field.label}</span>
                              <span className="ml-3 text-[8px] font-black text-zinc-500 uppercase tracking-widest">[{field.type}]</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeCustomField(field.id)}
                              className="text-zinc-600 hover:text-red-500 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
            className="flex-[2] py-5 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-[#00D1FF] hover:text-white transition-all shadow-2xl"
          >
            Finalize_Entry
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AdminProductEditor;