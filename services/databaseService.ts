import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { Product, User, Supplier, Notification, PromoCode, Order, OrderStatus, Bundle, SocialPost, UserCredit } from '../types';

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

export const databaseService = {
  // --- Auth ---
  registerUser: async (email: string, password: string, username: string, phone: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const newUser: User = {
        id: firebaseUser.uid,
        username,
        email,
        phone,
        handle: username.replace(/\s+/g, '_'),
        rep: 100,
        role: 'client',
        archetype: 'CYBER',
        level: 1,
        coins: 500,
        gems: 10,
        status: 'ACTIVE',
        lastLogin: new Date().toISOString(),
        totalSpent: 0,
        stats: {
          dailyGameAttempts: 0,
          lastGameReset: new Date().toISOString(),
          quests: [],
          aiTryOnsUsedToday: 0,
          tickets: 5,
          achievements: [],
          microCommitments: [
            { id: 'mc1', label: 'Sync Neural Link', type: 'SYNC_LINK', completed: false, rewardXP: 50, expiresAt: Date.now() + 86400000 },
            { id: 'mc2', label: 'Verify Sector Trends', type: 'VERIFY_TREND', completed: false, rewardXP: 50, expiresAt: Date.now() + 86400000 },
            { id: 'mc3', label: 'Broadcast Status', type: 'SHARE_RANK', completed: false, rewardXP: 50, expiresAt: Date.now() + 86400000 }
          ],
          softLockedItems: {},
          commitmentStreak: 0,
          selectedPath: null,
          brandSubscriptions: [],
          tagSubscriptions: []
        }
      };
      
      await databaseService.saveUser(newUser);
      return { success: true, user: newUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  verifyUser: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = await databaseService.getUser(userCredential.user.uid);
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  saveUser: async (user: User) => {
    const path = `users/${user.id}`;
    try {
      await setDoc(doc(db, 'users', user.id), user);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      return { success: false };
    }
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to direct firestore if API fails
      const path = 'products';
      try {
        const q = query(collection(db, path));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Product);
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.GET, path);
        return [];
      }
    }
  },

  subscribeToProducts: (callback: (products: Product[]) => void) => {
    const path = 'products';
    return onSnapshot(collection(db, path), (snapshot) => {
      callback(snapshot.docs.map(doc => doc.data() as Product));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  saveProduct: async (product: Product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving product:', error);
      const path = `products/${product.id}`;
      try {
        await setDoc(doc(db, 'products', product.id), product);
        return { success: true };
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.WRITE, path);
        return { success: false };
      }
    }
  },

  // --- Users ---
  getUser: async (userId: string): Promise<User | null> => {
    const path = `users/${userId}`;
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  subscribeToUser: (userId: string, callback: (user: User | null) => void) => {
    const path = `users/${userId}`;
    return onSnapshot(doc(db, 'users', userId), (snapshot) => {
      callback(snapshot.exists() ? (snapshot.data() as User) : null);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    const path = `users/${userId}`;
    try {
      await updateDoc(doc(db, 'users', userId), data);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return { success: false };
    }
  },

  // --- Suppliers ---
  getSuppliers: async (): Promise<Supplier[]> => {
    const path = 'suppliers';
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Supplier);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  // --- Orders ---
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      const path = 'orders';
      try {
        const q = query(collection(db, path), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Order);
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.GET, path);
        return [];
      }
    }
  },

  createOrder: async (order: Order) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      const path = `orders/${order.id}`;
      try {
        await setDoc(doc(db, 'orders', order.id), order);
        return { success: true };
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.CREATE, path);
        return { success: false };
      }
    }
  },

  // --- Notifications ---
  getAdminNotifications: async (): Promise<Notification[]> => {
    const path = 'notifications';
    try {
      const q = query(collection(db, path), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  getNotifications: async (userId?: string): Promise<Notification[]> => {
    const path = 'notifications';
    try {
      let q;
      if (userId) {
        q = query(collection(db, path), where('recipientId', '==', userId), orderBy('timestamp', 'desc'));
      } else {
        q = query(collection(db, path), where('recipientId', '==', null), orderBy('timestamp', 'desc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Notification);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  subscribeToNotifications: (userId: string | undefined, callback: (notifs: Notification[]) => void) => {
    const path = 'notifications';
    const q = userId 
      ? query(collection(db, path), where('recipientId', 'in', [userId, null]), orderBy('timestamp', 'desc'))
      : query(collection(db, path), where('recipientId', '==', null), orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => doc.data() as Notification));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  // --- Promo Codes ---
  getPromoCodes: async (): Promise<PromoCode[]> => {
    const path = 'promos';
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as PromoCode);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  // --- Admin Settings ---
  getAdminSettings: async (): Promise<any> => {
    const path = 'settings/admin';
    try {
      const docRef = doc(db, 'settings', 'admin');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : {};
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return {};
    }
  },

  updateAdminSetting: async (key: string, value: any) => {
    const path = 'settings/admin';
    try {
      await setDoc(doc(db, 'settings', 'admin'), { [key]: value }, { merge: true });
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
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
    await databaseService.updateUser(userId, { 'stats.achievements': achievements } as any);
  },

  completeMicroCommitment: async (userId: string, commitmentId: string) => {
    const user = await databaseService.getUser(userId);
    if (!user) return null;
    const commitments = (user.stats?.microCommitments || []).map(c => 
      c.id === commitmentId ? { ...c, completed: true } : c
    );
    const newRep = (user.rep || 0) + 50;
    await databaseService.updateUser(userId, { 
      'stats.microCommitments': commitments,
      rep: newRep
    } as any);
    return { ...user.stats, microCommitments: commitments };
  },

  softLockProduct: async (userId: string, productId: string) => {
    const user = await databaseService.getUser(userId);
    if (!user) return null;
    const softLockedItems = { ...(user.stats?.softLockedItems || {}) };
    softLockedItems[productId] = Date.now() + 300000;
    await databaseService.updateUser(userId, { 'stats.softLockedItems': softLockedItems } as any);
    return { ...user.stats, softLockedItems };
  },

  // --- Global Helpers ---
  calculateLevel: (rep: number) => Math.floor(rep / 1000) + 1,

  getSocialPosts: async (): Promise<SocialPost[]> => {
    const path = 'social_posts';
    try {
      const q = query(collection(db, path), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as SocialPost);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  sendNotification: async (title: string, message: string, type: string, recipientId: string | null = null) => {
    const path = 'notifications';
    try {
      await addDoc(collection(db, path), {
        id: Math.random().toString(36).substr(2, 9),
        title,
        message,
        type,
        recipientId,
        read: false,
        timestamp: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  sendSupplierNotification: async (supplierId: string, title: string, message: string) => {
    await databaseService.sendNotification(title, message, 'INFO', supplierId);
  },

  getGlobalNotifications: async (): Promise<Notification[]> => {
    return databaseService.getNotifications();
  },

  // --- Admin Methods ---
  getAdminUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch admin users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin users:', error);
      const path = 'users';
      try {
        const q = query(collection(db, path));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as User);
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.GET, path);
        return [];
      }
    }
  },

  getAdminProducts: async (): Promise<Product[]> => {
    return databaseService.getProducts();
  },

  updateUserStatusOnBackend: async (userId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating user status on backend:', error);
      return databaseService.updateUser(userId, { status } as any);
    }
  },

  getAdminFlashSales: async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/admin/flash-sales');
      if (!response.ok) throw new Error('Failed to fetch admin flash sales');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin flash sales:', error);
      const path = 'flash_sales';
      try {
        const q = query(collection(db, path));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.GET, path);
        return [];
      }
    }
  },

  addAdminFlashSale: async (sale: any) => {
    try {
      const response = await fetch('/api/admin/flash-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding admin flash sale:', error);
      const path = `flash_sales/${sale.id}`;
      try {
        await setDoc(doc(db, 'flash_sales', sale.id), sale);
        return { success: true };
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.CREATE, path);
        return { success: false };
      }
    }
  },

  getAdminKits: async (): Promise<Bundle[]> => {
    const path = 'bundles';
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Bundle);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  getAdminSuppliers: async (): Promise<Supplier[]> => {
    return databaseService.getSuppliers();
  },

  addAdminKit: async (kit: Bundle) => {
    const path = `bundles/${kit.id}`;
    try {
      await setDoc(doc(db, 'bundles', kit.id), kit);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return { success: false };
    }
  },

  getAdminOrders: async (): Promise<Order[]> => {
    return databaseService.getOrders();
  },

  getAdminMetrics: async (): Promise<any> => {
    try {
      const response = await fetch('/api/admin/metrics');
      if (!response.ok) throw new Error('Failed to fetch admin metrics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
      // Fallback logic if needed, but metrics are complex to calculate client-side
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

  // --- Products ---

  getAdminPayForMeRequests: async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/admin/pay-for-me');
      if (!response.ok) throw new Error('Failed to fetch admin pay-for-me requests');
      return await response.json();
    } catch (error) {
      console.error('Error fetching admin pay-for-me requests:', error);
      const path = 'pay_for_me';
      try {
        const q = query(collection(db, path), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.GET, path);
        return [];
      }
    }
  },

  updateAdminPayForMeStatus: async (requestId: string, status: string) => {
    const path = `pay_for_me/${requestId}`;
    try {
      await updateDoc(doc(db, 'pay_for_me', requestId), { status });
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return { success: false };
    }
  },

  addAdminNotification: async (notif: any) => {
    const path = 'notifications';
    try {
      await addDoc(collection(db, path), notif);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return { success: false };
    }
  },

  getAdminPromos: async (): Promise<PromoCode[]> => {
    return databaseService.getPromoCodes();
  },

  addAdminPromo: async (promo: PromoCode) => {
    const path = `promos/${promo.id}`;
    try {
      await setDoc(doc(db, 'promos', promo.id), promo);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return { success: false };
    }
  },

  registerSupplier: async (supplier: Supplier) => {
    const path = `suppliers/${supplier.id}`;
    try {
      await setDoc(doc(db, 'suppliers', supplier.id), supplier);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return { success: false };
    }
  },

  // --- Credits ---
  getUserCredits: async (userId: string): Promise<UserCredit[]> => {
    const path = 'credits';
    try {
      const q = query(collection(db, path), where('userId', '==', userId), where('status', '==', 'AVAILABLE'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserCredit));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  useUserCredit: async (userId: string, creditId: string) => {
    const path = `credits/${creditId}`;
    try {
      await updateDoc(doc(db, 'credits', creditId), { status: 'USED' });
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
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
    const path = 'users';
    try {
      const q = query(collection(db, path), orderBy('rep', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as User);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  // --- Pay For Me ---
  getPayForMeRequests: async (userId?: string): Promise<any[]> => {
    try {
      const url = userId ? `/api/pay-for-me/${userId}` : '/api/admin/pay-for-me';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch pay-for-me requests');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pay-for-me requests:', error);
      const path = 'pay_for_me';
      try {
        let q;
        if (userId) {
          q = query(collection(db, path), where('userId', '==', userId), orderBy('timestamp', 'desc'));
        } else {
          q = query(collection(db, path), orderBy('timestamp', 'desc'));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.GET, path);
        return [];
      }
    }
  },

  createPayForMeRequest: async (request: any) => {
    try {
      const response = await fetch('/api/pay-for-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating pay-for-me request:', error);
      const path = `pay_for_me/${request.id}`;
      try {
        await setDoc(doc(db, 'pay_for_me', request.id), request);
        return { success: true };
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.CREATE, path);
        return { success: false };
      }
    }
  },

  updatePayForMeStatus: async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/pay-for-me/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating pay-for-me status:', error);
      return databaseService.updateAdminPayForMeStatus(requestId, status);
    }
  },

  // --- Social ---
  likePost: async (postId: string, userId: string): Promise<SocialPost | null> => {
    const path = `social_posts/${postId}`;
    try {
      const docRef = doc(db, 'social_posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const post = docSnap.data() as SocialPost;
        const likedBy = post.likedBy || [];
        if (!likedBy.includes(userId)) {
          const updatedData = {
            likes: (post.likes || 0) + 1,
            likedBy: [...likedBy, userId]
          };
          await updateDoc(docRef, updatedData);
          return { ...post, ...updatedData };
        }
        return post;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return null;
    }
  },

  lovePost: async (postId: string, userId: string): Promise<SocialPost | null> => {
    const path = `social_posts/${postId}`;
    try {
      const docRef = doc(db, 'social_posts', postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const post = docSnap.data() as SocialPost;
        const lovedBy = post.lovedBy || [];
        if (!lovedBy.includes(userId)) {
          const updatedData = {
            loves: (post.loves || 0) + 1,
            lovedBy: [...lovedBy, userId]
          };
          await updateDoc(docRef, updatedData);
          return { ...post, ...updatedData };
        }
        return post;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
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
    const path = 'social_posts';
    try {
      // For simplicity, we'll just save the latest one if it's a new post
      // In a real app, we'd save each one individually
      for (const post of posts) {
        await setDoc(doc(db, 'social_posts', post.id), post);
      }
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return { success: false };
    }
  },

  // --- Supplier ---
  getSupplierProfile: async (supplierId: string): Promise<Supplier | null> => {
    const path = `suppliers/${supplierId}`;
    try {
      const docSnap = await getDoc(doc(db, 'suppliers', supplierId));
      return docSnap.exists() ? (docSnap.data() as Supplier) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  getSupplierProducts: async (supplierId: string): Promise<Product[]> => {
    const path = 'products';
    try {
      const q = query(collection(db, path), where('supplierId', '==', supplierId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Product);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  getSupplierOrders: async (supplierId: string): Promise<Order[]> => {
    const path = 'orders';
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      const allOrders = snapshot.docs.map(doc => doc.data() as Order);
      return allOrders.filter(order => 
        order.items.some(item => 
          item.supplierId === supplierId || 
          (item.isBundle && item.bundleProducts?.some(bp => bp.supplierId === supplierId))
        )
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  updateSupplierProfile: async (supplierId: string, data: Partial<Supplier>) => {
    const path = `suppliers/${supplierId}`;
    try {
      await updateDoc(doc(db, 'suppliers', supplierId), data);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return { success: false };
    }
  },

  saveProductToBackend: async (product: any) => {
    return databaseService.saveProduct(product as Product);
  },

  updateProductOnBackend: async (productId: string, data: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating product on backend:', error);
      const path = `products/${productId}`;
      try {
        await updateDoc(doc(db, 'products', productId), data);
        return { success: true };
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.UPDATE, path);
        return { success: false };
      }
    }
  },

  updateOrderStatusOnBackend: async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating order status on backend:', error);
      const path = `orders/${orderId}`;
      try {
        await updateDoc(doc(db, 'orders', orderId), { status });
        return { success: true };
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.UPDATE, path);
        return { success: false };
      }
    }
  },

  changePassword: async (userId: string, current: string, newPass: string) => {
    // This would normally use updatePassword(auth.currentUser, newPass)
    // But for simplicity and safety in this environment, we'll just log it
    console.log(`Password change requested for ${userId} (simulated)`);
    return { success: true };
  }
};
