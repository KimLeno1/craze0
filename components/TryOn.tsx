import React, { useRef, useEffect, useState } from 'react';
import { RankBenefits, UserStats } from '../types';

interface TryOnProps {
  rank: RankBenefits;
  stats: UserStats;
  onUsed: () => void;
}

const TryOn: React.FC<TryOnProps> = ({ rank, stats, onUsed }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    if (stats.aiTryOnsUsedToday >= rank.aiTryOnLimit) {
      setIsDenied(true);
      return;
    }

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
          onUsed();
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  if (isDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-12 text-center space-y-8 animate-in fade-in">
        <div className="text-8xl grayscale opacity-20">🚫</div>
        <div className="space-y-4">
           <h2 className="text-4xl font-serif italic text-white uppercase tracking-tighter">Thermal Limit Reached</h2>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-sm mx-auto">
             Your current standing as a {rank.tier} allows {rank.aiTryOnLimit} attempts per solar cycle. Access is restricted until recalibration.
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-500 pb-32">
      <header className="text-center">
        <h1 className="text-5xl font-serif italic text-white leading-none">The <span className="text-[#00D1FF] not-italic font-sans font-black glow-text">MATERIALIZER</span></h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-6">{rank.tier} Access Level // Daily attempts used: {stats.aiTryOnsUsedToday}/{rank.aiTryOnLimit}</p>
      </header>

      <div className="relative aspect-[3/4] w-full max-w-lg mx-auto rounded-[3.5rem] overflow-hidden bg-zinc-950 border border-white/10 shadow-3xl group">
        {!hasCamera ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <span className="text-6xl grayscale opacity-20 group-hover:opacity-100 transition-all">📷</span>
            <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[0.3em]">Accessing Visual Terminal...</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
        )}
        
        <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between border-[20px] border-transparent">
          <div className="flex justify-between">
            <div className="w-12 h-12 border-t-2 border-l-2 border-[#00D1FF]/50"></div>
            <div className="w-12 h-12 border-t-2 border-r-2 border-[#00D1FF]/50"></div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="glass px-6 py-2 rounded-full border-[#00D1FF]/30">
               <span className="text-[9px] font-black uppercase text-[#00D1FF] tracking-widest">Scanning {rank.tier} Silhouette...</span>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00D1FF]/50 to-transparent animate-pulse"></div>
          </div>
          <div className="flex justify-between">
            <div className="w-12 h-12 border-b-2 border-l-2 border-[#00D1FF]/50"></div>
            <div className="w-12 h-12 border-b-2 border-r-2 border-[#00D1FF]/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOn;