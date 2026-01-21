
import React, { useState, useEffect } from 'react';
import { Product, ViewState, Order, OrderStatus } from '../types';
import { EXTENDED_PRODUCTS, MOCK_ORDERS } from '../mockData';
import AdminProductEditor from './AdminProductEditor';
import AdminOrderManager from './AdminOrderManager';
import AdminDatabaseView from './AdminDatabaseView';
import AdminSupplierPanel from './AdminSupplierPanel';
import { databaseService } from '../services/databaseService';

interface AdminPanelProps {
  onExit: () => void;
  onNavigate: (view: ViewState) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'INVENTORY' | 'MARKET' | 'ORDERS' | 'DATABASE' | 'SUPPLIERS' | 'SECURITY'>('METRICS');
  const [systemLoad, setSystemLoad] = useState(84);
  
  // Security State
  const [adminCreds, setAdminCreds] = useState({ identifier: '', password: '' });
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<string | null>(null);

  // State for product editing
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localOrders, setLocalOrders] = useState<Order[]>(MOCK_ORDERS);

  useEffect(() => {
    setLocalProducts(databaseService.getProducts());
    setAdminCreds(databaseService.getAdminCredentials());
  }, []);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleRegisterProduct = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      const updated = localProducts.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p);
      setLocalProducts(updated);
      databaseService.saveProducts(updated);
    } else {
      const newProduct: Product = {
        ...formData as Product,
        id: (localProducts.length + 1).toString(),
        inStock: (formData.stockCount || 0) > 0,
        viewers: 0,
        velocityScore: formData.velocityScore || 50,
        hypeScore: formData.hypeScore || 50
      };
      const updated = [newProduct, ...localProducts];
      setLocalProducts(updated);
      databaseService.saveProducts(updated);
    }
    setIsEditorOpen(false);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, tracking?: string) => {
    setLocalOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, trackingNumber: tracking || order.trackingNumber } 
        : order
    ));
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingCreds(true);
    setTimeout(() => {
      databaseService.updateAdminCredentials(adminCreds);
      setIsUpdatingCreds(false);
      setSecurityStatus('HANDSHAKE_KEYS_REPLACED_SUCCESSFULLY');
      setTimeout(() => setSecurityStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#020202] text-white flex flex-col font-mono overflow-hidden">
      {/* Top Status Bar */}
      <div className="h-14 bg-zinc-950 border-b border-white/10 px-8 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>SYSTEM_OVERRIDE_ACTIVE</span>
          </div>
          <div className="h-4 w-px bg-zinc-800"></div>
          <span>NODE: NEW_TOKYO_01</span>
        </div>
        <div className="flex items-center gap-8">
          <span>LOAD: {systemLoad}%</span>
          <button 
            onClick={onExit}
            className="text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 transition-all border border-red-500/20"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-black border-r border-white/5 flex flex-col">
          <div className="p-8">
             <div className="text-xl font-serif italic mb-1">Root_Admin</div>
             <div className="text-[8px] text-zinc-500 tracking-[0.4em] uppercase">Auth: Level_99</div>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {[
              { id: 'METRICS', label: 'Circuit Analytics', icon: '📊' },
              { id: 'INVENTORY', label: 'Silhouettes', icon: '👕' },
              { id: 'ORDERS', label: 'Order Management', icon: '🚚' },
              { id: 'SUPPLIERS', label: 'Supplier Network', icon: '🏢' },
              { id: 'DATABASE', label: 'Central Database', icon: '🗄️' },
              { id: 'SECURITY', label: 'Security Protocol', icon: '🛡️' },
              { id: 'MARKET', label: 'Market Mod', icon: '⚡' },
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
          </nav>
        </aside>

        {/* Main Console */}
        <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top_right,_#111_0%,_transparent_50%)]">
          {activeTab === 'SECURITY' && (
            <div className="max-w-2xl space-y-12 animate-in fade-in duration-500">
               <header>
                  <h2 className="text-3xl font-serif italic text-white leading-none">Security_Protocol</h2>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Manage Root Access Handshakes</p>
               </header>

               <div className="bg-zinc-950 border border-white/5 p-10 rounded-[3rem] space-y-10 shadow-2xl">
                  <div className="space-y-2">
                    <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Active Status</div>
                    <div className="flex items-center gap-4 text-xs">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       <span className="text-zinc-400">Identity Protection: ENCRYPTED</span>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateSecurity} className="space-y-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">New Identity Handle</label>
                           <input 
                            type="text" 
                            required
                            value={adminCreds.identifier}
                            onChange={e => setAdminCreds({...adminCreds, identifier: e.target.value})}
                            className="w-full bg-black border border-white/10 p-6 rounded-2xl text-xs font-mono text-white focus:border-[#EC4899] outline-none transition-all"
                            placeholder="ADMIN_ID"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">New Security Phrase</label>
                           <input 
                            type="password" 
                            required
                            value={adminCreds.password}
                            onChange={e => setAdminCreds({...adminCreds, password: e.target.value})}
                            className="w-full bg-black border border-white/10 p-6 rounded-2xl text-xs font-mono text-white focus:border-[#EC4899] outline-none transition-all"
                            placeholder="••••••••••••"
                           />
                        </div>
                     </div>

                     {securityStatus && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-[9px] font-black uppercase tracking-widest text-center animate-bounce">
                           {securityStatus}
                        </div>
                     )}

                     <button 
                      type="submit"
                      disabled={isUpdatingCreds}
                      className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-[#EC4899] hover:text-white transition-all shadow-xl disabled:opacity-50"
                     >
                       {isUpdatingCreds ? 'CALIBRATING_NEW_KEYS...' : 'Finalize Identity Shift'}
                     </button>
                  </form>
               </div>

               <div className="p-8 bg-red-950/10 border border-red-500/20 rounded-[2rem] flex items-center gap-6">
                  <div className="text-2xl">⚠️</div>
                  <p className="text-[9px] text-zinc-500 uppercase font-bold leading-relaxed tracking-widest">
                    Changing these keys will immediately invalidate current sessions. Ensure the new handshake is archived in a secure offline vault.
                  </p>
               </div>
            </div>
          )}

          {activeTab === 'METRICS' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'Active Archivers', value: '1,204', trend: '+12%', color: 'text-green-500' },
                    { label: 'Conversion Delta', value: '42.8%', trend: '+5.4%', color: 'text-[#EC4899]' },
                    { label: 'Total Valuation', value: 'GH₵1.2M', trend: '+22%', color: 'text-blue-500' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-zinc-950 p-8 rounded-3xl border border-white/5">
                      <div className="text-[8px] text-zinc-500 uppercase tracking-[0.4em] mb-4">{stat.label}</div>
                      <div className="flex items-baseline gap-4">
                        <div className="text-3xl font-black">{stat.value}</div>
                        <div className={`text-[10px] ${stat.color}`}>{stat.trend}</div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'INVENTORY' && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif italic">Archive Database</h2>
                  <button 
                    onClick={handleRegisterProduct}
                    className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all"
                  >
                    Register New Silhouette
                  </button>
               </div>
               <div className="grid gap-4">
                  {localProducts.map(p => (
                    <div key={p.id} className="bg-zinc-950 p-6 border border-white/5 flex items-center gap-8 hover:border-white/20 transition-all group">
                       <div className="w-16 h-16 bg-black rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                          <img src={p.image} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <div className="text-xs font-black uppercase text-white">{p.name}</div>
                          <div className="text-[9px] text-zinc-600 font-mono">SKU_{p.id} // STOCK_{p.stockCount}</div>
                       </div>
                       <div className="flex gap-4 items-center">
                          <div className="text-right">
                             <div className="text-[8px] text-zinc-600 uppercase">Velocity</div>
                             <div className="text-xs font-mono font-black text-[#EC4899]">{p.velocityScore}%</div>
                          </div>
                          <button 
                            onClick={() => handleEditProduct(p)}
                            className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all"
                          >
                            ⚙️
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'ORDERS' && (
            <AdminOrderManager 
              orders={localOrders} 
              onUpdateStatus={handleUpdateOrderStatus} 
            />
          )}

          {activeTab === 'SUPPLIERS' && (
            <AdminSupplierPanel />
          )}

          {activeTab === 'DATABASE' && (
            <AdminDatabaseView />
          )}

          {activeTab === 'MARKET' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
               <div className="bg-zinc-950 border border-red-500/20 p-10 rounded-3xl space-y-8">
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Danger Zone</div>
                  <div className="space-y-4">
                    <button className="w-full py-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                      Trigger Global Flash Drop
                    </button>
                    <button className="w-full py-6 bg-transparent border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all">
                      Force Stock Depletion (FOMO Cycle)
                    </button>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Editor Modal */}
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
