
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { databaseService } from '../services/databaseService';

const HallOfFame: React.FC = () => {
  const [rankedUsers, setRankedUsers] = useState<(User & { totalLoves: number })[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await databaseService.getUsersRankedByLoves();
      setRankedUsers(users.slice(0, 10).map(u => ({ ...u, totalLoves: u.rep }))); // Using rep as totalLoves for now
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-40 animate-in fade-in duration-1000">
      <header className="py-12 md:py-24 px-6 md:px-20 border-b border-white/5 bg-gradient-to-b from-zinc-900/20 to-transparent">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-[#1a73e8] text-[8px] font-black text-white uppercase tracking-[0.5em]">
              Apex_Archivers
            </div>
            <div className="hidden md:block h-px w-20 bg-[#1a73e8]/20"></div>
          </div>
          <h1 className="text-5xl md:text-9xl font-serif italic tracking-tighter leading-none">
            Hall of <span className="text-[#1a73e8] not-italic font-sans uppercase glow-text">Fame</span>
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-black max-w-md">
            The highest-ranking nodes ranked by collective community adoration.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-20 py-10 md:py-20">
        <div className="grid gap-4 md:gap-6">
          {rankedUsers.map((user, idx) => (
            <div 
              key={user.id}
              className={`group relative flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-500 ${
                idx === 0 ? 'bg-[#1a73e8]/5 border-[#1a73e8]/30 md:scale-105 shadow-[0_0_50px_rgba(26,115,232,0.1)]' : 'bg-zinc-950 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-6 md:gap-10">
                <div className={`text-3xl md:text-5xl font-serif italic transition-colors ${idx < 3 ? 'text-[#1a73e8]' : 'text-zinc-800 group-hover:text-zinc-500'}`}>
                   {String(idx + 1).padStart(2, '0')}
                </div>
                
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl border ${
                    idx === 0 ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-[0_0_20px_rgba(26,115,232,0.4)]' : 'bg-zinc-900 border-white/10 text-white'
                  }`}>
                    {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '👤'}
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-black uppercase tracking-widest">{user.handle}</div>
                    <div className="flex items-center gap-2 md:gap-3 mt-1">
                      <span className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest">{user.archetype}</span>
                      <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                      <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${idx < 3 ? 'text-[#1a73e8]' : 'text-zinc-600'}`}>
                        {idx === 0 ? 'Apex_Prime' : idx < 3 ? 'Elite_Archiver' : 'Archiver'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between md:block md:text-right mt-6 md:mt-0 pt-6 md:pt-0 border-t border-white/5 md:border-0">
                <div className="space-y-1">
                  <div className="text-[8px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest">Loves_Received</div>
                  <div className={`text-2xl md:text-3xl font-mono ${idx === 0 ? 'text-[#1a73e8]' : 'text-white'}`}>
                    {user.totalLoves.toLocaleString()}
                  </div>
                </div>
                <div className="md:hidden space-y-1 text-right">
                  <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Reputation</div>
                  <div className="text-xl font-mono text-zinc-400">
                    {user.rep.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              {idx === 0 && (
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-[#1a73e8] text-white text-[7px] md:text-[8px] font-black px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-widest shadow-xl">
                  Current_Champion
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;
