
import React, { useState, useEffect, useMemo } from 'react';
import { Product, FlashSale } from '../types';
import { EXTENDED_PRODUCTS } from '../mockData';

interface FlashSalesProps {
  onAddToCart: (product: Product) => void;
}

interface DailySaleData {
  date: string;
  productId: string;
  discountPercent: number;
  expiryTimestamp: number;
}

const FlashSales: React.FC<FlashSalesProps> = ({ onAddToCart }) => {
  const [sale, setSale] = useState<FlashSale | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isVoided, setIsVoided] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedSaleRaw = localStorage.getItem('cc_daily_flash_sale');
    let saleData: DailySaleData;

    if (savedSaleRaw) {
      const parsed = JSON.parse(savedSaleRaw) as DailySaleData;
      if (parsed.date === today) {
        saleData = parsed;
      } else {
        saleData = generateNewSale(today);
      }
    } else {
      saleData = generateNewSale(today);
    }

    const product = EXTENDED_PRODUCTS.find(p => p.id === saleData.productId) || EXTENDED_PRODUCTS[0];
    const flashProduct: FlashSale = {
      ...product,
      price: Math.floor(product.originalPrice * (1 - saleData.discountPercent / 100)),
      discountPercent: saleData.discountPercent,
      saleEndTime: saleData.expiryTimestamp
    };

    setSale(flashProduct);
    
    // Initial time check
    const remaining = Math.max(0, Math.floor((saleData.expiryTimestamp - Date.now()) / 1000));
    setTimeLeft(remaining);
    if (remaining <= 0) setIsVoided(true);

  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timeLeft === 0 && sale) setIsVoided(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVoided(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, sale]);

  const generateNewSale = (dateString: string): DailySaleData => {
    const randomProduct = EXTENDED_PRODUCTS[Math.floor(Math.random() * EXTENDED_PRODUCTS.length)];
    const randomDiscount = Math.floor(Math.random() * (50 - 12 + 1)) + 12; // 12% to 50%
    const randomDurationSec = Math.floor(Math.random() * (10800 - 900 + 1)) + 900; // 15m to 3h
    
    const newData: DailySaleData = {
      date: dateString,
      productId: randomProduct.id,
      discountPercent: randomDiscount,
      expiryTimestamp: Date.now() + (randomDurationSec * 1000)
    };

    localStorage.setItem('cc_daily_flash_sale', JSON.stringify(newData));
    return newData;
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!sale) return null;

  return (
    <div className="min-h-[80vh] p-6 md:p-12 flex items-center justify-center animate-in fade-in duration-1000">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[4rem] bg-zinc-950 border border-red-500/20 shadow-[0_0_100px_-20px_rgba(239,68,68,0.3)]">
        
        {/* Background Thermal Pulse */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.08)_0%,transparent_70%)] animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
          
          {/* Visual Sector */}
          <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto relative bg-black overflow-hidden group">
            <img 
              src={sale.image} 
              className={`w-full h-full object-cover transition-all duration-1000 ${isVoided ? 'grayscale opacity-20' : 'opacity-70 group-hover:scale-110'}`} 
              alt={sale.name} 
            />
            
            {/* Scanning HUD Overlay */}
            {!isVoided && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-1 bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.8)] absolute top-0 animate-[scan_4s_linear_infinite]"></div>
                <style>{`
                  @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                  }
                `}</style>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-10 left-10">
              <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em] mb-2">Target_Identified</div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-white tracking-tighter">{sale.name}</h2>
            </div>
          </div>

          {/* Intel Sector */}
          <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center gap-10 border-t lg:border-t-0 lg:border-l border-white/5">
            
            <header className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Personalized Anomaly Detected</span>
              </div>
              <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.3em]">Protocol 12: Individual Scarcity Allocation</p>
            </header>

            <section className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Market Base</span>
                  <span className="text-2xl font-mono text-zinc-700 line-through">${sale.originalPrice}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block">Thermal Price</span>
                  <span className="text-6xl font-black font-mono text-white tracking-tighter">${sale.price}</span>
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl text-center space-y-4">
                <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Collapse Imminent In</div>
                <div className="text-6xl font-mono font-black text-white tracking-tighter animate-pulse">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 bg-red-500 text-white text-[8px] font-black rounded-full">-{sale.discountPercent}% VELOCITY BONUS</span>
                </div>
              </div>
            </section>

            <button 
              onClick={() => onAddToCart(sale)}
              disabled={isVoided}
              className={`w-full py-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-xs transition-all shadow-2xl active:scale-95 group relative overflow-hidden ${
                isVoided 
                ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-red-600 hover:text-white'
              }`}
            >
              <span className="relative z-10">{isVoided ? 'ANOMALY_VOIDED' : 'Authorize Acquisition'}</span>
              {!isVoided && (
                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              )}
            </button>

            <footer className="text-center">
              <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em] leading-relaxed">
                Notice: Daily anomaly allocation is final. <br/>Attempting to reset terminal will void all current offers.
              </p>
            </footer>

          </div>
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900">
           <div 
             className="h-full bg-red-500 transition-all duration-1000" 
             style={{ width: `${(timeLeft / 10800) * 100}%` }}
           ></div>
        </div>
      </div>
    </div>
  );
};

export default FlashSales;
