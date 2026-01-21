
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white px-6 md:px-12 py-24 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
        <div className="md:col-span-2">
          <h2 className="text-4xl font-serif italic mb-8">CLOSET<span className="text-[#EC4899] font-sans not-italic font-black">CRAZE</span></h2>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-10 font-medium">
            Authorized distributor of high-tier technical silhouettes. Our archival drops are protected by limited serial runs. Secure your place in the circuit.
          </p>
          <div className="flex gap-10">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 hover:text-[#EC4899] cursor-pointer transition-colors">IG // Archives</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 hover:text-[#EC4899] cursor-pointer transition-colors">Terminal</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 hover:text-[#EC4899] cursor-pointer transition-colors">Discord</span>
          </div>
        </div>
        
        <div className="space-y-8">
          <h4 className="text-[11px] uppercase tracking-[0.5em] font-black text-white">The Protocol</h4>
          <ul className="space-y-4 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
            <li className="hover:text-white cursor-pointer transition-colors">Logistics & Handling</li>
            <li className="hover:text-white cursor-pointer transition-colors">Vault Authentication</li>
            <li className="hover:text-white cursor-pointer transition-colors">Status Tiers</li>
            <li className="hover:text-white cursor-pointer transition-colors">The Manifesto</li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[11px] uppercase tracking-[0.5em] font-black text-white">The Signal</h4>
          <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tighter">Enter your comms to receive priority drop alerts.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="TERMINAL ADDRESS"
              className="w-full bg-zinc-900 border border-white/5 px-6 py-4 text-[10px] font-black focus:outline-none focus:border-[#EC4899] transition-colors rounded-xl"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest font-black text-[#EC4899]">Sync</button>
          </div>
        </div>
      </div>

      <div className="pt-24 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 mt-24">
        <div className="text-[9px] uppercase tracking-[0.5em] text-zinc-700 font-black italic">CC Protocol v2.5.0 // New Tokyo Branch</div>
        <div className="flex gap-12 text-[9px] uppercase tracking-[0.5em] text-zinc-700 font-black">
          <span className="hover:text-zinc-400 cursor-pointer transition-colors">Encryption Policy</span>
          <span className="hover:text-zinc-400 cursor-pointer transition-colors">User Agreement</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
