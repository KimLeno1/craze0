
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import NotificationCenter from './components/NotificationCenter';
import Lobby from './components/HomeLobby';
import FamousProducts from './components/FamousProducts';
import TryOn from './components/TryOn';
import Bundles from './components/Bundles';
import Categories from './components/Categories';
import PriceAnomalies from './components/PriceAnomalies';
import Profile from './components/Profile';
import WishlistView from './components/WishlistView';
import CategoryPanel from './components/CategoryPanel';
import SearchPanel from './components/SearchPanel';
import CategoryProductsPanel from './components/CategoryProductsPanel';
import AdminPanel from './components/AdminPanel';
import SupplierDashboard from './components/SupplierDashboard';
import CheckoutView from './components/CheckoutView';
import AdminLogin from './components/AdminLogin';
import SupplierLogin from './components/SupplierLogin';
import RoleSelection from './components/RoleSelection';
import HallOfFame from './components/HallOfFame';
import ContactPanel from './components/ContactPanel';
import GameShowroom from './components/GameShowroom';
import PayForMe from './components/PayForMe';
import Tutorial from './components/Tutorial';
import LandingScreen from './components/LandingScreen';
import VaultEntrance from './components/VaultEntrance';
import SocialGallery from './components/SocialGallery';
import StylistAI from './components/StylistAI';
import StyleQuiz from './components/StyleQuiz';
import { EXTENDED_PRODUCTS, MOCK_BUNDLES } from './mockData';
import { databaseService } from './services/databaseService';
import { getCurrentRank } from './data/rankingSystem';
import { Product, CartItem, Page, ViewState, UserStats, Notification, PromoCode, Bundle, UserPreferences } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('cc-auth-token') === 'true');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialFinished, setTutorialFinished] = useState<boolean>(() => localStorage.getItem('cc-tutorial-finished') === 'true');
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOBBY);
  const [activeSupplierId, setActiveSupplierId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('cc-theme') as 'dark' | 'light') || 'dark');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('closet-kraze-cart') || '[]');
    } catch (e) {
      console.error('Error parsing cart:', e);
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('closet-kraze-wishlist') || '[]');
    } catch (e) {
      console.error('Error parsing wishlist:', e);
      return [];
    }
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryProductsOpen, setIsCategoryProductsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>('All');
  const [products, setProducts] = useState<Product[]>([]);
  
  const [rep, setRep] = useState<number>(8500);
  const [handle, setHandle] = useState<string>(() => localStorage.getItem('cc-user-handle') || 'Viper_X');
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [surgeTimerEnd, setSurgeTimerEnd] = useState<number | null>(() => Number(localStorage.getItem('cc-surge-timer') || '0') || null);
  const [limitedOfferEnd, setLimitedOfferEnd] = useState<number | null>(null);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);
  const [showStyleQuiz, setShowStyleQuiz] = useState<boolean>(false);

  const resetLimitedOffer = async () => {
    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      try {
        const session = await databaseService.startUserAnomalySession(userId);
        if (session && session.endTime) {
          setLimitedOfferEnd(session.endTime);
        }
      } catch (e) {
        console.error('Error resetting limited offer:', e);
      }
    } else {
      const newEnd = Date.now() + (3600 * 1000); // 1 hour from now
      setLimitedOfferEnd(newEnd);
      localStorage.setItem('cc-limited-offer-timer', newEnd.toString());
    }
  };

  useEffect(() => {
    if (!limitedOfferEnd && !isAuthenticated) {
      const stored = localStorage.getItem('cc-limited-offer-timer');
      if (stored) {
        setLimitedOfferEnd(Number(stored));
      } else {
        resetLimitedOffer();
      }
    }
  }, [limitedOfferEnd, isAuthenticated]);

  const [stats, setStats] = useState<UserStats>(() => {
    // Initial mock stats, will be updated in useEffect
    return {
      userId: 'u1',
      level: 1,
      experience: 0,
      nextLevelExp: 1000,
      rank: 'NEOPHYTE',
      totalSpent: 0,
      itemsOwned: 0,
      achievements: [],
      dailyQuests: [],
      tickets: 5,
      aiTryOnsUsedToday: 0,
      dailyGameAttempts: 3,
      lastGameReset: new Date().toISOString(),
      quests: [],
      selectedPath: null,
      brandSubscriptions: [],
      tagSubscriptions: []
    };
  });

  const handleUpdateStats = async (newStats: UserStats) => {
    setStats(newStats);
    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      try {
        await databaseService.updateUserStats(userId, newStats);
      } catch (error) {
        console.error('Error updating stats on backend:', error);
      }
    }
  };

  useEffect(() => {
    const initUser = async () => {
      const userId = localStorage.getItem('cc-user-id');
      if (userId) {
        try {
          const profile = await databaseService.getUserProfile(userId);
          setRep(profile.rep);
          setHandle(profile.handle);
          setStats(profile.stats);
          setUserPrefs(profile.preferences);
          
          // Fetch wishlist and cart from backend
          const backendWishlist = await databaseService.getWishlist(userId);
          setWishlist(backendWishlist.map(p => p.id));
          
          const backendCart = await databaseService.getCart(userId);
          setCart(backendCart.map(item => ({
            ...item,
            id: item.productId,
            customizationData: item.selectedColor ? { color: item.selectedColor } : undefined
          })));

          // Check and initialize anomaly session
          try {
            const config = await databaseService.getAnomalyConfig();
            if (config) {
              let session = await databaseService.getUserAnomalySession(userId);
              if (!session || session.eventId !== config.eventId) {
                session = await databaseService.startUserAnomalySession(userId);
              }
              if (session && session.endTime) {
                setLimitedOfferEnd(session.endTime);
                localStorage.setItem('cc-limited-offer-timer', session.endTime.toString());
              }
            }
          } catch (e) {
            console.error('Error initializing anomaly session:', e);
          }
        } catch (error) {
          console.error('Error initializing user from backend:', error);
          // Fallback to local storage or defaults if backend fails
          setRep(Number(localStorage.getItem('cc-user-rep') || '8500'));
          const userStats = await databaseService.getUserStats('u1');
          setStats(userStats);
        }
      } else {
        setRep(Number(localStorage.getItem('cc-user-rep') || '8500'));
        const userStats = await databaseService.getUserStats('u1');
        setStats(userStats);
        const prefs = await databaseService.getUserPreferences('u1');
        setUserPrefs(prefs);
      }
    };
    initUser();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && tutorialFinished && !userPrefs && !showStyleQuiz) {
      setShowStyleQuiz(true);
    }
  }, [isAuthenticated, tutorialFinished, userPrefs]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);

  const [jackpotProductId, setJackpotProductId] = useState<string>(() => localStorage.getItem('cc-weekly-jackpot') || '1');

  // Live Activity Simulator
  const [activeUsers, setActiveUsers] = useState(1024);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentRank = useMemo(() => getCurrentRank(rep), [rep]);
  const balances = { coins: 4250, gems: 120, rep: rep };
  const jackpotProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    return products.find(p => p.id === jackpotProductId) || products[0];
  }, [jackpotProductId, products]);

  useEffect(() => {
    localStorage.setItem('closet-kraze-cart', JSON.stringify(cart));
    if (cart.length === 0) {
      setSurgeTimerEnd(null);
      localStorage.removeItem('cc-surge-timer');
    }
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cc-user-rep', rep.toString());
    localStorage.setItem('cc-user-handle', handle);
  }, [rep, handle]);

  useEffect(() => {
    localStorage.setItem('closet-kraze-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('cc-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cc-tutorial-finished', tutorialFinished.toString());
  }, [tutorialFinished]);

  useEffect(() => {
    const fetchData = async () => {
      setNotifications(await databaseService.getGlobalNotifications());
      setSocialPosts(await databaseService.getSocialPosts());
      setProducts(await databaseService.getProducts());
    };
    fetchData();
  }, []);

  const addToCart = async (product: Product, selectedSize?: string, customizationData?: Record<string, string>) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      try {
        await databaseService.addToCart(userId, {
          productId: product.id,
          quantity: 1,
          size: selectedSize,
          color: customizationData?.color
        });
        // Refresh cart from backend
        const backendCart = await databaseService.getCart(userId);
        setCart(backendCart.map(item => ({
          ...item,
          id: item.productId,
          customizationData: item.selectedColor ? { color: item.selectedColor } : undefined
        })));
      } catch (error) {
        console.error('Error adding to cart on backend:', error);
      }
    }

    if (!surgeTimerEnd) {
      const newEnd = Date.now() + (300 * 1000);
      setSurgeTimerEnd(newEnd);
      localStorage.setItem('cc-surge-timer', newEnd.toString());
    }
    setIsCartOpen(true);
  };

  const gainRep = async (amount: number) => {
    const userId = localStorage.getItem('cc-user-id') || 'u1'; 
    const updatedUser = await databaseService.addRep(userId, amount);
    if (updatedUser) {
      setRep(updatedUser.rep);
      setStats(await databaseService.getUserStats(userId));
    }
  };

  const trackAchievement = async (achievementId: string, progress: number) => {
    const userId = localStorage.getItem('cc-user-id') || 'u1';
    await databaseService.updateAchievementProgress(userId, achievementId, progress);
    setStats(await databaseService.getUserStats(userId));
    const profile = await databaseService.getUserProfile(userId);
    if (profile) setRep(profile.rep);
  };

  const toggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      const isAdding = !wishlist.includes(product.id);
      try {
        if (isAdding) {
          await databaseService.addToWishlist(userId, product.id);
          gainRep(5);
          trackAchievement('a5', 1); // Void Stalker progress
          databaseService.trackAction(userId, product.id, 'wishlist');
        } else {
          await databaseService.removeFromWishlist(userId, product.id);
        }
        // Refresh wishlist from backend
        const backendWishlist = await databaseService.getWishlist(userId);
        setWishlist(backendWishlist.map(p => p.id));
      } catch (error) {
        console.error('Error toggling wishlist on backend:', error);
      }
    }
  };

  const removeFromCart = async (productId: string, size?: string, color?: string) => {
    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      try {
        await databaseService.removeFromCart(userId, productId, size || '', color || '');
        const backendCart = await databaseService.getCart(userId);
        setCart(backendCart.map(item => ({
          ...item,
          id: item.productId,
          customizationData: item.selectedColor ? { color: item.selectedColor } : undefined
        })));
      } catch (error) {
        console.error('Error removing from cart on backend:', error);
      }
    } else {
      setCart(prev => prev.filter(i => i.id !== productId));
    }
  };

  const updateCartQuantity = async (productId: string, delta: number, size?: string, color?: string) => {
    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      const item = cart.find(i => i.id === productId && i.selectedSize === size && i.customizationData?.color === color);
      if (item) {
        try {
          await databaseService.updateCartItem(userId, {
            productId,
            quantity: item.quantity + delta,
            size,
            color
          });
          const backendCart = await databaseService.getCart(userId);
          setCart(backendCart.map(item => ({
            ...item,
            id: item.productId,
            customizationData: item.selectedColor ? { color: item.selectedColor } : undefined
          })));
        } catch (error) {
          console.error('Error updating cart quantity on backend:', error);
        }
      }
    } else {
      setCart(prev => prev.map(i => i.id === productId ? {...i, quantity: Math.max(1, i.quantity + delta)} : i));
    }
  };

  const clearCart = async () => {
    const userId = localStorage.getItem('cc-user-id');
    if (userId) {
      try {
        const backendCart = await databaseService.getCart(userId);
        for (const item of backendCart) {
          await databaseService.removeFromCart(userId, item.productId, item.size, item.color);
        }
        setCart([]);
      } catch (error) {
        console.error('Error clearing cart on backend:', error);
      }
    } else {
      setCart([]);
    }
  };
  const handleNavigateView = (view: ViewState) => {
    const protectedViews = [ViewState.PROFILE, ViewState.WISHLIST, ViewState.TRY_ON, ViewState.PAY_FOR_ME, ViewState.GAME_SHOWROOM];
    if (!isAuthenticated && protectedViews.includes(view)) {
      setShowAuthModal(true);
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameWin = async (reward: string) => {
    if (reward.includes('JACKPOT')) {
      alert("UNBELIEVABLE! You've secured the Weekly Jackpot: " + jackpotProduct.name);
      addToCart(jackpotProduct, jackpotProduct.sizes[0]);
    } else if (reward.includes('GH₵')) {
       alert("Reward Materialized: " + reward.replace(/_/g, ' '));
       // Logic would subtract from a future total or add credit
    } else if (reward.includes('PROMO')) {
       const codes = await databaseService.getPromoCodes();
       const winCode = codes[0];
       setActivePromo(winCode);
       alert("Neural Fragment Decrypted: Promo Code " + winCode.code + " Active!");
    }
    gainRep(100);
  };

  const addBundleToCart = (bundle: Bundle) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!surgeTimerEnd) {
      const newEnd = Date.now() + (300 * 1000);
      setSurgeTimerEnd(newEnd);
      localStorage.setItem('cc-surge-timer', newEnd.toString());
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === bundle.id && item.isBundle);
      if (existing) return prev.map(i => (i.id === bundle.id && i.isBundle) ? { ...i, quantity: i.quantity + 1 } : i);
      
      const bundleItem: CartItem = {
        id: bundle.id,
        name: bundle.name,
        price: bundle.bundlePrice,
        originalPrice: bundle.products.reduce((acc, p) => acc + p.originalPrice, 0),
        shippingFee: bundle.products.reduce((acc, p) => acc + (p.shippingFee || 0), 0),
        image: bundle.products[0].image,
        quantity: 1,
        isBundle: true,
        bundleProducts: bundle.products,
        category: 'All',
      };
      return [...prev, bundleItem];
    });
    setIsCartOpen(true);
  };

  const [haulProductIds, setHaulProductIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchHaul = async () => {
      const orders = await databaseService.getOrders();
      const userOrders = orders.filter(o => o.userId === stats.userId || o.userName === handle);
      const ids = userOrders.flatMap(o => o.items.map(i => i.id));
      setHaulProductIds([...new Set(ids)]);
    };
    fetchHaul();
  }, [stats.userId, handle]);

  const renderView = () => {
    switch (currentView) {
      case ViewState.LOBBY:
        return (
          <Lobby 
            userId={stats.userId} 
            products={products} 
            stats={stats} 
            userHandle={handle || 'Archiver'} 
            socialPosts={socialPosts} 
            wishlist={wishlist} 
            onNavigate={handleNavigateView} 
            onAddToCart={(id) => { const p = products.find(x => x.id === id); if (p) addToCart(p, p.sizes?.[0]); }} 
            onToggleWishlist={toggleWishlist} 
            onProductClick={(p) => { databaseService.trackAction(stats.userId, p.id, 'view'); setSelectedProduct(p); }} 
            onCompleteQuest={() => {}} 
            limitedOfferEnd={limitedOfferEnd}
            onResetLimitedOffer={resetLimitedOffer}
          />
        );
      case ViewState.FAMOUS:
        return (
          <FamousProducts 
            products={selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory)} 
            wishlist={wishlist} 
            onProductClick={setSelectedProduct} 
            onAddToCart={(p) => addToCart(p, p.sizes?.[0])} 
            onToggleWishlist={toggleWishlist} 
            limitedOfferEnd={limitedOfferEnd}
          />
        );
      case ViewState.TRY_ON: 
        return (
          <TryOn 
            rank={currentRank} 
            stats={stats} 
            onUsed={() => handleUpdateStats({...stats, aiTryOnsUsedToday: stats.aiTryOnsUsedToday + 1})} 
            wishlistProducts={products.filter(p => wishlist.includes(p.id))}
            haulProducts={products.filter(p => haulProductIds.includes(p.id))}
          />
        );
      case ViewState.STYLIST:
        return <StylistAI />;
      case ViewState.BUNDLES: 
        return <Bundles bundles={MOCK_BUNDLES} onAddBundle={addBundleToCart} />;
      case ViewState.CATEGORIES: return <Categories onSelectCategory={setSelectedCategory} onNavigate={handleNavigateView} />;
      case ViewState.PRICE_ANOMALY: 
        return (
          <PriceAnomalies 
            onAddToCart={(anomaly) => {
              const product = products.find(p => p.id === anomaly.productId);
              if (product) {
                addToCart({ ...product, price: anomaly.price, originalPrice: anomaly.originalPrice }, product.sizes?.[0] || 'M');
              }
            }} 
            onNavigate={handleNavigateView}
            session={limitedOfferEnd ? { endTime: limitedOfferEnd } : null}
          />
        );
      case ViewState.PROFILE: 
        return (
          <Profile 
            stats={stats} 
            rep={rep} 
            handle={handle} 
            onUpdateHandle={async (newHandle) => {
              const userId = localStorage.getItem('cc-user-id');
              if (userId) {
                try {
                  await databaseService.updateUserProfile(userId, { handle: newHandle });
                  setHandle(newHandle);
                } catch (error) {
                  console.error('Error updating handle on backend:', error);
                }
              } else {
                setHandle(newHandle);
              }
            }} 
            onNavigate={handleNavigateView} 
            onLogout={async () => { 
              await databaseService.logout();
              setIsAuthenticated(false); 
              setShowAuthModal(true); 
            }} 
            onApplyPromo={setActivePromo} 
            activePromo={activePromo} 
            onUpdateStats={handleUpdateStats} 
            theme={theme} 
            onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} 
            onOpenStyleQuiz={() => setShowStyleQuiz(true)} 
          />
        );
      case ViewState.WISHLIST: 
        return (
          <WishlistView 
            products={products} 
            wishlistIds={wishlist} 
            onAddToCart={(p) => addToCart(p, p.sizes?.[0])} 
            onToggleWishlist={toggleWishlist} 
            onProductClick={setSelectedProduct} 
            onNavigate={handleNavigateView} 
            rank={currentRank} 
            limitedOfferEnd={limitedOfferEnd}
          />
        );
      case ViewState.HALL_OF_FAME: return <HallOfFame />;
      case ViewState.CONTACT: return <ContactPanel />;
      case ViewState.GAME_SHOWROOM: return <GameShowroom tickets={stats.tickets} jackpotProduct={jackpotProduct} onPlay={() => handleUpdateStats({...stats, tickets: stats.tickets - 1})} onWin={handleGameWin} />;
      case ViewState.SOCIAL: return <SocialGallery stats={stats} onUpdateStats={handleUpdateStats} onGainRep={gainRep} onTrackAchievement={trackAchievement} />;
      case ViewState.PAY_FOR_ME: return <PayForMe rank={currentRank} wishlistProducts={products.filter(p => wishlist.includes(p.id))} onCompleteAcquisition={(p) => { setRep(r => r + 500); }} userHandle={handle} />;
      case ViewState.ADMIN_LOGIN: return <AdminLogin onSuccess={() => { setIsAuthenticated(true); localStorage.setItem('cc-auth-token', 'true'); setCurrentView(ViewState.ADMIN); }} onCancel={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.SUPPLIER_LOGIN: return <SupplierLogin onSuccess={(id) => { setIsAuthenticated(true); localStorage.setItem('cc-auth-token', 'true'); setActiveSupplierId(id); setCurrentView(ViewState.SUPPLIER_DASHBOARD); }} onCancel={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.ROLE_SELECTION: return <RoleSelection onSelect={(role) => setCurrentView(role === 'ADMIN' ? ViewState.ADMIN_LOGIN : ViewState.SUPPLIER_LOGIN)} onCancel={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.ADMIN: return <AdminPanel onExit={() => setCurrentView(ViewState.LOBBY)} onNavigate={handleNavigateView} onSetJackpot={(id) => { setJackpotProductId(id); localStorage.setItem('cc-weekly-jackpot', id); }} currentJackpotId={jackpotProductId} />;
      case ViewState.SUPPLIER_DASHBOARD: return <SupplierDashboard supplierId={activeSupplierId || 'sup1'} onLogout={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.CHECKOUT: return <CheckoutView items={cart} onComplete={async () => { 
        // Notify suppliers
        for (const item of cart) {
          if (item.isBundle && item.bundleProducts) {
            for (const p of item.bundleProducts) {
              databaseService.trackAction(stats.userId, p.id, 'purchase');
              if (p.supplierId) {
                await databaseService.sendSupplierNotification(
                  p.supplierId,
                  'Bundle Item Purchased',
                  `Your item "${p.name}" was purchased as part of the Synergy Kit "${item.name}".`
                );
              }
            }
          } else {
            databaseService.trackAction(stats.userId, item.id, 'purchase');
            if (item.supplierId) {
              await databaseService.sendSupplierNotification(
                item.supplierId,
                'Item Purchased',
                `Your item "${item.name}" has been purchased.`
              );
            }
          }
        }

        await clearCart();
        setSurgeTimerEnd(null); 
        resetLimitedOffer();
        gainRep(Math.floor(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) / 10));
        trackAchievement('a4', Math.floor(cart.reduce((acc, item) => acc + item.price * item.quantity, 0)));
        handleUpdateStats({...stats, tickets: stats.tickets + 2}); 
        setCurrentView(ViewState.LOBBY); 
      }} onCancel={() => setCurrentView(ViewState.LOBBY)} balances={balances} activePromo={activePromo} rank={currentRank} />;
      default: return <Lobby userId={stats.userId} products={products} stats={stats} userHandle={handle || 'Archiver'} socialPosts={socialPosts} wishlist={wishlist} onNavigate={handleNavigateView} onAddToCart={(id) => { const p = products.find(x => x.id === id); if (p) addToCart(p, p.sizes?.[0]); }} onToggleWishlist={toggleWishlist} onProductClick={(p) => { databaseService.trackAction(stats.userId, p.id, 'view'); setSelectedProduct(p); }} onCompleteQuest={() => {}} isAuthenticated={isAuthenticated} tutorialFinished={tutorialFinished} limitedOfferEnd={limitedOfferEnd} userPrefs={userPrefs} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#00D1FF] selection:text-white transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#050505] text-[#FAFAFA]' : 'bg-[#F9F9F9] text-[#1A1A1A]'
    }`}>
      <Header 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        wishlistCount={wishlist.length}
        notificationCount={notifications.filter(n => !n.read).length}
        stats={stats}
        onCartOpen={() => setIsCartOpen(true)}
        onNotificationOpen={() => setIsNotificationOpen(true)}
        onNavigatePage={(p) => handleNavigateView(p === Page.HOME ? ViewState.LOBBY : ViewState.FAMOUS)}
        onNavigateView={handleNavigateView}
        currentPage={currentView === ViewState.LOBBY ? Page.HOME : Page.SHOP}
        currentView={currentView}
        dropTime={300}
        onOpenCategories={() => setIsCategoryPanelOpen(true)}
        theme={theme}
        rep={rep}
        handle={handle}
      />
      
      <div className="fixed top-20 left-0 right-0 h-1 bg-white/5 z-40">
         <div className="h-full bg-[#00D1FF] shadow-[0_0_10px_#00D1FF] transition-all duration-1000" style={{ width: `${(activeUsers / 1200) * 100}%` }}></div>
      </div>

      <main className="pt-24 pb-24 flex-1">{renderView()}</main>
      
      <BottomNav 
        currentView={currentView} 
        onNavigate={handleNavigateView} 
        onOpenCategories={() => setIsCategoryPanelOpen(true)} 
        onOpenSearch={() => setIsSearchOpen(true)}
        isAuthenticated={isAuthenticated}
        onLogin={() => setShowAuthModal(true)}
      />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={(id) => {
          const item = cart.find(i => i.id === id);
          if (item) removeFromCart(id, item.selectedSize, item.customizationData?.color);
        }} 
        onUpdateQuantity={(id, d) => {
          const item = cart.find(i => i.id === id);
          if (item) updateCartQuantity(id, d, item.selectedSize, item.customizationData?.color);
        }} 
        onClear={clearCart} 
        onNavigate={handleNavigateView} 
        surgeTimerEnd={surgeTimerEnd} 
        activePromo={activePromo} 
        rank={currentRank} 
      />
      <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} notifications={notifications} onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n))} onMarkAllRead={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} />
      <CategoryPanel 
        isOpen={isCategoryPanelOpen} 
        onClose={() => setIsCategoryPanelOpen(false)} 
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsCategoryProductsOpen(true);
        }} 
        onNavigate={handleNavigateView} 
        activeCategory={selectedCategory} 
        products={products} 
        onProductSelect={setSelectedProduct} 
      />
      <SearchPanel 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        products={products} 
        onProductSelect={setSelectedProduct} 
      />
      <CategoryProductsPanel 
        isOpen={isCategoryProductsOpen} 
        onClose={() => setIsCategoryProductsOpen(false)} 
        category={selectedCategory} 
        products={products} 
        onProductSelect={setSelectedProduct} 
        limitedOfferEnd={limitedOfferEnd}
      />
      
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          stats={stats} 
          allProducts={products} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart} 
          onUpdateSynergy={() => {}} 
          onToggleWishlist={toggleWishlist} 
          onProductClick={setSelectedProduct} 
          isInWishlist={wishlist.includes(selectedProduct.id)} 
          rank={currentRank} 
          limitedOfferEnd={limitedOfferEnd}
        />
      )}
      
      {showAuthModal && (
        <LandingScreen 
          onComplete={(arch, isNew) => { 
            setIsAuthenticated(true); 
            setShowAuthModal(false); 
            if (isNew) setShowTutorial(true); 
          }} 
          onAdminAccess={() => { 
            setShowAuthModal(false); 
            setCurrentView(ViewState.ROLE_SELECTION); 
          }} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}

      {showTutorial && <Tutorial onComplete={() => { setShowTutorial(false); setTutorialFinished(true); }} onNavigate={handleNavigateView} />}
      
      {showStyleQuiz && (
        <StyleQuiz 
          userId={stats.userId} 
          onComplete={(prefs) => {
            setUserPrefs(prefs);
            setShowStyleQuiz(false);
          }} 
          onClose={() => setShowStyleQuiz(false)} 
        />
      )}
      
      <VaultEntrance />
      
      {/* Global Activity Heartbeat */}
      <div className="fixed top-24 right-6 z-40 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{activeUsers} Archivers Linked</span>
      </div>
    </div>
  );
};

export default App;
