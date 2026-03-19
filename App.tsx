
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
import FlashSales from './components/FlashSales';
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
import { EXTENDED_PRODUCTS, MOCK_BUNDLES } from './mockData';
import { databaseService } from './services/databaseService';
import { getCurrentRank } from './data/rankingSystem';
import { Product, CartItem, Page, ViewState, UserStats, Notification, PromoCode, Bundle } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('cc-auth-token') === 'true');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOBBY);
  const [activeSupplierId, setActiveSupplierId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('cc-theme') as 'dark' | 'light') || 'dark');
  
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('closet-kraze-cart') || '[]'));
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('closet-kraze-wishlist') || '[]'));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryProductsOpen, setIsCategoryProductsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>('All');
  const [products, setProducts] = useState<Product[]>([]);
  
  const [rep, setRep] = useState<number>(() => {
    const users = databaseService.getUsers();
    const user = users.find(u => u.handle === (localStorage.getItem('cc-user-handle') || 'Viper_X'));
    return user ? user.rep : Number(localStorage.getItem('cc-user-rep') || '8500');
  });
  const [handle, setHandle] = useState<string>(() => localStorage.getItem('cc-user-handle') || 'Viper_X');
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [surgeTimerEnd, setSurgeTimerEnd] = useState<number | null>(() => Number(localStorage.getItem('cc-surge-timer') || '0') || null);

  const [stats, setStats] = useState<UserStats>(() => {
    const userId = 'u1'; // Mock current user
    return databaseService.getUserStats(userId);
  });
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
    setNotifications(databaseService.getGlobalNotifications());
    setSocialPosts(databaseService.getSocialPosts());
    setProducts(databaseService.getProducts());
  }, []);

  const addToCart = (product: Product, selectedSize?: string, customizationData?: Record<string, string>) => {
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
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize && 
        JSON.stringify(item.customizationData) === JSON.stringify(customizationData)
      );
      if (existing) return prev.map(i => (
        i.id === product.id && 
        i.selectedSize === selectedSize && 
        JSON.stringify(i.customizationData) === JSON.stringify(customizationData)
      ) ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1, selectedSize, customizationData }];
    });
    setIsCartOpen(true);
  };

  const gainRep = (amount: number) => {
    const userId = 'u1'; 
    const updatedUser = databaseService.addRep(userId, amount);
    if (updatedUser) {
      setRep(updatedUser.rep);
      setStats(databaseService.getUserStats(userId));
    }
  };

  const trackAchievement = (achievementId: string, progress: number) => {
    const userId = 'u1';
    databaseService.updateAchievementProgress(userId, achievementId, progress);
    setStats(databaseService.getUserStats(userId));
    const user = databaseService.getUsers().find(u => u.id === userId);
    if (user) setRep(user.rep);
  };

  const toggleWishlist = (product: Product) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setWishlist(prev => {
      const isAdding = !prev.includes(product.id);
      const updated = isAdding ? [...prev, product.id] : prev.filter(id => id !== product.id);
      localStorage.setItem('closet-kraze-wishlist', JSON.stringify(updated));
      
      if (isAdding) {
        gainRep(5);
        trackAchievement('a5', 1); // Void Stalker progress
      }
      
      return updated;
    });
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

  const handleGameWin = (reward: string) => {
    if (reward.includes('JACKPOT')) {
      alert("UNBELIEVABLE! You've secured the Weekly Jackpot: " + jackpotProduct.name);
      addToCart(jackpotProduct, jackpotProduct.sizes[0]);
    } else if (reward.includes('GH₵')) {
       alert("Reward Materialized: " + reward.replace(/_/g, ' '));
       // Logic would subtract from a future total or add credit
    } else if (reward.includes('PROMO')) {
       const codes = databaseService.getPromoCodes();
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

  const renderView = () => {
    switch (currentView) {
      case ViewState.LOBBY:
        return <Lobby products={products} stats={stats} userHandle={handle || 'Archiver'} socialPosts={socialPosts} wishlist={wishlist} onNavigate={handleNavigateView} onAddToCart={(id) => { const p = products.find(x => x.id === id); if (p) addToCart(p, p.sizes?.[0]); }} onToggleWishlist={toggleWishlist} onProductClick={setSelectedProduct} onCompleteQuest={() => {}} />;
      case ViewState.FAMOUS:
        return <FamousProducts products={selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory)} wishlist={wishlist} onProductClick={setSelectedProduct} onAddToCart={(p) => addToCart(p, p.sizes?.[0])} onToggleWishlist={toggleWishlist} />;
      case ViewState.TRY_ON: 
        return <TryOn rank={currentRank} stats={stats} onUsed={() => setStats(s => ({...s, aiTryOnsUsedToday: s.aiTryOnsUsedToday + 1}))} />;
      case ViewState.BUNDLES: 
        return <Bundles bundles={MOCK_BUNDLES} onAddBundle={addBundleToCart} />;
      case ViewState.CATEGORIES: return <Categories onSelectCategory={setSelectedCategory} onNavigate={handleNavigateView} />;
      case ViewState.FLASH: 
        return (
          <FlashSales 
            onAddToCart={(sale) => {
              const product = products.find(p => p.id === sale.productId);
              if (product) {
                addToCart({ ...product, price: sale.price, originalPrice: sale.originalPrice }, product.sizes?.[0] || 'M');
              }
            }} 
            onNavigate={handleNavigateView}
          />
        );
      case ViewState.PROFILE: return <Profile stats={stats} rep={rep} handle={handle} onUpdateHandle={setHandle} onNavigate={handleNavigateView} onLogout={() => { setIsAuthenticated(false); localStorage.removeItem('cc-auth-token'); setShowAuthModal(true); }} onApplyPromo={setActivePromo} activePromo={activePromo} onUpdateStats={setStats} theme={theme} onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />;
      case ViewState.WISHLIST: return <WishlistView products={products} wishlistIds={wishlist} onAddToCart={(p) => addToCart(p, p.sizes?.[0])} onToggleWishlist={toggleWishlist} onProductClick={setSelectedProduct} onNavigate={handleNavigateView} rank={currentRank} />;
      case ViewState.HALL_OF_FAME: return <HallOfFame />;
      case ViewState.CONTACT: return <ContactPanel />;
      case ViewState.GAME_SHOWROOM: return <GameShowroom tickets={stats.tickets} jackpotProduct={jackpotProduct} onPlay={() => setStats(s => ({...s, tickets: s.tickets - 1}))} onWin={handleGameWin} />;
      case ViewState.SOCIAL: return <SocialGallery stats={stats} onUpdateStats={setStats} onGainRep={gainRep} onTrackAchievement={trackAchievement} />;
      case ViewState.PAY_FOR_ME: return <PayForMe rank={currentRank} wishlistProducts={products.filter(p => wishlist.includes(p.id))} onCompleteAcquisition={(p) => { setRep(r => r + 500); }} userHandle={handle} />;
      case ViewState.ADMIN_LOGIN: return <AdminLogin onSuccess={() => { setIsAuthenticated(true); localStorage.setItem('cc-auth-token', 'true'); setCurrentView(ViewState.ADMIN); }} onCancel={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.SUPPLIER_LOGIN: return <SupplierLogin onSuccess={(id) => { setIsAuthenticated(true); localStorage.setItem('cc-auth-token', 'true'); setActiveSupplierId(id); setCurrentView(ViewState.SUPPLIER_DASHBOARD); }} onCancel={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.ROLE_SELECTION: return <RoleSelection onSelect={(role) => setCurrentView(role === 'ADMIN' ? ViewState.ADMIN_LOGIN : ViewState.SUPPLIER_LOGIN)} onCancel={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.ADMIN: return <AdminPanel onExit={() => setCurrentView(ViewState.LOBBY)} onNavigate={handleNavigateView} onSetJackpot={(id) => { setJackpotProductId(id); localStorage.setItem('cc-weekly-jackpot', id); }} currentJackpotId={jackpotProductId} />;
      case ViewState.SUPPLIER_DASHBOARD: return <SupplierDashboard supplierId={activeSupplierId || 'sup1'} onLogout={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.CHECKOUT: return <CheckoutView items={cart} onComplete={() => { 
        // Notify suppliers
        cart.forEach(item => {
          if (item.isBundle && item.bundleProducts) {
            item.bundleProducts.forEach(p => {
              if (p.supplierId) {
                databaseService.sendSupplierNotification(
                  p.supplierId,
                  'Bundle Item Purchased',
                  `Your item "${p.name}" was purchased as part of the Synergy Kit "${item.name}".`
                );
              }
            });
          } else if (item.supplierId) {
            databaseService.sendSupplierNotification(
              item.supplierId,
              'Item Purchased',
              `Your item "${item.name}" has been purchased.`
            );
          }
        });

        setCart([]); 
        setSurgeTimerEnd(null); 
        gainRep(Math.floor(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) / 10));
        trackAchievement('a4', Math.floor(cart.reduce((acc, item) => acc + item.price * item.quantity, 0)));
        setStats(s => ({...s, tickets: s.tickets + 2})); 
        setCurrentView(ViewState.LOBBY); 
      }} onCancel={() => setCurrentView(ViewState.LOBBY)} balances={balances} activePromo={activePromo} />;
      default: return <Lobby products={products} stats={stats} userHandle={handle || 'Archiver'} socialPosts={socialPosts} wishlist={wishlist} onNavigate={handleNavigateView} onAddToCart={() => {}} onToggleWishlist={() => {}} onProductClick={setSelectedProduct} onCompleteQuest={() => {}} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white transition-colors duration-500 ${
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
         <div className="h-full bg-[#1a73e8] shadow-[0_0_10px_#1a73e8] transition-all duration-1000" style={{ width: `${(activeUsers / 1200) * 100}%` }}></div>
      </div>

      <main className="pt-24 flex-1">{renderView()}</main>
      
      <BottomNav 
        currentView={currentView} 
        onNavigate={handleNavigateView} 
        onOpenCategories={() => setIsCategoryPanelOpen(true)} 
        onOpenSearch={() => setIsSearchOpen(true)}
        isAuthenticated={isAuthenticated}
      />
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onClear={() => setCart([])} onNavigate={handleNavigateView} surgeTimerEnd={surgeTimerEnd} activePromo={activePromo} rank={currentRank} />
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
      />
      
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          stats={stats} 
          allProducts={products} 
          wishlistIds={wishlist}
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart} 
          onUpdateSynergy={() => {}} 
          onToggleWishlist={toggleWishlist} 
          onProductClick={setSelectedProduct} 
          isInWishlist={wishlist.includes(selectedProduct.id)} 
          rank={currentRank} 
        />
      )}
      
      {showAuthModal && (
        <LandingScreen 
          onComplete={(arch, isNew) => { 
            setHandle('User_' + Math.floor(Math.random()*1000)); 
            setIsAuthenticated(true); 
            localStorage.setItem('cc-auth-token', 'true');
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

      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} onNavigate={handleNavigateView} />}
      
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
