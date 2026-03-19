import { Product, User, Supplier, Notification, PromoCode, Order, OrderStatus, Bundle, PayForMeRequest, PayForMeStatus, UserStats, SocialPost } from '../types';
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
const FLASH_SALES_KEY = 'cc_flash_sales';
const BUNDLES_DB_KEY = 'cc_bundles_db';
const PAY_FOR_ME_KEY = 'cc_pay_for_me_db';
const FLASH_SALE_WINDOW_KEY = 'cc_flash_sale_window';
const FLASH_SALE_DURATION_KEY = 'cc_flash_sale_duration';

const MOCK_FLASH_SALES: any[] = [
  {
    ...EXTENDED_PRODUCTS[0],
    id: 'flash_1',
    saleEndTime: Date.now() + 1000 * 60 * 60 * 2, // 2 hours
    discountPercent: 40,
    price: Math.floor(EXTENDED_PRODUCTS[0].price * 0.6)
  },
  {
    ...EXTENDED_PRODUCTS[1],
    id: 'flash_2',
    saleEndTime: Date.now() + 1000 * 60 * 60 * 5, // 5 hours
    discountPercent: 25,
    price: Math.floor(EXTENDED_PRODUCTS[1].price * 0.75)
  }
];

const MOCK_POSTS: SocialPost[] = [
  {
    id: 'post_1',
    userId: 'u1',
    userHandle: 'Viper_X',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    likes: 124,
    loves: 45,
    timestamp: new Date().toISOString(),
    weekId: '', // Will be set in getSocialPosts
    likedBy: [],
    lovedBy: []
  },
  {
    id: 'post_2',
    userId: 'u2',
    userHandle: 'Ghost_Shell',
    image: 'https://images.unsplash.com/photo-1539109132314-34a77bd6819f?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    loves: 12,
    timestamp: new Date().toISOString(),
    weekId: '',
    likedBy: [],
    lovedBy: []
  },
  {
    id: 'post_3',
    userId: 'u3',
    userHandle: 'Luxe_Lord',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    likes: 256,
    loves: 120,
    timestamp: new Date().toISOString(),
    weekId: '',
    likedBy: [],
    lovedBy: []
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

export const databaseService = {
  getAdminCredentials: () => {
    const saved = localStorage.getItem(ADMIN_AUTH_KEY);
    if (!saved) {
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(DEFAULT_ADMIN));
      return DEFAULT_ADMIN;
    }
    return JSON.parse(saved);
  },

  updateAdminCredentials: (creds: typeof DEFAULT_ADMIN) => {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(creds));
    return creds;
  },

  getUsers: (): User[] => {
    const saved = localStorage.getItem(USER_DB_KEY);
    if (!saved) {
      localStorage.setItem(USER_DB_KEY, JSON.stringify(MOCK_USERS));
      return MOCK_USERS;
    }
    return JSON.parse(saved);
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
  },

  getProducts: (): Product[] => {
    const saved = localStorage.getItem(PRODUCT_DB_KEY);
    let products: Product[];
    if (!saved) {
      const seeded = EXTENDED_PRODUCTS.map((p, i) => ({
        ...p,
        supplierId: i % 2 === 0 ? 'sup1' : 'sup2',
        shippingFee: 25 // Default shipping fee
      }));
      localStorage.setItem(PRODUCT_DB_KEY, JSON.stringify(seeded));
      products = seeded;
    } else {
      products = JSON.parse(saved);
    }

    // Auto-update metrics (Heat and New)
    const now = Date.now();
    const updated = products.map(p => {
      // Logic: 10% chance to become "New" if not already, or based on ID
      const isNew = p.isNew || (parseInt(p.id) > 10); 
      // Logic: Randomly fluctuate velocity score (Heat)
      const velocityScore = Math.min(100, Math.max(10, p.velocityScore + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)));
      return { ...p, isNew, velocityScore };
    });

    return updated;
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(PRODUCT_DB_KEY, JSON.stringify(products));
  },

  getSuppliers: (): Supplier[] => {
    const saved = localStorage.getItem(SUPPLIER_DB_KEY);
    if (!saved) {
      localStorage.setItem(SUPPLIER_DB_KEY, JSON.stringify(MOCK_SUPPLIERS));
      return MOCK_SUPPLIERS;
    }
    return JSON.parse(saved);
  },

  saveSuppliers: (suppliers: Supplier[]) => {
    localStorage.setItem(SUPPLIER_DB_KEY, JSON.stringify(suppliers));
  },

  getGlobalNotifications: (): Notification[] => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!saved) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([WELCOME_NOTIFICATION]));
      return [WELCOME_NOTIFICATION];
    }
    return JSON.parse(saved);
  },

  saveGlobalNotification: (notif: Notification) => {
    const current = databaseService.getGlobalNotifications();
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([notif, ...current]));
  },

  updateNotifications: (notifs: Notification[]) => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  },

  getPromoCodes: (): PromoCode[] => {
    const saved = localStorage.getItem(PROMO_CODES_KEY);
    if (!saved) {
      const initial: PromoCode[] = [{ id: 'p1', code: 'NEO10', type: 'PERCENT', value: 10, description: '10% Sector Entry Discount' }];
      localStorage.setItem(PROMO_CODES_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  },

  savePromoCodes: (codes: PromoCode[]) => {
    localStorage.setItem(PROMO_CODES_KEY, JSON.stringify(codes));
  },

  updateUserStatus: (userId: string, status: User['status']) => {
    const users = databaseService.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, status } : u);
    databaseService.saveUsers(updated);
    return updated;
  },

  deleteUser: (userId: string) => {
    const users = databaseService.getUsers();
    const updated = users.filter(u => u.id !== userId);
    databaseService.saveUsers(updated);
    return updated;
  },

  registerSupplier: (supplier: Partial<Supplier>) => {
    const suppliers = databaseService.getSuppliers();
    const newSupplier: Supplier = {
      ...supplier as Supplier,
      id: `sup${Date.now()}`,
      status: 'ACTIVE',
      performanceScore: 50,
      totalRevenueYield: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [...suppliers, newSupplier];
    databaseService.saveSuppliers(updated);
    return updated;
  },

  getWeekId: () => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
  },

  getSocialPosts: (): SocialPost[] => {
    const saved = localStorage.getItem(SOCIAL_POSTS_KEY);
    const currentWeek = databaseService.getWeekId();
    
    let posts: SocialPost[];
    if (!saved) {
      posts = MOCK_POSTS.map(p => ({ ...p, weekId: currentWeek }));
      localStorage.setItem(SOCIAL_POSTS_KEY, JSON.stringify(posts));
    } else {
      posts = JSON.parse(saved);
    }
    
    // Filter out old posts (weekly reset)
    const filtered = posts.filter((p: SocialPost) => p.weekId === currentWeek);
    if (filtered.length !== posts.length) {
      localStorage.setItem(SOCIAL_POSTS_KEY, JSON.stringify(filtered));
    }
    return filtered;
  },

  saveSocialPosts: (posts: SocialPost[]) => {
    localStorage.setItem(SOCIAL_POSTS_KEY, JSON.stringify(posts));
  },

  likePost: (postId: string, userId: string) => {
    const posts = databaseService.getSocialPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const likedBy = post.likedBy || [];
    if (likedBy.includes(userId)) return post;

    const updatedPost = {
      ...post,
      likes: post.likes + 1,
      likedBy: [...likedBy, userId]
    };
    const updatedPosts = posts.map(p => p.id === postId ? updatedPost : p);
    databaseService.saveSocialPosts(updatedPosts);
    return updatedPost;
  },

  lovePost: (postId: string, userId: string) => {
    const posts = databaseService.getSocialPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const lovedBy = post.lovedBy || [];
    if (lovedBy.includes(userId)) return post;

    const updatedPost = {
      ...post,
      loves: post.loves + 1,
      lovedBy: [...lovedBy, userId]
    };
    const updatedPosts = posts.map(p => p.id === postId ? updatedPost : p);
    databaseService.saveSocialPosts(updatedPosts);
    
    // Reward post owner
    databaseService.addRep(post.userId, 25);
    
    return updatedPost;
  },

  getUsersRankedByLoves: (): (User & { totalLoves: number })[] => {
    const users = databaseService.getUsers();
    const posts = databaseService.getSocialPosts();
    
    const usersWithLoves = users.map(user => {
      const userPosts = posts.filter(p => p.userId === user.id);
      const totalLoves = userPosts.reduce((sum, p) => sum + (p.loves || 0), 0);
      return { ...user, totalLoves };
    });
    
    return usersWithLoves.sort((a, b) => b.totalLoves - a.totalLoves);
  },

  getOrders: (): Order[] => {
    const saved = localStorage.getItem(ORDERS_DB_KEY);
    if (!saved) {
      localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(MOCK_ORDERS));
      return MOCK_ORDERS;
    }
    return JSON.parse(saved);
  },

  saveOrders: (orders: Order[]) => {
    localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(orders));
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const orders = databaseService.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    databaseService.saveOrders(updated);
    return updated;
  },

  getFlashSales: (): any[] => {
    const saved = localStorage.getItem(FLASH_SALES_KEY);
    if (!saved) {
      localStorage.setItem(FLASH_SALES_KEY, JSON.stringify(MOCK_FLASH_SALES));
      return MOCK_FLASH_SALES;
    }
    return JSON.parse(saved);
  },

  saveFlashSales: (sales: any[]) => {
    localStorage.setItem(FLASH_SALES_KEY, JSON.stringify(sales));
  },

  getFlashSaleDuration: (): number => {
    const saved = localStorage.getItem(FLASH_SALE_DURATION_KEY);
    return saved ? parseInt(saved) : 2; // Default 2 hours
  },

  saveFlashSaleDuration: (hours: number) => {
    localStorage.setItem(FLASH_SALE_DURATION_KEY, hours.toString());
  },

  getFlashSaleWindow: (): { startTime: number; endTime: number } | null => {
    const saved = localStorage.getItem(FLASH_SALE_WINDOW_KEY);
    if (!saved) return null;
    const window = JSON.parse(saved);
    
    // Check if it's from today
    const now = new Date();
    const windowDate = new Date(window.startTime);
    if (now.toDateString() !== windowDate.toDateString()) {
      return null;
    }
    
    return window;
  },

  initializeFlashSaleWindow: () => {
    const duration = databaseService.getFlashSaleDuration();
    const startTime = Date.now();
    const endTime = startTime + (duration * 60 * 60 * 1000);
    const window = { startTime, endTime };
    localStorage.setItem(FLASH_SALE_WINDOW_KEY, JSON.stringify(window));
    return window;
  },

  getUsersRanked: (): User[] => {
    const users = databaseService.getUsers();
    return [...users].sort((a, b) => b.rep - a.rep);
  },

  getBundles: (): Bundle[] => {
    const saved = localStorage.getItem(BUNDLES_DB_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  },

  saveBundles: (bundles: Bundle[]) => {
    localStorage.setItem(BUNDLES_DB_KEY, JSON.stringify(bundles));
  },

  updateProductHype: (productId: string, hypeScore: number) => {
    const products = databaseService.getProducts();
    const updated = products.map(p => p.id === productId ? { ...p, hypeScore } : p);
    databaseService.saveProducts(updated);
    return updated;
  },

  updateProductHallOfFame: (productId: string, isHallOfFame: boolean) => {
    const products = databaseService.getProducts();
    const updated = products.map(p => p.id === productId ? { ...p, isHallOfFame } : p);
    databaseService.saveProducts(updated);
    return updated;
  },

  getVelocityHeatProducts: (): Product[] => {
    const products = databaseService.getProducts();
    return [...products].sort((a, b) => {
      const scoreA = (a.hypeScore || 0) + (a.velocityScore || 0) + (a.isHallOfFame ? 100 : 0);
      const scoreB = (b.hypeScore || 0) + (b.velocityScore || 0) + (b.isHallOfFame ? 100 : 0);
      return scoreB - scoreA;
    }).slice(0, 10);
  },

  getHallOfFameProducts: (): Product[] => {
    const products = databaseService.getProducts();
    return products.filter(p => p.isHallOfFame);
  },

  sendSupplierNotification: (supplierId: string, title: string, message: string) => {
    databaseService.sendNotification(title, message, 'INFO', supplierId);
  },

  sendNotification: (title: string, message: string, type: Notification['type'] = 'INFO', recipientId?: string) => {
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      recipientId
    };
    const current = databaseService.getGlobalNotifications();
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([notif, ...current]));
    return notif;
  },

  getPayForMeRequests: (): PayForMeRequest[] => {
    const saved = localStorage.getItem(PAY_FOR_ME_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  },

  savePayForMeRequests: (requests: PayForMeRequest[]) => {
    localStorage.setItem(PAY_FOR_ME_KEY, JSON.stringify(requests));
  },

  createPayForMeRequest: (request: Omit<PayForMeRequest, 'id' | 'timestamp' | 'status'>) => {
    const requests = databaseService.getPayForMeRequests();
    const newRequest: PayForMeRequest = {
      ...request,
      id: `pfm_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: PayForMeStatus.PENDING
    };
    const updated = [newRequest, ...requests];
    databaseService.savePayForMeRequests(updated);
    return newRequest;
  },

  updatePayForMeStatus: (requestId: string, status: PayForMeStatus) => {
    const requests = databaseService.getPayForMeRequests();
    const updated = requests.map(r => r.id === requestId ? { ...r, status } : r);
    databaseService.savePayForMeRequests(updated);
    return updated;
  },

  getUserStats: (userId: string): UserStats => {
    const saved = localStorage.getItem(`${USER_STATS_KEY}_${userId}`);
    if (!saved) {
      const initial: UserStats = {
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
      localStorage.setItem(`${USER_STATS_KEY}_${userId}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  },

  saveUserStats: (userId: string, stats: UserStats) => {
    localStorage.setItem(`${USER_STATS_KEY}_${userId}`, JSON.stringify(stats));
  },

  calculateLevel: (rep: number) => {
    return Math.floor(Math.sqrt(rep / 100)) + 1;
  },

  addRep: (userId: string, amount: number) => {
    const users = databaseService.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const oldLevel = databaseService.calculateLevel(user.rep);
    const newRep = user.rep + amount;
    const newLevel = databaseService.calculateLevel(newRep);

    const updatedUser = { ...user, rep: newRep, level: newLevel };
    const updatedUsers = users.map(u => u.id === userId ? updatedUser : u);
    databaseService.saveUsers(updatedUsers);

    if (newLevel > oldLevel) {
      databaseService.sendNotification(
        'Level Up Protocol Initialized',
        `Reputation magnitude increased. You have reached Level ${newLevel}. Access to higher-tier fragments unlocked.`,
        'REWARD',
        userId
      );
    }

    return updatedUser;
  },

  updateAchievementProgress: (userId: string, achievementId: string, progress: number) => {
    const stats = databaseService.getUserStats(userId);
    const achievement = stats.achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      const newProgress = Math.min(achievement.goal, achievement.progress + progress);
      const isUnlocked = newProgress >= achievement.goal;
      
      const updatedAchievements = stats.achievements.map(a => 
        a.id === achievementId ? { ...a, progress: newProgress, unlocked: isUnlocked } : a
      );
      
      databaseService.saveUserStats(userId, { ...stats, achievements: updatedAchievements });
      
      if (isUnlocked) {
        databaseService.addRep(userId, achievement.rewardREP);
        databaseService.sendNotification(
          'Milestone Achieved',
          `Protocol "${achievement.title}" completed. +${achievement.rewardREP} REP awarded.`,
          'REWARD',
          userId
        );
      }
    }
  }
};
