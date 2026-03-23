import { Product, User, Supplier, Notification, PromoCode, Order, OrderStatus, Bundle, SocialPost, UserCredit } from '../types';

const API_BASE = '/api';

export const databaseService = {
  // --- Auth ---
  registerUser: async (email: string, password: string, username: string, phone: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, phone })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  verifyUser: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    localStorage.removeItem('user');
  },

  saveUser: async (user: User) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving user:', error);
      return { success: false };
    }
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE}/users/email/${email}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  subscribeToProducts: (callback: (products: Product[]) => void) => {
    const interval = setInterval(async () => {
      const products = await databaseService.getProducts();
      callback(products);
    }, 5000);
    return () => clearInterval(interval);
  },

  saveProduct: async (product: Product) => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving product:', error);
      return { success: false };
    }
  },

  // --- Users ---
  getUser: async (userId: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`);
      const users: User[] = await response.json();
      return users.find(u => u.id === userId) || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  subscribeToUser: (userId: string, callback: (user: User | null) => void) => {
    const interval = setInterval(async () => {
      const user = await databaseService.getUser(userId);
      callback(user);
    }, 5000);
    return () => clearInterval(interval);
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false };
    }
  },

  // --- Suppliers ---
  getSuppliers: async (): Promise<Supplier[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/suppliers`);
      if (!response.ok) throw new Error('Failed to fetch suppliers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  },

  // --- Orders ---
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  createOrder: async (order: Order) => {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false };
    }
  },

  // --- Notifications ---
  getAdminNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/notifications`);
      if (!response.ok) throw new Error('Failed to fetch admin notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      return [];
    }
  },

  getNotifications: async (userId?: string): Promise<Notification[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/notifications`);
      const allNotifs: Notification[] = await response.json();
      if (userId) {
        return allNotifs.filter(n => n.recipientId === userId || n.recipientId === null);
      }
      return allNotifs.filter(n => n.recipientId === null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  subscribeToNotifications: (userId: string | undefined, callback: (notifs: Notification[]) => void) => {
    const interval = setInterval(async () => {
      const notifs = await databaseService.getNotifications(userId);
      callback(notifs);
    }, 5000);
    return () => clearInterval(interval);
  },

  // --- Promo Codes ---
  getPromoCodes: async (): Promise<PromoCode[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/promos`);
      if (!response.ok) throw new Error('Failed to fetch promos');
      return await response.json();
    } catch (error) {
      console.error('Error fetching promos:', error);
      return [];
    }
  },

  // --- Admin Settings ---
  getAdminSettings: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE}/admin/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {};
    }
  },

  updateAdminSetting: async (key: string, value: any) => {
    try {
      const response = await fetch(`${API_BASE}/admin/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false };
    }
  },

  // --- User Stats & Rep ---
  getUserStats: async (userId: string): Promise<any> => {
    const user = await databaseService.getUser(userId);
    return user?.stats || {
      dailyGameAttempts: 0,
      lastGameReset: new Date().toISOString(),
      quests: [],
      microCommitments: [],
      commitmentStreak: 0,
      softLockedItems: {},
      selectedPath: null,
      aiTryOnsUsedToday: 0,
      tickets: 5,
      brandSubscriptions: [],
      tagSubscriptions: [],
      achievements: []
    };
  },

  addRep: async (userId: string, amount: number) => {
    const user = await databaseService.getUser(userId);
    if (!user) return null;
    const newRep = (user.rep || 0) + amount;
    await databaseService.updateUser(userId, { rep: newRep });
    return { ...user, rep: newRep };
  },

  updateAchievementProgress: async (userId: string, achievementId: string, progress: number) => {
    const user = await databaseService.getUser(userId);
    if (!user) return;
    const achievements = [...(user.stats?.achievements || [])];
    const index = achievements.findIndex(a => a.id === achievementId);
    if (index >= 0) {
      achievements[index].progress += progress;
    } else {
      achievements.push({ id: achievementId, title: 'Achievement', description: '', icon: '', progress, goal: 100, rewardREP: 100, unlocked: false });
    }
    await databaseService.updateUser(userId, { stats: { ...user.stats, achievements } } as any);
  },

  completeMicroCommitment: async (userId: string, commitmentId: string) => {
    const user = await databaseService.getUser(userId);
    if (!user) return null;
    const commitments = (user.stats?.microCommitments || []).map(c => 
      c.id === commitmentId ? { ...c, completed: true } : c
    );
    const newRep = (user.rep || 0) + 50;
    await databaseService.updateUser(userId, { 
      stats: { ...user.stats, microCommitments: commitments },
      rep: newRep
    } as any);
    return { ...user.stats, microCommitments: commitments };
  },

  softLockProduct: async (userId: string, productId: string) => {
    const user = await databaseService.getUser(userId);
    if (!user) return null;
    const softLockedItems = { ...(user.stats?.softLockedItems || {}) };
    softLockedItems[productId] = Date.now() + 300000;
    await databaseService.updateUser(userId, { stats: { ...user.stats, softLockedItems } } as any);
    return { ...user.stats, softLockedItems };
  },

  // --- Global Helpers ---
  calculateLevel: (rep: number) => Math.floor(rep / 1000) + 1,

  getSocialPosts: async (): Promise<SocialPost[]> => {
    try {
      const response = await fetch(`${API_BASE}/social/posts`);
      if (!response.ok) throw new Error('Failed to fetch social posts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching social posts:', error);
      return [];
    }
  },

  sendNotification: async (title: string, message: string, type: string, recipientId: string | null = null) => {
    try {
      await fetch(`${API_BASE}/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type, recipientId })
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  sendSupplierNotification: async (supplierId: string, title: string, message: string) => {
    await databaseService.sendNotification(title, message, 'INFO', supplierId);
  },

  getGlobalNotifications: async (): Promise<Notification[]> => {
    return databaseService.getNotifications();
  },

  getAdminUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`);
      if (!response.ok) throw new Error('Failed to fetch admin users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
  },

  getAdminProducts: async (): Promise<Product[]> => {
    return databaseService.getProducts();
  },

  updateUserStatusOnBackend: async (userId: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating user status on backend:', error);
      return { success: false };
    }
  },

  getAdminFlashSales: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/flash-sales`);
      if (!response.ok) throw new Error('Failed to fetch admin flash sales');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin flash sales:', error);
      return [];
    }
  },

  addAdminFlashSale: async (sale: any) => {
    try {
      const response = await fetch(`${API_BASE}/admin/flash-sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding admin flash sale:', error);
      return { success: false };
    }
  },

  getAdminKits: async (): Promise<Bundle[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/kits`);
      if (!response.ok) throw new Error('Failed to fetch admin kits');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin kits:', error);
      return [];
    }
  },

  getAdminSuppliers: async (): Promise<Supplier[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/suppliers`);
      if (!response.ok) throw new Error('Failed to fetch admin suppliers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin suppliers:', error);
      return [];
    }
  },

  addAdminKit: async (kit: Bundle) => {
    try {
      const response = await fetch(`${API_BASE}/admin/kits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kit)
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding admin kit:', error);
      return { success: false };
    }
  },

  getAdminOrders: async (): Promise<Order[]> => {
    return databaseService.getOrders();
  },

  getAdminMetrics: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE}/admin/metrics`);
      if (!response.ok) throw new Error('Failed to fetch admin metrics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalSuppliers: 0,
        activeSessions: 0,
        systemHealth: 'UNKNOWN'
      };
    }
  },

  getAdminPayForMeRequests: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE}/admin/pay-for-me`);
      if (!response.ok) throw new Error('Failed to fetch admin pay-for-me requests');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin pay-for-me requests:', error);
      return [];
    }
  },

  updateAdminPayForMeStatus: async (requestId: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/pay-for-me/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating pay-for-me status:', error);
      return { success: false };
    }
  },

  addAdminNotification: async (notif: any) => {
    try {
      const response = await fetch(`${API_BASE}/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding admin notification:', error);
      return { success: false };
    }
  },

  getAdminPromos: async (): Promise<PromoCode[]> => {
    return databaseService.getPromoCodes();
  },

  addAdminPromo: async (promo: PromoCode) => {
    try {
      const response = await fetch(`${API_BASE}/admin/promos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promo)
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding admin promo:', error);
      return { success: false };
    }
  },

  registerSupplier: async (supplier: Supplier) => {
    try {
      const response = await fetch(`${API_BASE}/admin/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
      return await response.json();
    } catch (error) {
      console.error('Error registering supplier:', error);
      return { success: false };
    }
  },

  // --- Credits ---
  getUserCredits: async (userId: string): Promise<UserCredit[]> => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/credits`);
      if (!response.ok) throw new Error('Failed to fetch credits');
      return await response.json();
    } catch (error) {
      console.error('Error fetching credits:', error);
      return [];
    }
  },

  useUserCredit: async (userId: string, creditId: string) => {
    try {
      const response = await fetch(`${API_BASE}/user-credits/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, creditId })
      });
      return await response.json();
    } catch (error) {
      console.error('Error using credit:', error);
      return { success: false };
    }
  },

  // --- Flash Sales ---
  getFlashSales: async (): Promise<any[]> => {
    return databaseService.getAdminFlashSales();
  },

  getFlashSaleWindow: async (): Promise<any> => {
    const settings = await databaseService.getAdminSettings();
    return settings.flash_sale_window || null;
  },

  initializeFlashSaleWindow: async () => {
    const window = {
      start: Date.now(),
      end: Date.now() + 3600000
    };
    await databaseService.updateAdminSetting('flash_sale_window', window);
    return window;
  },

  // --- Hall of Fame ---
  getUsersRankedByLoves: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE}/users/ranked`);
      if (!response.ok) throw new Error('Failed to fetch ranked users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching ranked users:', error);
      return [];
    }
  },

  // --- Pay For Me ---
  getPayForMeRequests: async (userId?: string): Promise<any[]> => {
    try {
      const url = userId ? `${API_BASE}/users/${userId}/pay-for-me` : `${API_BASE}/admin/pay-for-me`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch pay-for-me requests');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pay-for-me requests:', error);
      return [];
    }
  },

  createPayForMeRequest: async (request: any) => {
    try {
      const response = await fetch(`${API_BASE}/pay-for-me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating pay-for-me request:', error);
      return { success: false };
    }
  },

  updatePayForMeStatus: async (requestId: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE}/pay-for-me/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating pay-for-me status:', error);
      return { success: false };
    }
  },

  // --- Social ---
  likePost: async (postId: string, userId: string): Promise<SocialPost | null> => {
    try {
      const response = await fetch(`${API_BASE}/social/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to like post');
      return await response.json();
    } catch (error) {
      console.error('Error liking post:', error);
      return null;
    }
  },

  lovePost: async (postId: string, userId: string): Promise<SocialPost | null> => {
    try {
      const response = await fetch(`${API_BASE}/social/posts/${postId}/love`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to love post');
      return await response.json();
    } catch (error) {
      console.error('Error loving post:', error);
      return null;
    }
  },

  getWeekId: () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return `week_${Math.ceil(day / 7)}`;
  },

  saveSocialPosts: async (posts: SocialPost[]) => {
    try {
      const response = await fetch(`${API_BASE}/social/posts/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts })
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving social posts:', error);
      return { success: false };
    }
  },

  // --- Supplier ---
  getSupplierProfile: async (supplierId: string): Promise<Supplier | null> => {
    try {
      const response = await fetch(`${API_BASE}/suppliers/${supplierId}`);
      if (!response.ok) throw new Error('Failed to fetch supplier profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching supplier profile:', error);
      return null;
    }
  },

  getSupplierProducts: async (supplierId: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE}/suppliers/${supplierId}/products`);
      if (!response.ok) throw new Error('Failed to fetch supplier products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching supplier products:', error);
      return [];
    }
  },

  getSupplierOrders: async (supplierId: string): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE}/suppliers/${supplierId}/orders`);
      if (!response.ok) throw new Error('Failed to fetch supplier orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching supplier orders:', error);
      return [];
    }
  },

  updateSupplierProfile: async (supplierId: string, data: Partial<Supplier>) => {
    try {
      const response = await fetch(`${API_BASE}/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating supplier profile:', error);
      return { success: false };
    }
  },

  saveProductToBackend: async (product: any) => {
    return databaseService.saveProduct(product as Product);
  },

  updateProductOnBackend: async (productId: string, data: Partial<Product>) => {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating product on backend:', error);
      return { success: false };
    }
  },

  updateOrderStatusOnBackend: async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating order status on backend:', error);
      return { success: false };
    }
  },

  changePassword: async (userId: string, current: string, newPass: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, current, newPass })
      });
      return await response.json();
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false };
    }
  }
};
