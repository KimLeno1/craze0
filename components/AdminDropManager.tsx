import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { databaseService } from '../services/databaseService';
import { Calendar, Plus, Trash2, Clock, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminDropManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newDrop, setNewDrop] = useState({
    name: '',
    description: '',
    releaseDate: '',
    rarity: 'RARE',
    productIds: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [p, d] = await Promise.all([
        databaseService.getProducts(),
        databaseService.getDrops()
      ]);
      setProducts(p);
      setDrops(d);
    } catch (error) {
      console.error('Failed to fetch drop data:', error);
      toast.error('Failed to load drop data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDrop.productIds.length === 0) {
      toast.error('Select at least one product for the drop');
      return;
    }

    try {
      await databaseService.createDrop({
        ...newDrop,
        productIds: newDrop.productIds
      });
      toast.success('Drop scheduled successfully');
      setIsCreating(false);
      setNewDrop({
        name: '',
        description: '',
        releaseDate: '',
        rarity: 'RARE',
        productIds: []
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to schedule drop');
    }
  };

  const handleDeleteDrop = async (id: string) => {
    try {
      await databaseService.deleteDrop(id);
      toast.success('Drop removed');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove drop');
    }
  };

  const toggleProduct = (productId: string) => {
    setNewDrop(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-[#00D1FF] border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif italic text-white flex items-center gap-4">
            <Calendar className="w-8 h-8 text-[#00D1FF]" />
            Temporal_Drop_Scheduler
          </h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Manage Scheduled Product Releases</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-[#00D1FF] text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
        >
          {isCreating ? 'Cancel_Operation' : 'Schedule_New_Drop'}
          <Plus className="w-4 h-4" />
        </button>
      </header>

      {isCreating && (
        <div className="glass p-10 rounded-[3rem] border-[#00D1FF]/20 space-y-8 animate-in slide-in-from-top-4 duration-500">
          <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest border-l-2 border-[#00D1FF] pl-3">New_Drop_Configuration</div>
          
          <form onSubmit={handleCreateDrop} className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Drop Name</label>
                <input 
                  type="text"
                  required
                  value={newDrop.name}
                  onChange={e => setNewDrop({...newDrop, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black uppercase text-xs focus:border-[#00D1FF] transition-colors outline-none"
                  placeholder="e.g. CYBER_PUNK_COLLECTION"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Description</label>
                <textarea 
                  required
                  value={newDrop.description}
                  onChange={e => setNewDrop({...newDrop, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black uppercase text-xs focus:border-[#00D1FF] transition-colors outline-none min-h-[100px]"
                  placeholder="Describe the drop theme..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Release Date</label>
                  <input 
                    type="datetime-local"
                    required
                    value={newDrop.releaseDate}
                    onChange={e => setNewDrop({...newDrop, releaseDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black uppercase text-xs focus:border-[#00D1FF] transition-colors outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Rarity Tier</label>
                  <select 
                    value={newDrop.rarity}
                    onChange={e => setNewDrop({...newDrop, rarity: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black uppercase text-xs focus:border-[#00D1FF] transition-colors outline-none"
                  >
                    <option value="RARE">RARE</option>
                    <option value="EPIC">EPIC</option>
                    <option value="LEGENDARY">LEGENDARY</option>
                    <option value="MYTHIC">MYTHIC</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#00D1FF] text-black py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#00D1FF]/20 hover:scale-[1.02] transition-transform"
              >
                Initialize_Drop_Protocol
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex justify-between">
                Select Products
                <span className="text-[#00D1FF]">{newDrop.productIds.length} Selected</span>
              </label>
              <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {products.map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    className={`relative aspect-square rounded-xl border transition-all overflow-hidden group ${
                      newDrop.productIds.includes(product.id)
                        ? 'border-[#00D1FF] ring-2 ring-[#00D1FF]/20'
                        : 'border-white/5 grayscale hover:grayscale-0'
                    }`}
                  >
                    <img src={product.image} className="w-full h-full object-cover" />
                    {newDrop.productIds.includes(product.id) && (
                      <div className="absolute inset-0 bg-[#00D1FF]/20 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-[#00D1FF]" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-[8px] font-black text-white uppercase truncate">{product.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {drops.length === 0 ? (
          <div className="lg:col-span-2 glass p-20 rounded-[3rem] border-white/5 text-center space-y-4">
            <Clock className="w-12 h-12 text-zinc-700 mx-auto" />
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">No Drops Currently Scheduled</p>
          </div>
        ) : (
          drops.map(drop => {
            const isLive = new Date(drop.releaseDate) <= new Date();
            return (
              <div key={drop.id} className="glass p-8 rounded-[3rem] border-white/5 space-y-6 group hover:border-[#00D1FF]/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-white uppercase">{drop.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        isLive ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {isLive ? 'LIVE' : 'SCHEDULED'}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{drop.rarity} TIER</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteDrop(drop.id)}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 uppercase font-medium">{drop.description}</p>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <Calendar className="w-4 h-4 text-[#00D1FF]" />
                  <div className="text-[10px] font-black text-white uppercase tracking-widest">
                    {new Date(drop.releaseDate).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                    <span>Included Assets</span>
                    <span>{drop.productIds.length} Items</span>
                  </div>
                  <div className="flex -space-x-3">
                    {drop.productIds.slice(0, 5).map((pid: string) => {
                      const p = products.find(prod => prod.id === pid);
                      return p ? (
                        <div key={pid} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-zinc-900">
                          <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                      ) : null;
                    })}
                    {drop.productIds.length > 5 && (
                      <div className="w-10 h-10 rounded-full border-2 border-black bg-zinc-900 flex items-center justify-center text-[8px] font-black text-white">
                        +{drop.productIds.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminDropManager;
