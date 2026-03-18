import { RankBenefits } from '../types';

export const RANK_THRESHOLDS = {
  'Novice': 0,
  'Tempest': 2000,
  'Icon': 5000,
  'Star': 12000,
  'Appeal God': 30000
};

export const RANK_BENEFITS: Record<string, RankBenefits> = {
  'Novice': {
    tier: 'Novice',
    vaultLimit: 5,
    aiTryOnLimit: 2,
    discountMultiplier: 0.25,
    ticketsPerPurchase: { tickets: 1, perItems: 3 },
    payForMeSlots: 1,
    wishlistRetentionDays: 7,
    canSeeSponsors: false,
    canSeeOtherWishlists: false
  },
  'Tempest': {
    tier: 'Tempest',
    vaultLimit: 15,
    aiTryOnLimit: 3,
    discountMultiplier: 0.35,
    ticketsPerPurchase: { tickets: 3, perItems: 5 },
    payForMeSlots: 2,
    wishlistRetentionDays: 30,
    canSeeSponsors: false,
    canSeeOtherWishlists: false
  },
  'Icon': {
    tier: 'Icon',
    vaultLimit: 20,
    aiTryOnLimit: 4,
    discountMultiplier: 0.50,
    ticketsPerPurchase: { tickets: 3, perItems: 1 },
    payForMeSlots: 3,
    wishlistRetentionDays: 90,
    canSeeSponsors: false,
    canSeeOtherWishlists: false
  },
  'Star': {
    tier: 'Star',
    vaultLimit: 30,
    aiTryOnLimit: 5,
    discountMultiplier: 0.75,
    ticketsPerPurchase: { tickets: 4, perItems: 3 },
    payForMeSlots: 4,
    wishlistRetentionDays: 'PERMANENT',
    canSeeSponsors: true,
    canSeeOtherWishlists: true
  },
  'Appeal God': {
    tier: 'Appeal God',
    vaultLimit: 35,
    aiTryOnLimit: 6,
    discountMultiplier: 1.0,
    ticketsPerPurchase: { tickets: 6, perItems: 3 },
    payForMeSlots: 5,
    wishlistRetentionDays: 'PERMANENT',
    canSeeSponsors: true,
    canSeeOtherWishlists: true
  }
};

export const getCurrentRank = (rep: number): RankBenefits => {
  if (rep >= RANK_THRESHOLDS['Appeal God']) return RANK_BENEFITS['Appeal God'];
  if (rep >= RANK_THRESHOLDS['Star']) return RANK_BENEFITS['Star'];
  if (rep >= RANK_THRESHOLDS['Icon']) return RANK_BENEFITS['Icon'];
  if (rep >= RANK_THRESHOLDS['Tempest']) return RANK_BENEFITS['Tempest'];
  return RANK_BENEFITS['Novice'];
};

export const getNextRankThreshold = (rep: number): { next: string; threshold: number } | null => {
  if (rep >= RANK_THRESHOLDS['Appeal God']) return null;
  if (rep >= RANK_THRESHOLDS['Star']) return { next: 'Appeal God', threshold: RANK_THRESHOLDS['Appeal God'] };
  if (rep >= RANK_THRESHOLDS['Icon']) return { next: 'Star', threshold: RANK_THRESHOLDS['Star'] };
  if (rep >= RANK_THRESHOLDS['Tempest']) return { next: 'Icon', threshold: RANK_THRESHOLDS['Icon'] };
  return { next: 'Tempest', threshold: RANK_THRESHOLDS['Tempest'] };
};