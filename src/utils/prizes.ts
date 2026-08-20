import { Prize, ClaimVoucher } from '../types';

export const PRIZES: Prize[] = [
  {
    id: 'offer_100',
    title: '100% FREE BOX',
    subtitle: '100% FREE BOX',
    tag: 'ULTRA RARE',
    discountValue: '100% FREE BOX',
    description: 'Get 1 Full Box of Lionmax Powder Caffeinated Beverage completely FREE at the booth!',
    highlightColor: '#00FF66', // Neon green
    borderColor: '#00FF66',
    bgGlow: 'rgba(0, 255, 102, 0.4)',
    badge: '🏆 100% FREE BOX',
    chance: 5,
    icon: 'crown',
    isWin: true,
  },
  {
    id: 'offer_50',
    title: '50% OFF',
    subtitle: '50% DISCOUNT FOR NEXT PURCHASE',
    tag: 'RARE TIER',
    discountValue: '50% OFF',
    description: 'Enjoy 50% discount on Lionmax for your next purchase at our Softlogic booth!',
    highlightColor: '#FFD700', // Gold
    borderColor: '#FFD700',
    bgGlow: 'rgba(255, 215, 0, 0.4)',
    badge: '⚡ 50% OFF',
    chance: 15,
    icon: 'zap',
    isWin: true,
  },
  {
    id: 'offer_buy',
    title: 'BUY 1 GET 1 FREE',
    subtitle: 'BUY OFFER',
    tag: 'SPECIAL OFFER',
    discountValue: 'BUY 1 GET 1 FREE',
    description: 'Buy 1 box of Lionmax and get 1 box completely FREE at our exhibition booth!',
    highlightColor: '#00E5FF', // Electric cyan
    borderColor: '#00E5FF',
    bgGlow: 'rgba(0, 229, 255, 0.4)',
    badge: '🔥 BUY 1 GET 1 FREE',
    chance: 20,
    icon: 'flame',
    isWin: true,
  },
  {
    id: 'offer_20_next',
    title: '20% OFF ON NEXT PURCHASE',
    subtitle: '20% DISCOUNT',
    tag: 'POPULAR TIER',
    discountValue: '20% OFF',
    description: 'Claim 20% OFF on your next Lionmax purchase at our exhibition counter!',
    highlightColor: '#FF9900', // Vibrant orange
    borderColor: '#FF9900',
    bgGlow: 'rgba(255, 153, 0, 0.4)',
    badge: '✨ 20% OFF ON NEXT PURCHASE',
    chance: 25,
    icon: 'sparkles',
    isWin: true,
  },
  {
    id: 'try_again',
    title: 'BETTER LUCK NEXT TIME',
    subtitle: 'TRY AGAIN LATER',
    tag: 'ENERGY PARTICIPANT',
    discountValue: 'TRY AGAIN',
    description: 'Thank you for participating! Visit our Softlogic booth to taste Lionmax Energy Drink!',
    highlightColor: '#CBD5E1', // Cool slate
    borderColor: '#64748B',
    bgGlow: 'rgba(148, 163, 184, 0.3)',
    badge: '🔄 TRY AGAIN LATER',
    chance: 35,
    icon: 'refresh',
    isWin: false,
  },
];

/**
 * Exact Winning Probabilities Distribution (as specified):
 * 100% (100% Free BOX)                    ->  5%
 * 50% off (50% Discount for next purchase)-> 15%
 * Buy 1 GET 1 FREE (Buy Offer)            -> 20%
 * 20% OFF on Next Purchase                -> 25%
 * Better luck next time, Try Again later  -> 35%
 * Total = 100%
 */
export function rollWeightedPrize(): Prize {
  const rand = Math.random() * 100; // 0 to 100
  
  if (rand < 5) {
    return PRIZES[0]; // 100% (100% Free BOX) (5%)
  } else if (rand < 20) {
    return PRIZES[1]; // 50% off (15%)
  } else if (rand < 40) {
    return PRIZES[2]; // Buy 1 GET 1 FREE (20%)
  } else if (rand < 65) {
    return PRIZES[3]; // 20% OFF on Next Purchase (25%)
  } else {
    return PRIZES[4]; // Better luck next time, Try Again later (35%)
  }
}

export function generateSecureCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LION-${code}`;
}

export function createClaimVoucher(prize: Prize): ClaimVoucher {
  return {
    code: generateSecureCode(),
    prize,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    expiryMinutes: 60,
    isRedeemed: false,
  };
}
