import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VaultEntranceProps {
  onComplete?: () => void;
}

const VaultEntrance: React.FC<VaultEntranceProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Initial delay before opening
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);

    // Time for animation to finish then remove from DOM
    const removeTimer = setTimeout(() => {
      setIsRemoved(true);
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (isRemoved) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {!isRemoved && (
          <>
            {/* Left Door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: isOpen ? '-100%' : 0 }}
              transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 bg-[#0A0A0A] border-r border-[#EC4899]/20 flex items-center justify-end pointer-events-auto"
            >
              <div className="relative h-full w-full flex items-center justify-end">
                {/* Vault Details */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-32 h-32 rounded-full border-4 border-[#1A1A1A] bg-[#050505] z-10 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                   <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#EC4899]/30 animate-[spin_10s_linear_infinite]"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-12 bg-[#EC4899]/40 rounded-full"></div>
                   </div>
                </div>
                
                {/* Texture/Lines */}
                <div className="absolute inset-0 opacity-10">
                   <div className="h-full w-full bg-[radial-gradient(#EC4899_1px,transparent_1px)] [background-size:20px_20px]"></div>
                </div>
                
                <div className="mr-20 text-right">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Closet</h2>
                  <div className="h-1 w-24 bg-[#EC4899] ml-auto"></div>
                </div>
              </div>
            </motion.div>

            {/* Right Door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: isOpen ? '100%' : 0 }}
              transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 bg-[#0A0A0A] border-l border-[#EC4899]/20 flex items-center justify-start pointer-events-auto"
            >
              <div className="relative h-full w-full flex items-center justify-start">
                {/* Texture/Lines */}
                <div className="absolute inset-0 opacity-10">
                   <div className="h-full w-full bg-[radial-gradient(#EC4899_1px,transparent_1px)] [background-size:20px_20px]"></div>
                </div>

                <div className="ml-20">
                  <h2 className="text-4xl font-black text-[#EC4899] tracking-tighter uppercase mb-2">Kraze</h2>
                  <div className="h-1 w-24 bg-white"></div>
                </div>
              </div>
            </motion.div>

            {/* Center Glow */}
            <motion.div 
              initial={{ opacity: 1 }}
              animate={{ opacity: isOpen ? 0 : 1 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
               <div className="w-1 h-full bg-[#EC4899]/20 blur-xl"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultEntrance;
