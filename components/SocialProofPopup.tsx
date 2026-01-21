
import React, { useState, useEffect } from 'react';
import { SocialEvent } from '../types';
import { LIVE_SOCIAL_FEED } from '../data/socialProofData';

const SocialProofPopup: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<SocialEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const triggerNextEvent = () => {
      const delay = Math.random() * 10000 + 5000; // 5-15 seconds
      setTimeout(() => {
        const randomEvent = LIVE_SOCIAL_FEED[Math.floor(Math.random() * LIVE_SOCIAL_FEED.length)];
        setCurrentEvent({ ...randomEvent, timestamp: 'Just now' });
        setIsVisible(true);
        
        setTimeout(() => {
          setIsVisible(false);
          triggerNextEvent();
        }, 4000);
      }, delay);
    };

    triggerNextEvent();
  }, []);

  if (!currentEvent) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE': return '🛒';
      case 'RESERVE': return '🔒';
      case 'LEVEL_UP': return '🆙';
      case 'ARENA_WIN': return '👑';
      default: return '✨';
    }
  };

  const getMessage = (event: SocialEvent) => {
    switch (event.type) {
      case 'PURCHASE': return `secured the ${event.productName}`;
      case 'RESERVE': return `reserved a ${event.productName}`;
      case 'LEVEL_UP': return `reached Level ${Math.floor(Math.random() * 50) + 5}`;
      case 'ARENA_WIN': return `dominated the Style Arena`;
      default: return 'is active in the circuit';
    }
  };

  return (
    <div className={`fixed bottom-32 left-6 z-[200] transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <div className="glass px-6 py-4 rounded-2xl border-pink-500/20 flex items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-xs">
        <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-xl border border-pink-500/30">
          {getIcon(currentEvent.type)}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-white uppercase tracking-tight">@{currentEvent.user}</span>
            <span className="text-[8px] font-bold text-pink-500 uppercase tracking-widest">{currentEvent.location}</span>
          </div>
          <p className="text-[9px] text-zinc-400 font-medium uppercase leading-tight mt-0.5">
            {getMessage(currentEvent)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialProofPopup;
