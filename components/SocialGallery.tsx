import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Share2, Camera, X, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { SocialPost, UserStats } from '../types';
import { databaseService } from '../services/databaseService';

interface SocialGalleryProps {
  stats: UserStats;
  onUpdateStats: (stats: UserStats) => void;
  onGainRep?: (amount: number) => void;
  onTrackAchievement?: (id: string, progress: number) => void;
}

const SocialGallery: React.FC<SocialGalleryProps> = ({ stats, onUpdateStats, onGainRep, onTrackAchievement }) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostImage, setNewPostImage] = useState('');
  const [activeTab, setActiveTab] = useState<'FEED' | 'HALL_OF_FAME'>('FEED');

  useEffect(() => {
    setPosts(databaseService.getSocialPosts());
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts]);

  const starPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.loves - a.loves)
      .slice(0, 10);
  }, [posts]);

  const currentUserId = 'current_user';

  const handleLike = (postId: string) => {
    const updatedPost = databaseService.likePost(postId, currentUserId);
    if (updatedPost) {
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      onGainRep?.(2);
    }
  };

  const handleLove = (postId: string) => {
    const updatedPost = databaseService.lovePost(postId, currentUserId);
    if (updatedPost) {
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      onGainRep?.(5);
    }
  };

  const handleCreatePost = () => {
    if (!newPostImage) return;

    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      userId: 'current_user', // Simplified
      userHandle: localStorage.getItem('cc-user-handle') || 'Archiver',
      image: newPostImage,
      likes: 0,
      loves: 0,
      timestamp: new Date().toISOString(),
      weekId: databaseService.getWeekId()
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    databaseService.saveSocialPosts(updated);
    setNewPostImage('');
    setShowPostModal(false);
    onGainRep?.(50);
    onTrackAchievement?.('a1', 1); // Socialite progress
  };

  const daysUntilReset = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday
    const diff = 7 - day;
    return diff === 7 ? 0 : diff;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-20 py-8 md:py-16 pb-40">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse shadow-[0_0_10px_#1a73e8]"></div>
            <span className="text-[10px] font-black text-[#1a73e8] uppercase tracking-[0.4em]">Live Matrix Feed</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter leading-none">
            Circuit <span className="text-[#1a73e8] not-italic font-sans">Feed</span>
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Neural Reset in {daysUntilReset()} Days
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('FEED')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'FEED' ? 'bg-[#1a73e8] text-white shadow-[0_0_20px_rgba(26,115,232,0.4)]' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Live Feed
            </button>
            <button
              onClick={() => setActiveTab('HALL_OF_FAME')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                activeTab === 'HALL_OF_FAME' ? 'bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Star className="w-3 h-3" />
              Hall of Fame
            </button>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl active:scale-95"
          >
            <Camera className="w-4 h-4" />
            Transmit Look
          </button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <AnimatePresence mode="popLayout">
          {activeTab === 'FEED' ? (
            sortedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-[#1a73e8]/50 transition-colors"
              >
                {/* Image Container */}
                <div 
                  className="aspect-[4/5] relative overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    if (e.detail === 2) {
                      handleLove(post.id);
                    } else if (e.detail === 1) {
                      handleLike(post.id);
                    }
                  }}
                >
                  <img
                    src={post.image}
                    alt={`Post by ${post.userHandle}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-[10px] font-black text-white">
                          {post.userHandle[0]}
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-tight">@{post.userHandle}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interaction Bar */}
                <div className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.likedBy?.includes(currentUserId) ? 'text-[#1a73e8]' : 'text-zinc-400 hover:text-[#1a73e8]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedBy?.includes(currentUserId) ? 'fill-current' : ''}`} />
                      <span className="text-[10px] font-bold">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => handleLove(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.lovedBy?.includes(currentUserId) ? 'text-amber-500' : 'text-zinc-400 hover:text-amber-500'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${post.lovedBy?.includes(currentUserId) ? 'fill-current' : ''}`} />
                      <span className="text-[10px] font-bold">{post.loves}</span>
                    </button>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600 uppercase">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            starPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative bg-zinc-950 rounded-[2.5rem] overflow-hidden border transition-all duration-500 ${
                  index === 0 ? 'border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.2)]' : 
                  index === 1 ? 'border-zinc-300 shadow-[0_0_30px_rgba(212,212,216,0.1)]' :
                  index === 2 ? 'border-orange-700 shadow-[0_0_20px_rgba(194,65,12,0.1)]' :
                  'border-white/5 hover:border-amber-500/50'
                }`}
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.userHandle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  
                  {/* Rank Badge */}
                  <div className={`absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center font-serif italic text-2xl z-20 shadow-2xl ${
                    index === 0 ? 'bg-amber-500 text-black' : 
                    index === 1 ? 'bg-zinc-300 text-black' :
                    index === 2 ? 'bg-orange-700 text-white' :
                    'bg-black/60 text-white border border-white/10'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-amber-500 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border border-amber-500/30">
                    <Star className="w-3 h-3 fill-current" />
                    Elite Archive
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black ${
                      index === 0 ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'
                    }`}>
                      {post.userHandle[0]}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-white uppercase tracking-tight">@{post.userHandle}</div>
                      <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Circuit_Archiver</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Loves</span>
                        <div className="flex items-center gap-2 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-mono font-black">{post.loves}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Likes</span>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-mono font-black">{post.likes}</span>
                        </div>
                      </div>
                    </div>
                    
                    {index < 3 && (
                      <div className="text-[10px] font-serif italic text-amber-500/50">
                        {index === 0 ? 'Grand_Master' : index === 1 ? 'Elite_Contender' : 'Rising_Star'}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {(activeTab === 'FEED' ? posts : starPosts).length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Share2 className="w-8 h-8 text-zinc-700" />
          </div>
          <h3 className="text-xl font-black text-white uppercase mb-2">No Transmissions Found</h3>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Be the first to link your style to the circuit</p>
        </div>
      )}

      {/* Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] rounded-[40px] border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] m-4"
            >
              <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Transmit Look</h2>
                  <button onClick={() => setShowPostModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Neural Image Link (URL)</label>
                    <input
                      type="text"
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
                    />
                  </div>

                  {newPostImage && (
                    <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
                      <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  <div className="bg-[#1a73e8]/10 border border-[#1a73e8]/20 rounded-2xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1a73e8]/20 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#1a73e8]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Weekly Reset Protocol</h4>
                      <p className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                        All transmissions are purged at the end of the week. Top 10 looks will be archived in the Stars sector until the next cycle.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostImage}
                    className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1a73e8] hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black active:scale-95"
                  >
                    Initiate Transmission
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialGallery;
