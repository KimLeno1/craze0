
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { databaseService } from '../services/databaseService';
import { User } from '../types';

interface LandingScreenProps {
  onComplete: (user: User, isNewUser: boolean) => void;
  onAdminAccess?: () => void;
  onClose?: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onComplete, onAdminAccess, onClose }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'SIGNUP') {
      if (formData.password !== formData.confirmPassword) {
        alert("Neural Mismatch: Security Phrases do not sync.");
        return;
      }
      
      setIsAuthenticating(true);
      const result = await databaseService.registerUser(formData.email, formData.password, formData.username, formData.phone);
      setIsAuthenticating(false);
      
      if (!result.success) {
        alert(result.error);
        return;
      }
      
      if (result.user) {
        onComplete(result.user, true);
      }
    } else {
      // LOGIN
      setIsAuthenticating(true);
      const result = await databaseService.verifyUser(formData.email, formData.password);
      setIsAuthenticating(false);
      
      if (!result.success) {
        alert(result.error);
        return;
      }
      
      if (result.user) {
        onComplete(result.user, false);
      }
    }
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
            {authMode === 'SIGNUP' && (
              <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="USER_NAME" className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none" />
            )}
            
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="IDENTITY_EMAIL" className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none" />
            
            {authMode === 'SIGNUP' && (
              <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="CONTACT_PHONE" className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none" />
            )}

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                placeholder="SECURITY_PHRASE" 
                className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none pr-14" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {authMode === 'SIGNUP' && (
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  value={formData.confirmPassword} 
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  placeholder="CONFIRM_PHRASE" 
                  className="w-full bg-zinc-950 border border-white/10 px-6 py-5 rounded-2xl text-xs font-black text-white focus:border-[#1a73e8] outline-none pr-14" 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            <button type="submit" disabled={isAuthenticating} className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] bg-white text-black hover:bg-[#1a73e8] hover:text-white transition-all active:scale-95 disabled:opacity-50">
              {isAuthenticating ? 'Decrypting...' : authMode === 'LOGIN' ? 'Initialize Uplink' : 'Register Profile'}
            </button>
          </form>
          <div className="text-center mt-6 opacity-10 hover:opacity-100 transition-opacity duration-700">
            <p className="text-[8px] uppercase tracking-widest">HINT: customer@closetkraze.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
