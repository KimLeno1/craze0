
import React, { useState, useEffect } from 'react';
import { Product, FlashSale } from '../types';
import { databaseService } from '../services/databaseService';

const AdminFlashSaleManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [globalDuration, setGlobalDuration] = useState(2);
  const [newSale, setNewSale] = useState({
    productId: '',
    discountPercent: 20
  });

  useEffect(() => {
    setProducts(databaseService.getProducts());
    setFlashSales(databaseService.getFlashSales());
    setGlobalDuration(databaseService.getFlashSaleDuration());
  }, []);

  const handleUpdateDuration = (hours: number) => {
    setGlobalDuration(hours);
    databaseService.saveFlashSaleDuration(hours);
  };

  const handleAddSale = () => {
    const product = products.find(p => p.id === newSale.productId);
    if (!product) return;

    const sale: FlashSale = {
      ...product,
      id: `flash_${Date.now()}`,
      productId: product.id,
      discountPercent: newSale.discountPercent,
      price: Math.floor(product.price * (1 - newSale.discountPercent / 100)),
      saleEndTime: Date.now() + globalDuration * 60 * 60 * 1000 // This is just for individual sale tracking if needed
    };

    const updated = [...flashSales, sale];
    setFlashSales(updated);
    databaseService.saveFlashSales(updated);
    setIsAdding(false);
  };

  const handleDeleteSale = (id: string) => {
    const updated = flashSales.filter(s => s.id !== id);
    setFlashSales(updated);
    databaseService.saveFlashSales(updated);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif italic text-white">Flash_Sale_Protocols</h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Initialize High-Velocity Liquidation Events</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-950 border border-white/10 p-4 rounded-xl flex items-center gap-4">
            <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Global_Window (Hrs)</label>
            <input 
              type="number"
              value={globalDuration}
              onChange={e => handleUpdateDuration(parseInt(e.target.value))}
              className="w-16 bg-black border border-white/10 p-2 rounded text-xs text-white outline-none focus:border-[#EC4899]"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-[#EC4899] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Initialize_New_Sale
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="bg-zinc-950 border border-[#EC4899]/30 p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-top-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Target_Asset</label>
              <select 
                value={newSale.productId}
                onChange={e => setNewSale({...newSale, productId: e.target.value})}
                className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-[#EC4899]"
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (GH₵{p.price})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Discount_Factor (%)</label>
              <input 
                type="number"
                value={newSale.discountPercent}
                onChange={e => setNewSale({...newSale, discountPercent: parseInt(e.target.value)})}
                className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-[#EC4899]"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={handleAddSale} className="flex-1 bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#EC4899] hover:text-white transition-all">Confirm_Protocol</button>
            <button onClick={() => setIsAdding(false)} className="flex-1 bg-zinc-900 text-zinc-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Abort</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {flashSales.map(sale => (
          <div key={sale.id} className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] flex gap-8 items-center group hover:border-[#EC4899]/30 transition-all">
            <img src={sale.image} className="w-24 h-24 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all" />
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-xl font-black text-white">{sale.name}</div>
                <div className="text-[9px] text-[#EC4899] font-black uppercase tracking-widest">-{sale.discountPercent}% Liquidation</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="text-[8px] text-zinc-600 uppercase tracking-widest">Sale_Price</div>
                  <div className="text-2xl font-mono text-white">GH₵{sale.price}</div>
                </div>
                <button 
                  onClick={() => handleDeleteSale(sale.id)}
                  className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                >
                  Terminate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFlashSaleManager;
