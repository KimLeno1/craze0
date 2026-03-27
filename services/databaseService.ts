import { Product, User, Supplier, Notification, PromoCode, Order, OrderStatus, Bundle, PayForMeRequest, PayForMeStatus, UserStats, UserPreferences, UserHistory, UserPost, SocialComment, SocialInteraction } from '../types';
import { EXTENDED_PRODUCTS, MOCK_ORDERS } from '../mockData';
import { USER_ACHIEVEMENTS } from '../data/extendedMock';

const USER_DB_KEY = 'cc_admin_user_db';
const PRODUCT_DB_KEY = 'cc_admin_product_db';
const SUPPLIER_DB_KEY = 'cc_admin_supplier_db';
const ADMIN_AUTH_KEY = 'cc_admin_auth_creds';
const NOTIFICATIONS_KEY = 'cc_global_notifications';
const PROMO_CODES_KEY = 'cc_promo_codes';
const SOCIAL_POSTS_KEY = 'cc_social_posts';
const ORDERS_DB_KEY = 'cc_orders_db';
const USER_STATS_KEY = 'cc_user_stats';
const PRICE_ANOMALIES_KEY = 'cc_price_anomalies';
const BUNDLES_DB_KEY = 'cc_bundles_db';
const PAY_FOR_ME_KEY = 'cc_pay_for_me_db';
const PRICE_ANOMALY_WINDOW_KEY = 'cc_price_anomaly_window';
const PRICE_ANOMALY_DURATION_KEY = 'cc_price_anomaly_duration';

const MOCK_PRICE_ANOMALIES: any[] = [
  {
    ...EXTENDED_PRODUCTS[0],
    id: 'anomaly_1',
    anomalyEndTime: Date.now() + 1000 * 60 * 60 * 2, // 2 hours
    discountPercent: 40,
    price: Math.floor(EXTENDED_PRODUCTS[0].price * 0.6)
  },
  {
    ...EXTENDED_PRODUCTS[1],
    id: 'anomaly_2',
    anomalyEndTime: Date.now() + 1000 * 60 * 60 * 5, // 5 hours
    discountPercent: 25,
    price: Math.floor(EXTENDED_PRODUCTS[1].price * 0.75)
  }
];

const MOCK_POSTS = [
  {
    id: 'post_1',
    userId: 'u1',
    userHandle: 'Viper_X',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    likes: 124,
    loves: 45,
    timestamp: new Date().toISOString(),
    weekId: '' // Will be set in getSocialPosts
  },
  {
    id: 'post_2',
    userId: 'u2',
    userHandle: 'Ghost_Shell',
    image: 'https://images.unsplash.com/photo-1539109132314-34a77bd6819f?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    loves: 12,
    timestamp: new Date().toISOString(),
    weekId: ''
  },
  {
    id: 'post_3',
    userId: 'u3',
    userHandle: 'Luxe_Lord',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    likes: 256,
    loves: 120,
    timestamp: new Date().toISOString(),
    weekId: ''
  }
];

const MOCK_USERS: User[] = [
  { id: 'u1', handle: 'Viper_X', email: 'viper@archivers.net', archetype: 'CYBER', rep: 4500, level: 7, coins: 1200, gems: 45, status: 'ACTIVE', lastLogin: '2h ago', totalSpent: 850 },
  { id: 'u2', handle: 'Ghost_Shell', email: 'ghost@void.com', archetype: 'VOID', rep: 8900, level: 10, coins: 5400, gems: 120, status: 'ACTIVE', lastLogin: '15m ago', totalSpent: 2400 },
  { id: 'u3', handle: 'Luxe_Lord', email: 'lord@heirloom.io', archetype: 'LUXE', rep: 12000, level: 12, coins: 8900, gems: 300, status: 'ACTIVE', lastLogin: '5d ago', totalSpent: 12500 },
  { id: 'u4', handle: 'Glitch_Boi', email: 'glitch@chaos.org', archetype: 'CYBER', rep: 1200, level: 4, coins: 400, gems: 5, status: 'BANNED', lastLogin: '1y ago', totalSpent: 0 },
];

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'CyberKnit Industries', contactEmail: 'ops@cyberknit.nt', region: 'Neo Tokyo Central', status: 'ACTIVE', performanceScore: 94, totalRevenueYield: 450000, joinedDate: '2024-01-12' },
  { id: 'sup2', name: 'Void Loom Textiles', contactEmail: 'archive@voidloom.de', region: 'Neo Berlin', status: 'ACTIVE', performanceScore: 82, totalRevenueYield: 280000, joinedDate: '2024-03-05' },
  { id: 'sup3', name: 'Ethereal Silks', contactEmail: 'luxury@ethereal.sh', region: 'Emerald Heights', status: 'RESTRICTED', performanceScore: 45, totalRevenueYield: 120000, joinedDate: '2024-06-20' },
];

