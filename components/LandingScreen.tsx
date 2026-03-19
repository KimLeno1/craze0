
import React, { useState } from 'react';

interface LandingScreenProps {
  onComplete: (archetype: string, isNewUser: boolean) => void;
  onAdminAccess?: () => void;
  onClose?: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onComplete, onAdminAccess, onClose }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleAdminClick = () => {
    const nextClicks = adminClicks + 1;
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 150);
    if (nextClicks >= 5) {
      onAdminAccess?.();
      setAdminClicks(0);
    } else {
      setAdminClicks(nextClicks);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'SIGNUP' && formData.password !== formData.confirmPassword) {
      alert("Neural Mismatch: Security Phrases do not sync.");
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onComplete('CYBER', authMode === 'SIGNUP');
    }, 1200);
  };

  return (
    <div className={`fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-500 ${isGlitching ? 'invert' : ''}`}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-12 duration-700">
        <div className="bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl group">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif italic text-white leading-none tracking-tighter mb-4">
              CLOSET<br/><span className="not-italic font-sans font-black text-white uppercase select-none cursor-default" onClick={handleAdminClick}>KRAZE</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Identity Authentication Protocol</p>
          </div>

          <div className="flex bg-black/50 p-1 rounded-2xl mb-8 border border-white/5">
            <button onClick={() => setAuthMode('LOGIN')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'LOGIN' ? 'bg-white text-black' : 'text-zinc-500'}`}>Sign In</button>
            <button onClick={() => setAuthMode('SIGNUP')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'SIGNUP' ? 'bg-white text-black' : 'text-zinc-500'}`}>Register</button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="IDENTITY_EMAIL" className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none" />
            
            {authMode === 'SIGNUP' && (
              <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="CONTACT_PHONE" className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none" />
            )}

            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="SECURITY_PHRASE" className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none" />
            
            {authMode === 'SIGNUP' && (
              <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="CONFIRM_PHRASE" className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none" />
            )}

            <button type="submit" disabled={isAuthenticating} className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] bg-white text-black hover:bg-[#1a73e8] hover:text-white transition-all active:scale-95 disabled:opacity-50">
              {isAuthenticating ? 'Decrypting...' : authMode === 'LOGIN' ? 'Initialize Uplink' : 'Register Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
