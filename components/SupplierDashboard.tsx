
import React, { useState, useEffect } from 'react';
import { Product, Supplier, Order, OrderStatus } from '../types';
import { databaseService } from '../services/databaseService';
import SupplierProductEditor from './SupplierProductEditor';
import { Package, LayoutDashboard, ShoppingBag, User, LogOut, CheckCircle, Clock, Truck, XCircle, Settings, Zap } from 'lucide-react';

interface SupplierDashboardProps {
  supplierId: string;
  onLogout: () => void;
}

type Tab = 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'ANOMALIES';

const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ supplierId, onLogout }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Anomaly State
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [newAnomaly, setNewAnomaly] = useState({
    productId: '',
    discountedPrice: 0,
    duration: 2
  });

  useEffect(() => {
    refreshData();
  }, [supplierId]);

  const refreshData = async () => {
    try {
      // Check auth
      const authData = await databaseService.checkAuth(localStorage.getItem('cc-auth-token') || '');
      if (!authData.authenticated) {
        onLogout();
        return;
      }
      
      // Fetch data in parallel
      const [currentSupplier, myProducts, myOrders, myAnomalies] = await Promise.all([
        databaseService.getSupplierById(supplierId),
        databaseService.getSupplierProducts(supplierId),
        databaseService.getSupplierOrders(supplierId),
        databaseService.getSupplierAnomalies(supplierId)
      ]);

      if (currentSupplier) setSupplier(currentSupplier);
      setProducts(myProducts);
      setOrders(myOrders);
      setAnomalies(myAnomalies);
    } catch (error) {
      console.error('Data refresh error:', error);
    }
  };

  const handleSaveProduct = async (formData: Partial<Product>) => {
    try {
      await databaseService.saveProduct({ ...formData, supplierId });
      setIsEditorOpen(false);
      await refreshData();
    } catch (error) {
      console.error('Save product error:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await databaseService.updateOrderStatus(orderId, status);
      await refreshData();
    } catch (error) {
      console.error('Update order error:', error);
    }
  };

  const handleCreateAnomaly = async () => {
    try {
      const anomaly = {
        id: `anomaly_${Date.now()}`,
        productId: newAnomaly.productId,
        price: newAnomaly.discountedPrice,
        anomalyEndTime: Date.now() + newAnomaly.duration * 60 * 60 * 1000,
        discountPercent: Math.round((1 - newAnomaly.discountedPrice / (products.find(p => p.id === newAnomaly.productId)?.price || 1)) * 100)
      };
      
      await databaseService.createPriceAnomaly(anomaly);
      setIsAnomalyModalOpen(false);
      await refreshData();
    } catch (error) {
      console.error('Create anomaly error:', error);
    }
  };

  const handleDeleteAnomaly = async (id: string) => {
    try {
      await databaseService.deletePriceAnomaly(id);
      await refreshData();
    } catch (error) {
      console.error('Delete anomaly error:', error);
    }
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

  const renderDashboard = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total Yield</span>
            <span className="text-emerald-500 text-xs font-black">+12%</span>
          </div>
          <div className="text-3xl font-mono font-black text-white">GH₵{supplier.totalRevenueYield.toLocaleString()}</div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[75%]"></div>
          </div>
        </div>
        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sync Score</span>
            <span className="text-[#f59e0b] text-xs font-black">Optimal</span>
          </div>
          <div className="text-3xl font-mono font-black text-[#f59e0b]">{supplier.performanceScore}%</div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-[#f59e0b]" style={{ width: `${supplier.performanceScore}%` }}></div>
          </div>
        </div>
        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Active Silhouettes</span>
            <span className="text-blue-500 text-xs font-black">Linked</span>
          </div>
          <div className="text-3xl font-mono font-black text-white">{products.length}</div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[60%]"></div>
          </div>
        </div>
      </div>

      <section className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-2xl flex items-center justify-center text-2xl">👤</div>
          <div>
            <h3 className="text-xl font-serif italic text-white">Supplier Profile</h3>
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Node Identity & Logistics Config</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Organization Name</label>
              <div className="bg-black border border-white/5 p-4 rounded-xl text-sm font-bold text-white">{supplier.name}</div>
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Contact Protocol</label>
              <div className="bg-black border border-white/5 p-4 rounded-xl text-sm font-bold text-white">{supplier.contactEmail}</div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Operational Region</label>
              <div className="bg-black border border-white/5 p-4 rounded-xl text-sm font-bold text-white">{supplier.region}</div>
            </div>
            <div className="space-y-2">
              <label className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Uplink Status</label>
              <div className="flex items-center gap-3 bg-black border border-white/5 p-4 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-bold text-white uppercase tracking-widest">{supplier.status}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-serif italic text-white">Archival Silhouettes</h3>
          <p className="text-[8px] text-zinc-600 font-black tracking-widest uppercase">Manage your supply chain inventory</p>
        </div>
        <button 
          onClick={handleRegister}
          className="bg-[#f59e0b] text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white active:bg-green-700 transition-all rounded-2xl shadow-lg shadow-[#f59e0b]/10"
        >
          Register New Silhouette
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-8 hover:border-[#f59e0b]/20 transition-all group relative overflow-hidden">
             <div className="w-24 h-32 rounded-3xl overflow-hidden bg-black grayscale group-hover:grayscale-0 transition-all shadow-2xl">
                <img src={p.image} className="w-full h-full object-cover" />
             </div>
             <div className="flex-1 space-y-4">
                <div>
                  <div className="text-lg font-black text-white uppercase tracking-tight">{p.name}</div>
                  <div className="text-[9px] text-zinc-600 font-mono mt-1 uppercase tracking-widest">
                    SKU_{p.id} // STOCK: {p.stockCount}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div>
                      <div className="text-[8px] text-zinc-700 uppercase tracking-widest mb-1">Valuation</div>
                      <div className="text-xl font-mono font-black text-white">GH₵{p.price}</div>
                   </div>
                   <div className="h-8 w-px bg-zinc-900"></div>
                   <div>
                      <div className="text-[8px] text-zinc-700 uppercase tracking-widest mb-1">Market Heat</div>
                      <div className="text-xl font-mono font-black text-[#f59e0b]">{p.velocityScore}%</div>
                   </div>
                </div>
             </div>
             <button 
               onClick={() => handleEdit(p)}
               className="w-12 h-12 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-xl hover:bg-[#f59e0b] hover:text-black transition-all"
             >
               ⚙️
             </button>
          </div>
        ))}
        {products.length === 0 && (
           <div className="col-span-full py-32 text-center border border-dashed border-white/5 rounded-[3rem] space-y-6">
              <div className="text-6xl opacity-10">📦</div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">No supply records detected in this node.</p>
           </div>
        )}
      </div>
    </div>
  );

  const renderAnomalies = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-serif italic text-white">Global Reduction Protocols</h3>
          <p className="text-[8px] text-zinc-600 font-black tracking-widest uppercase">Initialize high-velocity liquidation events</p>
        </div>
        <button 
          onClick={() => setIsAnomalyModalOpen(true)}
          className="bg-green-500 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-green-500 transition-all rounded-2xl shadow-lg shadow-green-500/10"
        >
          Initialize New Anomaly
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {anomalies.map(a => {
          const product = products.find(p => p.id === a.productId);
          if (!product) return null;
          return (
            <div key={a.id} className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-8 hover:border-[#00D1FF]/20 transition-all group relative overflow-hidden">
               <div className="w-24 h-32 rounded-3xl overflow-hidden bg-black grayscale group-hover:grayscale-0 transition-all shadow-2xl">
                  <img src={product.image} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-lg font-black text-white uppercase tracking-tight">{product.name}</div>
                    <div className="text-[9px] text-[#00D1FF] font-black mt-1 uppercase tracking-widest">
                      ANOMALY_ACTIVE // STATUS: {a.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div>
                        <div className="text-[8px] text-zinc-700 uppercase tracking-widest mb-1">Anomaly Price</div>
                        <div className="text-xl font-mono font-black text-white">GH₵{a.discountedPrice}</div>
                     </div>
                     <div className="h-8 w-px bg-zinc-900"></div>
                     <div>
                        <div className="text-[8px] text-zinc-700 uppercase tracking-widest mb-1">Time Remaining</div>
                        <div className="text-xl font-mono font-black text-[#00D1FF]">
                          {Math.max(0, Math.floor((a.endTime - Date.now()) / (1000 * 60)))}m
                        </div>
                     </div>
                  </div>
               </div>
               <button 
                 onClick={() => handleDeleteAnomaly(a.id)}
                 className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
               >
                 Terminate
               </button>
            </div>
          );
        })}
        {anomalies.length === 0 && (
           <div className="col-span-full py-32 text-center border border-dashed border-white/5 rounded-[3rem] space-y-6">
              <div className="text-6xl opacity-10">⚡</div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">No global reductions detected in current cycle.</p>
           </div>
        )}
      </div>

      {isAnomalyModalOpen && (
        <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-[#00D1FF]/30 w-full max-w-xl rounded-[3rem] p-12 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="space-y-2">
              <h3 className="text-3xl font-serif italic text-white">Anomaly_Config</h3>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Define Liquidation Parameters</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Target Silhouette</label>
                <select 
                  value={newAnomaly.productId}
                  onChange={e => {
                    const p = products.find(prod => prod.id === e.target.value);
                    setNewAnomaly({
                      ...newAnomaly, 
                      productId: e.target.value,
                      discountedPrice: p ? Math.floor(p.price * 0.8) : 0
                    });
                  }}
                  className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-[#00D1FF]"
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (GH₵{p.price})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Anomaly Price (GH₵)</label>
                  <input 
                    type="number"
                    value={newAnomaly.discountedPrice}
                    onChange={e => setNewAnomaly({...newAnomaly, discountedPrice: parseInt(e.target.value)})}
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-[#00D1FF]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Duration (Hours)</label>
                  <input 
                    type="number"
                    value={newAnomaly.duration}
                    onChange={e => setNewAnomaly({...newAnomaly, duration: parseInt(e.target.value)})}
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm text-white outline-none focus:border-[#00D1FF]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleCreateAnomaly}
                disabled={!newAnomaly.productId}
                className="flex-1 bg-green-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-green-500 transition-all disabled:opacity-50"
              >
                Initialize Protocol
              </button>
              <button 
                onClick={() => setIsAnomalyModalOpen(false)}
                className="flex-1 bg-zinc-900 text-zinc-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-serif italic text-white">Logistics Fulfillment</h3>
          <p className="text-[8px] text-zinc-600 font-black tracking-widest uppercase">Manage incoming regional acquisitions</p>
        </div>
        <div className="bg-zinc-950 px-6 py-2 rounded-full border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          {orders.length} Records Active
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {orders.map(o => (
          <div key={o.id} className="bg-zinc-950 border border-white/5 p-10 rounded-[3rem] space-y-8 relative overflow-hidden group">
             <div className="flex justify-between items-start">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></div>
                      <div className="text-lg font-black text-white tracking-tighter">{o.id}</div>
                   </div>
                   <div className="text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-mono">TIMESTAMP: {new Date(o.timestamp).toLocaleString()}</div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <select 
                    value={o.status}
                    onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className={`bg-black border px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest outline-none transition-all ${
                      o.status === OrderStatus.DELIVERED ? 'border-green-500/30 text-green-500' :
                      o.status === OrderStatus.CANCELLED ? 'border-red-500/30 text-red-500' :
                      'border-[#f59e0b]/30 text-[#f59e0b]'
                    }`}
                  >
                    {Object.values(OrderStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
             </div>

             <div className="space-y-4">
                <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] px-1">Allocated Inventory</div>
                <div className="grid gap-3">
                   {o.items.filter(i => products.some(mp => mp.id === i.id)).map((item, idx) => (
                     <div key={idx} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center group-hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-lg bg-zinc-900 overflow-hidden">
                              <img src={item.image} className="w-full h-full object-cover grayscale" />
                           </div>
                           <span className="text-xs text-zinc-400 font-black uppercase truncate max-w-[200px]">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-white">x{item.quantity}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div className="space-y-2 w-full md:w-auto">
                   <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block">Logistics Destination</span>
                   <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-[10px] text-zinc-400 font-bold uppercase leading-relaxed">
                      {o.deliveryAddress}
                   </div>
                </div>
                <div className="text-right">
                   <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block mb-1">Node Revenue</span>
                   <div className="text-2xl font-mono font-black text-white">GH₵{o.total}</div>
                </div>
             </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full py-32 text-center italic text-zinc-800 text-[10px] uppercase font-black tracking-[0.5em]">Zero active logistics detected in current cycle.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] bg-[#020202] text-[#f59e0b] flex font-mono overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-24 md:w-72 bg-zinc-950 border-r border-[#f59e0b]/10 flex flex-col">
        <div className="p-8 border-b border-[#f59e0b]/10">
          <div className="text-xl font-serif italic text-white hidden md:block">
            SUPPLIER<span className="text-[#f59e0b] font-sans font-black not-italic ml-1">CONSOLE</span>
          </div>
          <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-2 hidden md:block">v2.5 // LOGISTICS_CORE</div>
          <div className="text-2xl md:hidden text-center">🏢</div>
        </div>

        <nav className="flex-1 p-4 space-y-4 mt-8">
          <button 
            onClick={() => setActiveTab('DASHBOARD')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-[#f59e0b] text-black shadow-lg shadow-[#f59e0b]/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('PRODUCTS')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'PRODUCTS' ? 'bg-[#f59e0b] text-black shadow-lg shadow-[#f59e0b]/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            <Package size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Inventory</span>
          </button>
          <button 
            onClick={() => setActiveTab('ORDERS')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'ORDERS' ? 'bg-[#f59e0b] text-black shadow-lg shadow-[#f59e0b]/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            <ShoppingBag size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Logistics</span>
          </button>
          <button 
            onClick={() => setActiveTab('ANOMALIES')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'ANOMALIES' ? 'bg-[#f59e0b] text-black shadow-lg shadow-[#f59e0b]/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            <Zap size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Global Reduction</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#f59e0b]/10">
          <button 
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              localStorage.removeItem('cc-auth-token');
              onLogout();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-zinc-950 border-b border-[#f59e0b]/10 px-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Uplink_Stable</span>
            </div>
            <div className="h-4 w-px bg-zinc-800"></div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Node: {supplier.region}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Operator Identity</div>
              <div className="text-xs font-black text-white uppercase">{supplier.name}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-lg">
              👤
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-10 md:p-16 bg-[radial-gradient(circle_at_top_right,_#110b00_0%,_transparent_50%)]">
          {activeTab === 'DASHBOARD' && renderDashboard()}
          {activeTab === 'PRODUCTS' && renderProducts()}
          {activeTab === 'ORDERS' && renderOrders()}
          {activeTab === 'ANOMALIES' && renderAnomalies()}
        </main>

        {/* Footer Marquee */}
        <footer className="h-10 bg-zinc-950 border-t border-[#f59e0b]/10 overflow-hidden flex items-center">
           <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap text-[9px] font-black text-zinc-800 uppercase tracking-[0.6em] flex gap-20">
              <span>Synchronizing logistics data...</span>
              <span>Uplink Secure // Node Status: Optimal</span>
              <span>Archive Integrity: 100%</span>
              <span>Supply Chain Flow: Verified</span>
              <span>Regional Yield: GH₵{supplier.totalRevenueYield.toLocaleString()}</span>
              <span>No Hype Control Detected // System Rules Active</span>
           </div>
        </footer>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <SupplierProductEditor 
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default SupplierDashboard;
