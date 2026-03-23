
import React, { useState, useMemo, useEffect } from 'react';
import { UserStats, ViewState, PromoCode, Order, OrderStatus } from '../types';
import { USER_ACHIEVEMENTS } from '../data/extendedMock';
import { databaseService } from '../services/databaseService';
import { getCurrentRank, getNextRankThreshold } from '../data/rankingSystem';
import { MOCK_ORDERS } from '../mockData';
import OrderDetailsModal from './OrderDetailsModal';
import SubscriptionPanel from './SubscriptionPanel';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  rep: number;
  handle: string;
  username?: string;
  onUpdateHandle: (handle: string) => void;
  onNavigate: (view: ViewState) => void;
  onLogout?: () => void;
  onApplyPromo?: (promo: PromoCode) => void;
  activePromo?: PromoCode | null;
  onUpdateStats?: (stats: UserStats) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, rep, handle, username, onUpdateHandle, onNavigate, onLogout, onApplyPromo, activePromo, onUpdateStats, theme, onToggleTheme }) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isEditingHandle, setIsEditingHandle] = useState(false);
  const [newHandle, setNewHandle] = useState(handle);
  
  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const currentRank = getCurrentRank(rep);
  const nextRank = getNextRankThreshold(rep);
  const level = Math.floor(Math.sqrt(rep / 100)) + 1;
  const achievements = stats.achievements && stats.achievements.length > 0 ? stats.achievements : USER_ACHIEVEMENTS;
  const totalProgress = Math.round((achievements.reduce((acc, a) => acc + (Math.min(a.progress, a.goal) / a.goal), 0) / achievements.length) * 100);

  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const orders = await databaseService.getOrders();
      setUserOrders(orders);
    };
    fetchData();
  }, []);

  const handlePromoActivate = async () => {
    const codes = await databaseService.getPromoCodes();
    const found = codes.find(c => c.code === promoInput.toUpperCase());
    if (found) {
      onApplyPromo?.(found);
      setPromoInput('');
      setPromoError(null);
    } else {
      setPromoError('Fragment identity unknown or voided.');
      setTimeout(() => setPromoError(null), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordStatus({ type: 'error', message: 'Neural Mismatch: Security Phrases do not sync.' });
      return;
    }
    if (passwords.new.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Security Strength Insufficient: Minimum 6 characters required.' });
      return;
    }

    // Mocking user ID as 'u1' for demo if not provided, but usually we'd have it in stats or props
    // Let's assume 'u1' for now as it's the main mock user
    const result = await databaseService.changePassword('u1', passwords.current, passwords.new);
    
    if (result.success) {
      setPasswordStatus({ type: 'success', message: 'Security Protocol Recalibrated Successfully.' });
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => {
        setPasswordStatus(null);
        setShowPasswordChange(false);
      }, 3000);
    } else {
      setPasswordStatus({ type: 'error', message: (result as any).error || 'Recalibration Failed.' });
    }
  };

  return (
    <div className="p-4 sm:p-8 md:p-16 space-y-12 md:space-y-16 pb-40 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#1a73e8] glow-text animate-pulse"></div>
             <span className="text-[10px] font-black text-[#1a73e8] uppercase tracking-[0.4em]">Archiver Dossier</span>
          </div>
          <div className="flex items-center gap-4">
            {isEditingHandle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  className={`border px-4 py-2 rounded-xl text-xl md:text-2xl font-black uppercase outline-none focus:border-[#1a73e8] ${
                    theme === 'dark' ? 'bg-zinc-900 border-[#1a73e8]/30 text-white' : 'bg-white border-zinc-200 text-black'
                  }`}
                  autoFocus
                />
                <button 
                  onClick={() => {
                    onUpdateHandle(newHandle);
                    setIsEditingHandle(false);
                  }}
                  className="bg-[#1a73e8] text-white p-2 rounded-xl hover:scale-105 transition-transform"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <h1 className={`text-4xl md:text-8xl font-serif italic tracking-tighter leading-none group cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black'}`} onClick={() => setIsEditingHandle(true)}>
                  {handle} <span className="text-zinc-500 text-sm not-italic font-sans group-hover:text-[#1a73e8] transition-colors">✎</span>
                </h1>
                {username && (
                  <p className="text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Identity: {username}</p>
                )}
              </div>
            )}
          </div>
          <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em]">Reputation Magnitude: {rep.toLocaleString()} REP</p>
          <div className="flex items-center gap-2">
            <span className="text-[9px] md:text-[10px] font-black text-white bg-[#1a73e8] px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(26,115,232,0.4)]">LEVEL {level}</span>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Archiver Status</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
           <div className={`flex-1 lg:flex-none px-6 md:px-8 py-4 rounded-3xl border flex flex-col items-center min-w-[140px] md:min-w-[160px] ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status Tier</span>
              <span className="text-xl md:text-2xl font-mono font-black text-[#1a73e8] uppercase">{currentRank.tier}</span>
           </div>
           <div className={`flex-1 lg:flex-none px-6 md:px-8 py-4 rounded-3xl border flex flex-col items-center min-w-[120px] md:min-w-[140px] ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Sync Ratio</span>
              <span className={`text-xl md:text-2xl font-mono font-black ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{totalProgress}%</span>
           </div>
        </div>
      </header>

      {/* Theme & Identity Control */}
      <section className={`p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] border space-y-10 relative overflow-hidden group ${theme === 'dark' ? 'glass border-white/10' : 'bg-white border-zinc-200 shadow-xl'}`}>
        <div className={`absolute top-0 right-0 p-12 opacity-[0.03] text-[15rem] md:text-[20rem] font-black pointer-events-none group-hover:scale-110 transition-transform duration-1000 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          {currentRank.tier.charAt(0)}
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
          <div className="w-28 h-28 md:w-48 md:h-48 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-tr from-[#1a73e8] to-purple-600 p-1 shadow-[0_0_50px_rgba(26,115,232,0.3)]">
            <div className="w-full h-full bg-black rounded-[2.3rem] md:rounded-[3.3rem] flex items-center justify-center text-5xl md:text-6xl">
              {currentRank.tier === 'Appeal God' ? '🔱' : currentRank.tier === 'Star' ? '⭐' : currentRank.tier === 'Icon' ? '💎' : currentRank.tier === 'Tempest' ? '🌪️' : '🌱'}
            </div>
          </div>
          
          <div className="space-y-6 text-center md:text-left flex-1 w-full">
            <div className="space-y-4">
              <h2 className={`text-3xl md:text-6xl font-serif italic tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Current Standing: {currentRank.tier}
              </h2>
              
              {nextRank && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span>Next Rank: {nextRank.next}</span>
                    <span>{rep.toLocaleString()} / {nextRank.threshold.toLocaleString()} REP</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-[#1a73e8] to-purple-600 shadow-[0_0_10px_#1a73e8]" 
                      style={{ width: `${(rep / nextRank.threshold) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4 pt-4 justify-center md:justify-start">
              <button 
                onClick={onToggleTheme}
                className={`flex-1 sm:flex-none px-6 md:px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[9px] transition-all shadow-xl border ${
                  theme === 'dark' 
                  ? 'bg-zinc-900 text-white border-white/10 hover:bg-white hover:text-black' 
                  : 'bg-white text-black border-zinc-200 hover:bg-black hover:text-white'
                }`}
              >
                {theme === 'dark' ? '☀️ Neural Light' : '🌙 Neural Dark'}
              </button>
              <button 
                onClick={() => setIsSubscriptionOpen(true)}
                className="flex-1 sm:flex-none px-6 md:px-8 py-4 bg-[#1a73e8] text-white rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[9px] hover:scale-105 transition-all shadow-xl"
              >
                Subscriptions
              </button>
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className={`w-full sm:w-auto px-6 md:px-8 py-4 border rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[9px] hover:bg-red-600 hover:text-white transition-all shadow-xl ${
                    theme === 'dark' ? 'bg-zinc-900 text-zinc-400 border-white/5' : 'bg-white text-zinc-500 border-zinc-200'
                  }`}
                >
                  Terminate Session
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Matrix */}
      <section className="space-y-8 md:space-y-10">
        <div className="flex items-center gap-6">
          <h3 className="text-xl md:text-2xl font-serif italic text-white whitespace-nowrap">Tier Benefits Matrix</h3>
          <div className="h-px w-full bg-zinc-900"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 space-y-4">
              <span className="text-2xl">📦</span>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Vault Capacity</p>
                <p className="text-lg md:text-xl font-mono font-black text-white">{currentRank.vaultLimit} Items</p>
              </div>
           </div>
           <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 space-y-4">
              <span className="text-2xl">🤳</span>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Daily AI Try-Ons</p>
                <p className="text-lg md:text-xl font-mono font-black text-white">{currentRank.aiTryOnLimit} Attempts</p>
              </div>
           </div>
           <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 space-y-4">
              <span className="text-2xl">🎟️</span>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Playroom Yield</p>
                <p className="text-lg md:text-xl font-mono font-black text-white">{currentRank.ticketsPerPurchase.tickets} per {currentRank.ticketsPerPurchase.perItems}</p>
              </div>
           </div>
           <div className="bg-zinc-950 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 space-y-4">
              <span className="text-2xl">💸</span>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Pay For Me Channels</p>
                <p className="text-lg md:text-xl font-mono font-black text-white">{currentRank.payForMeSlots} Concurrent</p>
              </div>
           </div>
        </div>
      </section>

      {/* Acquisition History */}
      <section className="space-y-8 md:space-y-10">
        <div className="flex items-center gap-6">
          <h3 className="text-xl md:text-2xl font-serif italic text-white whitespace-nowrap">Acquisition History</h3>
          <div className="h-px w-full bg-zinc-900"></div>
        </div>

        <div className="grid gap-4">
          {userOrders.length === 0 ? (
            <div className="py-16 md:py-20 text-center glass border-dashed border-white/5 rounded-[2.5rem] md:rounded-[3rem] opacity-30">
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em]">No physical acquisitions detected in the archive.</p>
            </div>
          ) : (
            userOrders.map(order => (
              <button 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="w-full text-left group glass border-white/5 hover:border-[#1a73e8]/30 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 md:gap-6">
                   <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-xl md:text-2xl group-hover:scale-110 transition-transform">
                      📦
                   </div>
                   <div className="space-y-1">
                      <div className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ref: {order.id}</div>
                      <div className="text-xs md:text-sm font-black text-white uppercase">{order.items.length} Signal{order.items.length > 1 ? 's' : ''} Secured</div>
                      <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(order.timestamp).toLocaleDateString()}</div>
                   </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10">
                   <div className="text-left md:text-right">
                      <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-500/10 text-green-500' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-500/10 text-red-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                   </div>
                   <div className="text-right">
                      <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Valuation</div>
                      <div className="text-lg md:text-xl font-mono font-black text-white">GH₵{order.total}</div>
                   </div>
                   <div className="hidden md:block text-zinc-800 group-hover:text-[#1a73e8] transition-colors">→</div>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Promo Activation */}
      <section className="space-y-8 md:space-y-10">
        <div className="flex items-center gap-6">
          <h3 className="text-xl md:text-2xl font-serif italic text-white whitespace-nowrap">Fragment Activation</h3>
          <div className="h-px w-full bg-zinc-900"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <div className="bg-zinc-950/40 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 space-y-6 md:space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest">Inject Promo Code</div>
              <div className="relative group">
                <input 
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="FRAGMENT_IDENT"
                  className="w-full bg-black border border-white/10 p-5 md:p-6 rounded-2xl text-[10px] md:text-xs font-black text-white focus:border-blue-500 transition-all outline-none"
                />
                <button 
                  onClick={handlePromoActivate}
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white text-black px-4 md:px-6 py-2 md:py-3 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95"
                >
                  Sync
                </button>
              </div>
              {promoError && <p className="text-[8px] font-black text-red-500 uppercase px-2 animate-pulse">{promoError}</p>}
            </div>
          </div>

          <div className="bg-zinc-950 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-center items-center text-center min-h-[160px]">
             {activePromo ? (
               <div className="animate-in zoom-in-95 duration-500 space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl md:text-3xl mx-auto animate-pulse">🎫</div>
                  <div className="space-y-1">
                    <div className="text-[8px] md:text-[9px] font-black text-blue-500 uppercase tracking-widest">Active Influence</div>
                    <div className="text-lg md:text-xl font-black text-white tracking-widest uppercase">{activePromo.code}</div>
                  </div>
               </div>
             ) : (
               <div className="opacity-20 space-y-4">
                 <div className="text-5xl md:text-6xl">🔒</div>
                 <p className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">No Active Discount Aura</p>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Security Protocol Section */}
      <section className="space-y-8 md:space-y-10">
        <div className="flex items-center gap-6">
          <h3 className="text-xl md:text-2xl font-serif italic text-white whitespace-nowrap">Security Protocol</h3>
          <div className="h-px w-full bg-zinc-900"></div>
        </div>

        <div className={`bg-zinc-950/40 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 transition-all duration-500 ${showPasswordChange ? 'ring-1 ring-[#1a73e8]/30' : ''}`}>
          {!showPasswordChange ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xl">
                  <ShieldCheck className="text-[#1a73e8]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Identity Security Phrase</p>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Last recalibrated: 14 cycles ago</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPasswordChange(true)}
                className="w-full md:w-auto px-8 py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#1a73e8] hover:text-white transition-all active:scale-95"
              >
                Recalibrate Phrase
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest px-1">Current Phrase</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.current ? "text" : "password"}
                      required
                      value={passwords.current}
                      onChange={e => setPasswords({...passwords, current: e.target.value})}
                      placeholder="••••••••"
                      className="w-full bg-black border border-white/10 p-5 rounded-2xl text-[10px] font-black text-white focus:border-[#1a73e8] outline-none pr-12"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                    >
                      {showPasswords.current ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest px-1">New Phrase</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.new ? "text" : "password"}
                      required
                      value={passwords.new}
                      onChange={e => setPasswords({...passwords, new: e.target.value})}
                      placeholder="••••••••"
                      className="w-full bg-black border border-white/10 p-5 rounded-2xl text-[10px] font-black text-white focus:border-[#1a73e8] outline-none pr-12"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                    >
                      {showPasswords.new ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest px-1">Confirm New Phrase</label>
                  <div className="relative">
                    <input 
                      type={showPasswords.confirm ? "text" : "password"}
                      required
                      value={passwords.confirm}
                      onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                      placeholder="••••••••"
                      className="w-full bg-black border border-white/10 p-5 rounded-2xl text-[10px] font-black text-white focus:border-[#1a73e8] outline-none pr-12"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                    >
                      {showPasswords.confirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {passwordStatus && (
                <div className={`p-4 rounded-2xl text-[9px] font-black uppercase text-center border ${
                  passwordStatus.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                  {passwordStatus.message}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordStatus(null);
                    setPasswords({ current: '', new: '', confirm: '' });
                  }}
                  className="flex-1 py-4 bg-zinc-900 text-zinc-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#1a73e8] hover:text-white transition-all active:scale-95 shadow-xl"
                >
                  Commit Recalibration
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Reputation Milestones */}
      <section className="space-y-8 md:space-y-10">
        <div className="flex items-center gap-6">
          <h3 className="text-xl md:text-2xl font-serif italic text-white whitespace-nowrap">Reputation Milestones</h3>
          <div className="h-px w-full bg-zinc-900"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {achievements.map(ach => {
            const progressPercent = (Math.min(ach.progress, ach.goal) / ach.goal) * 100;
            return (
              <div 
                key={ach.id} 
                className={`relative group glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                  ach.unlocked 
                  ? 'border-[#1a73e8]/30 bg-zinc-900/40' 
                  : 'border-white/5 bg-zinc-950/20 grayscale hover:grayscale-[0.5]'
                }`}
              >
                <div className="absolute bottom-0 left-0 h-1 bg-zinc-900 w-full">
                   <div 
                     className={`h-full transition-all duration-1000 ${ach.unlocked ? 'bg-[#1a73e8]' : 'bg-zinc-700'}`} 
                     style={{ width: `${progressPercent}%` }}
                   ></div>
                </div>

                <div className="flex items-start justify-between mb-6 md:mb-8 relative z-10">
                  <div className={`text-3xl md:text-4xl transition-transform duration-500 group-hover:scale-110 ${ach.unlocked ? 'drop-shadow-[0_0_10px_#1a73e8]' : ''}`}>
                    {ach.unlocked ? ach.icon : '🔒'}
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <h4 className="text-xs md:text-sm font-black uppercase tracking-widest text-white group-hover:text-[#1a73e8] transition-colors">
                    {ach.unlocked ? ach.title : 'Signal_Encrypted'}
                  </h4>
                  <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-tight leading-relaxed line-clamp-2 italic">
                    {ach.unlocked || ach.progress > 0 ? ach.description : 'Analyze circuit to decrypt protocol requirements.'}
                  </p>
                </div>

                <div className="mt-6 md:mt-8 flex justify-between items-center relative z-10">
                   <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Rep Yield: +{ach.rewardREP}</div>
                   <div className="text-[9px] md:text-[10px] font-mono font-black text-zinc-400">
                     {ach.progress} <span className="text-zinc-700">/</span> {ach.goal}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}

      {/* Subscription Panel */}
      <SubscriptionPanel 
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        stats={stats}
        onUpdateSubscriptions={(brands, tags) => {
          onUpdateStats?.({
            ...stats,
            brandSubscriptions: brands,
            tagSubscriptions: tags
          });
        }}
      />
    </div>
  );
};

export default Profile;
