
import React, { useState, useEffect } from 'react';
import { Supplier, Product, Order } from '../types';
import { databaseService } from '../services/databaseService';
import { MOCK_ORDERS } from '../mockData';

const AdminSupplierPanel: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Registration Form State
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactEmail: '',
    region: 'Neo Tokyo Central'
  });

  useEffect(() => {
    setSuppliers(databaseService.getSuppliers());
    setAllProducts(databaseService.getProducts());
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = databaseService.registerSupplier(newSupplier);
    setSuppliers(updated);
    setIsRegistering(false);
    setNewSupplier({ name: '', contactEmail: '', region: 'Neo Tokyo Central' });
  };

  const supplierProducts = allProducts.filter(p => p.supplierId === selectedSupplier?.id);
  const supplierOrders = MOCK_ORDERS.filter(o => 
    o.items.some(item => allProducts.find(ap => ap.id === item.id)?.supplierId === selectedSupplier?.id)
  );

  if (selectedSupplier) {
    return (
      <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <button 
              onClick={() => setSelectedSupplier(null)}
              className="text-[8px] font-black text-zinc-500 hover:text-white uppercase tracking-widest mb-2 flex items-center gap-2"
            >
              ← Back to Network Nodes
            </button>
            <h2 className="text-4xl font-serif italic text-white">{selectedSupplier.name}</h2>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Uplink ID: {selectedSupplier.id}</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                selectedSupplier.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {selectedSupplier.status}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-zinc-950 px-8 py-4 rounded-2xl border border-white/5 flex flex-col items-center">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Revenue Yield</span>
                <span className="text-xl font-mono font-black text-white">GH₵{selectedSupplier.totalRevenueYield.toLocaleString()}</span>
             </div>
             <div className="bg-zinc-950 px-8 py-4 rounded-2xl border border-white/5 flex flex-col items-center">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Performance Sync</span>
                <span className="text-xl font-mono font-black text-[#EC4899]">{selectedSupplier.performanceScore}%</span>
             </div>
          </div>
        </header>

        {/* Supplier Products */}
        <section className="space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif italic text-zinc-400">Archived Silhouettes</h3>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{supplierProducts.length} Entries</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplierProducts.map(p => (
                <div key={p.id} className="group glass p-6 rounded-3xl border border-white/5 hover:border-[#EC4899]/30 transition-all">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all">
                    <img src={p.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                       <div className="text-xs font-black text-white uppercase truncate max-w-[150px]">{p.name}</div>
                       <div className="text-[9px] text-zinc-600 uppercase tracking-widest">SKU_{p.id}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-mono font-black text-[#EC4899]">GH₵{p.price}</div>
                       <div className="text-[8px] text-zinc-700 uppercase">Stock: {p.stockCount}</div>
                    </div>
                  </div>
                </div>
              ))}
              {supplierProducts.length === 0 && (
                <div className="col-span-full py-10 text-center border border-dashed border-white/10 rounded-3xl text-zinc-700 text-[10px] uppercase font-black tracking-widest">
                  No products attributed to this node.
                </div>
              )}
           </div>
        </section>

        {/* Supplier Orders */}
        <section className="space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-serif italic text-zinc-400">Linked Order Stream</h3>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{supplierOrders.length} Events</span>
           </div>
           <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                   <tr>
                      <th className="px-8 py-6">Order_Uplink</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Valuation</th>
                      <th className="px-8 py-6 text-right">Timestamp</th>
                   </tr>
                </thead>
                <tbody className="text-[10px] font-mono">
                   {supplierOrders.map(o => (
                     <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6 text-white font-black">{o.id}</td>
                        <td className="px-8 py-6">
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                             o.status === 'DELIVERED' ? 'text-green-500' : 'text-yellow-500'
                           }`}>
                             {o.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right text-zinc-300">GH₵{o.total}</td>
                        <td className="px-8 py-6 text-right text-zinc-600">{o.timestamp.split('T')[0]}</td>
                     </tr>
                   ))}
                </tbody>
              </table>
              {supplierOrders.length === 0 && (
                <div className="py-20 text-center italic text-zinc-700">No active order stream for this node.</div>
              )}
           </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-serif italic text-white">Supplier_Network</h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Managing global manufacturing nodes</p>
        </div>
        
        <button 
          onClick={() => setIsRegistering(true)}
          className="bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#EC4899] hover:text-white transition-all shadow-xl"
        >
          Register Node
        </button>
      </header>

      {/* Node Registration Modal */}
      {isRegistering && (
        <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="bg-[#050505] border border-white/10 w-full max-w-lg rounded-[3rem] p-12 space-y-10 animate-in zoom-in-95 duration-500">
              <div className="space-y-2">
                 <h3 className="text-3xl font-serif italic text-white">New_Node_Auth</h3>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Provisioning global supplier identity</p>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Supplier Designation</label>
                    <input 
                      type="text" 
                      required
                      value={newSupplier.name}
                      onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] outline-none"
                      placeholder="e.g. Neo-Mesh Foundry"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Comms Protocol (Email)</label>
                    <input 
                      type="email" 
                      required
                      value={newSupplier.contactEmail}
                      onChange={e => setNewSupplier({...newSupplier, contactEmail: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] outline-none"
                      placeholder="ops@node.net"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Geographic Sector</label>
                    <select 
                      value={newSupplier.region}
                      onChange={e => setNewSupplier({...newSupplier, region: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] outline-none appearance-none"
                    >
                      <option>Neo Tokyo Central</option>
                      <option>Neo Berlin</option>
                      <option>Emerald Heights</option>
                      <option>Void Outer-Rim</option>
                    </select>
                 </div>
                 
                 <div className="flex gap-4 pt-6">
                    <button 
                      type="button" 
                      onClick={() => setIsRegistering(false)}
                      className="flex-1 py-4 bg-zinc-950 text-zinc-600 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:text-white transition-all"
                    >
                      Abort
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-4 bg-[#EC4899] text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-[#EC4899] transition-all shadow-2xl"
                    >
                      Initialize Provisioning
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {suppliers.map(sup => (
          <div 
            key={sup.id} 
            onClick={() => setSelectedSupplier(sup)}
            className="group glass p-10 rounded-[3rem] border border-white/5 hover:border-[#EC4899]/50 transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Visual Flare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4899]/5 blur-[60px] rounded-full group-hover:bg-[#EC4899]/10 transition-colors"></div>
            
            <div className="relative z-10 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xl">🏢</div>
                  <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    sup.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {sup.status}
                  </div>
               </div>
               
               <div className="space-y-1">
                  <h3 className="text-2xl font-serif italic text-white group-hover:text-[#EC4899] transition-colors">{sup.name}</h3>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">{sup.region}</p>
               </div>
               
               <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Yield</span>
                    <span className="text-sm font-mono font-black text-white">GH₵{(sup.totalRevenueYield / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Sync</span>
                    <span className="text-sm font-mono font-black text-[#EC4899]">{sup.performanceScore}%</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSupplierPanel;
