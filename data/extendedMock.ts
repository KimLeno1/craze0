
import { ProductPerformance, Achievement } from '../types';

export const PRODUCT_PERFORMANCE_DATA: ProductPerformance[] = [
  { productId: '1', totalPurchases: 850, totalSystemUsers: 1000, initialStock: 900, hoursToSoldOut: 4 },
  { productId: '2', totalPurchases: 420, totalSystemUsers: 1000, initialStock: 500, hoursToSoldOut: 12 },
  { productId: '3', totalPurchases: 150, totalSystemUsers: 1000, initialStock: 600, hoursToSoldOut: 72 },
  { productId: '4', totalPurchases: 950, totalSystemUsers: 1000, initialStock: 960, hoursToSoldOut: 2 },
  { productId: '5', totalPurchases: 50, totalSystemUsers: 1000, initialStock: 300, hoursToSoldOut: 168 },
  { productId: '6', totalPurchases: 300, totalSystemUsers: 1000, initialStock: 1000, hoursToSoldOut: 48 },
];

export const USER_ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'a1', 
    title: 'Drop_Origin', 
    description: 'Archive a silhouette within the first 60 seconds of a Thermal Drop.', 
    icon: '⚡', 
    unlocked: true, 
    progress: 1, 
    goal: 1 
  },
  { 
    id: 'a2', 
    title: 'Velocity_Snatcher', 
    description: 'Secure 3 silhouettes with a Velocity Heat index exceeding 95%.', 
    icon: '🔥', 
    unlocked: false, 
    progress: 1, 
    goal: 3 
  },
  { 
    id: 'a3', 
    title: 'Synergy_Architect', 
    description: 'Initialize and complete 2 full Synergy Kits (Bundles).', 
    icon: '📦', 
    unlocked: false, 
    progress: 0, 
    goal: 2 
  },
  { 
    id: 'a4', 
    title: 'Circuit_Elite', 
    description: 'Reach a total archive valuation of $5,000.', 
    icon: '💎', 
    unlocked: false, 
    progress: 1250, 
    goal: 5000 
  },
  { 
    id: 'a5', 
    title: 'Void_Stalker', 
    description: 'Wishlist 10 items from the "Void Minimalist" sector.', 
    icon: '🌑', 
    unlocked: false, 
    progress: 4, 
    goal: 10 
  },
  { 
    id: 'a6', 
    title: 'Arena_Dominant', 
    description: 'Cast 100 decisive votes in the Style Arena.', 
    icon: '🏛️', 
    unlocked: false, 
    progress: 42, 
    goal: 100 
  }
];

export const GAME_REWARDS_POOL = [
  { id: 'r1', type: 'COINS', value: 100, label: '100 COINS' },
  { id: 'r2', type: 'COINS', value: 500, label: '500 COINS' },
  { id: 'r3', type: 'GEMS', value: 10, label: '10 GEMS' },
  { id: 'r4', type: 'GEMS', value: 50, label: '50 GEMS' },
  { id: 'r5', type: 'XP', value: 250, label: '250 XP' },
];
