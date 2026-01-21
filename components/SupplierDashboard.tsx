
import React, { useState, useEffect } from 'react';
import { Product, Supplier, Order, OrderStatus } from '../types';
import { databaseService } from '../services/databaseService';
import { MOCK_ORDERS } from '../mockData';
import SupplierProductEditor from './SupplierProductEditor';

interface SupplierDashboardProps {
  supplierId: string;
  onLogout: () => void;
}

const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ supplierId, onLogout }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    refreshData();
  }, [supplierId]);

  const refreshData = () => {
    const allSuppliers = databaseService.getSuppliers();
    const current = allSuppliers.find(s => s.id === supplierId) || allSuppliers[0];
    setSupplier(current);

    const allProducts = databaseService.getProducts();
    const myProducts = allProducts.filter(p => p.supplierId === current.id);
    setProducts(myProducts);

    const myOrders = MOCK_ORDERS.filter(o => 
      o.items.some(item => myProducts.find(mp => mp.id === item.id))
    );
    setOrders(myOrders);
  };

  const handleSaveProduct = (formData: Partial<Product>) => {
    const allProducts = databaseService.getProducts();
    if (editingProduct) {
      const updated = allProducts.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p);
      databaseService.saveProducts(updated);
    } else {
      const newProduct: Product = {
        ...formData as Product,
        id: `SP-${Date.now()}`,
        supplierId: supplier?.id,
        inStock: (formData.stockCount || 0) > 0,
        viewers: 0,
        velocityScore: 0, // Restricted: Always start at 0
        hypeScore: 0,    // Restricted: Always start at 0
        isNew: true
      };
      databaseService.saveProducts([newProduct, ...allProducts]);
    }
    setIsEditorOpen(false);
    refreshData();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleRegister = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  if (!supplier) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-[#020202] text-[#f59e0b] flex flex-col font-mono overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-zinc-950 border-b border-[#f59e0b]/20 px-8 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></span>
            <span>NODE_UPLINK_STABLE</span>
          </div>
          <div className="h-4 w-px bg-zinc-800"></div>
          <span>OPERATOR: {supplier.name}</span>
        </div>
        <button 
          onClick={onLogout}
          className="text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black px-4 py-2 transition-all border border-[#f59e0b]/20"
        >
          DISCONNECT
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top_right,_#110b00_0%,_transparent_50%)] space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start gap-8">
           <div className="space-y-2">
              <h1 className="text-4xl font-serif italic text-white leading-none">Node_Console</h1>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">{supplier.region} Logistics Terminal</p>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-zinc-950 px-8 py-4 rounded-3xl border border-white/5 flex flex-col items-center">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Local Yield</span>
                 <span className="text-xl font-mono font-black text-white">GH₵{supplier.totalRevenueYield.toLocaleString()}</span>
              </div>
              <div className="bg-zinc-950 px-8 py-4 rounded-3xl border border-white/5 flex flex-col items-center">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Sync Performance</span>
                 <span className="text-xl font-mono font-black text-[#f59e0b]">{supplier.performanceScore}%</span>
              </div>
           </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Inventory Summary */}
          <section className="lg:col-span-7 space-y-8">
             <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="space-y-1">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Inventory Status</h3>
                   <span className="text-[8px] text-zinc-600 font-mono tracking-widest uppercase">Manage Archival Silhouettes</span>
                </div>
                <button 
                  onClick={handleRegister}
                  className="bg-[#f59e0b] text-black px-6 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all rounded-lg"
                >
                  Register New Silhouette
                </button>
             </div>
             
             <div className="grid gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-zinc-950 border border-white/5 p-6 rounded-[2rem] flex items-center gap-8 hover:border-[#f59e0b]/20 transition-all group">
                     <div className="w-16 h-20 rounded-2xl overflow-hidden bg-black grayscale group-hover:grayscale-0 transition-all">
                        <img src={p.image} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <div className="text-xs font-black text-white uppercase">{p.name}</div>
                        <div className="text-[9px] text-zinc-600 font-mono mt-1">
                          SKU_{p.id} // STOCK_{p.stockCount} // GH₵{p.price}
                        </div>
                        <div className="flex gap-2 mt-3">
                           {p.tags?.slice(0, 2).map(t => (
                             <span key={t} className="text-[7px] text-zinc-700 font-black uppercase tracking-widest">#{t}</span>
                           ))}
                        </div>
                     </div>
                     <div className="flex gap-4 items-center">
                        <div className="text-right">
                           <div className="text-[8px] text-zinc-600 uppercase tracking-widest">Market Feed</div>
                           <div className="text-xs font-black text-[#f59e0b]">{p.velocityScore}% HEAT</div>
                        </div>
                        <button 
                          onClick={() => handleEdit(p)}
                          className="w-10 h-10 border border-white/5 rounded-xl flex items-center justify-center text-lg hover:bg-[#f59e0b] hover:text-black transition-all"
                        >
                          ⚙️
                        </button>
                     </div>
                  </div>
                ))}
                {products.length === 0 && (
                   <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem] space-y-4">
                      <div className="text-4xl opacity-20">🏢</div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 italic">No supply records found for this node.</p>
                   </div>
                )}
             </div>
          </section>

          {/* Pending Logistics */}
          <section className="lg:col-span-5 space-y-8">
             <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="space-y-1">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Logistics Feed</h3>
                   <span className="text-[8px] text-zinc-600 font-mono tracking-widest uppercase">Incoming Regional Fulfillment</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{orders.length} Records</span>
             </div>
             
             <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="bg-zinc-950 border border-white/5 p-6 rounded-[2.5rem] space-y-6">
                     <div className="flex justify-between items-start">
                        <div>
                           <div className="text-[10px] font-black text-white">{o.id}</div>
                           <div className="text-[8px] text-zinc-700 uppercase tracking-widest mt-1">TIMESTAMP: {o.timestamp.split('T')[0]}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          o.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20'
                        }`}>
                          {o.status}
                        </span>
                     </div>

                     <div className="space-y-3">
                        <div className="text-[8px] font-black text-zinc-700 uppercase tracking-widest px-1">Allocated Units</div>
                        <div className="space-y-2">
                           {o.items.filter(i => products.some(mp => mp.id === i.id)).map((item, idx) => (
                             <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-xl flex justify-between items-center">
                                <span className="text-[9px] text-zinc-400 font-bold uppercase truncate max-w-[150px]">{item.name}</span>
                                <span className="text-[10px] font-black text-white">x{item.quantity}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <div className="space-y-1">
                           <span className="text-[8px] font-black text-zinc-700 uppercase block">Ship To</span>
                           <span className="text-[9px] text-zinc-500 uppercase font-bold truncate max-w-[140px]">{o.deliveryAddress}</span>
                        </div>
                        <div className="text-right">
                           <span className="text-[8px] font-black text-zinc-700 uppercase block">Node Yield</span>
                           <span className="text-xs font-black text-white">GH₵{o.total}</span>
                        </div>
                     </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="py-20 text-center italic text-zinc-800 text-[10px] uppercase font-black tracking-[0.4em]">Zero active logistics detected.</div>
                )}
             </div>
          </section>
        </div>
      </main>

      {/* Editor Modal */}
      {isEditorOpen && (
        <SupplierProductEditor 
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}

      <footer className="h-8 bg-zinc-950 border-t border-[#f59e0b]/10 overflow-hidden flex items-center">
         <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] flex gap-10">
            <span>Synchronizing logistics data...</span>
            <span>Uplink Secure // Node Status: Optimal</span>
            <span>Archive Integrity: 100%</span>
            <span>Supply Chain Flow: Verified</span>
            <span>No Hype Control Detected // System Rules Active</span>
         </div>
      </footer>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default SupplierDashboard;