const WELCOME_NOTIFICATION: Notification = {
  id: 'welcome_01',
  title: 'Protocol Initialized: Welcome Archiver',
  message: 'Greetings from the Closet Kraze core. Access the Velocity Heat for real-time demand insights, use the Synergy Kits to maximize status, and consult the AI Stylist in your studio for neural outfit building.',
  type: 'WELCOME',
  timestamp: 'Just now',
  read: false
};

const DEFAULT_ADMIN = {
  identifier: 'leno',
  password: '1q2w3!'
};

const API_BASE = '/api';
const ADMIN_API_BASE = '/api/admin';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  const text = await response.text();
  throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
};

const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error parsing ${key}:`, e);
    return fallback;
  }
};

export const databaseService = {
  getAdminCredentials: async () => {
    try {
      const response = await fetch(`${API_BASE}/settings/admin_creds`);
      const creds = await handleResponse(response);
      return creds || DEFAULT_ADMIN;
    } catch (error) {
      console.error('Error fetching admin credentials:', error);
      return safeParse(ADMIN_AUTH_KEY, DEFAULT_ADMIN);
    }
  },

  updateAdminCredentials: async (creds: typeof DEFAULT_ADMIN) => {
    try {
      await fetch(`${API_BASE}/settings/admin_creds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(creds));
    } catch (error) {
      console.error('Error updating admin credentials:', error);
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(creds));
    }
    return creds;
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      return safeParse(USER_DB_KEY, MOCK_USERS);
    }
  },

  saveUsers: async (users: User[]) => {
    try {
      for (const user of users) {
        await fetch(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
      }
    } catch (error) {
      console.error('Error saving users:', error);
      localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
    }
  },

  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const products = await handleResponse(response);
      if (products.length === 0) return EXTENDED_PRODUCTS;
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return safeParse(PRODUCT_DB_KEY, [] as Product[]);
    }
  },

  saveProducts: async (products: Product[]) => {
    try {
      for (const product of products) {
        await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
      }
    } catch (error) {
      console.error('Error saving products:', error);
      localStorage.setItem(PRODUCT_DB_KEY, JSON.stringify(products));
    }
  },

  getSuppliers: async (): Promise<Supplier[]> => {
    try {
      const response = await fetch(`${API_BASE}/suppliers`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return safeParse(SUPPLIER_DB_KEY, MOCK_SUPPLIERS);
    }
  },

  saveSuppliers: async (suppliers: Supplier[]) => {
    try {
      for (const supplier of suppliers) {
        await fetch(`${API_BASE}/suppliers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supplier)
        });
      }
    } catch (error) {
      console.error('Error saving suppliers:', error);
      localStorage.setItem(SUPPLIER_DB_KEY, JSON.stringify(suppliers));
    }
  },

  getGlobalNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await fetch(`${API_BASE}/notifications`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return safeParse(NOTIFICATIONS_KEY, [WELCOME_NOTIFICATION]);
    }
  },

  saveGlobalNotification: async (notif: Notification) => {
    try {
      await fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      });
    } catch (error) {
      console.error('Error saving notification:', error);
      const current = safeParse(NOTIFICATIONS_KEY, [WELCOME_NOTIFICATION]);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([notif, ...current]));
    }
  },

  updateNotifications: async (notifs: Notification[]) => {
    try {
      for (const notif of notifs) {
        await fetch(`${API_BASE}/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notif)
        });
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
    }
  },
  
  getPromoCodes: async (): Promise<PromoCode[]> => {
    try {
      const response = await fetch(`${API_BASE}/promo-codes`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      const initial: PromoCode[] = [{ id: 'p1', code: 'NEO10', type: 'PERCENT', value: 10, description: '10% Sector Entry Discount', discount: 10, usageLimit: 100, usedCount: 0, expiryDate: '2025-12-31' }];
      return safeParse(PROMO_CODES_KEY, initial);
    }
  },

  savePromoCodes: async (codes: PromoCode[]) => {
    try {
      for (const code of codes) {
        await fetch(`${API_BASE}/promo-codes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(code)
        });
      }
    } catch (error) {
      console.error('Error saving promo codes:', error);
      localStorage.setItem(PROMO_CODES_KEY, JSON.stringify(codes));
    }
  },

  updateUserStatus: async (userId: string, status: User['status']) => {
    const users = await databaseService.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, status } : u);
    await databaseService.saveUsers(updated);
    return updated;
  },

  deleteUser: async (userId: string) => {
    const users = await databaseService.getUsers();
    const updated = users.filter(u => u.id !== userId);
    await databaseService.saveUsers(updated);
    return updated;
  },

  registerSupplier: async (supplier: Partial<Supplier>) => {
    const suppliers = await databaseService.getSuppliers();
    const newSupplier: Supplier = {
      ...supplier as Supplier,
      id: `sup${Date.now()}`,
      status: 'ACTIVE',
      performanceScore: 50,
      totalRevenueYield: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [...suppliers, newSupplier];
    await databaseService.saveSuppliers(updated);
    return updated;
  },

  getWeekId: () => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
  },

  getSocialPosts: async (): Promise<UserPost[]> => {
    try {
      const response = await fetch(`${API_BASE}/social-posts`);
      const posts = await handleResponse(response);
      const currentWeek = databaseService.getWeekId();
      
      if (posts.length === 0) {
        return MOCK_POSTS.map(p => ({ 
          ...p, 
          weekId: currentWeek,
          dislikes: 0,
          reports: 0
        } as UserPost));
      }

      return posts;
    } catch (error) {
      console.error('Error fetching social posts:', error);
      const currentWeek = databaseService.getWeekId();
      return safeParse(SOCIAL_POSTS_KEY, MOCK_POSTS.map(p => ({ 
        ...p, 
        weekId: currentWeek,
        dislikes: 0,
        reports: 0
      } as UserPost)));
    }
  },

  interactWithPost: async (postId: string, userId: string, type: 'LIKE' | 'DISLIKE'): Promise<UserPost> => {
    try {
      const response = await fetch(`${API_BASE}/social-posts/${postId}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error interacting with post:', error);
      throw error;
    }
  },

  getPostComments: async (postId: string): Promise<SocialComment[]> => {
    try {
      const response = await fetch(`${API_BASE}/social-posts/${postId}/comments`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  addPostComment: async (postId: string, userId: string, userHandle: string, text: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/social-posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userHandle, text })
      });
      const result = await handleResponse(response);
      return result.success;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  },

  reportPost: async (postId: string, userId: string, reason: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/social-posts/${postId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason })
      });
      const result = await handleResponse(response);
      return result.success;
    } catch (error) {
      console.error('Error reporting post:', error);
      return false;
    }
  },

  getUserInteractions: async (userId: string): Promise<SocialInteraction[]> => {
    try {
      const response = await fetch(`${API_BASE}/social-interactions/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user interactions:', error);
      return [];
    }
  },

  saveSocialPosts: async (posts: any[]) => {
    try {
      for (const post of posts) {
        await fetch(`${API_BASE}/social-posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        });
      }
    } catch (error) {
      console.error('Error saving social posts:', error);
      localStorage.setItem(SOCIAL_POSTS_KEY, JSON.stringify(posts));
    }
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return safeParse(ORDERS_DB_KEY, MOCK_ORDERS);
    }
  },

  saveOrders: async (orders: Order[]) => {
    try {
      for (const order of orders) {
        await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
      }
    } catch (error) {
      console.error('Error saving orders:', error);
      localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(orders));
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const orders = await databaseService.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status, trackingNumber: trackingNumber || o.trackingNumber } : o);
    await databaseService.saveOrders(updated);
    return updated;
  },

  getPriceAnomalies: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE}/price-anomalies`);
      const anomalies = await handleResponse(response);
      if (anomalies.length === 0) return MOCK_PRICE_ANOMALIES;
      return anomalies;
    } catch (error) {
      console.error('Error fetching price anomalies:', error);
      return safeParse(PRICE_ANOMALIES_KEY, MOCK_PRICE_ANOMALIES);
    }
  },

  savePriceAnomalies: async (anomalies: any[]) => {
    try {
      for (const anomaly of anomalies) {
        await fetch(`${API_BASE}/price-anomalies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(anomaly)
        });
      }
    } catch (error) {
      console.error('Error saving price anomalies:', error);
      localStorage.setItem(PRICE_ANOMALIES_KEY, JSON.stringify(anomalies));
    }
  },

  getPriceAnomalyDuration: async (): Promise<number> => {
    try {
      const response = await fetch(`${API_BASE}/settings/price_anomaly_duration`);
      const duration = await handleResponse(response);
      return duration !== null ? duration : 2;
    } catch (error) {
      console.error('Error fetching price anomaly duration:', error);
      const saved = localStorage.getItem(PRICE_ANOMALY_DURATION_KEY);
      return saved ? parseInt(saved) : 2;
    }
  },

  savePriceAnomalyDuration: async (hours: number) => {
    try {
      await fetch(`${API_BASE}/settings/price_anomaly_duration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hours)
      });
    } catch (error) {
      console.error('Error saving price anomaly duration:', error);
      localStorage.setItem(PRICE_ANOMALY_DURATION_KEY, hours.toString());
    }
  },

  getPriceAnomalyWindow: async (): Promise<{ startTime: number; endTime: number } | null> => {
    try {
      const response = await fetch(`${API_BASE}/settings/price_anomaly_window`);
      const window = await handleResponse(response);
      if (!window) return null;
      
      const now = new Date();
      const windowDate = new Date(window.startTime);
      if (now.toDateString() !== windowDate.toDateString()) {
        return null;
      }
      return window;
    } catch (error) {
      console.error('Error fetching price anomaly window:', error);
      const window = safeParse<{ startTime: number; endTime: number } | null>(PRICE_ANOMALY_WINDOW_KEY, null);
      if (!window) return null;
      const now = new Date();
      const windowDate = new Date(window.startTime);
      if (now.toDateString() !== windowDate.toDateString()) return null;
      return window;
    }
  },

  initializePriceAnomalyWindow: async () => {
    const duration = await databaseService.getPriceAnomalyDuration();
    const startTime = Date.now();
    const endTime = startTime + (duration * 60 * 60 * 1000);
    const window = { startTime, endTime };
    try {
      await fetch(`${API_BASE}/settings/price_anomaly_window`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(window)
      });
    } catch (error) {
      console.error('Error initializing price anomaly window:', error);
      localStorage.setItem(PRICE_ANOMALY_WINDOW_KEY, JSON.stringify(window));
    }
    return window;
  },

  getUsersRanked: async (): Promise<User[]> => {
    const users = await databaseService.getUsers();
    return [...users].sort((a, b) => b.rep - a.rep);
  },

  getBundles: async (): Promise<Bundle[]> => {
    try {
      const response = await fetch(`${API_BASE}/bundles`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching bundles:', error);
      return safeParse(BUNDLES_DB_KEY, []);
    }
  },

  saveBundles: async (bundles: Bundle[]) => {
    try {
      for (const bundle of bundles) {
        await fetch(`${API_BASE}/bundles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bundle)
        });
      }
    } catch (error) {
      console.error('Error saving bundles:', error);
      localStorage.setItem(BUNDLES_DB_KEY, JSON.stringify(bundles));
    }
  },

  updateProductHype: async (productId: string, hypeScore: number) => {
    const products = await databaseService.getProducts();
    const updated = products.map(p => p.id === productId ? { ...p, hypeScore } : p);
    await databaseService.saveProducts(updated);
    return updated;
  },

  updateProductHallOfFame: async (productId: string, isHallOfFame: boolean) => {
    const products = await databaseService.getProducts();
    const updated = products.map(p => p.id === productId ? { ...p, isHallOfFame } : p);
    await databaseService.saveProducts(updated);
    return updated;
  },

  getVelocityHeatProducts: async (): Promise<Product[]> => {
    const products = await databaseService.getProducts();
    return [...products].sort((a, b) => {
      const scoreA = (a.hypeScore || 0) + (a.velocityScore || 0) + (a.isHallOfFame ? 100 : 0);
      const scoreB = (b.hypeScore || 0) + (b.velocityScore || 0) + (b.isHallOfFame ? 100 : 0);
      return scoreB - scoreA;
    });
  },

  getHallOfFameProducts: async (): Promise<Product[]> => {
    const products = await databaseService.getProducts();
    return products.filter(p => p.isHallOfFame);
  },

  sendSupplierNotification: async (supplierId: string, title: string, message: string) => {
    await databaseService.sendNotification(title, message, 'INFO', supplierId);
  },

  sendNotification: async (title: string, message: string, type: Notification['type'] = 'INFO', recipientId?: string) => {
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      recipientId
    };
    await databaseService.saveGlobalNotification(notif);
    return notif;
  },

  getPayForMeRequests: async (): Promise<PayForMeRequest[]> => {
    try {
      const response = await fetch(`${API_BASE}/pay-for-me`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching pay-for-me requests:', error);
      return safeParse(PAY_FOR_ME_KEY, []);
    }
  },

  savePayForMeRequests: async (requests: PayForMeRequest[]) => {
    try {
      for (const request of requests) {
        await fetch(`${API_BASE}/pay-for-me`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        });
      }
    } catch (error) {
      console.error('Error saving pay-for-me requests:', error);
      localStorage.setItem(PAY_FOR_ME_KEY, JSON.stringify(requests));
    }
  },

  createPayForMeRequest: async (request: Omit<PayForMeRequest, 'id' | 'timestamp' | 'status'>) => {
    const requests = await databaseService.getPayForMeRequests();
    const newRequest: PayForMeRequest = {
      ...request,
      id: `pfm_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: PayForMeStatus.PENDING
    };
    const updated = [newRequest, ...requests];
    await databaseService.savePayForMeRequests(updated);
    return newRequest;
  },

  updatePayForMeStatus: async (requestId: string, status: PayForMeStatus) => {
    const requests = await databaseService.getPayForMeRequests();
    const updated = requests.map(r => r.id === requestId ? { ...r, status } : r);
    await databaseService.savePayForMeRequests(updated);
    return updated;
  },

  getUserStats: async (userId: string): Promise<UserStats> => {
    try {
      const response = await fetch(`${API_BASE}/user-stats/${userId}`);
      if (response.status === 404) {
        // Return default stats if not found, without logging an error
        const initial: UserStats = {
          userId: userId,
          dailyGameAttempts: 3,
          lastGameReset: new Date().toISOString(),
          quests: [],
          selectedPath: null,
          aiTryOnsUsedToday: 0,
          tickets: 0,
          brandSubscriptions: [],
          tagSubscriptions: [],
          achievements: USER_ACHIEVEMENTS
        };
        return initial;
      }
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      const initial: UserStats = {
        userId: userId,
        dailyGameAttempts: 3,
        lastGameReset: new Date().toISOString(),
        quests: [],
        selectedPath: null,
        aiTryOnsUsedToday: 0,
        tickets: 0,
        brandSubscriptions: [],
        tagSubscriptions: [],
        achievements: USER_ACHIEVEMENTS
      };
      return safeParse(`${USER_STATS_KEY}_${userId}`, initial);
    }
  },

  saveUserStats: async (userId: string, stats: UserStats) => {
    try {
      await fetch(`${API_BASE}/user-stats/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
      });
    } catch (error) {
      console.error('Error saving user stats:', error);
      localStorage.setItem(`${USER_STATS_KEY}_${userId}`, JSON.stringify(stats));
    }
  },

  getAdminMetrics: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/metrics`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
      return {
        totalRevenue: 125000,
        activeOrders: 45,
        totalUsers: 1250,
        totalProducts: 450,
        systemUptime: '99.9%',
        threatLevel: 'LOW'
      };
    }
  },

  getSecurityStatus: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/security`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching security status:', error);
      return {
        firewall: 'ACTIVE',
        encryption: 'AES-256-GCM',
        loadBalancer: 'HEALTHY',
        activeSessions: 12,
        threatLevel: 'LOW',
        events: []
      };
    }
  },

  getJackpotPrizes: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/jackpot`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching jackpot prizes:', error);
      return [];
    }
  },

  calculateLevel: (rep: number) => {
    return Math.floor(Math.sqrt(rep / 100)) + 1;
  },

  addRep: async (userId: string, amount: number) => {
    const users = await databaseService.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const oldLevel = databaseService.calculateLevel(user.rep);
    const newRep = user.rep + amount;
    const newLevel = databaseService.calculateLevel(newRep);

    const updatedUser = { ...user, rep: newRep, level: newLevel };
    const updatedUsers = users.map(u => u.id === userId ? updatedUser : u);
    await databaseService.saveUsers(updatedUsers);

    if (newLevel > oldLevel) {
      await databaseService.sendNotification(
        'Level Up Protocol Initialized',
        `Reputation magnitude increased. You have reached Level ${newLevel}. Access to higher-tier fragments unlocked.`,
        'REWARD',
        userId
      );
    }

    return updatedUser;
  },

  updateAchievementProgress: async (userId: string, achievementId: string, progress: number) => {
    const stats = await databaseService.getUserStats(userId);
    const achievement = stats.achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      const newProgress = Math.min(achievement.goal, achievement.progress + progress);
      const isUnlocked = newProgress >= achievement.goal;
      
      const updatedAchievements = stats.achievements.map(a => 
        a.id === achievementId ? { ...a, progress: newProgress, unlocked: isUnlocked } : a
      );
      
      await databaseService.saveUserStats(userId, { ...stats, achievements: updatedAchievements });
      
      if (isUnlocked) {
        await databaseService.addRep(userId, achievement.rewardREP);
        await databaseService.sendNotification(
          'Milestone Achieved',
          `Protocol "${achievement.title}" completed. +${achievement.rewardREP} REP awarded.`,
          'REWARD',
          userId
        );
      }
    }
  },

  getUserPreferences: async (userId: string): Promise<UserPreferences | null> => {
    try {
      const response = await fetch(`${API_BASE}/user-preferences/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  },

  saveUserPreferences: async (userId: string, prefs: UserPreferences) => {
    try {
      await fetch(`${API_BASE}/user-preferences/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  },

  getUserHistory: async (userId: string): Promise<UserHistory> => {
    try {
      const response = await fetch(`${API_BASE}/user-history/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user history:', error);
      return { userId, viewedProductIds: [], wishlistedProductIds: [], purchasedProductIds: [] };
    }
  },

  saveUserHistory: async (userId: string, history: UserHistory) => {
    try {
      await fetch(`${API_BASE}/user-history/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(history)
      });
    } catch (error) {
      console.error('Error saving user history:', error);
    }
  },

  getRecommendations: async (userId: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE}/recommendations/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  },

  trackAction: async (userId: string, productId: string, action: 'view' | 'wishlist' | 'purchase') => {
    const history = await databaseService.getUserHistory(userId);
    if (action === 'view') {
      if (!history.viewedProductIds.includes(productId)) {
        history.viewedProductIds.push(productId);
      }
    } else if (action === 'wishlist') {
      if (!history.wishlistedProductIds.includes(productId)) {
        history.wishlistedProductIds.push(productId);
      }
    } else if (action === 'purchase') {
      if (!history.purchasedProductIds.includes(productId)) {
        history.purchasedProductIds.push(productId);
      }
    }
    await databaseService.saveUserHistory(userId, history);
  }
};
