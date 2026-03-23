
import React, { useState, useEffect } from 'react';
import { Product, ViewState, Order, OrderStatus, Notification, PromoCode } from '../types';
import { databaseService } from '../services/databaseService';
import { MOCK_ORDERS } from '../mockData';
import AdminProductEditor from './AdminProductEditor';
import AdminOrderManager from './AdminOrderManager';
import AdminDatabaseView from './AdminDatabaseView';
import AdminSupplierPanel from './AdminSupplierPanel';
import AdminSecurityPanel from './AdminSecurityPanel';
import AdminFlashSaleManager from './AdminFlashSaleManager';
import AdminKitManager from './AdminKitManager';
import AdminNotificationManager from './AdminNotificationManager';
import AdminPayForMeManager from './AdminPayForMeManager';

interface AdminPanelProps {
  onExit: () => void;
  onNavigate: (view: ViewState) => void;
  onSetJackpot: (productId: string) => void;
  currentJackpotId: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit, onNavigate, onSetJackpot, currentJackpotId }) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'INVENTORY' | 'JACKPOT' | 'ORDERS' | 'DATABASE' | 'SUPPLIERS' | 'PROMOS' | 'SECURITY' | 'FLASH' | 'KITS' | 'NOTIFICATIONS' | 'SPONSORSHIPS'>('METRICS');
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localOrders, setLocalOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setLocalProducts(databaseService.getProducts());
  }, []);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      const updated = localProducts.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p);
      setLocalProducts(updated);
      databaseService.saveProducts(updated);
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#020202] text-white flex flex-col font-mono overflow-hidden">
      <div className="h-14 bg-zinc-950 border-b border-white/10 px-8 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em]">
        <span>SYSTEM_OVERRIDE_ACTIVE</span>
        <button onClick={onExit} className="text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 transition-all border border-red-500/20">
          TERMINATE_SESSION
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-black border-r border-white/5 flex flex-col p-4 space-y-2">
          {[
            { id: 'METRICS', label: 'Analytics', icon: '📊' },
            { id: 'INVENTORY', label: 'Inventory', icon: '👕' },
            { id: 'JACKPOT', label: 'Jackpot Prize', icon: '🏆' },
            { id: 'ORDERS', label: 'Orders', icon: '🚚' },
            { id: 'DATABASE', label: 'Database', icon: '🗄️' },
            { id: 'SUPPLIERS', label: 'Suppliers', icon: '🏢' },
            { id: 'PROMOS', label: 'Promos', icon: '🎟️' },
            { id: 'KITS', label: 'Synergy Kits', icon: '📦' },
            { id: 'FLASH', label: 'Flash Sales', icon: '⚡' },
            { id: 'NOTIFICATIONS', label: 'Broadcast', icon: '📢' },
            { id: 'SPONSORSHIPS', label: 'Pay For Me', icon: '🤝' },
            { id: 'SECURITY', label: 'Security', icon: '🛡️' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-white text-black' : 'text-zinc-500 hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-12">
          {activeTab === 'JACKPOT' && (
            <div className="max-w-4xl space-y-12 animate-in fade-in duration-500">
               <header>
                  <h2 className="text-3xl font-serif italic text-white">Weekly_Jackpot_Asset</h2>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Designate the Apex Prize</p>
               </header>

               <div className="bg-zinc-950 border border-white/5 p-10 rounded-[3rem] space-y-8">
                  <div className="text-[10px] font-black text-[#EC4899] uppercase tracking-widest">Active Jackpot</div>
                  {localProducts.find(p => p.id === currentJackpotId) && (
                    <div className="flex gap-8 items-center bg-black/50 p-6 rounded-3xl border border-[#EC4899]/30">
                       <img src={localProducts.find(p => p.id === currentJackpotId)?.image} className="w-24 h-24 object-cover rounded-xl" />
                       <div>
                          <div className="text-xl font-black text-white">{localProducts.find(p => p.id === currentJackpotId)?.name}</div>
                          <div className="text-[10px] text-zinc-500 uppercase">SKU: {currentJackpotId}</div>
                       </div>
                    </div>
                  )}

                  <div className="grid gap-3">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select New Protocol</div>
                    {localProducts.slice(0, 8).map(p => (
                      <button 
                        key={p.id}
                        onClick={() => onSetJackpot(p.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${currentJackpotId === p.id ? 'border-[#EC4899] bg-[#EC4899]/5' : 'border-white/5 hover:border-white/20'}`}
                      >
                        <span className="text-xs font-black text-white">{p.name}</span>
                        <span className="text-[8px] font-bold text-zinc-600 uppercase">GH₵{p.price}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'METRICS' && <div className="text-zinc-500">Analytics Terminal Loading...</div>}
          {activeTab === 'INVENTORY' && (
            <div className="grid gap-4">
              {localProducts.map(p => (
                <div key={p.id} className="bg-zinc-950 p-6 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-6">
                    <img src={p.image} className="w-16 h-20 object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all" />
                    <div className="space-y-1">
                      <div className="text-xs uppercase font-black text-white">{p.name}</div>
                      <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">SKU: {p.id} | Price: GH₵{p.price}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Hype Velocity</label>
                        {p.isHallOfFame && <span className="text-[8px] font-black text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase">Hall of Fame</span>}
                      </div>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={p.hypeScore || 0} 
                          onChange={(e) => {
                            const newHype = parseInt(e.target.value);
                            const updated = localProducts.map(prod => prod.id === p.id ? { ...prod, hypeScore: newHype } : prod);
                            setLocalProducts(updated);
                            databaseService.updateProductHype(p.id, newHype);
                          }}
                          className="w-32 accent-[#EC4899] bg-zinc-900 h-1 rounded-full appearance-none cursor-pointer"
                        />
                        <span className="text-[10px] font-mono font-black text-[#EC4899] w-8 text-right">{p.hypeScore || 0}%</span>
                      </div>
                    </div>
                    
                    <button onClick={() => handleEditProduct(p)} className="px-6 py-3 bg-white/5 hover:bg-white hover:text-black text-[9px] uppercase font-black tracking-widest transition-all rounded-lg border border-white/5">
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'ORDERS' && <AdminOrderManager orders={localOrders} onUpdateStatus={() => {}} />}
          {activeTab === 'DATABASE' && <AdminDatabaseView />}
          {activeTab === 'SUPPLIERS' && <AdminSupplierPanel />}
          {activeTab === 'FLASH' && <AdminFlashSaleManager />}
          {activeTab === 'KITS' && <AdminKitManager />}
          {activeTab === 'NOTIFICATIONS' && <AdminNotificationManager />}
          {activeTab === 'SPONSORSHIPS' && <AdminPayForMeManager />}
          {activeTab === 'SECURITY' && <AdminSecurityPanel />}
        </main>
      </div>

      {isEditorOpen && (
        <AdminProductEditor 
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
