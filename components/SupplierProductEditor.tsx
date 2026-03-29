import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, Gender } from '../types';
import { databaseService } from '../services/databaseService';
import { Camera, Upload, Loader2 } from 'lucide-react';

interface SupplierProductEditorProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const CATEGORIES: Category[] = ['Apparel', 'Accessories', 'Beauty', 'Home'];
const GENDERS: Gender[] = ['MALE', 'FEMALE', 'UNISEX'];

const SupplierProductEditor: React.FC<SupplierProductEditorProps> = ({ product, onSave, onCancel }) => {
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
    stockCount: 0,
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        shippingFee: product.shippingFee || 0,
        image: product.image,
        category: product.category,
        gender: product.gender || 'UNISEX',
        description: product.description,
        details: product.details,
        inStock: product.inStock,
        stockCount: product.stockCount,
        tags: product.tags,
        sizes: product.sizes || [],
        isCustom: product.isCustom || false,
        priceRange: product.priceRange || { min: 0, max: 0 },
        customizationFields: product.customizationFields || []
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData.name) return;

    setIsUploading(true);
    try {
      const result = await databaseService.uploadProductImage(file, formData.name);
      if (result.url) {
        setFormData(prev => ({ ...prev, image: result.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
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
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] transition-all outline-none"
                  placeholder="ITEM_NAME_STRING"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Available Price (GH₵)</label>
                  <input 
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Logistics Yield (Shipping GH₵)</label>
                  <input 
                    type="number"
                    required
                    value={formData.shippingFee || 0}
                    onChange={e => setFormData({...formData, shippingFee: Number(e.target.value)})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] outline-none"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Inventory Depth</label>
                  <input 
                    type="number"
                    required
                    value={formData.stockCount || 0}
                    onChange={e => setFormData({...formData, stockCount: Number(e.target.value)})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Sector</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] outline-none appearance-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block px-1">Scale Options (Sizes)</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={sizeInput}
                    onChange={e => setSizeInput(e.target.value)}
                    placeholder="ADD_SIZE..."
                    className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-3 text-[10px] text-white focus:border-[#f59e0b] outline-none"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  />
                  <button type="button" onClick={addSize} className="w-12 h-12 bg-[#f59e0b] text-black rounded-2xl flex items-center justify-center font-black">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes?.map(size => (
                    <span 
                      key={size} 
                      onClick={() => removeSize(size)}
                      className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] px-3 py-1 rounded-full text-[8px] font-black uppercase cursor-pointer hover:bg-red-500/20 hover:text-red-500 transition-all"
                    >
                      {size} ✕
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1 flex justify-between items-center">
                  Visual Uplink (Image)
                  {isUploading && <Loader2 className="w-3 h-3 animate-spin text-[#f59e0b]" />}
                </label>
                
                <div className="flex gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 bg-black border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f59e0b]/50 transition-all group shrink-0 overflow-hidden"
                  >
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-zinc-700 group-hover:text-[#f59e0b] mb-2" />
                        <span className="text-[8px] font-black text-zinc-700 group-hover:text-[#f59e0b] uppercase tracking-widest">Upload</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <input 
                      type="url"
                      required
                      value={formData.image || ''}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] focus:border-[#f59e0b] outline-none"
                      placeholder="OR_PASTE_URL_HERE"
                    />
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest px-2">
                      {formData.name ? 'Ready for upload' : 'Enter product name first to enable upload'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Product Configuration */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest border-l-2 border-[#f59e0b] pl-3">Customization Protocol</div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.isCustom || false}
                      onChange={e => setFormData({...formData, isCustom: e.target.checked})}
                      className="w-5 h-5 rounded border-white/10 bg-black text-[#f59e0b] focus:ring-[#f59e0b]"
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
                          className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Max Price (GH₵)</label>
                        <input 
                          type="number"
                          value={formData.priceRange?.max || 0}
                          onChange={e => setFormData({...formData, priceRange: { ...formData.priceRange!, max: Number(e.target.value) }})}
                          className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs text-[#f59e0b] outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Customization Form Builder</label>
                      
                      <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text"
                            placeholder="Field Label"
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
                            placeholder="Options (comma separated)"
                            value={newFieldOptions}
                            onChange={e => setNewFieldOptions(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none"
                          />
                        )}

                        <button 
                          type="button"
                          onClick={addCustomField}
                          className="w-full py-3 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#f59e0b] hover:text-black transition-all"
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

            <div className="space-y-8">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-zinc-700 pl-3">Design Intel</div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Dossier Snippet</label>
                <textarea 
                  rows={4}
                  value={formData.description || ''}
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