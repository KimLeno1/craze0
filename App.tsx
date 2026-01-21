
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Lobby from './components/HomeLobby';
import FamousProducts from './components/FamousProducts';
import TryOn from './components/TryOn';
import Bundles from './components/Bundles';
import OutfitBuilder from './components/OutfitBuilder';
import Categories from './components/Categories';
import FlashSales from './components/FlashSales';
import Profile from './components/Profile';
import WishlistView from './components/WishlistView';
import CategoryPanel from './components/CategoryPanel';
import SocialProofPopup from './components/SocialProofPopup';
import LandingScreen from './components/LandingScreen';
import AdminPanel from './components/AdminPanel';
import SupplierDashboard from './components/SupplierDashboard';
import CheckoutView from './components/CheckoutView';
import AdminLogin from './components/AdminLogin';
import { EXTENDED_PRODUCTS, MOCK_BUNDLES } from './mockData';
import { USER_ACHIEVEMENTS } from './data/extendedMock';
import { getHypeRankedProducts } from './services/metricsService';
import { Product, CartItem, Page, ViewState, UserStats, Bundle, Category, Achievement } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('closet-craze-auth') === 'true';
  });
  
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOBBY);
  const [activeSupplierId, setActiveSupplierId] = useState<string | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('closet-craze-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('closet-craze-wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('closet-craze-achievements');
    return saved ? JSON.parse(saved) : USER_ACHIEVEMENTS;
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [timeLeft, setTimeLeft] = useState(300);

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('closet-craze-stats');
    return saved ? JSON.parse(saved) : {
      dailyGameAttempts: 0,
      lastGameReset: new Date().toDateString(),
      quests: [
        { id: 'q1', title: 'Analyze Velocity Heat', rewardXP: 100, icon: '🔥', completed: false },
        { id: 'q2', title: 'Refine Identity', rewardXP: 150, icon: '🎨', completed: false }
      ],
      selectedPath: 'CYBER'
    };
  });

  const balances = {
    coins: 4250,
    gems: 120,
    xp: achievements.reduce((acc, ach) => acc + (ach.unlocked ? ach.rewardXP || 0 : 0), 0) + 8500
  };

  useEffect(() => {
    localStorage.setItem('closet-craze-auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id) 
        : [...prev, product.id]
    );
  };

  const handleAdminSuccess = (role: 'ADMIN' | 'SUPPLIER', id?: string) => {
    if (role === 'ADMIN') {
      setCurrentView(ViewState.ADMIN);
    } else {
      setActiveSupplierId(id || 'sup1');
      setCurrentView(ViewState.SUPPLIER_DASHBOARD);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.LOBBY:
        return (
          <Lobby 
            products={EXTENDED_PRODUCTS} 
            stats={stats} 
            wishlist={wishlist}
            onNavigate={setCurrentView} 
            onAddToCart={(pId) => {
              const p = EXTENDED_PRODUCTS.find(x => x.id === pId);
              if (p) addToCart(p);
            }} 
            onToggleWishlist={toggleWishlist}
            onProductClick={setSelectedProduct}
            onCompleteQuest={(qId) => {
              setStats(prev => ({
                ...prev,
                quests: prev.quests.map(q => q.id === qId ? { ...q, completed: true } : q)
              }));
            }}
          />
        );
      case ViewState.FAMOUS:
        return (
          <FamousProducts 
            products={selectedCategory === 'All' ? EXTENDED_PRODUCTS : EXTENDED_PRODUCTS.filter(p => p.category === selectedCategory)} 
            wishlist={wishlist}
            onProductClick={setSelectedProduct} 
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
          />
        );
      case ViewState.TRY_ON: return <TryOn />;
      case ViewState.BUNDLES: return <Bundles bundles={MOCK_BUNDLES} onAddBundle={(b) => b.products.forEach(p => addToCart(p))} />;
      case ViewState.CATEGORIES: return <Categories onSelectCategory={setSelectedCategory} onNavigate={setCurrentView} />;
      case ViewState.FLASH: return <FlashSales onAddToCart={addToCart} />;
      case ViewState.PROFILE: return <Profile stats={stats} onNavigate={setCurrentView} onLogout={() => setIsAuthenticated(false)} />;
      case ViewState.WISHLIST: return <WishlistView products={EXTENDED_PRODUCTS} wishlistIds={wishlist} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} onProductClick={setSelectedProduct} />;
      case ViewState.ADMIN_LOGIN: return <AdminLogin onSuccess={handleAdminSuccess} onCancel={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.ADMIN: return <AdminPanel onExit={() => setCurrentView(ViewState.LOBBY)} onNavigate={setCurrentView} />;
      case ViewState.SUPPLIER_DASHBOARD: return <SupplierDashboard supplierId={activeSupplierId || 'sup1'} onLogout={() => setCurrentView(ViewState.LOBBY)} />;
      case ViewState.CHECKOUT: return <CheckoutView items={cart} onComplete={() => setCart([])} onCancel={() => setCurrentView(ViewState.LOBBY)} balances={balances} />;
      default: return <Lobby products={EXTENDED_PRODUCTS} stats={stats} wishlist={wishlist} onNavigate={setCurrentView} onAddToCart={() => {}} onToggleWishlist={() => {}} onProductClick={setSelectedProduct} onCompleteQuest={() => {}} />;
    }
  };

  if (currentView === ViewState.ADMIN_LOGIN) return <AdminLogin onSuccess={handleAdminSuccess} onCancel={() => setCurrentView(ViewState.LOBBY)} />;
  if (currentView === ViewState.ADMIN) return <AdminPanel onExit={() => setCurrentView(ViewState.LOBBY)} onNavigate={setCurrentView} />;
  if (currentView === ViewState.SUPPLIER_DASHBOARD) return <SupplierDashboard supplierId={activeSupplierId || 'sup1'} onLogout={() => setCurrentView(ViewState.LOBBY)} />;
  if (currentView === ViewState.CHECKOUT) return <CheckoutView items={cart} onComplete={() => {setCart([]); setCurrentView(ViewState.LOBBY);}} onCancel={() => setCurrentView(ViewState.LOBBY)} balances={balances} />;

  if (!isAuthenticated) {
    return <LandingScreen onComplete={(archetype) => {setStats(prev => ({...prev, selectedPath: archetype})); setIsAuthenticated(true);}} onAdminAccess={() => setCurrentView(ViewState.ADMIN_LOGIN)} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex flex-col font-sans">
      <Header 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        wishlistCount={wishlist.length}
        stats={stats}
        onCartOpen={() => setIsCartOpen(true)}
        onNavigatePage={(p) => setCurrentView(p === Page.HOME ? ViewState.LOBBY : ViewState.FAMOUS)}
        onNavigateView={setCurrentView}
        currentPage={currentView === ViewState.LOBBY ? Page.HOME : Page.SHOP}
        currentView={currentView}
        dropTime={timeLeft}
        onOpenCategories={() => setIsCategoryPanelOpen(true)}
      />
      <main className="pt-24 flex-1">{renderView()}</main>
      <BottomNav currentView={currentView} onNavigate={setCurrentView} onOpenCategories={() => setIsCategoryPanelOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onNavigate={setCurrentView} />
      <CategoryPanel isOpen={isCategoryPanelOpen} onClose={() => setIsCategoryPanelOpen(false)} onSelectCategory={setSelectedCategory} onNavigate={setCurrentView} activeCategory={selectedCategory} products={EXTENDED_PRODUCTS} onProductSelect={setSelectedProduct} />
      <SocialProofPopup />
      {selectedProduct && <ProductDetail product={selectedProduct} stats={stats} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} onUpdateSynergy={() => {}} onToggleWishlist={toggleWishlist} isInWishlist={wishlist.includes(selectedProduct.id)} />}
    </div>
  );
};

export default App;
