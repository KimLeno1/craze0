
import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-12 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      <div className="relative bg-[#09090B] w-full max-w-4xl h-full md:h-fit md:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/5 rounded-[3rem]">
        <header className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center bg-black/40">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
                 <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.4em]">Acquisition Summary</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif italic text-white tracking-tighter">Order {order.id}</h2>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{new Date(order.timestamp).toLocaleString()}</p>
           </div>
           <button 
             onClick={onClose}
             className="w-14 h-14 rounded-full glass border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg text-white text-xl"
           >✕</button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scrollbar-hide">
           {/* Logistics Grid */}
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest border-l-2 border-[#00D1FF] pl-4">Logistics Protocol</div>
                 <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="space-y-1">
                       <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Operator Identity</span>
                       <p className="text-sm font-black text-white uppercase">{order.userName}</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Contact Uplink</span>
                       <p className="text-sm font-mono text-zinc-400">{order.phone || 'NO_PH_DATA'}</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Exact Coordinates</span>
                       <p className="text-xs font-medium text-zinc-400 leading-relaxed italic uppercase tracking-tighter">"{order.deliveryAddress}"</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest border-l-2 border-[#00D1FF] pl-4">Acquisition Status</div>
                 <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center space-y-4 min-h-[160px]">
                    <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl ${
                      order.status === OrderStatus.DELIVERED ? 'bg-green-500/10 text-green-500 border border-green-500/30' :
                      order.status === OrderStatus.CANCELLED ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                      'bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/30 animate-pulse'
                    }`}>
                      {order.status}
                    </span>
                    {order.trackingNumber && (
                      <div className="space-y-1 pt-2">
                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Neural Tracking ID</span>
                        <p className="text-xs font-mono text-white">{order.trackingNumber}</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Items Section */}
           <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                 <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Inventory Breakdown</div>
                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{order.items.length} ARCHIVES</span>
              </div>

              <div className="space-y-4">
                 {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center bg-zinc-950/40 p-4 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-all">
                       <div className="w-20 h-24 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all flex-shrink-0">
                          <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="text-[9px] font-black text-[#00D1FF] uppercase tracking-widest mb-1">{item.isBundle ? 'Synergy Kit' : `Sector_${item.category}`}</div>
                          <h4 className="text-lg font-black text-white uppercase truncate">{item.name}</h4>
                          {item.customizationData && Object.keys(item.customizationData).length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-2">
                              {Object.entries(item.customizationData).map(([fieldId, value]) => (
                                <div key={fieldId} className="flex items-center gap-2">
                                  <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">Custom:</span>
                                  <span className="text-[8px] font-bold text-amber-500 uppercase">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-4 mt-2">
                             <span className="text-[9px] font-bold text-zinc-600 uppercase">Qty: {item.quantity}</span>
                             {!item.isBundle && <span className="text-[9px] font-bold text-zinc-600 uppercase">Size: {item.selectedSize || 'OS'}</span>}
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-xl font-mono font-black text-white">GH₵{item.price * item.quantity}</div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <footer className="p-8 md:p-12 bg-black border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex gap-10 items-center">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Authorization Link</span>
                 <span className="text-[10px] font-mono text-zinc-500">CC-SECURE-HANDSHAKE-v2.5</span>
              </div>
           </div>
           <div className="flex items-baseline gap-6">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Final Valuation</span>
              <span className="text-5xl font-mono font-black text-white tracking-tighter">GH₵{order.total}</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
