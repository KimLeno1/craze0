import React, { useState } from 'react';

const ContactPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REQUEST' | 'COMMS'>('REQUEST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate encryption and sending
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16 pb-40 animate-in fade-in duration-700">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-3 glass px-4 py-2 rounded-full border-pink-500/20 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Direct Uplink Channel</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">
          The <span className="text-white not-italic font-sans font-black uppercase glow-text">Uplink</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Sector_01 Communication Terminal</p>
      </header>

      <div className="flex justify-center">
        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 w-full max-w-sm">
          <button 
            onClick={() => setActiveTab('REQUEST')}
            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'REQUEST' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            Custom Request
          </button>
          <button 
            onClick={() => setActiveTab('COMMS')}
            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'COMMS' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            Direct Comms
          </button>
        </div>
      </div>

      <div className="relative">
        {isSuccess ? (
          <div className="glass p-16 rounded-[4rem] border-green-500/20 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-5xl mx-auto shadow-[0_0_50px_rgba(34,197,94,0.2)]">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-serif italic text-white">Transmission Encrypted</h2>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-relaxed">
                Your signal has been received by the architects. <br/> A response will materialize in your inbox shortly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass p-10 md:p-16 rounded-[4rem] border-white/5 space-y-10 relative overflow-hidden group shadow-2xl">
            {/* Form Background Technical Detail */}
            <div className="absolute top-0 right-0 p-12 text-zinc-500/5 text-[20rem] font-black pointer-events-none select-none">
              {activeTab === 'REQUEST' ? 'R' : 'C'}
            </div>

            <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-serif italic text-white">
                  {activeTab === 'REQUEST' ? 'Silhouette Blueprint' : 'Secure Message'}
                </h2>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {activeTab === 'REQUEST' 
                    ? 'Request a unique piece or high-tier modification.' 
                    : 'Initialize a direct query with our support nodes.'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Operator Identity</label>
                  <input 
                    type="text" required
                    className="w-full bg-zinc-950 border border-white/10 p-6 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] outline-none transition-all placeholder:text-zinc-800"
                    placeholder="IDENT_HANDLE"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Comms Address</label>
                  <input 
                    type="email" required
                    className="w-full bg-zinc-950 border border-white/10 p-6 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] outline-none transition-all placeholder:text-zinc-800"
                    placeholder="EMAIL@NET.CORE"
                  />
                </div>
              </div>

              {activeTab === 'REQUEST' && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">Aesthetic Archetype</label>
                  <select className="w-full bg-zinc-950 border border-white/10 p-6 rounded-2xl text-xs font-black text-white focus:border-[#EC4899] outline-none appearance-none cursor-pointer">
                    <option>CYBER_VANGUARD</option>
                    <option>VOID_MINIMALIST</option>
                    <option>ETHEREAL_HEIR</option>
                    <option>STREET_NOMAD</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2">
                  {activeTab === 'REQUEST' ? 'Silhouette Specifications' : 'Message Payload'}
                </label>
                <textarea 
                  required rows={6}
                  className="w-full bg-zinc-950 border border-white/10 p-8 rounded-[2.5rem] text-xs font-black text-white focus:border-[#EC4899] outline-none transition-all resize-none placeholder:text-zinc-800"
                  placeholder={activeTab === 'REQUEST' ? "Describe materials, utility requirements, and visual aura..." : "Enter your query for the architectural team..."}
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-xs transition-all shadow-3xl active:scale-95 group relative overflow-hidden ${
                  isSubmitting ? 'bg-zinc-900 text-zinc-600' : 'bg-white text-black hover:bg-green-500 hover:text-white active:bg-green-700'
                }`}
              >
                <span className="relative z-10">{isSubmitting ? 'ENCRYPTING_TRANSMISSION...' : 'Establish Uplink Connection'}</span>
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-green-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <footer className="grid md:grid-cols-3 gap-8">
        {[
          { label: 'Latency', value: '< 20ms', icon: '📡' },
          { label: 'Security', value: 'AES-256', icon: '🔒' },
          { label: 'Priority', value: 'TIER_1', icon: '⚡' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2">
            <span className="text-2xl mb-2">{stat.icon}</span>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</span>
            <span className="text-xs font-mono font-black text-white">{stat.value}</span>
          </div>
        ))}
      </footer>
    </div>
  );
};

export default ContactPanel;