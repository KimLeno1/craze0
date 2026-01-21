
import React, { useState, useEffect } from 'react';
import { getStylingAdvice, generateDreamOutfit } from '../services/geminiService';

const StylistAI: React.FC = () => {
  // Styling Advice State
  const [mood, setMood] = useState('');
  const [occasion, setOccasion] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [adviceLoadingText, setAdviceLoadingText] = useState('Consulting...');

  // Dream Outfit State
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamImage, setDreamImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageLoadingText, setImageLoadingText] = useState('Synthesizing...');
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Loading text cycles
  useEffect(() => {
    let interval: any;
    if (isLoadingAdvice) {
      const texts = ['SYNCING_NEURAL', 'CALIBRATING_VIBE', 'INDEXING_TRENDS', 'GENERATE_VERDICT'];
      let i = 0;
      interval = setInterval(() => {
        setAdviceLoadingText(texts[i % texts.length]);
        i++;
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isLoadingAdvice]);

  useEffect(() => {
    let interval: any;
    if (isGeneratingImage) {
      const texts = ['FORGING_PIXELS', 'WEAVING_MESH', 'CALIBRATING_LIGHT', 'FINAL_POLISH'];
      let i = 0;
      interval = setInterval(() => {
        setImageLoadingText(texts[i % texts.length]);
        i++;
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isGeneratingImage]);

  const handleConsult = async () => {
    if (!mood || !occasion) return;
    setIsLoadingAdvice(true);
    try {
      const result = await getStylingAdvice(mood, occasion);
      setAdvice(result || "My stylistic sensors are jammed. Try again later, darling.");
    } catch (error) {
      setAdvice("Oops! Even fashion geniuses have off days. Try later.");
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const handleGenerateDream = async () => {
    if (!dreamDescription) return;
    setIsGeneratingImage(true);
    setDreamImage(null);
    setIsShared(false);
    try {
      const imageUrl = await generateDreamOutfit(dreamDescription);
      setDreamImage(imageUrl);
    } catch (error) {
      console.error("Image generation failed", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const simulateShare = (platform: string) => {
    setIsShared(true);
    setTimeout(() => {
      setIsShareModalOpen(false);
      setIsShared(false);
      alert(`Shared to ${platform}! You earned 10 Craze Coins.`);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-16 pb-40 overflow-x-hidden">
      <header className="text-center mb-16 md:mb-32">
        <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-serif italic mb-6 tracking-tighter leading-[0.85] animate-in slide-in-from-top-4 duration-1000">
          AI Fashion <span className="text-[#EC4899] not-italic font-sans font-black uppercase glow-text">Studio</span>
        </h1>
        <p className="text-zinc-500 max-w-2xl mx-auto uppercase text-[9px] sm:text-[11px] font-black tracking-[0.5em] leading-relaxed opacity-60">
          Gemini-Powered Neural Styling & Archetype Visualization
        </p>
      </header>

      <div className="space-y-32 md:space-y-52">
        {/* Section 1: Styling Verdict */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-6 mb-12 md:mb-20">
            <div className="h-px flex-1 bg-zinc-900"></div>
            <h2 className="text-[9px] md:text-xs font-black uppercase tracking-[0.5em] text-[#EC4899] whitespace-nowrap">
              System // Verdict_Engines
            </h2>
            <div className="h-px flex-1 bg-zinc-900"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-stretch">
            <div className="flex flex-col space-y-10 bg-zinc-950/40 p-8 md:p-14 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-2xl">
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Atmosphere</label>
                  <input 
                    type="text" 
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="Lethal / Avant-garde"
                    className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-5 text-white text-base focus:border-[#EC4899] focus:outline-none transition-all placeholder:text-zinc-800 font-mono tracking-tight"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">The Objective</label>
                  <input 
                    type="text" 
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="District 9 Gala"
                    className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-5 text-white text-base focus:border-[#EC4899] focus:outline-none transition-all placeholder:text-zinc-800 font-mono tracking-tight"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleConsult}
                disabled={isLoadingAdvice || !mood || !occasion}
                className={`w-full h-20 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group ${
                  isLoadingAdvice ? 'bg-zinc-900 text-white cursor-wait' : 'bg-white text-black hover:bg-[#EC4899] hover:text-white'
                }`}
              >
                {isLoadingAdvice ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EC4899]/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-ping"></div>
                      <div className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-ping [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-[#EC4899] rounded-full animate-ping [animation-delay:0.4s]"></div>
                    </div>
                    <span className="relative z-10 font-mono">{adviceLoadingText}</span>
                  </>
                ) : (
                  <>
                    <span>Begin Neural Scan</span>
                    <span className="text-xl group-hover:translate-x-2 transition-transform">⚡</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center min-h-[400px]">
              {isLoadingAdvice ? (
                <div className="text-center space-y-8 animate-in fade-in duration-500">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-t-2 border-[#EC4899] rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-b-2 border-zinc-800 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🧬</div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] text-[#EC4899] font-black uppercase tracking-[0.6em] animate-pulse">Processing_Vibe_Arrays</p>
                    <div className="w-48 h-[1px] bg-zinc-900 mx-auto">
                      <div className="h-full bg-[#EC4899] w-1/2 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ) : advice ? (
                <div className="w-full p-10 md:p-16 bg-zinc-950 border border-white/10 rounded-[4rem] relative group overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700 flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-12 text-[#EC4899]/5 text-[15rem] font-serif italic pointer-events-none group-hover:scale-110 transition-transform duration-1000 select-none leading-none">"</div>
                  <p className="text-zinc-100 italic leading-relaxed font-serif text-2xl md:text-4xl relative z-10">
                    &ldquo;{advice}&rdquo;
                  </p>
                  <div className="mt-16 flex items-center gap-6 border-t border-white/5 pt-12 relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white text-black flex items-center justify-center font-black text-xl shadow-xl group-hover:rotate-12 transition-transform">CC</div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-black uppercase tracking-widest text-white">Neural Architect v3.1</div>
                      <div className="text-[9px] text-zinc-600 uppercase tracking-[0.5em] font-bold italic">Authorized Styling Feed</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-20 border border-zinc-900 rounded-[4rem] w-full group hover:border-[#EC4899]/30 transition-all duration-700 cursor-default bg-zinc-950/20">
                  <div className="text-8xl mb-10 grayscale opacity-10 group-hover:opacity-40 group-hover:scale-105 group-hover:rotate-3 transition-all duration-1000">🧬</div>
                  <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.6em] italic">Awaiting Genetic Inputs</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Dream Outfit Visualization */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-center gap-6 mb-12 md:mb-20">
            <div className="h-px flex-1 bg-zinc-900"></div>
            <h2 className="text-[9px] md:text-xs font-black uppercase tracking-[0.5em] text-purple-500 whitespace-nowrap">
              Lab // Visual_Manifest
            </h2>
            <div className="h-px flex-1 bg-zinc-900"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <div className="order-2 lg:order-1 flex flex-col justify-center space-y-12 lg:sticky lg:top-40">
              <div className="space-y-6">
                <h3 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter leading-tight">Physical <br/> Synthesis</h3>
                <p className="text-zinc-500 text-[11px] sm:text-xs font-bold leading-relaxed uppercase tracking-[0.3em] max-w-lg opacity-70">
                  Describe a silhouette that defies the standard archives. Our generative laboratory will materialize it in 8k resolution for the arena.
                </p>
              </div>

              <div className="bg-zinc-950/40 p-10 md:p-14 rounded-[4rem] border border-white/5 space-y-10 backdrop-blur-md shadow-2xl">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Concept Blueprint</label>
                  <textarea 
                    value={dreamDescription}
                    onChange={(e) => setDreamDescription(e.target.value)}
                    placeholder="Describe textures, lighting, and form..."
                    rows={5}
                    className="w-full bg-black border border-zinc-900 rounded-[2rem] px-8 py-6 text-white text-base focus:border-purple-500 focus:outline-none transition-all resize-none font-mono tracking-tight"
                  />
                </div>
                <button 
                  onClick={handleGenerateDream}
                  disabled={isGeneratingImage || !dreamDescription}
                  className={`w-full h-20 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 relative overflow-hidden group ${
                    isGeneratingImage ? 'bg-zinc-900 text-white cursor-wait' : 'bg-white text-black hover:bg-purple-600 hover:text-white'
                  }`}
                >
                  {isGeneratingImage ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="relative z-10 font-mono">{imageLoadingText}</span>
                    </>
                  ) : (
                    <>
                      <span>Manifest Blueprint</span>
                      <span className="text-xl group-hover:rotate-12 transition-transform">↯</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-full aspect-[4/5] bg-black rounded-[4rem] border border-white/5 overflow-hidden relative group transition-all duration-1000 hover:shadow-[0_0_100px_-20px_rgba(168,85,247,0.4)] hover:border-purple-500/30">
                {isGeneratingImage ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 animate-in fade-in duration-500">
                    <div className="w-full h-full relative overflow-hidden">
                       <div className="absolute inset-0 opacity-10 flex flex-wrap gap-1 p-4">
                          {Array.from({length: 400}).map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-purple-500 rounded-sm animate-pulse" style={{ animationDelay: `${i * 0.01}s` }}></div>
                          ))}
                       </div>
                       <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
                         <div className="text-8xl animate-pulse">🧱</div>
                         <div className="text-center space-y-4">
                           <div className="text-[11px] font-black uppercase tracking-[0.7em] text-purple-500">Materializing_Realism</div>
                           <div className="w-32 h-[2px] bg-zinc-900 mx-auto overflow-hidden">
                              <div className="h-full bg-purple-500 w-1/3 animate-[shimmer_1s_infinite]"></div>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                ) : dreamImage ? (
                  <>
                    <img 
                      src={dreamImage} 
                      alt="Dream Outfit" 
                      className="w-full h-full object-cover animate-in zoom-in-105 fade-in duration-1000"
                    />
                    {/* Subtle Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EC4899]/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(236,72,153,0.15)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60"></div>
                    <div className="absolute bottom-12 left-10 right-10 space-y-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                      <div className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em] mb-2 px-6 py-2 bg-purple-950/40 backdrop-blur-2xl rounded-full w-fit border border-purple-500/20">
                        Concept_Render_Success
                      </div>
                      <p className="text-white text-base md:text-lg font-medium italic opacity-80 leading-relaxed line-clamp-2">
                        "{dreamDescription}"
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-16">
                    <div className="text-9xl mb-10 opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all duration-1000 select-none grayscale">🎨</div>
                    <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.6em] italic max-w-[280px] leading-loose">
                      Initialize Laboratory Parameters
                    </p>
                  </div>
                )}
              </div>
              
              {dreamImage && !isGeneratingImage && (
                <div className="mt-12 flex justify-center animate-in slide-in-from-bottom-8 duration-700">
                  <button 
                    onClick={handleShareClick}
                    className="flex items-center gap-8 bg-white text-black px-16 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#EC4899] hover:text-white transition-all shadow-3xl active:scale-95 group"
                  >
                    <span>Broadcast Vision</span>
                    <span className="bg-zinc-100 text-[#EC4899] px-4 py-1.5 rounded-full text-[9px] font-black border border-zinc-200 group-hover:bg-white transition-colors">
                      +10 XP
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Share Modal - Refined Bottom Sheet for Mobile */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-0 sm:px-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="bg-black border-t sm:border border-white/10 w-full max-w-xl rounded-t-[4rem] sm:rounded-[4rem] overflow-hidden shadow-[0_0_150px_-30px_rgba(236,72,153,0.3)] animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-700">
            <div className="relative h-72 md:h-96 bg-zinc-950 flex items-center justify-center overflow-hidden">
              {dreamImage && <img src={dreamImage} alt="Preview" className="w-full h-full object-cover opacity-40 blur-xl scale-150" />}
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="bg-black/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 text-center space-y-4 shadow-3xl border-t-[#EC4899]/30">
                   <p className="text-white text-[12px] font-black uppercase tracking-[0.6em] glow-text">Transmission_Ready</p>
                   <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.4em]">Protocol 09: Global Synchronization</p>
                </div>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-10 right-10 w-14 h-14 rounded-full bg-black/50 backdrop-blur-3xl flex items-center justify-center text-white hover:bg-red-600/50 transition-all border border-white/10 z-20 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-12 md:p-16 space-y-12">
              <div className="text-center space-y-6">
                <h3 className="text-4xl font-serif italic text-white">Select Node</h3>
                <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.4em] leading-relaxed max-w-xs mx-auto italic">
                  Broadcast your silhouette to the circuit to influence global trend parameters.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 md:gap-12">
                {[
                  { name: 'ARCHIVE', icon: '📸', color: 'bg-zinc-900 border border-white/5' },
                  { name: 'TERMINAL', icon: '𝕏', color: 'bg-black border border-white/10' },
                  { name: 'PULSE', icon: '📌', color: 'bg-red-950/20 border border-red-900/30' },
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => simulateShare(p.name)}
                    disabled={isShared}
                    className="flex flex-col items-center gap-5 group"
                  >
                    <div className={`w-20 h-20 md:w-24 md:h-24 ${p.color} rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:-translate-y-3 transition-all duration-500`}>
                      {p.icon}
                    </div>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-[#EC4899] transition-colors">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>

              {isShared && (
                <div className="text-center py-4 text-green-500 text-[11px] font-black uppercase tracking-[0.6em] animate-pulse">
                  Uplink_Confirmed
                </div>
              )}
            </div>
            
            <div className="bg-zinc-950 p-10 text-center border-t border-white/5 pb-16 sm:pb-10">
               <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em]">
                 System Result: <span className="text-[#EC4899] font-bold">10_XP_ALLOCATED</span>
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StylistAI;
