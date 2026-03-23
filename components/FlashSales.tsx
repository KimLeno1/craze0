
import React, { useState, useEffect } from 'react';
import { Product, FlashSale, ViewState } from '../types';
import { databaseService } from '../services/databaseService';

interface FlashSalesProps {
  onAddToCart: (sale: FlashSale) => void;
  onNavigate: (view: ViewState) => void;
}

const FlashSales: React.FC<FlashSalesProps> = ({ onAddToCart, onNavigate }) => {
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [window, setWindow] = useState<{ startTime: number; endTime: number } | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSales = await databaseService.getFlashSales();
      setSales(fetchedSales);
      
      let currentWindow = await databaseService.getFlashSaleWindow();
      if (!currentWindow) {
        currentWindow = await databaseService.initializeFlashSaleWindow();
        setIsFirstVisit(true);
      }
      setWindow(currentWindow);
    };

    fetchData();

    const timer = setInterval(() => {
      setSales(prev => [...prev]); // Force re-render for timer
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (endTime: number) => {
    const seconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWindowActive = window && Date.now() < window.endTime;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-40 animate-in fade-in duration-1000">
      <header className="py-8 md:py-24 px-4 sm:px-6 md:px-20 border-b border-white/5 bg-gradient-to-b from-red-900/10 to-transparent">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="px-2 md:px-3 py-1 bg-red-500 text-[7px] md:text-[8px] font-black text-white uppercase tracking-[0.3em] md:tracking-[0.5em] animate-pulse">
              {isWindowActive ? 'Liquidation_Active' : 'Window_Closed'}
            </div>
            <div className="h-px w-8 md:w-20 bg-red-500/20"></div>
            {isFirstVisit && (
              <span className="text-[8px] md:text-[9px] font-bold text-amber-500 uppercase tracking-widest animate-bounce">
                Daily Window Initialized!
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-serif italic tracking-tighter leading-none">
            Flash <span className="text-red-500 not-italic font-sans">Sales</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
            <p className="text-zinc-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black max-w-md leading-relaxed">
              High-velocity anomalies detected in the archive. These assets are de-materializing rapidly. Secure them before the window collapses.
            </p>
            {window && (
              <div className="bg-zinc-900/50 border border-red-500/20 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col items-center min-w-[140px] md:min-w-[200px] w-fit">
                <span className="text-[7px] md:text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 md:mb-2">Daily Window Collapse</span>
                <span className="text-2xl md:text-4xl font-mono font-black text-white">{formatTime(window.endTime)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-20 py-12 md:py-20">
        {!isWindowActive ? (
          <div className="text-center py-24 md:py-40 space-y-8">
            <div className="text-7xl md:text-9xl grayscale opacity-20">⌛</div>
            <h2 className="text-3xl md:text-4xl font-serif italic text-white/40">The window has collapsed.</h2>
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em]">Return tomorrow for a new anomaly detection window.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {sales.map(sale => {
              const isVoided = !isWindowActive; // Global window controls all
              return (
                <div 
                  key={sale.id}
                  className={`group relative bg-zinc-950 border rounded-[2.5rem] md:rounded-[3rem] overflow-hidden transition-all duration-500 ${
                    isVoided ? 'border-white/5 opacity-50' : 'border-red-500/20 hover:border-red-500/50 shadow-2xl'
                  }`}
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={sale.image} 
                      className={`w-full h-full object-cover transition-transform duration-1000 ${!isVoided && 'group-hover:scale-110'}`}
                      alt={sale.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    
                    {!isVoided && (
                      <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-red-600 text-white text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-widest animate-pulse">
                        -{sale.discountPercent}%
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-10 space-y-6 md:space-y-8">
                    <div className="space-y-2">
                      <div className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest">Anomaly_ID: {sale.id}</div>
                      <h3 className="text-2xl md:text-3xl font-serif italic text-white">{sale.name}</h3>
                    </div>

                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                      <div className="space-y-1">
                        <div className="text-[8px] text-zinc-600 uppercase tracking-widest">Base_Cost</div>
                        <div className="text-lg md:text-xl font-mono text-zinc-700 line-through">GH₵{sale.originalPrice}</div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-[8px] text-red-500 uppercase tracking-widest">Thermal_Price</div>
                        <div className="text-3xl md:text-4xl font-mono text-white">GH₵{sale.price}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => onAddToCart(sale)}
                      disabled={isVoided}
                      className={`w-full py-5 md:py-6 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                        isVoided 
                        ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-red-600 hover:text-white active:scale-95'
                      }`}
                    >
                      {isVoided ? 'ANOMALY_VOIDED' : 'Secure_Asset'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSales;
