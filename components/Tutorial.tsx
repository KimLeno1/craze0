import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface TourStep {
  view: ViewState;
  title: string;
  description: string;
  selector?: string; // For visual cues if needed
}

const TOUR_STEPS: TourStep[] = [
  {
    view: ViewState.LOBBY,
    title: "The Signal Core",
    description: "Welcome to Closet Kraze. This is your primary uplink to the high-fashion circuit. Here you'll find active drops and editorial silhouettes currently materializing in the archives."
  },
  {
    view: ViewState.FAMOUS,
    title: "Velocity Heat",
    description: "Our algorithmic demand matrix. Items here are ranked by global acquisition velocity. High heat indicates imminent stock depletion. Secure them before they de-materialize."
  },
  {
    view: ViewState.BUNDLES,
    title: "Synergy Kits",
    description: "Optimized collections designed for maximum status efficiency. Acquiring a full kit provides a significant reputation yield compared to individual acquisition."
  },
  {
    view: ViewState.TRY_ON,
    title: "The Materializer",
    description: "Spatial AI synthesis. Project any archive silhouette onto your physical architecture using the camera uplink. Your rank determines your daily materialization limit."
  },
  {
    view: ViewState.PAY_FOR_ME,
    title: "Sponsorship Protocol",
    description: "External funding initialization. Generate strategic links for your wishlisted items. Allow other nodes in the circuit to contribute to your acquisition."
  },
  {
    view: ViewState.PROFILE,
    title: "Reputation Hierarchy",
    description: "This is your dossier. Your standing—from Novice to Appeal God—is calculated by REP. Higher ranks unlock vault capacity, discount multipliers, and Oracle visibility."
  }
];

interface TutorialProps {
  onComplete: () => void;
  onNavigate: (view: ViewState) => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is the welcome screen
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onNavigate(TOUR_STEPS[next].view);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    localStorage.setItem('cc-seen-tutorial', 'true');
    setIsExiting(true);
    setTimeout(onComplete, 500);
  };

  const currentData = currentStep >= 0 ? TOUR_STEPS[currentStep] : null;

  return (
    <div className={`fixed inset-0 z-[600] flex items-center justify-center p-6 transition-all duration-700 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={handleClose} />
      
      {/* Scanning effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-px bg-[#EC4899] animate-[scan_8s_linear_infinite]" />
      </div>

      <div className="relative z-10 w-full max-w-xl animate-in zoom-in-95 duration-500">
        <div className="glass p-10 md:p-16 rounded-[4rem] border-white/10 shadow-[0_0_100px_rgba(236,72,153,0.15)] relative overflow-hidden group">
          {/* Welcome View */}
          {currentStep === -1 ? (
            <div className="space-y-10 text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-[#EC4899] to-purple-600 p-0.5 mx-auto animate-bounce">
                <div className="w-full h-full bg-black rounded-[2.4rem] flex items-center justify-center text-4xl">👋</div>
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-serif italic text-white tracking-tighter">Initialize <span className="text-[#EC4899] not-italic font-sans font-black">PROTOCOLS?</span></h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
                  New identity detected in Sector_01. Do you require a guided synchronization of the Closet Kraze circuit?
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => handleNext()}
                  className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-[#EC4899] hover:text-white transition-all shadow-2xl"
                >
                  Begin Synchronization
                </button>
                <button 
                  onClick={handleClose}
                  className="text-[10px] font-black text-zinc-700 hover:text-zinc-400 uppercase tracking-[0.3em] transition-colors"
                >
                  Skip Protocol [Manual Override]
                </button>
              </div>
            </div>
          ) : (
            /* Step View */
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse"></div>
                  <span className="text-[10px] font-black text-[#EC4899] uppercase tracking-[0.4em]">Step {currentStep + 1} of {TOUR_STEPS.length}</span>
                </div>
                <button onClick={handleClose} className="text-zinc-600 hover:text-white transition-colors">✕</button>
              </header>

              <div className="space-y-4">
                <h2 className="text-4xl font-serif italic text-white tracking-tighter">{currentData?.title}</h2>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed italic uppercase tracking-tighter">
                  "{currentData?.description}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <button 
                  onClick={handleNext}
                  className="flex-1 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#EC4899] hover:text-white transition-all shadow-xl"
                >
                  {currentStep === TOUR_STEPS.length - 1 ? 'Complete Link' : 'Next Signal'}
                </button>
              </div>

              {/* Step indicator dots */}
              <div className="flex justify-center gap-2">
                {TOUR_STEPS.map((_, i) => (
                  <div key={i} className={`h-1 transition-all duration-500 rounded-full ${i === currentStep ? 'w-8 bg-[#EC4899]' : 'w-2 bg-zinc-800'}`} />
                ))}
              </div>
            </div>
          )}

          {/* Technical UI elements */}
          <div className="absolute bottom-4 left-10 text-[8px] font-mono text-zinc-800 uppercase tracking-widest">Protocol_Tour_v2.5</div>
          <div className="absolute top-4 right-10 text-[8px] font-mono text-zinc-800 uppercase tracking-widest">Secure_Handshake</div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Tutorial;