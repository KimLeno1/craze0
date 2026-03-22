
export type Category = 'All' | 'Apparel' | 'Accessories' | 'Home' | 'Beauty';
export type Gender = 'MALE' | 'FEMALE' | 'UNISEX';

export type UserRankTier = 'Novice' | 'Tempest' | 'Icon' | 'Star' | 'Appeal God';

export interface RankBenefits {
  tier: UserRankTier;
  vaultLimit: number;
  aiTryOnLimit: number;
  discountMultiplier: number; // 0.25 to 1.0
  ticketsPerPurchase: { tickets: number; perItems: number };
  payForMeSlots: number;
  wishlistRetentionDays: number | 'PERMANENT';
  canSeeSponsors: boolean;
  canSeeOtherWishlists: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'PERCENT' | 'AMOUNT';
  value: number;
  description: string;
  expiresAt: string;
  usageLimit?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'URGENT' | 'REWARD' | 'WELCOME';
  timestamp: string;
  read: boolean;
  recipientId?: string; // For targeted notifications (e.g., supplierId)
}

export interface CustomizationField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'color';
  options?: string[]; // For select type
  required: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  shippingFee: number;
  image: string;
  category: Category;
  gender: Gender;
  description: string;
  details: string[];
  inStock: boolean;
  isNew?: boolean;
  viewers: number;
  stockCount: number;
  hypeScore: number;
  velocityScore: number;
  isHallOfFame?: boolean;
  synergyPath?: string;
  appeal?: string;
  brand?: string;
  tags?: string[];
  supplierId?: string;
  sizes: string[];
  isCustom?: boolean;
  priceRange?: { min: number; max: number };
  customizationFields?: CustomizationField[];
  images?: string[];
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  region: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'RESTRICTED';
  performanceScore: number;
  totalRevenueYield: number;
  joinedDate: string;
}

export interface User {
  id: string;
  handle: string;
  username?: string; // Added for registration
  email: string;
  phone?: string; // Added for registration
  password?: string; // Added for authentication
  archetype: string;
  rep: number;
  level: number;
  coins: number;
  gems: number;
  status: 'ACTIVE' | 'BANNED' | 'RESTRICTED';
  lastLogin: string;
  totalSpent: number;
  role: 'client' | 'admin' | 'supplier';
  stats?: UserStats;
}

export interface Bundle {
  id: string;
  name: string;
  products: Product[];
  bundlePrice: number;
  description: string;
  expiresIn: number;
}

export interface FlashSale extends Product {
  productId: string;
  saleEndTime: number;
  discountPercent: number;
}

export interface CartItem extends Partial<Product> {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  shippingFee: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  isBundle?: boolean;
  bundleProducts?: Product[];
  customizationData?: Record<string, string>;
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
  CONTACT = 'CONTACT',
  GAME_SHOWROOM = 'GAME_SHOWROOM',
  PAY_FOR_ME = 'PAY_FOR_ME',
  SOCIAL = 'SOCIAL',
  HALL_OF_FAME = 'HALL_OF_FAME',
  ADMIN_NOTIFICATIONS = 'ADMIN_NOTIFICATIONS'
}

export enum Page {
  HOME = 'HOME',
  SHOP = 'SHOP'
}

export interface Quest {
  id: string;
  title: string;
  rewardREP: number;
  icon: string;
  completed: boolean;
}

export interface MicroCommitment {
  id: string;
  type: 'VERIFY_TREND' | 'SYNC_LINK' | 'ENDORSE_STYLE' | 'RESERVE_SLOT' | 'SHARE_RANK';
  label: string;
  rewardXP: number;
  completed: boolean;
  expiresAt: number;
}

export interface UserStats {
  dailyGameAttempts: number;
  lastGameReset: string;
  quests: Quest[];
  microCommitments: MicroCommitment[];
  commitmentStreak: number;
  softLockedItems: Record<string, number>; // productId -> expiry timestamp
  selectedPath: string | null;
  aiTryOnsUsedToday: number;
  tickets: number;
  brandSubscriptions: string[];
  tagSubscriptions: string[];
  achievements: Achievement[];
}

export interface UserCredit {
  id: string;
  userId: string;
  amount: number;
  createdAt: number;
  status: 'AVAILABLE' | 'USED';
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
  phone?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface TrendReport {
  text: string;
  sources: { title: string; uri: string }[];
}

// Added missing interfaces to resolve compilation errors in extendedMock.ts, socialProofData.ts, and SocialProofPopup.tsx

/** 
 * Represents the statistical performance data of a product for velocity calculations.
 */
export interface ProductPerformance {
  productId: string;
  totalPurchases: number;
  totalSystemUsers: number;
  initialStock: number;
  hoursToSoldOut: number;
}

/** 
 * Represents a gamification achievement for the user profile.
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  goal: number;
  rewardREP: number;
}

/** 
 * Represents a real-time social activity event for the social proof notification system.
 */
export interface SocialEvent {
  id: string;
  type: 'PURCHASE' | 'RESERVE' | 'LEVEL_UP' | 'ARENA_WIN';
  user: string;
  productName?: string;
  location: string;
  timestamp: string;
}

/** 
 * Represents inventory scarcity data restricted by geographic region.
 */
export interface RegionalScarcity {
  productId: string;
  region: string;
  stockLevel: 'CRITICAL' | 'LOW' | 'STABLE';
  unitsLeft: number;
}

export enum PayForMeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED'
}

export interface PayForMeRequest {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: PayForMeStatus;
  timestamp: string;
  payerName?: string;
  payerContact?: string;
  message?: string;
}

export interface SocialPost {
  id: string;
  userId: string;
  userHandle: string;
  image: string;
  likes: number;
  loves: number;
  timestamp: string;
  weekId: string;
  likedBy?: string[];
  lovedBy?: string[];
}
