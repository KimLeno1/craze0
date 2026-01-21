
import React, { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';
import { Supplier } from '../types';

interface AdminLoginProps {
  onSuccess: (role: 'ADMIN' | 'SUPPLIER', id?: string) => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [loginType, setLoginType] = useState<'ADMIN' | 'SUPPLIER'>('ADMIN');
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
          return prev + Math.random() * 25;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleFinalAuth = () => {
    const storedAdmin = databaseService.getAdminCredentials();
    
    if (loginType === 'ADMIN') {
      if (credentials.username === storedAdmin.identifier && credentials.password === storedAdmin.password) {
        setStatus('SUCCESS');
        setTimeout(() => onSuccess('ADMIN'), 1000);
      } else {
        triggerError();
      }
    } else {
      // Supplier login: Checks for general supplier credentials or could be node-specific
      // In this version, we accept 'SUPPLIER' / 'NODE_2025' and link it to the selected ID
      if (credentials.username.toUpperCase() === 'SUPPLIER' && credentials.password === 'NODE_2025') {
        setStatus('SUCCESS');
        setTimeout(() => onSuccess('SUPPLIER', selectedSupplierId), 1000);
      } else {
        triggerError();
      }
    }
  };

  const triggerError = () => {
    setStatus('ERROR');
    setAuthProgress(0);
    setTimeout(() => setStatus('IDLE'), 2000);
  };

  const themeColor = loginType === 'ADMIN' ? '#00ff41' : '#f59e0b';

  return (
    <div className="fixed inset-0 z-[500] bg-black text-white font-mono flex items-center justify-center p-6 overflow-hidden">
      {/* Background Matrix/Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(${themeColor} 1px, transparent 1px), linear-gradient(90deg, ${themeColor} 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      ></div>

      <div className={`w-full max-w-lg space-y-10 transition-all duration-500 relative z-10 ${status === 'ERROR' ? 'animate-shake' : ''}`}>
        
        {/* Access Role Selection */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-40">Select_Access_Protocol</span>
          </div>
          <div className="flex bg-zinc-900/50 p-1.5 rounded-3xl border border-white/5 shadow-2xl">
            <button 
              onClick={() => { setLoginType('ADMIN'); setStatus('IDLE'); }}
              className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-2xl transition-all duration-500 ${
                loginType === 'ADMIN' 
                ? 'bg-[#00ff41] text-black shadow-[0_0_30px_#00ff41]' 
                : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <span className="text-xl">🧠</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Root Architect</span>
            </button>
            <button 
              onClick={() => { setLoginType('SUPPLIER'); setStatus('IDLE'); }}
              className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-2xl transition-all duration-500 ${
                loginType === 'SUPPLIER' 
                ? 'bg-[#f59e0b] text-black shadow-[0_0_30px_#f59e0b]' 
                : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <span className="text-xl">🏭</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Logistics Node</span>
            </button>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-[0.25em]" style={{ color: themeColor }}>
            {loginType === 'ADMIN' ? 'System_Core' : 'Supplier_Terminal'}
          </h1>
          <p className="text-[10px] opacity-40 uppercase tracking-[0.4em]">
            Authorized Personnel: Handshake v.2025
          </p>
        </div>

        {/* Main Auth Card */}
        <div 
          className="bg-black border p-10 rounded-[3.5rem] space-y-8 shadow-2xl relative overflow-hidden"
          style={{ borderColor: `${themeColor}44`, boxShadow: `0 0 80px ${themeColor}11` }}
        >
          {status === 'AUTHENTICATING' || status === 'SUCCESS' ? (
            <div className="py-14 space-y-10 text-center">
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-[0.8em] animate-pulse" style={{ color: themeColor }}>
                  {status === 'SUCCESS' ? 'Access_Granted' : 'Calibrating_Identity'}
                </div>
                <div className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">Uplink established // Secure tunnel active</div>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300 shadow-[0_0_15px_currentColor]" 
                  style={{ width: `${authProgress}%`, backgroundColor: themeColor, color: themeColor }} 
                />
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setStatus('AUTHENTICATING'); }} className="space-y-6">
              
              {/* Conditional Node Selector for Suppliers */}
              {loginType === 'SUPPLIER' && (
                <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
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
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-zinc-600 tracking-widest px-1">Identity Handle</label>
                  <input 
                    type="text" required value={credentials.username}
                    onChange={e => setCredentials({...credentials, username: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-mono text-white outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                    placeholder={loginType === 'ADMIN' ? "ADMIN_ID" : "NODE_OPERATOR_ID"}
                    autoFocus
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
                  Authentication_Failed // Check_Protocol_Keys
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={onCancel} 
                  className="flex-1 py-5 bg-zinc-900/50 text-zinc-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all"
                >
                  Abort
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-5 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95" 
                  style={{ backgroundColor: themeColor }}
                >
                  Establish Connection
                </button>
              </div>
            </form>
          )}

          <div className="text-center opacity-10 hover:opacity-100 transition-opacity duration-700">
            <p className="text-[8px] uppercase tracking-widest">
              {loginType === 'ADMIN' ? 'HINT: leno / 1q2w3!' : 'HINT: SUPPLIER / NODE_2025'}
            </p>
          </div>
        </div>

        {/* Footer Ticker */}
        <div className="h-4 overflow-hidden opacity-20 text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-10">
           <div className="animate-[marquee_15s_linear_infinite] whitespace-nowrap flex gap-10">
              <span style={{ color: themeColor }}>Synchronizing Global Inventory...</span>
              <span style={{ color: themeColor }}>Bypassing Regional Firewalls...</span>
              <span style={{ color: themeColor }}>Neural Handshake Active...</span>
              <span style={{ color: themeColor }}>Node Validation: PENDING...</span>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default AdminLogin;
