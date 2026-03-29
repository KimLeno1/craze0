
import React, { useState, useEffect } from 'react';
import { getStylingAdvice, generateDreamOutfit } from '../services/geminiService';

const StylistAI: React.FC = () => {
  const [mood, setMood] = useState('');
  const [occasion, setOccasion] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [adviceLoadingText, setAdviceLoadingText] = useState('Consulting...');

  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamImage, setDreamImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageLoadingText, setImageLoadingText] = useState('Synthesizing...');
  const [isHighFi, setIsHighFi] = useState(false);
  
  useEffect(() => {
    let interval: any;
    if (isLoadingAdvice) {
      const texts = ['SYNCING_CORE', 'INDEXING_VIBE', 'ARCHIVING_VERDICT'];
      let i = 0;
      interval = setInterval(() => setAdviceLoadingText(texts[i++ % texts.length]), 600);
    }
    return () => clearInterval(interval);
  }, [isLoadingAdvice]);

  useEffect(() => {
    let interval: any;
    if (isGeneratingImage) {
      const texts = ['BLUEPRINTING', 'MESH_WEAVING', 'MATERIALIZING'];
      let i = 0;
      interval = setInterval(() => setImageLoadingText(texts[i++ % texts.length]), 700);
    }
    return () => clearInterval(interval);
  }, [isGeneratingImage]);

  const handleConsult = async () => {
    if (!mood || !occasion) return;
    setIsLoadingAdvice(true);
    try {
      const result = await getStylingAdvice(mood, occasion);
      setAdvice(result);
    } catch (error) {
      setAdvice("Local sensors jammed. Maintain baseline.");
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const handleGenerateDream = async () => {
    if (!dreamDescription) return;
    
    if (isHighFi && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // As per instructions, assume successful selection after triggering dialog
        await (window as any).aistudio.openSelectKey();
      }
    }

    setIsGeneratingImage(true);
    setDreamImage(null);
    try {
      const imageUrl = await generateDreamOutfit(dreamDescription, isHighFi);
      setDreamImage(imageUrl);
    } catch (error: any) {
      if (error?.message?.includes("Requested entity was not found")) {
        (window as any).aistudio?.openSelectKey();
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-24 pb-40">
      <header className="text-center mb-16 md:mb-32">
        <h1 className="text-4xl sm:text-6xl lg:text-[8rem] font-serif italic mb-6 tracking-tighter leading-[0.9] animate-in slide-in-from-top-4 duration-1000">
          Neural Style <span className="text-[#EC4899] not-italic font-sans font-black uppercase glow-text">Studio</span>
        </h1>
        <div className="flex items-center justify-center gap-4 opacity-40">
           <div className="h-px w-20 bg-[#EC4899]"></div>
           <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.5em]">LOCAL_SYNTHESIS_v3.0</p>
           <div className="h-px w-20 bg-[#EC4899]"></div>
        </div>
      </header>

      <div className="space-y-32 md:space-y-64">
        {/* Section 1: Styling Verdict */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12 bg-zinc-950/50 p-10 md:p-16 rounded-[4rem] border border-white/5 backdrop-blur-xl">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Atmosphere</label>
                <input 
                  type="text" value={mood} onChange={(e) => setMood(e.target.value)}
                  placeholder="Lethal / Minimalist"
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-[#EC4899] outline-none font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Mission</label>
                <input 
                  type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)}
                  placeholder="District 9 Gala"
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-[#EC4899] outline-none font-mono"
                />
              </div>
            </div>
            <button 
              onClick={handleConsult} disabled={isLoadingAdvice || !mood || !occasion}
              className="w-full py-7 bg-white text-black rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-green-500 hover:text-white active:bg-green-700 transition-all shadow-2xl"
            >
              {isLoadingAdvice ? adviceLoadingText : 'Initialize Scan'}
            </button>
          </div>

          <div className="min-h-[300px] flex items-center justify-center">
            {isLoadingAdvice ? (
              <div className="w-20 h-20 border-4 border-[#EC4899]/20 border-t-[#EC4899] rounded-full animate-spin" />
            ) : advice ? (
              <div className="w-full p-12 bg-white/5 border border-white/10 rounded-[4rem] relative group overflow-hidden animate-in zoom-in-95 duration-700">
                <div className="absolute top-0 right-0 p-8 text-[#EC4899]/5 text-[15rem] font-serif italic pointer-events-none select-none">"</div>
                <p className="text-2xl md:text-4xl font-serif italic text-white relative z-10">&ldquo;{advice}&rdquo;</p>
              </div>
            ) : (
              <div className="text-center opacity-10 group hover:opacity-30 transition-opacity">
                <div className="text-[10rem]">🧬</div>
                <p className="text-[10px] font-black uppercase tracking-[1em]">Awaiting Inputs</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Synthesis Lab */}
        <section className="grid lg:grid-cols-2 gap-20 items-start">
          <div className="order-2 lg:order-1 space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter">Physical <span className="text-purple-500 not-italic">Synthesis</span></h2>
              <p className="text-zinc-500 text-xs uppercase tracking-widest leading-loose">Access the internal image buffer. Materialize a verified silhouette from the local circuit.</p>
            </div>

            <div className="bg-zinc-950/50 p-10 md:p-14 rounded-[4rem] border border-white/5 space-y-10">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Blueprint Specs</span>
                <button onClick={() => setIsHighFi(!isHighFi)} className={`px-4 py-1.5 rounded-full border transition-all text-[8px] font-black uppercase ${isHighFi ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-zinc-900 border-white/5 text-zinc-700'}`}>
                  {isHighFi ? 'High-Fi Active' : 'Standard Res'}
                </button>
              </div>
              <textarea 
                value={dreamDescription} onChange={(e) => setDreamDescription(e.target.value)}
                placeholder="Describe textures, silhouettes, and aura..."
                rows={4}
                className="w-full bg-black border border-white/10 rounded-[2rem] px-8 py-6 text-white focus:border-purple-500 outline-none font-mono resize-none"
              />
              <button 
                onClick={handleGenerateDream} disabled={isGeneratingImage || !dreamDescription}
                className="w-full py-8 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-green-500 hover:text-white active:bg-green-700 transition-all shadow-2xl"
              >
                {isGeneratingImage ? imageLoadingText : 'Authorize Materialization'}
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 aspect-[3/4] bg-zinc-950 rounded-[4rem] border border-white/5 overflow-hidden relative group hover:shadow-[0_0_80px_-20px_rgba(168,85,247,0.3)] transition-all duration-1000">
            {isGeneratingImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 bg-black z-10">
                <div className="text-6xl animate-pulse">🧱</div>
                <div className="text-[10px] font-black text-purple-500 uppercase tracking-[1em] animate-pulse">Processing_Buffer</div>
              </div>
            ) : dreamImage ? (
              <img src={dreamImage} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="Synthesis Result" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-5">
                <div className="text-[12rem]">🎨</div>
                <p className="text-[10px] font-black uppercase tracking-[1em]">Lab Idle</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StylistAI;
