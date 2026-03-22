
import React, { useState, useEffect } from 'react';
import { PromoCode } from '../types';
import { databaseService } from '../services/databaseService';

const AdminPromoManager: React.FC = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [newPromo, setNewPromo] = useState({
    code: '',
    value: 10,
    type: 'PERCENT' as 'PERCENT' | 'AMOUNT',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'NEO_SUMMER_DISCOUNT'
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const data = await databaseService.getAdminPromos();
    setPromos(data);
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code) return;
    
    const promoData: PromoCode = {
      id: `promo-${Date.now()}`,
      ...newPromo
    };
    
    const result = await databaseService.addAdminPromo(promoData);
    if (result) {
      setNewPromo({
        code: '',
        value: 10,
        type: 'PERCENT',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'NEO_SUMMER_DISCOUNT'
      });
      refreshData();
    }
  };

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-serif italic text-white">Promo_Code_Generator</h2>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Incentivize Velocity & Loyalty</p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleAddPromo} className="bg-zinc-950 border border-white/5 p-10 rounded-[3rem] space-y-6">
          <div className="text-[10px] font-black text-[#1a73e8] uppercase tracking-widest">Forge New Protocol</div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Voucher_Code</label>
              <input 
                type="text"
                value={newPromo.code}
                onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                placeholder="e.g. NEO_SUMMER_25"
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Discount_Value</label>
                <input 
                  type="number"
                  value={newPromo.value}
                  onChange={(e) => setNewPromo({...newPromo, value: parseInt(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:outline-none focus:border-[#1a73e8]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Type</label>
                <select 
                  value={newPromo.type}
                  onChange={(e) => setNewPromo({...newPromo, type: e.target.value as any})}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:outline-none focus:border-[#1a73e8]"
                >
                  <option value="PERCENT">% Percentage</option>
                  <option value="AMOUNT">GH₵ Fixed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Expiration_Date</label>
              <input 
                type="date"
                value={newPromo.expiresAt}
                onChange={(e) => setNewPromo({...newPromo, expiresAt: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-mono text-white focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#1a73e8] hover:text-white transition-all active:scale-95">
            Initialize_Promo
          </button>
        </form>

        <div className="space-y-6">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Active_Vouchers</div>
          <div className="space-y-3">
            {promos.map(promo => (
              <div key={promo.id} className="bg-zinc-950 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">🎟️</div>
                  <div>
                    <div className="text-sm font-black text-white tracking-widest">{promo.code}</div>
                    <div className="text-[8px] text-zinc-600 uppercase font-bold">
                      {promo.type === 'PERCENT' ? `${promo.value}% OFF` : `GH₵${promo.value} OFF`} | Exp: {new Date(promo.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button className="text-zinc-700 hover:text-red-500 transition-colors">🗑️</button>
              </div>
            ))}
            {promos.length === 0 && (
              <div className="py-10 text-center border border-dashed border-white/5 rounded-3xl">
                <p className="text-[10px] text-zinc-700 uppercase italic">No active promo protocols</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromoManager;
