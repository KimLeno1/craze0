import { Product, User, Supplier, Notification, PromoCode, Order, Bundle, SocialPost, UserCredit } from '../types';

const getAuthToken = () => localStorage.getItem('cc-auth-token');

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    // Handle unauthorized (e.g., redirect to login or clear token)
    // localStorage.removeItem('cc-auth-token');
  }
  return response;
};

export const databaseService = {
  // --- Auth ---
  registerUser: async (email: string, password: string, username: string, phone: string) => {
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, phone })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('cc-auth-token', data.token);
        localStorage.setItem('cc-current-user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  verifyUser: async (email: string, password: string) => {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('cc-auth-token', data.token);
        localStorage.setItem('cc-current-user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    localStorage.removeItem('cc-auth-token');
    localStorage.removeItem('cc-current-user');
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  subscribeToProducts: (callback: (products: Product[]) => void) => {
    // Polling as a simple replacement for onSnapshot
    const interval = setInterval(async () => {
      const products = await databaseService.getProducts();
      callback(products);
    }, 10000);
    return () => clearInterval(interval);
  },

  saveProduct: async (product: Product) => {
    try {
      const response = await fetchWithAuth('/api/products', {
        method: 'POST',
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
      const response = await fetchWithAuth(`/api/admin/users`); // Simplified for now
      const users = await response.json();
      return users.find((u: any) => u.id === userId) || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  changePassword: async (userId: string, current: string, newPass: string) => {
    // Simplified for now, in a real app this would be a dedicated API call
    return { success: true };
  },

  subscribeToUser: (userId: string, callback: (user: User | null) => void) => {
    const interval = setInterval(async () => {
      const user = await databaseService.getUser(userId);
      callback(user);
    }, 10000);
    return () => clearInterval(interval);
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    try {
      const response = await fetchWithAuth(`/api/admin/users/${userId}/status`, { // Reusing status update for general updates for now
        method: 'PUT',
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
      const response = await fetch('/api/admin/suppliers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  },

  // --- Orders ---
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch('/api/orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  createOrder: async (order: Order) => {
    try {
      const response = await fetchWithAuth('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false };
    }
  },

  // --- Notifications ---
  getNotifications: async (userId?: string): Promise<Notification[]> => {
    try {
      const response = await fetch('/api/admin/notifications');
      const allNotifs = await response.json();
      if (userId) {
        return allNotifs.filter((n: any) => n.recipientId === userId || n.recipientId === null);
      }
      return allNotifs.filter((n: any) => n.recipientId === null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  getAdminNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await fetchWithAuth('/api/admin/notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      return [];
    }
  },

  subscribeToNotifications: (userId: string | undefined, callback: (notifs: Notification[]) => void) => {
    const interval = setInterval(async () => {
      const notifs = await databaseService.getNotifications(userId);
      callback(notifs);
    }, 10000);
    return () => clearInterval(interval);
  },

  // --- Promo Codes ---
  getPromoCodes: async (): Promise<PromoCode[]> => {
    try {
      const response = await fetch('/api/admin/promos');
      return await response.json();
    } catch (error) {
      console.error('Error fetching promos:', error);
      return [];
    }
  },

  // --- Admin Settings ---
  getAdminSettings: async (): Promise<any> => {
    try {
      const response = await fetch('/api/admin/settings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {};
    }
  },

  updateAdminSetting: async (key: string, value: any) => {
    try {
      const response = await fetchWithAuth(`/api/admin/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false };
    }
  },

  // --- User Stats & Rep ---
  addRep: async (userId: string, amount: number) => {
    // Simplified: in a real app, this would be a dedicated API call
    const user = await databaseService.getUser(userId);
    if (!user) return null;
    const newRep = (user.rep || 0) + amount;
    await databaseService.updateUser(userId, { rep: newRep });
    return { ...user, rep: newRep };
  },

  updateAchievementProgress: async (userId: string, achievementId: string, progress: number) => {
    // Simplified
  },

  completeMicroCommitment: async (userId: string, commitmentId: string) => {
    // Simplified
    return null;
  },

  softLockProduct: async (userId: string, productId: string) => {
    // Simplified
    return null;
  },

  // --- Global Helpers ---
  calculateLevel: (rep: number) => Math.floor(rep / 1000) + 1,

  getSocialPosts: async (): Promise<SocialPost[]> => {
    return []; // Simplified
  },

  sendNotification: async (title: string, message: string, type: string, recipientId: string | null = null) => {
    try {
      await fetchWithAuth('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify({ title, message, type, recipientId })
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  sendSupplierNotification: async (supplierId: string, title: string, message: string) => {
    await databaseService.sendNotification(title, message, 'INFO', supplierId);
  },

  // --- Admin Methods ---
  getAdminUsers: async (): Promise<User[]> => {
    const response = await fetchWithAuth('/api/admin/users');
    return await response.json();
  },

  getAdminProducts: async (): Promise<Product[]> => {
    return databaseService.getProducts();
  },

  updateProductOnBackend: async (productId: string, data: Partial<Product>) => {
    const response = await fetchWithAuth(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  saveProductToBackend: async (product: Product) => {
    return databaseService.saveProduct(product);
  },

  updateUserStatusOnBackend: async (userId: string, status: string) => {
    const response = await fetchWithAuth(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  updateOrderStatusOnBackend: async (orderId: string, status: string) => {
    const response = await fetchWithAuth(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  getAdminFlashSales: async (): Promise<any[]> => {
    const response = await fetchWithAuth('/api/admin/flash-sales');
    return await response.json();
  },

  addAdminFlashSale: async (sale: any) => {
    const response = await fetchWithAuth('/api/admin/flash-sales', {
      method: 'POST',
      body: JSON.stringify(sale)
    });
    return await response.json();
  },

  getAdminKits: async (): Promise<Bundle[]> => {
    const response = await fetchWithAuth('/api/admin/kits');
    return await response.json();
  },

  getAdminSuppliers: async (): Promise<Supplier[]> => {
    return databaseService.getSuppliers();
  },

  addAdminKit: async (kit: Bundle) => {
    const response = await fetchWithAuth('/api/admin/kits', {
      method: 'POST',
      body: JSON.stringify(kit)
    });
    return await response.json();
  },

  getAdminOrders: async (): Promise<Order[]> => {
    return databaseService.getOrders();
  },

  getSupplierOrders: async (supplierId: string): Promise<Order[]> => {
    const response = await fetchWithAuth(`/api/suppliers/${supplierId}/orders`);
    return await response.json();
  },

  getSupplierProfile: async (supplierId: string): Promise<Supplier | null> => {
    const response = await fetchWithAuth(`/api/suppliers/${supplierId}/profile`);
    return await response.json();
  },

  getSupplierProducts: async (supplierId: string): Promise<Product[]> => {
    const response = await fetchWithAuth(`/api/suppliers/${supplierId}/products`);
    return await response.json();
  },

  updateSupplierProfile: async (supplierId: string, data: Partial<Supplier>) => {
    const response = await fetchWithAuth(`/api/suppliers/${supplierId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  getAdminMetrics: async (): Promise<any> => {
    const response = await fetchWithAuth('/api/admin/metrics');
    return await response.json();
  },

  getAdminPayForMeRequests: async (): Promise<any[]> => {
    const response = await fetchWithAuth('/api/admin/pay-for-me');
    return await response.json();
  },

  updateAdminPayForMeStatus: async (requestId: string, status: string) => {
    const response = await fetchWithAuth(`/api/admin/pay-for-me/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  addAdminNotification: async (notif: any) => {
    const response = await fetchWithAuth('/api/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(notif)
    });
    return await response.json();
  },

  getAdminPromos: async (): Promise<PromoCode[]> => {
    const response = await fetchWithAuth('/api/admin/promos');
    return await response.json();
  },

  addAdminPromo: async (promo: PromoCode) => {
    const response = await fetchWithAuth('/api/admin/promos', {
      method: 'POST',
      body: JSON.stringify(promo)
    });
    return await response.json();
  },

  registerSupplier: async (supplier: Supplier) => {
    // Simplified
    return { success: true };
  },

  // --- Credits ---
  getUserCredits: async (userId: string): Promise<UserCredit[]> => {
    const response = await fetchWithAuth(`/api/users/${userId}/credits`);
    return await response.json();
  },

  useUserCredit: async (userId: string, creditId: string) => {
    const response = await fetchWithAuth('/api/user-credits/use', {
      method: 'POST',
      body: JSON.stringify({ userId, creditId })
    });
    return await response.json();
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
    const users = await databaseService.getAdminUsers();
    return users.sort((a, b) => (b.rep || 0) - (a.rep || 0)).slice(0, 10);
  },

  // --- Pay For Me ---
  getPayForMeRequests: async (userId?: string): Promise<any[]> => {
    const url = userId ? `/api/pay-for-me/${userId}` : '/api/admin/pay-for-me';
    const response = await fetchWithAuth(url);
    return await response.json();
  },

  createPayForMeRequest: async (request: any) => {
    const response = await fetchWithAuth('/api/pay-for-me', {
      method: 'POST',
      body: JSON.stringify(request)
    });
    return await response.json();
  },

  updatePayForMeStatus: async (requestId: string, status: string) => {
    const response = await fetchWithAuth(`/api/pay-for-me/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  // --- Social ---
  likePost: async (postId: string, userId: string): Promise<SocialPost | null> => {
    return null; // Simplified
  },

  lovePost: async (postId: string, userId: string): Promise<SocialPost | null> => {
    return null; // Simplified
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
    // Simplified
  }
};
