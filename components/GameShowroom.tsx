
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { databaseService } from '../services/databaseService';

interface GameShowroomProps {
  tickets: number;
  jackpotProduct: Product | null;
  onPlay: () => void;
  onWin: (reward: string) => void;
}

const GameShowroom: React.FC<GameShowroomProps> = ({ tickets, jackpotProduct, onPlay, onWin }) => {
  const [activeGame, setActiveGame] = useState<'NONE' | 'DICE' | 'GUESS' | 'GIFT'>('NONE');
  const [gameState, setGameState] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  if (!jackpotProduct) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#EC4899] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Cooldown logic
  const [cooldownEnd, setCooldownEnd] = useState<number>(() => {
    return Number(localStorage.getItem('cc-arena-cooldown') || '0');
  });
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((cooldownEnd - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        localStorage.removeItem('cc-arena-cooldown');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownEnd]);

  const startCooldown = () => {
    const end = Date.now() + 60 * 1000; // 60 second recalibration
    setCooldownEnd(end);
    localStorage.setItem('cc-arena-cooldown', end.toString());
  };

  const triggerWin = async (outcome: string, score: number = 100) => {
    onWin(outcome);
    setGameState({ result: outcome, win: true, icon: '💎' });
    startCooldown();
    
    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      try {
        await databaseService.saveGameScore(userId, activeGame, score, { outcome });
      } catch (error) {
        console.error('Error saving game score:', error);
      }
    }
  };

  const triggerLoss = async (reason: string, score: number = 0) => {
    setGameState({ result: reason, win: false, icon: '💀' });
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 1000);
    startCooldown();
    
    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      try {
        await databaseService.saveGameScore(userId, activeGame, score, { reason });
      } catch (error) {
        console.error('Error saving game score:', error);
      }
    }
  };

  const handleRollDice = () => {
    if (tickets <= 0 || timeLeft > 0) return;
    onPlay();
    setIsSpinning(true);
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      
      if (total === 12) {
        triggerWin('JACKPOT_UNLOCKED');
      } else if (total >= 9) {
        triggerWin('GH₵150_CREDIT');
      } else if (total >= 7) {
        triggerWin('PROMO_DECRYPTED');
      } else {
        triggerLoss('THERMAL_COLLAPSE');
      }
      setGameState(prev => ({ ...prev, d1, d2, total }));
      setIsSpinning(false);
    }, 1500);
  };

  const handleGuess = (num: number) => {
    if (tickets <= 0 || timeLeft > 0) return;
    onPlay();
    const target = Math.floor(Math.random() * 10) + 1;
    if (num === target) {
      triggerWin('PROMO_DECRYPTED');
    } else {
      triggerLoss('COGNITIVE_MISMATCH');
      setGameState(prev => ({ ...prev, target }));
    }
  };

  const handleGiftBox = (idx: number) => {
    if (tickets <= 0 || timeLeft > 0) return;
    onPlay();
    const rewards = ['JACKPOT_UNLOCKED', 'GH₵100_CREDIT', 'EMPTY_VAULT'];
    const shuffled = [...rewards].sort(() => Math.random() - 0.5);
    const outcome = shuffled[idx];
    
    if (outcome === 'EMPTY_VAULT') {
      triggerLoss('IDENTITY_VOIDED');
    } else {
      triggerWin(outcome);
    }
  };

  const reset = () => {
    setActiveGame('NONE');
    setGameState(null);
  };

  const isLocked = timeLeft > 0 || tickets <= 0;

  return (
    <div className={`p-6 md:p-12 space-y-12 animate-in fade-in duration-500 pb-32 max-w-5xl mx-auto transition-all ${glitchActive ? 'invert bg-red-900/20' : ''}`}>
      <header className="text-center space-y-8">
        <div className="flex flex-col gap-2">
           <h1 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter">Play<span className="text-[#EC4899] not-italic font-sans font-black uppercase">room</span></h1>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em]">Win Archival Gear & Neural Credits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Ticket Balance */}
          <div className="glass px-8 py-6 rounded-[2rem] border-white/5 flex flex-col items-center justify-center gap-2 group relative overflow-hidden">
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Available Tickets</span>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-mono font-black text-white">{tickets}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xl ${tickets > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500 animate-pulse'}`}>
                {tickets > 0 ? '🎟️' : '🪫'}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-1000" style={{ width: `${Math.min(100, (tickets / 10) * 100)}%` }}></div>
          </div>

          {/* Cooldown Status */}
          <div className={`glass px-8 py-6 rounded-[2rem] border-white/5 flex flex-col items-center justify-center gap-2 overflow-hidden relative ${timeLeft > 0 ? 'border-[#EC4899]/30' : 'border-blue-500/30'}`}>
             <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Arena Status</span>
             <div className="flex items-center gap-3">
                <span className={`text-xl font-mono font-black ${timeLeft > 0 ? 'text-[#EC4899]' : 'text-blue-400'}`}>
                   {timeLeft > 0 ? `RELOADING_${timeLeft}s` : 'READY_TO_PLAY'}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${timeLeft > 0 ? 'border-[#EC4899] animate-spin text-[#EC4899]' : 'border-blue-500 text-blue-500'}`}>
                   {timeLeft > 0 ? '⏳' : '✓'}
                </div>
             </div>
          </div>

          {/* Weekly Jackpot */}
          <div className="glass px-8 py-6 rounded-[2rem] border-white/5 flex flex-col items-center justify-center gap-1 group relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
            <span className="text-[8px] font-black text-[#EC4899] uppercase tracking-widest">Weekly Jackpot</span>
            <span className="text-xs font-serif italic text-white text-center line-clamp-1">{jackpotProduct.name}</span>
            <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
               <div className="h-full bg-[#EC4899] animate-[shimmer_2s_infinite]" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          {showHelp ? 'Hide Instructions' : 'How to Play?'}
        </button>

        {showHelp && (
          <div className="max-w-2xl mx-auto glass p-8 rounded-3xl border-white/5 text-left space-y-4 animate-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">🎟️ Tickets</h4>
                <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-wider">Earn 2 tickets with every purchase. Each game attempt consumes 1 ticket.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">⏳ Cooldown</h4>
                <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-wider">The arena requires 60 seconds to recalibrate after each game attempt.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">💎 Rewards</h4>
                <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-wider">Win the Weekly Jackpot item, Neural Credits (discounts), or Promo Fragments.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">🎯 Winning</h4>
                <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-wider">Dice: Total 12 wins Jackpot. Guess: Match the Oracle's number. Vault: Pick the right box.</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {activeGame === 'NONE' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'DICE', name: 'Thermal Roll', icon: '🎲', desc: 'Roll 12 for Jackpot', cost: 1, color: 'from-pink-600/20 to-pink-900/40', border: 'border-pink-500/20' },
            { id: 'GUESS', name: 'Oracle Range', icon: '🔮', desc: 'Match Oracle (1-10)', cost: 1, color: 'from-blue-600/20 to-blue-900/40', border: 'border-blue-500/20' },
            { id: 'GIFT', name: 'Identity Vault', icon: '📦', desc: 'Pick a container', cost: 1, color: 'from-purple-600/20 to-purple-900/40', border: 'border-purple-500/20' }
          ].map(g => (
            <button
              key={g.id}
              disabled={isLocked}
              onClick={() => setActiveGame(g.id as any)}
              className={`relative overflow-hidden group p-8 rounded-[2.5rem] bg-gradient-to-br ${g.color} ${g.border} text-center transition-all hover:scale-[1.05] shadow-2xl active:scale-95 border flex flex-col items-center gap-6 disabled:opacity-40 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed`}
            >
              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center text-5xl mx-auto group-hover:rotate-12 transition-transform duration-500">
                  {g.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif italic text-white group-hover:text-[#EC4899] transition-colors">{g.name}</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{g.desc}</p>
                </div>
                <div className="pt-2">
                  <span className="px-4 py-2 bg-black/60 rounded-full text-[8px] font-black text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">
                    {isLocked ? (timeLeft > 0 ? 'Recalibrating' : 'No Tickets') : `Play for ${g.cost} Ticket`}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </button>
          ))}
        </div>
      ) : (
        <div className={`glass p-8 md:p-16 rounded-[4rem] border-white/10 text-center space-y-12 animate-in zoom-in-95 relative overflow-hidden min-h-[550px] shadow-[0_0_100px_rgba(0,0,0,0.5)] ${gameState && !gameState.win ? 'border-red-900/50' : 'border-white/10'}`}>
          <button onClick={reset} className="absolute top-10 left-10 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors flex items-center gap-2 group">
             <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> EXIT ARENA
          </button>
          
          {!gameState ? (
            <div className="space-y-12 py-10">
              {activeGame === 'DICE' && (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter">Thermal Roll</h2>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total 12 = Jackpot // 9+ = Neural Credits // 7+ = Promo</p>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className={`w-32 h-32 rounded-[2.5rem] glass border-white/10 flex items-center justify-center text-7xl shadow-2xl ${isSpinning ? 'animate-bounce' : ''}`}>🎲</div>
                    <div className={`w-32 h-32 rounded-[2.5rem] glass border-white/10 flex items-center justify-center text-7xl shadow-2xl ${isSpinning ? 'animate-bounce [animation-delay:0.2s]' : ''}`}>🎲</div>
                  </div>
                  <button 
                    disabled={isSpinning || isLocked}
                    onClick={handleRollDice}
                    className="group relative px-20 py-8 bg-white text-black rounded-3xl font-black uppercase tracking-[0.5em] text-xs hover:bg-[#EC4899] hover:text-white transition-all shadow-3xl disabled:opacity-20 overflow-hidden"
                  >
                    <span className="relative z-10">{isSpinning ? 'ROLLING...' : `Roll Dice`}</span>
                    <div className="absolute inset-0 bg-[#EC4899] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </div>
              )}

              {activeGame === 'GUESS' && (
                <div className="space-y-10">
                   <div className="space-y-2">
                    <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter">Oracle Range</h2>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sync with the Oracle's frequency (1-10)</p>
                  </div>
                   <div className="grid grid-cols-5 gap-4 max-w-sm mx-auto">
                     {[1,2,3,4,5,6,7,8,9,10].map(n => (
                       <button 
                        key={n} 
                        disabled={isLocked}
                        onClick={() => handleGuess(n)}
                        className="w-16 h-16 rounded-2xl glass border-white/5 flex items-center justify-center font-black text-white hover:bg-white hover:text-black hover:scale-110 transition-all disabled:opacity-20 shadow-xl"
                       >
                         {n}
                       </button>
                     ))}
                   </div>
                </div>
              )}

              {activeGame === 'GIFT' && (
                <div className="space-y-12">
                   <div className="space-y-2">
                    <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter">Identity Vault</h2>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">One contains the Jackpot. Choose wisely.</p>
                  </div>
                   <div className="flex justify-center gap-10">
                     {[0,1,2].map(idx => (
                       <button 
                        key={idx}
                        disabled={isLocked}
                        onClick={() => handleGiftBox(idx)}
                        className="w-40 h-40 rounded-[3rem] glass border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-[#EC4899]/10 hover:-translate-y-4 transition-all shadow-2xl group disabled:opacity-20"
                       >
                         <span className="text-7xl group-hover:scale-110 transition-transform">📦</span>
                         <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-[#EC4899]">Vault_{idx + 1}</span>
                       </button>
                     ))}
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12 animate-in zoom-in-90 duration-500 py-10">
               <div className={`text-9xl mb-6 transition-all duration-[1.5s] ${!gameState.win ? 'grayscale blur-lg opacity-40 scale-150 rotate-12' : 'drop-shadow-[0_0_50px_#EC4899] scale-110 animate-bounce'}`}>
                 {gameState.icon}
               </div>
               <div className="space-y-6">
                 <h2 className={`text-6xl md:text-8xl font-serif italic uppercase tracking-tighter leading-none ${gameState.win ? 'text-[#EC4899] glow-text' : 'text-red-600'}`}>
                    {gameState.result.replace(/_/g, ' ')}
                 </h2>
                 <div className="h-px w-20 bg-zinc-900 mx-auto"></div>
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em] max-w-sm mx-auto leading-relaxed italic">
                   {activeGame === 'DICE' && `Result: ${gameState.total} // Need: 12`}
                   {activeGame === 'GUESS' && !gameState.win && `Oracle's Number: ${gameState.target}`}
                   {gameState.win ? 'REWARD ALLOCATED TO YOUR ACCOUNT' : 'BETTER LUCK NEXT TIME'}
                 </p>
               </div>
               <div className="pt-8">
                <button 
                  onClick={reset} 
                  className={`w-full max-w-md py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-xs transition-all shadow-3xl border ${gameState.win ? 'bg-white text-black hover:bg-[#EC4899] hover:text-white border-transparent' : 'bg-black text-zinc-600 hover:text-white border-white/5'}`}
                >
                  Return to Playroom
                </button>
               </div>
            </div>
          )}
          
          {glitchActive && (
            <div className="absolute inset-0 pointer-events-none bg-red-600/20 mix-blend-overlay animate-pulse z-50 overflow-hidden">
               <div className="absolute inset-0 border-[20px] border-red-500/50 animate-ping"></div>
            </div>
          )}
        </div>
      )}

      {/* Global Arena Intel */}
      <footer className="bg-zinc-950/50 border border-white/5 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-3xl grayscale group-hover:grayscale-0 transition-all group-hover:rotate-12">🏛️</div>
            <div className="space-y-1">
               <h4 className="text-xl font-serif italic text-white">Playroom Protocol</h4>
               <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest leading-relaxed">
                  Neural recalibration (60s) required between games. <br/> Rewards are automatically applied to your next acquisition.
               </p>
            </div>
         </div>
         <div className="text-right">
            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest block mb-1">System Status</span>
            <div className="text-xs font-mono font-bold text-green-500 animate-pulse">● ONLINE_OPTIMAL</div>
         </div>
      </footer>
    </div>
  );
};

export default GameShowroom;
