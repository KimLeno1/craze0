
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';

interface AdminOrderManagerProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus, tracking?: string) => void;
}

const AdminOrderManager: React.FC<AdminOrderManagerProps> = ({ orders, onUpdateStatus }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    onUpdateStatus(orderId, status, trackingInput);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status, trackingNumber: trackingInput });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif italic text-white">Logistics_Command</h2>
        <div className="flex gap-4">
          <div className="glass px-6 py-2 rounded-xl border-white/5 flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">System Link Active</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map(order => (
          <div 
            key={order.id} 
            className={`glass p-8 rounded-[2.5rem] border transition-all duration-500 ${selectedOrder?.id === order.id ? 'border-[#EC4899]/50 bg-zinc-900/40' : 'border-white/5 hover:border-white/20'}`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black font-mono text-white">{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    order.status === OrderStatus.DELIVERED ? 'bg-green-500/10 text-green-500' :
                    order.status === OrderStatus.CANCELLED ? 'bg-red-500/10 text-red-500' :
                    order.status === OrderStatus.SHIPPED ? 'bg-blue-500/10 text-blue-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client Identity</div>
                  <div className="text-sm font-serif italic text-zinc-300">@{order.userName}</div>
                </div>
              </div>

              <div className="flex-1 lg:px-12 space-y-4">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cargo Analysis</div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 px-3 py-2 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} className="w-full h-full object-cover grayscale" />
                      </div>
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">
                        {item.quantity}x {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Authorization Value</div>
                  <div className="text-2xl font-black font-mono text-white tracking-tighter">GH₵{order.total}</div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedOrder(order);
                    setTrackingInput(order.trackingNumber || '');
                  }}
                  className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-xl hover:bg-white hover:text-black transition-all"
                >
                  ⚙️
                </button>
              </div>
            </div>

            {selectedOrder?.id === order.id && (
              <div className="mt-8 pt-8 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Delivery_Coordinates</label>
                    <p className="text-xs font-medium text-zinc-300 bg-black/40 p-4 rounded-2xl border border-white/5">
                      {order.deliveryAddress}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Tracking_Aura_ID</label>
                    <input 
                      type="text" 
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="Enter Tracking Identifier..."
                      className="w-full bg-black/40 border border-white/5 px-6 py-4 rounded-2xl text-xs font-mono text-white focus:border-[#EC4899] transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Status_Override</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(OrderStatus).map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                            order.status === status 
                            ? 'bg-white text-black border-white' 
                            : 'bg-transparent text-zinc-600 border-white/5 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderManager;
