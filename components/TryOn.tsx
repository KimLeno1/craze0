
import React, { useRef, useEffect, useState } from 'react';

const TryOn: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
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

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-500 pb-32">
      <header className="text-center">
        <h1 className="text-5xl font-serif italic text-white leading-none">The <span className="text-[#EC4899] not-italic font-sans font-black glow-text">MATERIALIZER</span></h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-6">Spatial fitting protocol active</p>
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
        
        {/* HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between border-[20px] border-transparent">
          <div className="flex justify-between">
            <div className="w-12 h-12 border-t-2 border-l-2 border-[#EC4899]/50"></div>
            <div className="w-12 h-12 border-t-2 border-r-2 border-[#EC4899]/50"></div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="glass px-6 py-2 rounded-full border-[#EC4899]/30">
               <span className="text-[9px] font-black uppercase text-[#EC4899] tracking-widest">Scanning Silhouette...</span>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#EC4899]/50 to-transparent animate-pulse"></div>
          </div>

          <div className="flex justify-between">
            <div className="w-12 h-12 border-b-2 border-l-2 border-[#EC4899]/50"></div>
            <div className="w-12 h-12 border-b-2 border-r-2 border-[#EC4899]/50"></div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] italic leading-relaxed">
          "Architecture of the self is the ultimate design project."
        </p>
      </div>
    </div>
  );
};

export default TryOn;
