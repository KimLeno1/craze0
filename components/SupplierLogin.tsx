
import React, { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { Supplier } from '../types';

interface SupplierLoginProps {
  onSuccess: (supplierId: string) => void;
  onCancel: () => void;
}

const SupplierLogin: React.FC<SupplierLoginProps> = ({ onSuccess, onCancel }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('sup1');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [status, setStatus] = useState<'IDLE' | 'AUTHENTICATING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [authProgress, setAuthProgress] = useState(0);

  useEffect(() => {
    setSuppliers(databaseService.getSuppliers());
  }, []);

  useEffect(() => {
    let interval: any;
    if (status === 'AUTHENTICATING') {
      interval = setInterval(() => {
        setAuthProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            handleFinalAuth();
            return 100;
          }
          return prev + Math.random() * 20;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleFinalAuth = () => {
    // Supplier login: Standard check for this demo environment
    if (credentials.username.toUpperCase() === 'SUPPLIER' && credentials.password === 'NODE_2025') {
      setStatus('SUCCESS');
      setTimeout(() => onSuccess(selectedSupplierId), 800);
    } else {
      setStatus('ERROR');
      setAuthProgress(0);
      setTimeout(() => setStatus('IDLE'), 2000);
    }
  };

  const themeColor = '#f59e0b'; // Logistics Amber

  return (
    <div className="fixed inset-0 z-[500] bg-black text-white font-mono flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(${themeColor} 1px, transparent 1px), linear-gradient(90deg, ${themeColor} 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      ></div>

      <div className="w-full max-w-lg space-y-10 relative z-10 animate-in fade-in duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-[0.25em] transition-colors duration-500" style={{ color: themeColor }}>
            Node_Terminal
          </h1>
          <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-500">Logistics Uplink Protocol // v2025</p>
        </div>

        <div className="bg-black border p-10 rounded-[3.5rem] space-y-8 shadow-2xl relative overflow-hidden" style={{ borderColor: `${themeColor}44`, boxShadow: `0 0 100px ${themeColor}11` }}>
          {status === 'AUTHENTICATING' || status === 'SUCCESS' ? (
            <div className="py-14 space-y-10 text-center animate-in fade-in duration-500">
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-[1em] animate-pulse" style={{ color: themeColor }}>
                  {status === 'SUCCESS' ? 'HANDSHAKE_COMPLETE' : 'CALIBRATING_NODE_LINK'}
                </div>
                <div className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
                  Uplink: ESTABLISHED // Protocol: LOGISTICS_NODE
                </div>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-xs mx-auto">
                <div 
                  className="h-full transition-all duration-300 shadow-[0_0_15px_currentColor]" 
                  style={{ width: `${authProgress}%`, backgroundColor: themeColor, color: themeColor }} 
                />
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setStatus('AUTHENTICATING'); }} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-zinc-600 tracking-widest px-1">Regional Node ID</label>
                <div className="relative group">
                  <select 
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-mono text-white outline-none focus:border-[#f59e0b]/50 transition-all appearance-none cursor-pointer"
                  >
                    {suppliers.map(sup => (
                      <option key={sup.id} value={sup.id} className="bg-zinc-950 text-white">
                        {sup.id.toUpperCase()} // {sup.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#f59e0b]">▼</div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-zinc-600 tracking-widest px-1">Operator Handle</label>
                  <input 
                    type="text" required value={credentials.username}
                    onChange={e => setCredentials({...credentials, username: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-mono text-white outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                    placeholder="OPERATOR_ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-zinc-600 tracking-widest px-1">Security Signature</label>
                  <input 
                    type="password" required value={credentials.password}
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-mono text-white outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
              
              {status === 'ERROR' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase text-center rounded-2xl animate-pulse">
                  AUTHENTICATION_FAILURE // KEY_REJECTION
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={onCancel} 
                  className="flex-1 py-5 bg-zinc-900/50 text-zinc-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all"
                >
                  ABORT
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-5 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95" 
                  style={{ backgroundColor: themeColor }}
                >
                  INITIALIZE_UPLINK
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierLogin;
