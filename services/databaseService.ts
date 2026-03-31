import { Product, User, Supplier, Notification, PromoCode, Order, OrderStatus, Bundle, PayForMeRequest, PayForMeStatus, UserStats, UserPreferences, UserHistory, UserPost, SocialComment, SocialInteraction, Withdrawal } from '../types';

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
  return { success: true, message: text };
};

export const databaseService = {
  // --- AUTH ---
  checkAuth: async (token: string) => {
    const response = await fetch(`${API_BASE}/auth/check`, {
      headers: { 'Authorization': token }
    });
    return await handleResponse(response);
  },

  login: async (data: any) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  },

  signup: async (data: any) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  },

  logout: async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    localStorage.removeItem('cc-auth-token');
    localStorage.removeItem('cc-user-id');
    localStorage.removeItem('cc-user-handle');
  },

  // --- USERS ---
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/users`);
    return await handleResponse(response);
  },

  updateUserStatus: async (userId: string, status: User['status']) => {
    const response = await fetch(`${API_BASE}/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await handleResponse(response);
  },

  deleteUser: async (userId: string) => {
    const response = await fetch(`${API_BASE}/users/${userId}`, { method: 'DELETE' });
    return await handleResponse(response);
  },

  getUsersRanked: async (): Promise<User[]> => {
    const users = await databaseService.getUsers();
    return [...users].sort((a, b) => b.rep - a.rep);
  },

  addRep: async (userId: string, amount: number) => {
    const response = await fetch(`${API_BASE}/users/${userId}/rep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    return await handleResponse(response);
  },

  calculateLevel: (rep: number) => {
    return Math.floor(Math.sqrt(rep / 100)) + 1;
  },

  // --- PRODUCTS ---
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/products`);
    return await handleResponse(response);
  },

  saveProduct: async (product: Partial<Product>) => {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await handleResponse(response);
  },

  saveProducts: async (products: Product[]) => {
    for (const product of products) {
      await databaseService.saveProduct(product);
    }
  },

  updateProductHype: async (productId: string, hypeScore: number) => {
    const response = await fetch(`${API_BASE}/products/${productId}/hype`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hypeScore })
    });
    return await handleResponse(response);
  },

  updateProductHallOfFame: async (productId: string, isHallOfFame: boolean) => {
    const response = await fetch(`${API_BASE}/products/${productId}/hall-of-fame`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isHallOfFame })
    });
    return await handleResponse(response);
  },

  getVelocityHeatProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/products/velocity-heat`);
    return await handleResponse(response);
  },

  getHallOfFameProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/products/hall-of-fame`);
    return await handleResponse(response);
  },

  // --- SUPPLIERS ---
  getSuppliers: async (): Promise<Supplier[]> => {
    const response = await fetch(`${API_BASE}/suppliers`);
    return await handleResponse(response);
  },

  getSupplierById: async (id: string): Promise<Supplier | null> => {
    const response = await fetch(`${API_BASE}/suppliers/${id}`);
    return await handleResponse(response);
  },

  registerSupplier: async (supplier: Partial<Supplier>) => {
    const response = await fetch(`${API_BASE}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier)
    });
    return await handleResponse(response);
  },

  getSupplierProducts: async (supplierId: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/products?supplierId=${supplierId}`);
    return await handleResponse(response);
  },

  getSupplierOrders: async (supplierId: string): Promise<Order[]> => {
    const response = await fetch(`${API_BASE}/orders?supplierId=${supplierId}`);
    return await handleResponse(response);
  },

  getSupplierAnomalies: async (supplierId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE}/price-anomalies?supplierId=${supplierId}`);
    return await handleResponse(response);
  },

  saveSuppliers: async (suppliers: Supplier[]) => {
    for (const supplier of suppliers) {
      await fetch(`${API_BASE}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
    }
  },

  deleteSupplier: async (id: string) => {
    const response = await fetch(`${API_BASE}/suppliers/${id}`, { method: 'DELETE' });
    return await handleResponse(response);
  },

  updateSupplierCommission: async (supplierId: string, commissionRate: number) => {
    const response = await fetch(`${API_BASE}/suppliers/${supplierId}/commission`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commissionRate })
    });
    return await handleResponse(response);
  },

  // --- WALLETS ---
  getWallet: async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE}/wallets/${id}`);
    return await handleResponse(response);
  },

  requestPayout: async (id: string, amount: number, description: string) => {
    const response = await fetch(`${API_BASE}/wallets/${id}/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description })
    });
    return await handleResponse(response);
  },

  getBanks: async () => {
    const response = await fetch(`${API_BASE}/paystack/banks`);
    return await handleResponse(response);
  },

  resolveAccount: async (accountNumber: string, bankCode: string) => {
    const response = await fetch(`${API_BASE}/paystack/resolve-account?account_number=${accountNumber}&bank_code=${bankCode}`);
    return await handleResponse(response);
  },

  withdrawFunds: async (data: { userId: string; amount: number; bankCode: string; bankName: string; accountNumber: string; accountName: string }) => {
    const response = await fetch(`${API_BASE}/paystack/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  },

  getWithdrawals: async (userId: string): Promise<Withdrawal[]> => {
    const response = await fetch(`${API_BASE}/paystack/withdrawals/${userId}`);
    return await handleResponse(response);
  },

  verifyTransfer: async (reference: string) => {
    const response = await fetch(`${API_BASE}/paystack/transfer/verify/${reference}`);
    return await handleResponse(response);
  },

  initializePaystackTransaction: async (email: string, amount: number, metadata: any) => {
    const response = await fetch(`${API_BASE}/paystack/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, metadata })
    });
    return await handleResponse(response);
  },

  verifyPaystackTransaction: async (reference: string) => {
    const response = await fetch(`${API_BASE}/paystack/verify/${reference}`);
    return await handleResponse(response);
  },

  // --- QUIZ ---
  saveQuizResults: async (userId: string, results: any) => {
    const response = await fetch(`${API_BASE}/quiz/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, results })
    });
    return await handleResponse(response);
  },

  getQuizResults: async (userId: string) => {
    const response = await fetch(`${API_BASE}/quiz/results/${userId}`);
    return await handleResponse(response);
  },

  // --- LOYALTY ---
  getLoyaltyPoints: async (userId: string): Promise<number> => {
    const response = await fetch(`${API_BASE}/loyalty/points/${userId}`);
    const data = await handleResponse(response);
    return data.points;
  },

  earnLoyaltyPoints: async (userId: string, amount: number, reason: string) => {
    const response = await fetch(`${API_BASE}/loyalty/earn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, reason })
    });
    return await handleResponse(response);
  },

  redeemLoyaltyPoints: async (userId: string, amount: number, reason: string) => {
    const response = await fetch(`${API_BASE}/loyalty/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, reason })
    });
    return await handleResponse(response);
  },

  getLoyaltyTransactions: async (userId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE}/loyalty/transactions/${userId}`);
    return await handleResponse(response);
  },

  // --- NOTIFICATIONS ---
  getGlobalNotifications: async (): Promise<Notification[]> => {
    const response = await fetch(`${API_BASE}/notifications`);
    return await handleResponse(response);
  },

  saveGlobalNotification: async (notif: Notification) => {
    const response = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif)
    });
    return await handleResponse(response);
  },

  updateNotifications: async (notifs: Notification[]) => {
    for (const notif of notifs) {
      await fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      });
    }
  },

  sendSupplierNotification: async (supplierId: string, title: string, message: string) => {
    const response = await fetch(`${API_BASE}/notifications/supplier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplierId, title, message })
    });
    return await handleResponse(response);
  },

  sendNotification: async (title: string, message: string, type: Notification['type'] = 'INFO', recipientId?: string) => {
    const response = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message, type, recipientId })
    });
    return await handleResponse(response);
  },

  // --- PROMO CODES ---
  getPromoCodes: async (): Promise<PromoCode[]> => {
    const response = await fetch(`${API_BASE}/promo-codes`);
    return await handleResponse(response);
  },

  savePromoCodes: async (codes: PromoCode[]) => {
    for (const code of codes) {
      await fetch(`${API_BASE}/promo-codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(code)
      });
    }
  },

  deletePromoCode: async (id: string) => {
    const response = await fetch(`${API_BASE}/promo-codes/${id}`, { method: 'DELETE' });
    return await handleResponse(response);
  },

  // --- ORDERS ---
  getOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE}/orders`);
    return await handleResponse(response);
  },

  saveOrders: async (orders: Order[]) => {
    for (const order of orders) {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    }
  },

  createOrder: async (order: any) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return await handleResponse(response);
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber })
    });
    return await handleResponse(response);
  },

  // --- PRICE ANOMALIES ---
  getPriceAnomalies: async (userId?: string, supplierId?: string): Promise<any[]> => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (supplierId) params.append('supplierId', supplierId);
    const response = await fetch(`${API_BASE}/price-anomalies?${params.toString()}`);
    return await handleResponse(response);
  },

  createPriceAnomaly: async (anomaly: any) => {
    const response = await fetch(`${API_BASE}/price-anomalies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anomaly)
    });
    return await handleResponse(response);
  },

  deletePriceAnomaly: async (id: string) => {
    const response = await fetch(`${API_BASE}/price-anomalies/${id}`, { method: 'DELETE' });
    return await handleResponse(response);
  },

  getAnomalyConfig: async () => {
    const response = await fetch(`${API_BASE}/admin/anomaly-config`);
    return await handleResponse(response);
  },

  saveAnomalyConfig: async (config: { duration: number; productIds: string[]; discount: number }) => {
    const response = await fetch(`${API_BASE}/admin/anomaly-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await handleResponse(response);
  },

  getUserAnomalySession: async (userId: string) => {
    const response = await fetch(`${API_BASE}/user/anomaly-session/${userId}`);
    return await handleResponse(response);
  },

  startUserAnomalySession: async (userId: string) => {
    const response = await fetch(`${API_BASE}/user/anomaly-session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await handleResponse(response);
  },

  savePriceAnomalies: async (anomalies: any[]) => {
    for (const anomaly of anomalies) {
      await fetch(`${API_BASE}/price-anomalies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anomaly)
      });
    }
  },

  getPriceAnomalyDuration: async (): Promise<number> => {
    const response = await fetch(`${API_BASE}/settings/price_anomaly_duration`);
    return await handleResponse(response);
  },

  savePriceAnomalyDuration: async (hours: number) => {
    const response = await fetch(`${API_BASE}/settings/price_anomaly_duration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hours)
    });
    return await handleResponse(response);
  },

  getPriceAnomalyWindow: async (): Promise<{ startTime: number; endTime: number } | null> => {
    const response = await fetch(`${API_BASE}/settings/price_anomaly_window`);
    return await handleResponse(response);
  },

  initializePriceAnomalyWindow: async () => {
    const duration = await databaseService.getPriceAnomalyDuration();
    const startTime = Date.now();
    const endTime = startTime + (duration * 60 * 60 * 1000);
    const window = { startTime, endTime };
    const response = await fetch(`${API_BASE}/settings/price_anomaly_window`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(window)
    });
    await handleResponse(response);
    return window;
  },

  // --- BUNDLES ---
  getBundles: async (): Promise<Bundle[]> => {
    const response = await fetch(`${API_BASE}/bundles`);
    return await handleResponse(response);
  },

  saveBundles: async (bundles: Bundle[]) => {
    for (const bundle of bundles) {
      await fetch(`${API_BASE}/bundles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundle)
      });
    }
  },

  deleteBundle: async (id: string) => {
    const response = await fetch(`${API_BASE}/bundles/${id}`, { method: 'DELETE' });
    return await handleResponse(response);
  },

  // --- DROPS ---
  getDrops: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE}/drops`);
    return await handleResponse(response);
  },

  createDrop: async (drop: any) => {
    const response = await fetch(`${API_BASE}/drops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drop)
    });
    return await handleResponse(response);
  },

  deleteDrop: async (id: string) => {
    const response = await fetch(`${API_BASE}/drops/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  },

  // --- PAY FOR ME ---
  getPayForMeRequests: async (): Promise<PayForMeRequest[]> => {
    const response = await fetch(`${API_BASE}/pay-for-me`);
    return await handleResponse(response);
  },

  savePayForMeRequests: async (requests: PayForMeRequest[]) => {
    for (const request of requests) {
      await fetch(`${API_BASE}/pay-for-me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
    }
  },

  createPayForMeRequest: async (request: Omit<PayForMeRequest, 'id' | 'timestamp' | 'status'>) => {
    const response = await fetch(`${API_BASE}/pay-for-me`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return await handleResponse(response);
  },

  updatePayForMeStatus: async (requestId: string, status: PayForMeStatus) => {
    const response = await fetch(`${API_BASE}/pay-for-me/${requestId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await handleResponse(response);
  },

  // --- SOCIAL ---
  getSocialPosts: async (): Promise<UserPost[]> => {
    const response = await fetch(`${API_BASE}/social-posts`);
    return await handleResponse(response);
  },

  interactWithPost: async (postId: string, userId: string, type: 'LIKE' | 'DISLIKE'): Promise<UserPost> => {
    const response = await fetch(`${API_BASE}/social-posts/${postId}/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type })
    });
    return await handleResponse(response);
  },

  getPostComments: async (postId: string): Promise<SocialComment[]> => {
    const response = await fetch(`${API_BASE}/social-posts/${postId}/comments`);
    return await handleResponse(response);
  },

  addPostComment: async (postId: string, userId: string, userHandle: string, text: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE}/social-posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userHandle, text })
    });
    const result = await handleResponse(response);
    return result.success;
  },

  reportPost: async (postId: string, userId: string, reason: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE}/social-posts/${postId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason })
    });
    const result = await handleResponse(response);
    return result.success;
  },

  getUserInteractions: async (userId: string): Promise<SocialInteraction[]> => {
    const response = await fetch(`${API_BASE}/social-interactions/${userId}`);
    return await handleResponse(response);
  },

  saveSocialPosts: async (posts: any[]) => {
    for (const post of posts) {
      await fetch(`${API_BASE}/social-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
    }
  },

  // --- STATS & PREFERENCES ---
  updateAchievementProgress: async (userId: string, achievementId: string, progress: number) => {
    const response = await fetch(`${API_BASE}/user-stats/${userId}/achievements/${achievementId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress })
    });
    return await handleResponse(response);
  },

  getUserStats: async (userId: string): Promise<UserStats> => {
    const response = await fetch(`${API_BASE}/user-stats/${userId}`);
    return await handleResponse(response);
  },

  updateUserStats: async (userId: string, stats: UserStats) => {
    const response = await fetch(`${API_BASE}/user-stats/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    return await handleResponse(response);
  },

  getUserPreferences: async (userId: string): Promise<UserPreferences | null> => {
    const response = await fetch(`${API_BASE}/user-preferences/${userId}`);
    return await handleResponse(response);
  },

  saveUserPreferences: async (userId: string, prefs: UserPreferences) => {
    const response = await fetch(`${API_BASE}/user-preferences/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs)
    });
    return await handleResponse(response);
  },

  getUserHistory: async (userId: string): Promise<UserHistory> => {
    const response = await fetch(`${API_BASE}/user-history/${userId}`);
    return await handleResponse(response);
  },

  saveUserHistory: async (userId: string, history: UserHistory) => {
    const response = await fetch(`${API_BASE}/user-history/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(history)
    });
    return await handleResponse(response);
  },

  // --- RECOMMENDATIONS ---
  getRecommendations: async (userId: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/recommendations/${userId}`);
    return await handleResponse(response);
  },

  trackAction: async (userId: string, productId: string, action: 'view' | 'wishlist' | 'purchase') => {
    const response = await fetch(`${API_BASE}/user-history/${userId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, action })
    });
    return await handleResponse(response);
  },

  // --- ADMIN ---
  getAdminMetrics: async () => {
    const response = await fetch(`${API_BASE}/admin/metrics`);
    return await handleResponse(response);
  },

  getSecurityStatus: async () => {
    const response = await fetch(`${API_BASE}/admin/security`);
    return await handleResponse(response);
  },

  logSecurityEvent: async (event: any) => {
    const response = await fetch(`${ADMIN_API_BASE}/security-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    return await handleResponse(response);
  },

  getJackpotPrizes: async () => {
    const response = await fetch(`${API_BASE}/admin/jackpot`);
    return await handleResponse(response);
  },

  // --- USER PANEL ---
  getUserProfile: async (userId: string) => {
    const response = await fetch(`${API_BASE}/user/profile/${userId}`);
    return await handleResponse(response);
  },

  updateUserProfile: async (userId: string, data: any) => {
    const response = await fetch(`${API_BASE}/user/profile/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  },

  getWishlist: async (userId: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE}/user/wishlist/${userId}`);
    return await handleResponse(response);
  },

  addToWishlist: async (userId: string, productId: string) => {
    const response = await fetch(`${API_BASE}/user/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId })
    });
    return await handleResponse(response);
  },

  removeFromWishlist: async (userId: string, productId: string) => {
    const response = await fetch(`${API_BASE}/user/wishlist/${userId}/${productId}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  },

  getCart: async (userId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE}/user/cart/${userId}`);
    return await handleResponse(response);
  },

  addToCart: async (userId: string, item: any) => {
    const response = await fetch(`${API_BASE}/user/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...item })
    });
    return await handleResponse(response);
  },

  updateCartItem: async (userId: string, item: any) => {
    const response = await fetch(`${API_BASE}/user/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...item })
    });
    return await handleResponse(response);
  },

  removeFromCart: async (userId: string, productId: string, size: string, color: string) => {
    const response = await fetch(`${API_BASE}/user/cart/${userId}/${productId}/${size || 'none'}/${color || 'none'}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  },

  logMysteryBoxOpening: async (data: any) => {
    const response = await fetch(`${API_BASE}/user/mystery-box/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  },

  getMysteryBoxHistory: async (userId: string) => {
    const response = await fetch(`${API_BASE}/user/mystery-box/history/${userId}`);
    return await handleResponse(response);
  },

  saveGameScore: async (userId: string, gameType: string, score: number, details: any) => {
    const response = await fetch(`${API_BASE}/user/game-scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, gameId: gameType, score, details })
    });
    return await handleResponse(response);
  },

  getGameScores: async (userId: string) => {
    const response = await fetch(`${API_BASE}/user/game-scores/${userId}`);
    return await handleResponse(response);
  },

  saveStylistSession: async (data: any) => {
    const response = await fetch(`${API_BASE}/user/stylist-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  },

  getStylistSessions: async (userId: string) => {
    const response = await fetch(`${API_BASE}/user/stylist-sessions/${userId}`);
    return await handleResponse(response);
  },

  saveTryOn: async (data: any) => {
    const response = await fetch(`${API_BASE}/user/try-on`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  },

  getTryOnHistory: async (userId: string) => {
    const response = await fetch(`${API_BASE}/user/try-on/${userId}`);
    return await handleResponse(response);
  },

  // --- UPLOADS ---
  uploadProductImage: async (file: File, productName: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', productName);
    const response = await fetch(`${API_BASE}/upload/product`, {
      method: 'POST',
      body: formData
    });
    return await handleResponse(response);
  },

  uploadFeedImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_BASE}/upload/feed`, {
      method: 'POST',
      body: formData
    });
    return await handleResponse(response);
  },

  // --- UTILS ---
  getWeekId: () => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
  },
};
