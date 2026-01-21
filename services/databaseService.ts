
import { Product, User, Supplier } from '../types';
import { EXTENDED_PRODUCTS } from '../mockData';

const USER_DB_KEY = 'cc_admin_user_db';
const PRODUCT_DB_KEY = 'cc_admin_product_db';
const SUPPLIER_DB_KEY = 'cc_admin_supplier_db';
const ADMIN_AUTH_KEY = 'cc_admin_auth_creds';

const MOCK_USERS: User[] = [
  { id: 'u1', handle: 'Viper_X', email: 'viper@archivers.net', archetype: 'CYBER', xp: 4500, coins: 1200, gems: 45, status: 'ACTIVE', lastLogin: '2h ago', totalSpent: 850 },
  { id: 'u2', handle: 'Ghost_Shell', email: 'ghost@void.com', archetype: 'VOID', xp: 8900, coins: 5400, gems: 120, status: 'ACTIVE', lastLogin: '15m ago', totalSpent: 2400 },
  { id: 'u3', handle: 'Luxe_Lord', email: 'lord@heirloom.io', archetype: 'LUXE', xp: 12000, coins: 8900, gems: 300, status: 'ACTIVE', lastLogin: '5d ago', totalSpent: 12500 },
  { id: 'u4', handle: 'Glitch_Boi', email: 'glitch@chaos.org', archetype: 'CYBER', xp: 1200, coins: 400, gems: 5, status: 'BANNED', lastLogin: '1y ago', totalSpent: 0 },
];

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'CyberKnit Industries', contactEmail: 'ops@cyberknit.nt', region: 'Neo Tokyo Central', status: 'ACTIVE', performanceScore: 94, totalRevenueYield: 450000, joinedDate: '2024-01-12' },
  { id: 'sup2', name: 'Void Loom Textiles', contactEmail: 'archive@voidloom.de', region: 'Neo Berlin', status: 'ACTIVE', performanceScore: 82, totalRevenueYield: 280000, joinedDate: '2024-03-05' },
  { id: 'sup3', name: 'Ethereal Silks', contactEmail: 'luxury@ethereal.sh', region: 'Emerald Heights', status: 'RESTRICTED', performanceScore: 45, totalRevenueYield: 120000, joinedDate: '2024-06-20' },
];

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
    if (!saved) {
      const seeded = EXTENDED_PRODUCTS.map((p, i) => ({
        ...p,
        supplierId: i % 2 === 0 ? 'sup1' : 'sup2'
      }));
      localStorage.setItem(PRODUCT_DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(saved);
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
  }
};
