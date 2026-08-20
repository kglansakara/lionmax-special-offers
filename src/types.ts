export type GamePhase = 'idle' | 'windup' | 'dropping' | 'bursting' | 'scratching' | 'revealed';

export interface Prize {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  discountValue: string;
  description: string;
  highlightColor: string;
  borderColor: string;
  bgGlow: string;
  badge: string;
  chance: number; // percentage
  icon: string;
  isWin?: boolean;
}

export interface ClaimVoucher {
  code: string;
  prize: Prize;
  timestamp: string;
  expiryMinutes: number;
  isRedeemed: boolean;
  redeemedAt?: string;
  visitorName?: string;
  visitorPhone?: string;
  repurchaseInterest?: 'yes_ready' | 'interested_sample' | 'maybe_later' | 'already_bought' | string;
  notes?: string;
  syncedToCloud?: boolean;
}

export interface StoredGameState {
  voucher: ClaimVoucher;
  phase: GamePhase;
  savedAt: string;
}

export interface ExhibitionLead {
  id?: string;
  voucher_code: string;
  prize_id: string;
  prize_title: string;
  discount_value: string;
  visitor_name: string;
  visitor_phone?: string;
  is_redeemed: boolean;
  played_at: string;
  redeemed_at?: string;
  repurchase_intent?: string;
  notes?: string;
  booth_id?: string;
  created_at?: string;
}
