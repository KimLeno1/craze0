import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, Zap, Share2, Target, Lock } from 'lucide-react';
import { UserStats, MicroCommitment } from '../types';

interface MicroCompliancePanelProps {
  stats: UserStats;
  onComplete: (id: string) => void;
}

const MicroCompliancePanel: React.FC<MicroCompliancePanelProps> = ({ stats, onComplete }) => {
  const getIcon = (type: MicroCommitment['type']) => {
    switch (type) {
      case 'VERIFY_TREND': return <ShieldCheck className="w-4 h-4" />;
      case 'SYNC_LINK': return <Zap className="w-4 h-4" />;
      case 'ENDORSE_STYLE': return <Target className="w-4 h-4" />;
      case 'SHARE_RANK': return <Share2 className="w-4 h-4" />;
      case 'RESERVE_SLOT': return <Lock className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const activeCommitments = stats.microCommitments.filter(c => !c.completed);
  const completedCount = stats.microCommitments.filter(c => c.completed).length;

  if (activeCommitments.length === 0 && completedCount > 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a73e8]/10 border border-[#1a73e8]/20 rounded-2xl p-6 mb-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[#1a73e8] flex items-center justify-center shadow-[0_0_20px_#1a73e8]">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
        </div>
        <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Neural Alignment Complete</h3>
        <p className="text-zinc-400 text-sm mb-4">You are fully synced with the Sector. Weekly Streak: <span className="text-[#1a73e8] font-bold">{stats.commitmentStreak}</span></p>
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a73e8]">Next Sync in 7d</div>
      </motion.div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a73e8] mb-2">Neural Compliance</div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Weekly Alignment</h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Weekly Streak</div>
          <div className="text-2xl font-black text-[#1a73e8]">{stats.commitmentStreak}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {stats.microCommitments.map((commitment) => (
            <motion.button
              key={commitment.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => !commitment.completed && onComplete(commitment.id)}
              disabled={commitment.completed}
              className={`relative group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${
                commitment.completed 
                ? 'bg-zinc-900/50 border-zinc-800 opacity-50 cursor-default' 
                : 'bg-zinc-900 border-white/5 hover:border-[#1a73e8]/50 hover:bg-zinc-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                commitment.completed ? 'bg-green-500/20 text-green-500' : 'bg-[#1a73e8]/10 text-[#1a73e8] group-hover:bg-[#1a73e8] group-hover:text-white'
              }`}>
                {commitment.completed ? <CheckCircle2 className="w-5 h-5" /> : getIcon(commitment.type)}
              </div>
              
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-tight mb-0.5">{commitment.label}</div>
                <div className="text-[10px] font-medium text-zinc-500">
                  {commitment.completed ? 'Alignment Verified' : `+${commitment.rewardXP} Neural Credits`}
                </div>
              </div>

              {!commitment.completed && (
                <div className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse"></div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-4 bg-zinc-900/30 border border-white/5 p-4 rounded-2xl">
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / stats.microCommitments.length) * 100}%` }}
            className="h-full bg-[#1a73e8] shadow-[0_0_10px_#1a73e8]"
          />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {completedCount}/{stats.microCommitments.length} Complete
        </div>
      </div>
    </div>
  );
};

export default MicroCompliancePanel;
