import React, { useState, useMemo, useEffect } from 'react';
import { RankBenefits, Product, PayForMeRequest, PayForMeStatus } from '../types';
import { databaseService } from '../services/databaseService';
import { Share2, Wallet, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface PayForMeProps {
  rank: RankBenefits;
  wishlistProducts: Product[];
  onCompleteAcquisition: (product: Product) => void;
  userHandle: string;
}

const PayForMe: React.FC<PayForMeProps> = ({ rank, wishlistProducts, onCompleteAcquisition, userHandle }) => {
  const [activeRequests, setActiveRequests] = useState<PayForMeRequest[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY' | 'GLOBAL'>('ACTIVE');

  useEffect(() => {
    const allRequests = databaseService.getPayForMeRequests();
    if (activeTab === 'GLOBAL') {
      // Show all pending/approved requests from other users
      setActiveRequests(allRequests.filter(r => r.userName !== userHandle && (r.status === PayForMeStatus.PENDING || r.status === PayForMeStatus.APPROVED)));
    } else {
      setActiveRequests(allRequests.filter(r => r.userName === userHandle));
    }
  }, [userHandle, activeTab]);

  const canAddMore = activeRequests.filter(r => r.status === PayForMeStatus.PENDING || r.status === PayForMeStatus.APPROVED).length < rank.payForMeSlots;

  const handleInitializeSponsorship = (product: Product) => {
    if (!canAddMore) return;
    
    setGeneratingId(product.id);
    setTimeout(() => {
      const newRequest = databaseService.createPayForMeRequest({
        userId: userHandle, // Using handle as ID for this mock
        userName: userHandle,
        items: [{ ...product, quantity: 1 }],
        total: product.price,
        message: `I'd love to have this ${product.name}! Can someone help me out?`
      });
      
      setActiveRequests(prev => [newRequest, ...prev]);
      setGeneratingId(null);
      setIsSelecting(false);
    }, 1500);
  };

  const handlePayRemaining = (request: PayForMeRequest) => {
    if (confirm(`Authorize final settlement of GH₵${request.total} for ${request.items[0].name}?`)) {
      databaseService.updatePayForMeStatus(request.id, PayForMeStatus.PAID);
      onCompleteAcquisition(request.items[0] as Product);
      setActiveRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: PayForMeStatus.PAID } : r));
    }
  };

  const getStatusIcon = (status: PayForMeStatus) => {
    switch (status) {
      case PayForMeStatus.PENDING: return <Clock className="w-4 h-4 text-amber-500" />;
      case PayForMeStatus.APPROVED: return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case PayForMeStatus.PAID: return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case PayForMeStatus.REJECTED: return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-zinc-500" />;
    }
  };

  const filteredRequests = useMemo(() => {
    if (activeTab === 'GLOBAL') return activeRequests;
    if (activeTab === 'ACTIVE') {
      return activeRequests.filter(r => r.status !== PayForMeStatus.PAID && r.status !== PayForMeStatus.REJECTED);
    }
    return activeRequests.filter(r => r.status === PayForMeStatus.PAID || r.status === PayForMeStatus.REJECTED);
  }, [activeRequests, activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 pb-40 animate-in fade-in duration-700">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-3 glass px-4 py-2 rounded-full border-green-500/20 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Sponsorship Protocol v3.0</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">
          Pay For <span className="text-white not-italic font-sans font-black uppercase glow-text">Me</span>
        </h1>
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
            {rank.tier} Authorization // {activeRequests.filter(r => r.status === PayForMeStatus.PENDING || r.status === PayForMeStatus.APPROVED).length}/{rank.payForMeSlots} Active Channels
          </p>
          
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'ACTIVE' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Active_Requests
            </button>
            <button 
              onClick={() => setActiveTab('HISTORY')}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'HISTORY' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Archive_Log
            </button>
            <button 
              onClick={() => setActiveTab('GLOBAL')}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'GLOBAL' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Global_Feed
            </button>
          </div>
        </div>
      </header>

      {/* Active Sponsorships Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredRequests.map((request) => {
          const product = request.items[0];
          const isPaid = request.status === PayForMeStatus.PAID;
          
          return (
            <div key={request.id} className="glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden group shadow-2xl animate-in zoom-in-95">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-6xl font-black text-white pointer-events-none uppercase">
                {request.status}
              </div>

              <div className="flex gap-6 items-start relative z-10">
                <div className="w-24 h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif italic text-white">{product.name}</h3>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">UPLINK_ID: {request.id}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                      {getStatusIcon(request.status)}
                      <span className="text-[8px] font-black text-white uppercase tracking-widest">{request.status}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      <span>Acquisition_Target</span>
                      <span className="text-[#EC4899]">GH₵{request.total}</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          request.status === PayForMeStatus.PAID ? 'bg-emerald-500' :
                          request.status === PayForMeStatus.APPROVED ? 'bg-blue-500' :
                          'bg-amber-500'
                        }`} 
                        style={{ width: request.status === PayForMeStatus.PAID ? '100%' : '15%' }}
                      ></div>
                    </div>
                  </div>

                  {!isPaid && (
                    <div className="flex gap-3 pt-2">
                      {activeTab === 'GLOBAL' ? (
                        <button 
                          onClick={() => {
                            if (confirm(`Authorize sponsorship of GH₵${request.total} for @${request.userName}?`)) {
                              databaseService.updatePayForMeStatus(request.id, PayForMeStatus.PAID);
                              // In a real app, we'd notify the user. Here we just update local state.
                              setActiveRequests(prev => prev.filter(r => r.id !== request.id));
                              alert('Sponsorship authorized. Acquisition protocol initiated.');
                            }
                          }}
                          className="flex-1 py-3 bg-white text-black rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <Wallet className="w-3 h-3" />
                          Authorize_Sponsorship
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => alert(`Strategic link copied: https://closetkraze.app/pay/${request.id}`)}
                            className="flex-1 py-3 bg-zinc-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                          >
                            <Share2 className="w-3 h-3" />
                            Copy Link
                          </button>
                          {request.status === PayForMeStatus.APPROVED && (
                            <button 
                              onClick={() => handlePayRemaining(request)}
                              className="flex-1 py-3 bg-white text-black rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#EC4899] hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                              <Wallet className="w-3 h-3" />
                              Complete_Acquisition
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {request.payerName && (
                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Oracle Sponsor Log</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-500/5 border border-blue-500/20 rounded-full text-[7px] text-blue-200 font-bold uppercase">
                      @{request.payerName} has authorized this acquisition.
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Sponsorship Button */}
        {activeTab === 'ACTIVE' && canAddMore && !isSelecting && (
          <button 
            onClick={() => setIsSelecting(true)}
            className="h-[240px] rounded-[3rem] border-2 border-dashed border-white/5 bg-white/5 flex flex-col items-center justify-center gap-4 hover:border-[#EC4899]/40 hover:bg-white/10 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">➕</div>
            <div className="text-center">
              <p className="text-xs font-black text-white uppercase tracking-widest">Initialize New Uplink</p>
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1">Select from your Wishlist</p>
            </div>
          </button>
        )}

        {filteredRequests.length === 0 && activeTab === 'HISTORY' && (
          <div className="col-span-full py-20 text-center opacity-30 italic uppercase text-[10px] tracking-widest">No archived transmissions found.</div>
        )}
      </div>

      {/* Wishlist Selection Modal */}
      {isSelecting && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[3rem] p-10 flex flex-col max-h-[80vh] shadow-3xl">
            <header className="flex justify-between items-center mb-8 shrink-0">
              <h2 className="text-3xl font-serif italic text-white">Select Asset</h2>
              <button onClick={() => setIsSelecting(false)} className="text-zinc-500 hover:text-white">✕</button>
            </header>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-4 scrollbar-hide">
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-20 opacity-30 italic uppercase text-[10px] tracking-widest">Wishlist is empty. Add items to request sponsorship.</div>
              ) : (
                wishlistProducts.map(product => (
                  <div key={product.id} className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-[#EC4899]/30 transition-all">
                    <div className="w-16 h-20 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                      <img src={product.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-white uppercase">{product.name}</h4>
                      <p className="text-xs font-mono text-[#EC4899]">GH₵{product.price}</p>
                    </div>
                    <button 
                      disabled={generatingId === product.id}
                      onClick={() => handleInitializeSponsorship(product)}
                      className="px-6 py-3 bg-white text-black rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#EC4899] hover:text-white transition-all disabled:opacity-50"
                    >
                      {generatingId === product.id ? 'Materializing...' : 'Select'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Perks Summary */}
      <footer className="bg-zinc-950/50 border border-white/5 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="text-4xl grayscale opacity-30">🛡️</div>
            <div className="space-y-1">
               <h4 className="text-lg font-serif italic text-white">Protocol Transparency</h4>
               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                  Items reserved via sponsorship remain in the global buffer for {typeof rank.wishlistRetentionDays === 'number' ? `${rank.wishlistRetentionDays} days` : 'Permanently'}.
                  <br/>Contributors are verified via the CC Handshake.
               </p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default PayForMe;