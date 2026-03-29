import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Share2, Camera, X, MessageSquare, TrendingUp, Clock, AlertTriangle, Send, Upload, Loader2 } from 'lucide-react';
import { UserPost, UserStats, Product, SocialComment, SocialInteraction } from '../types';
import { databaseService } from '../services/databaseService';

interface SocialGalleryProps {
  stats: UserStats;
  onUpdateStats: (stats: UserStats) => void;
  onGainRep?: (amount: number) => void;
  onTrackAchievement?: (id: string, progress: number) => void;
}

const SocialGallery: React.FC<SocialGalleryProps> = ({ stats, onUpdateStats, onGainRep, onTrackAchievement }) => {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<UserPost | null>(null);
  const [newPostImage, setNewPostImage] = useState('');
  const [activeTab, setActiveTab] = useState<'FEED' | 'HALL_OF_FAME'>('FEED');
  const [hallOfFameProducts, setHallOfFameProducts] = useState<Product[]>([]);
  const [userInteractions, setUserInteractions] = useState<SocialInteraction[]>([]);
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = stats.userId;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await databaseService.getSocialPosts();
      setPosts(fetchedPosts);
      setHallOfFameProducts(await databaseService.getHallOfFameProducts());
      if (currentUserId) {
        setUserInteractions(await databaseService.getUserInteractions(currentUserId));
      }
    };
    fetchData();
  }, [currentUserId]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts]);

  const hallOfFamePosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);
  }, [posts]);

  const handleInteract = async (postId: string, type: 'LIKE' | 'DISLIKE') => {
    if (!currentUserId) return;
    try {
      const updatedPost = await databaseService.interactWithPost(postId, currentUserId, type);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      if (selectedPost?.id === postId) setSelectedPost(updatedPost);
      setUserInteractions(await databaseService.getUserInteractions(currentUserId));
      onGainRep?.(2);
    } catch (error) {
      console.error('Interaction failed:', error);
    }
  };

  const handlePostClick = async (post: UserPost) => {
    setSelectedPost(post);
    const postComments = await databaseService.getPostComments(post.id);
    setComments(postComments);
  };

  const handleAddComment = async () => {
    if (!selectedPost || !newComment.trim() || !currentUserId) return;
    const handle = localStorage.getItem('cc-user-handle') || 'Archiver';
    const success = await databaseService.addPostComment(selectedPost.id, currentUserId, handle, newComment);
    if (success) {
      setNewComment('');
      const updatedComments = await databaseService.getPostComments(selectedPost.id);
      setComments(updatedComments);
      onGainRep?.(5);
    }
  };

  const handleReport = async () => {
    if (!selectedPost || !reportReason.trim() || !currentUserId) return;
    const success = await databaseService.reportPost(selectedPost.id, currentUserId, reportReason);
    if (success) {
      setIsReporting(false);
      setReportReason('');
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 3000);
    }
  };

  const getUserInteraction = (postId: string) => {
    return userInteractions.find(i => i.postId === postId)?.type;
  };

  const handleCreatePost = async () => {
    if (!newPostImage) return;

    const newPost: UserPost = {
      id: `post_${Date.now()}`,
      userId: currentUserId || 'anon',
      userHandle: localStorage.getItem('cc-user-handle') || 'Archiver',
      image: newPostImage,
      likes: 0,
      dislikes: 0,
      reports: 0,
      timestamp: new Date().toISOString(),
      weekId: databaseService.getWeekId()
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    await databaseService.saveSocialPosts(updated);
    setNewPostImage('');
    setShowPostModal(false);
    onGainRep?.(50);
    onTrackAchievement?.('a1', 1);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await databaseService.uploadFeedImage(file);
      if (result.url) {
        setNewPostImage(result.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const daysUntilReset = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = 5 - day; // Friday is 5
    return diff <= 0 ? 7 + diff : diff;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-20 py-8 md:py-16 pb-40">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse shadow-[0_0_10px_#00D1FF]"></div>
            <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-[0.4em]">Live Matrix Feed</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter leading-none">
            Circuit <span className="text-[#00D1FF] not-italic font-sans">Feed</span>
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
                activeTab === 'FEED' ? 'bg-[#00D1FF] text-white shadow-[0_0_20px_rgba(0,209,255,0.4)]' : 'text-zinc-500 hover:text-white'
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
                onClick={() => handlePostClick(post)}
                className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-[#00D1FF]/50 transition-all cursor-pointer hover:scale-[1.02]"
              >
                {/* Image Container */}
                <div className="aspect-[4/5] relative overflow-hidden">
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
                        <div className="w-8 h-8 rounded-full bg-[#00D1FF] flex items-center justify-center text-[10px] font-black text-white">
                          {post.userHandle[0]}
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-tight">@{post.userHandle}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interaction Bar */}
                <div className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-md">
                  <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleInteract(post.id, 'LIKE')}
                      className={`flex items-center gap-1.5 transition-colors ${getUserInteraction(post.id) === 'LIKE' ? 'text-[#00D1FF]' : 'text-zinc-400 hover:text-[#00D1FF]'}`}
                    >
                      <Heart className={`w-4 h-4 ${getUserInteraction(post.id) === 'LIKE' ? 'fill-current' : ''}`} />
                      <span className="text-[10px] font-bold">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => handleInteract(post.id, 'DISLIKE')}
                      className={`flex items-center gap-1.5 transition-colors ${getUserInteraction(post.id) === 'DISLIKE' ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
                    >
                      <Star className={`w-4 h-4 ${getUserInteraction(post.id) === 'DISLIKE' ? 'fill-current' : ''}`} />
                      <span className="text-[10px] font-bold">{post.dislikes}</span>
                    </button>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600 uppercase">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            hallOfFamePosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePostClick(post)}
                className="group relative bg-zinc-950 rounded-3xl overflow-hidden border border-amber-500/20 hover:border-amber-500 transition-all cursor-pointer"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={`Post by ${post.userHandle}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Star className="w-2 h-2 fill-current" />
                    Rank #{index + 1}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">@{post.userHandle}</div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none">Hall of Fame Entry</h3>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3 text-amber-500 fill-current" />
                      <span className="text-amber-500 font-mono font-black">{post.likes} Likes</span>
                    </div>
                    <div className="flex items-center gap-1 text-[8px] font-black text-zinc-500 uppercase">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      Viral Status
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {(activeTab === 'FEED' ? posts : hallOfFamePosts).length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Share2 className="w-8 h-8 text-zinc-700" />
          </div>
          <h3 className="text-xl font-black text-white uppercase mb-2">No Transmissions Found</h3>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Be the first to link your style to the circuit</p>
        </div>
      )}

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0A0A0A] rounded-[40px] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[700px]"
            >
              {/* Image Side */}
              <div className="w-full md:w-3/5 h-1/2 md:h-full bg-black relative">
                <img 
                  src={selectedPost.image} 
                  alt="Post Detail" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Info Side */}
              <div className="w-full md:w-2/5 h-1/2 md:h-full flex flex-col bg-[#0A0A0A] border-l border-white/10">
                {/* User Info */}
                <div className="p-6 border-bottom border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00D1FF] flex items-center justify-center text-xs font-black text-white">
                      {selectedPost.userHandle[0]}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">@{selectedPost.userHandle}</div>
                      <div className="text-[10px] text-zinc-500 font-mono uppercase">{new Date(selectedPost.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsReporting(true)}
                    className="text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </button>
                </div>

                {/* Comments Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-widest">No comments yet</span>
                    </div>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#00D1FF] uppercase tracking-tight">@{comment.userHandle}</span>
                          <span className="text-[8px] text-zinc-600 font-mono">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Interaction Bar */}
                <div className="p-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleInteract(selectedPost.id, 'LIKE')}
                      className={`flex items-center gap-2 transition-colors ${getUserInteraction(selectedPost.id) === 'LIKE' ? 'text-[#00D1FF]' : 'text-zinc-400 hover:text-[#00D1FF]'}`}
                    >
                      <Heart className={`w-5 h-5 ${getUserInteraction(selectedPost.id) === 'LIKE' ? 'fill-current' : ''}`} />
                      <span className="text-xs font-black">{selectedPost.likes}</span>
                    </button>
                    <button
                      onClick={() => handleInteract(selectedPost.id, 'DISLIKE')}
                      className={`flex items-center gap-2 transition-colors ${getUserInteraction(selectedPost.id) === 'DISLIKE' ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
                    >
                      <Star className={`w-5 h-5 ${getUserInteraction(selectedPost.id) === 'DISLIKE' ? 'fill-current' : ''}`} />
                      <span className="text-xs font-black">{selectedPost.dislikes}</span>
                    </button>
                  </div>

                  {/* Comment Input */}
                  <div className="relative">
                    <input 
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="Add a comment..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00D1FF] transition-colors pr-12"
                    />
                    <button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#00D1FF] flex items-center justify-center text-white disabled:opacity-50 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {isReporting && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReporting(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-[#1A1A1A] rounded-3xl p-8 border border-white/10"
            >
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Report Transmission</h3>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for reporting..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors h-32 mb-6"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsReporting(false)}
                  className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReport}
                  disabled={!reportReason.trim()}
                  className="flex-1 bg-red-500 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Success Toast */}
      <AnimatePresence>
        {reportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[130] bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl"
          >
            Report submitted for review.
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 flex justify-between items-center">
                      Neural Image Link
                      {isUploading && <Loader2 className="w-3 h-3 animate-spin text-[#00D1FF]" />}
                    </label>
                    
                    <div className="flex gap-4">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00D1FF]/50 transition-all group shrink-0 overflow-hidden"
                      >
                        {newPostImage ? (
                          <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-zinc-700 group-hover:text-[#00D1FF] mb-2" />
                            <span className="text-[8px] font-black text-zinc-700 group-hover:text-[#00D1FF] uppercase tracking-widest">Upload</span>
                          </>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <input
                          type="text"
                          value={newPostImage}
                          onChange={(e) => setNewPostImage(e.target.value)}
                          placeholder="OR_PASTE_URL_HERE"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#00D1FF] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#00D1FF]/10 border border-[#00D1FF]/20 rounded-2xl p-4 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00D1FF]/20 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#00D1FF]" />
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
                    className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00D1FF] hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black active:scale-95"
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
