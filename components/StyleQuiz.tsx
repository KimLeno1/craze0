import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Category, Gender, UserPreferences } from '../types';
import { databaseService } from '../services/databaseService';

interface StyleQuizProps {
  userId: string;
  onComplete: (prefs: UserPreferences) => void;
  onClose: () => void;
}

const ARCHETYPE_TAGS = [
  'Street', 'Old Money', 'Simple', 'Cyber', 'Avant-Garde', 'Minimalist', 'Vintage', 'Gorpcore', 'Y2K', 'Preppy', 'Grunge', 'Boho'
];

const CATEGORIES: Category[] = ['All', 'Apparel', 'Footwear', 'Accessories', 'Kits', 'Fragments'];
const GENDERS: Gender[] = ['UNISEX', 'MEN', 'WOMEN'];

export const StyleQuiz: React.FC<StyleQuizProps> = ({ userId, onComplete, onClose }) => {
  const [step, setStep] = useState(0);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<Gender[]>([]);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      const prefs: UserPreferences = {
        userId,
        preferredCategories: selectedCategories,
        preferredGenders: selectedGenders,
        styleArchetype: selectedArchetypes.join(','),
      };
      databaseService.saveUserPreferences(userId, prefs);
      onComplete(prefs);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleArchetype = (tag: string) => {
    setSelectedArchetypes(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleCategory = (cat: Category) => {
    if (cat === 'All') {
      setSelectedCategories(prev => prev.includes('All') ? [] : ['All', ...CATEGORIES.filter(c => c !== 'All')]);
      return;
    }
    setSelectedCategories(prev => {
      const newCats = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat];
      if (newCats.length === CATEGORIES.length - 1 && !newCats.includes('All')) {
        return ['All', ...newCats];
      }
      return newCats.filter(c => c !== 'All');
    });
  };

  const toggleGender = (gen: Gender) => {
    setSelectedGenders(prev => 
      prev.includes(gen) ? prev.filter(g => g !== gen) : [...prev, gen]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl my-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Style Protocol</h2>
              <p className="text-zinc-400 text-xs sm:text-sm">Step {step + 1} of 3</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Select Style Archetypes</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm">Choose multiple tags that define your aesthetic.</p>
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {ARCHETYPE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleArchetype(tag)}
                      className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full border text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                        selectedArchetypes.includes(tag)
                          ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Preferred Categories</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm">Select the types of items you want to see in your feed.</p>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full border text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                        selectedCategories.includes(cat)
                          ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Gender Preference</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm">Help us tailor the silhouettes to your identity.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {GENDERS.map((gen) => (
                    <button
                      key={gen}
                      onClick={() => toggleGender(gen)}
                      className={`p-4 sm:p-6 rounded-xl border flex flex-col items-center gap-2 sm:gap-3 transition-all ${
                        selectedGenders.includes(gen)
                          ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      <span className="font-bold text-sm sm:text-base">{gen}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 sm:mt-12">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm sm:text-base ${
                step === 0 ? 'opacity-0 pointer-events-none' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={(step === 0 && selectedArchetypes.length === 0) || (step === 1 && selectedCategories.length === 0) || (step === 2 && selectedGenders.length === 0)}
              className="flex items-center gap-2 px-6 py-2 sm:px-8 sm:py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {step === 2 ? 'Complete Protocol' : 'Next'}
              <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.5);
        }
      `}</style>
    </div>
  );
};

export default StyleQuiz;
