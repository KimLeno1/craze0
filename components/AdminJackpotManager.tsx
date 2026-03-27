import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { databaseService } from '../services/databaseService';
import { Trophy, Zap, Star, AlertCircle } from 'lucide-react';

interface AdminJackpotManagerProps {
  currentJackpotId: string;
  onSetJackpot: (productId: string) => void;
}

const AdminJackpotManager: React.FC<AdminJackpotManagerProps> = ({ currentJackpotId, onSetJackpot }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [jackpotPrizes, setJackpotPrizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProducts(await databaseService.getProducts());
        setJackpotPrizes(await databaseService.getJackpotPrizes());
      } catch (error) {
        console.error('Failed to fetch jackpot data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeJackpot = products.find(p => p.id === currentJackpotId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-[#00D1FF] border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-serif italic text-white flex items-center gap-4">
          <Trophy className="w-8 h-8 text-amber-500" />
          Apex_Prize_Designator
        </h2>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Configure the Weekly Jackpot Asset</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Jackpot Card */}
        <div className="lg:col-span-1 glass p-10 rounded-[3rem] border-white/5 space-y-8">
          <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-l-2 border-amber-500 pl-3">Current_Active_Protocol</div>
          
          {activeJackpot ? (
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-4 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src={activeJackpot.image} 
                  className="w-full aspect-[3/4] object-cover rounded-3xl border border-white/10 relative" 
                />
                <div className="absolute top-4 right-4 bg-amber-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                  Active_Prize
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase">{activeJackpot.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SKU: {activeJackpot.id}</span>
                  <span className="text-xl font-mono font-black text-amber-500">GH₵{activeJackpot.price}</span>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                <Zap className="w-5 h-5 text-amber-500" />
                <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-relaxed">
                  This asset is currently the primary reward for the weekly jackpot event.
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto" />
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">No Active Jackpot Designated</p>
            </div>
          )}
        </div>

        {/* Selection Grid */}
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] border-white/5 space-y-8">
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest border-l-2 border-[#00D1FF] pl-3">Asset_Registry_Selection</div>
            <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Total Assets: {products.length}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
            {products.map(product => (
              <button 
                key={product.id}
                onClick={() => onSetJackpot(product.id)}
                className={`p-4 rounded-3xl border transition-all text-left space-y-4 group ${
                  currentJackpotId === product.id 
                    ? 'border-amber-500 bg-amber-500/5' 
                    : 'border-white/5 hover:border-white/20 bg-black/40'
                }`}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img 
                    src={product.image} 
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      currentJackpotId === product.id ? 'grayscale-0 scale-110' : 'grayscale group-hover:grayscale-0'
                    }`} 
                  />
                  {currentJackpotId === product.id && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <Star className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-black text-white uppercase truncate">{product.name}</div>
                  <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">GH₵{product.price}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJackpotManager;
