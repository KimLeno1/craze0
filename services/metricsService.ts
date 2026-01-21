
import { PRODUCT_PERFORMANCE_DATA } from '../data/extendedMock';
import { Product } from '../types';

/**
 * Velocity Score Formula:
 * ((Purchases / TotalUsers) / (InitialStock / HoursToSoldOut)) * ScaleFactor
 */
export const calculateVelocityScore = (productId: string): number => {
  const stats = PRODUCT_PERFORMANCE_DATA.find(p => p.productId === productId);
  if (!stats) return 50; // Default average

  const adoptionRate = stats.totalPurchases / stats.totalSystemUsers; // (Purchases/Users)
  const depletionRate = stats.initialStock / stats.hoursToSoldOut;    // (Stock/Time)

  // Avoid division by zero
  if (depletionRate === 0) return 0;

  // We scale the result to a 0-100 range for the UI
  const rawScore = (adoptionRate / depletionRate) * 2000; 
  return Math.min(100, Math.round(rawScore));
};

export const getHypeRankedProducts = (products: Product[]): Product[] => {
  return products.map(p => ({
    ...p,
    velocityScore: calculateVelocityScore(p.id)
  })).sort((a, b) => b.velocityScore - a.velocityScore);
};
