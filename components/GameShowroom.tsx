
import React, { useState } from 'react';

interface GameShowroomProps {
  attemptsRemaining: number;
  onPlay: () => void;
  onWin: (reward: string) => void;
}

const GameShowroom: React.FC<GameShowroomProps> = ({ attemptsRemaining, onPlay, onWin }) => {
  const [activeGame, setActiveGame] = useState<'NONE' | 'RPS' | 'GUESS' | 'SPIN'>('NONE');
  const [gameState, setGameState] = useState<any>(null);

  const startRPS = (choice: string) => {
    if (attemptsRemaining <= 0) return alert("Daily passes exhausted. Return in 24 hours.");
    onPlay();
    const options = ['ROCK', 'PAPER', 'SCISSORS'];
    const bot = options[Math.floor(Math.random() * 3)];
    let result = '';
    
    if (choice === bot) result = 'TIE';
    else if (
      (choice === 'ROCK' && bot === 'SCISSORS') || 
      (choice === 'PAPER' && bot === 'ROCK') || 
      (choice === 'SCISSORS' && bot === 'PAPER')
    ) {
      result = 'WIN';
      onWin('50 GEMS');
    } else {
      result = 'LOSE';
    }
    setGameState({ player: choice, bot, result });
  };

  const startGuess = (num: number) => {
    if (attemptsRemaining <= 0) return alert("Daily passes exhausted.");
    onPlay();
    const target = Math.floor(Math.random() * 5) + 1;
    if (num === target) {
      setGameState({ result: 'WIN', target });
      onWin('500 COINS');
    } else {
      setGameState({ result: 'LOSE', target });
    }
  };

  const startSpin = () => {
    if (attemptsRemaining <= 0) return alert("Daily passes exhausted.");
    onPlay();
    const rewards = ['TRY AGAIN', '10 GEMS', 'LOSE', '100 COINS', 'RARE BADGE', '200 XP'];
    const outcome = rewards[Math.floor(Math.random() * rewards.length)];
    setGameState({ result: outcome });
    if (outcome !== 'LOSE' && outcome !== 'TRY AGAIN') onWin(outcome);
  };

  const reset = () => {
    setActiveGame('NONE');
    setGameState(null);
  };

  return (
    <div className="p-6 md:p-12 space-y-12 animate-in fade-in duration-500 pb-32 max-w-4xl mx-auto">
      <header className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter">Arcade <span className="text-[#EC4899] not-italic font-sans font-black uppercase">Arena</span></h1>
        <div className="inline-flex items-center gap-4 glass px-8 py-3 rounded-full border-[#EC4899]/20 shadow-xl">
          <div className={`w-2 h-2 rounded-full ${attemptsRemaining > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Daily Passes: {attemptsRemaining}/3</span>
        </div>
      </header>

      {activeGame === 'NONE' ? (
        <div className="grid gap-6">
          {[
            { id: 'RPS', name: 'Cyber Tactics (RPS)', icon: '✊', desc: 'Outthink the machine.', color: 'from-pink-600 to-purple-600' },
            { id: 'GUESS', name: 'Oracle\'s Choice', icon: '🔮', desc: 'Predict the digit 1-5.', color: 'from-blue-600 to-indigo-600' },
            { id: 'SPIN', name: 'The Wheel of Fate', icon: '🎡', desc: 'Randomized circuit rewards.', color: 'from-orange-500 to-red-600' }
          ].map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as any)}
              className={`relative overflow-hidden group p-10 rounded-[2.5rem] bg-gradient-to-br ${g.color} text-left transition-all hover:scale-[1.02] shadow-2xl active:scale-95 border border-white/10`}
            >
              <div className="relative z-10 flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif italic text-white leading-none">{g.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{g.desc}</p>
                </div>
                <span className="text-6xl group-hover:rotate-12 transition-transform duration-500">{g.icon}</span>
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass p-12 rounded-[3.5rem] border-white/10 text-center space-y-12 animate-in zoom-in-95 relative overflow-hidden">
          <button onClick={reset} className="absolute top-10 left-10 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">← EXIT_TERMINAL</button>
          
          {activeGame === 'RPS' && !gameState && (
            <div className="space-y-12">
              <h2 className="text-4xl font-serif italic text-white">Initiate Combat</h2>
              <div className="flex justify-center gap-8">
                {[
                  { id: 'ROCK', icon: '✊' },
                  { id: 'PAPER', icon: '✋' },
                  { id: 'SCISSORS', icon: '✌️' }
                ].map(m => (
                  <button 
                    key={m.id}
                    onClick={() => startRPS(m.id)} 
                    className="w-24 h-24 rounded-3xl glass text-4xl hover:bg-white hover:text-black transition-all shadow-xl flex items-center justify-center border-white/5"
                  >
                    {m.icon}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeGame === 'GUESS' && !gameState && (
            <div className="space-y-12">
              <h2 className="text-4xl font-serif italic text-white">Select the Oracle's Thought</h2>
              <div className="flex justify-center gap-4 flex-wrap">
                {[1,2,3,4,5].map(n => (
                  <button 
                    key={n}
                    onClick={() => startGuess(n)} 
                    className="w-16 h-16 rounded-2xl glass text-xl font-black hover:bg-white hover:text-black transition-all border-white/5"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeGame === 'SPIN' && !gameState && (
            <div className="space-y-12">
              <h2 className="text-4xl font-serif italic text-white">Spin the Fabric</h2>
              <div className="relative w-56 h-56 mx-auto border-4 border-[#EC4899] rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#EC4899]/20 to-transparent rounded-full"></div>
                <span className="text-7xl">🎡</span>
              </div>
              <button 
                onClick={startSpin} 
                className="px-16 py-6 bg-[#EC4899] text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-[0_0_50px_rgba(236,72,153,0.4)] hover:bg-white hover:text-black transition-all active:scale-95"
              >
                SPIN_VAULT
              </button>
            </div>
          )}

          {gameState && (
            <div className="space-y-8 animate-in zoom-in-90 duration-500">
              <div className="text-8xl mb-6">
                {(gameState.result === 'WIN' || (typeof gameState.result === 'string' && !['LOSE', 'TRY AGAIN'].includes(gameState.result))) ? '💎' : '💀'}
              </div>
              <h2 className="text-5xl font-serif italic uppercase text-white tracking-tighter">
                {typeof gameState.result === 'string' ? gameState.result : 'Protocol Concluded'}
              </h2>
              <div className="space-y-2">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
                  {activeGame === 'RPS' && `Neural Hand: ${gameState.player} // System Choice: ${gameState.bot}`}
                  {activeGame === 'GUESS' && `Oracle frequency: ${gameState.target}`}
                  {activeGame === 'SPIN' && `Reward allocated to vault.`}
                </p>
                {gameState.result === 'WIN' && <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">TRANSACTION_SUCCESS +50 XP</p>}
              </div>
              <button 
                onClick={reset} 
                className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#EC4899] hover:text-white transition-all shadow-3xl"
              >
                Synchronize Return
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameShowroom;
