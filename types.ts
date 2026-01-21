
export type Category = 'All' | 'Apparel' | 'Accessories' | 'Home' | 'Beauty';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: Category;
  description: string;
  details: string[];
  inStock: boolean;
  isNew?: boolean;
  viewers: number;
  stockCount: number;
  hypeScore: number;
  velocityScore: number; // Calculated: (Sales/TotalUsers) / (Stock/TimeToSoldOut)
  synergyPath?: string;
  tags?: string[];
  supplierId?: string; // Link to supplier
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  region: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'RESTRICTED';
  performanceScore: number; // 0-100
  totalRevenueYield: number;
  joinedDate: string;
}

export interface User {
  id: string;
  handle: string;
  email: string;
  archetype: string;
  xp: number;
  coins: number;
  gems: number;
  status: 'ACTIVE' | 'BANNED' | 'RESTRICTED';
  lastLogin: string;
  totalSpent: number;
}

export interface Bundle {
  id: string;
  name: string;
  products: Product[];
  bundlePrice: number;
  description: string;
  expiresIn: number; // seconds
}

export interface FlashSale extends Product {
  saleEndTime: number; // timestamp
  discountPercent: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum ViewState {
  LOBBY = 'LOBBY',
  FAMOUS = 'FAMOUS',
  TRY_ON = 'TRY_ON',
  CATEGORIES = 'CATEGORIES',
  BUNDLES = 'BUNDLES',
  FLASH = 'FLASH',
  PROFILE = 'PROFILE',
  OUTFIT_BUILDER = 'OUTFIT_BUILDER',
  WISHLIST = 'WISHLIST',
  ADMIN = 'ADMIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  SUPPLIER_LOGIN = 'SUPPLIER_LOGIN',
  ROLE_SELECTION = 'ROLE_SELECTION',
  SUPPLIER_DASHBOARD = 'SUPPLIER_DASHBOARD',
  CHECKOUT = 'CHECKOUT',
  TRENDS = 'TRENDS'
}

export enum Page {
  HOME = 'HOME',
  SHOP = 'SHOP'
}

export interface Quest {
  id: string;
  title: string;
  rewardXP: number;
  icon: string;
  completed: boolean;
}

export interface UserStats {
  dailyGameAttempts: number;
  lastGameReset: string;
  quests: Quest[];
  selectedPath: string | null;
}

export interface SocialEvent {
  id: string;
  type: 'PURCHASE' | 'RESERVE' | 'ARENA_WIN' | 'LEVEL_UP';
  user: string;
  productName?: string;
  location: string;
  timestamp: string;
}

export interface RegionalScarcity {
  productId: string;
  region: string;
  stockLevel: 'CRITICAL' | 'LOW' | 'STABLE';
  unitsLeft: number;
}

export interface ProductPerformance {
  productId: string;
  totalPurchases: number;
  totalSystemUsers: number;
  initialStock: number;
  hoursToSoldOut: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  goal: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: string;
  trackingNumber?: string;
  deliveryAddress: string;
}

export interface TrendSource {
  title: string;
  uri: string;
}

export interface TrendReport {
  text: string;
  sources: TrendSource[];
}
