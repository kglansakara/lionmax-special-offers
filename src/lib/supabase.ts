import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExhibitionLead, ClaimVoucher } from '../types';

const LOCAL_LEADS_STORAGE_KEY = 'lionmax_booth_leads';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  
  // Also support custom runtime configured URL/Key from staff settings
  const customUrl = localStorage.getItem('lionmax_custom_supabase_url') || '';
  const customKey = localStorage.getItem('lionmax_custom_supabase_key') || '';

  const url = customUrl || envUrl;
  const key = customKey || envKey;

  return {
    url,
    key,
    isConfigured: !!(url && key && url.startsWith('http')),
  };
};

export const getSupabase = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: false,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseClient;
};

// Reset client cache if custom keys change
export const resetSupabaseClient = () => {
  supabaseClient = null;
};

// Local storage backup functions
export const getLocalLeads = (): ExhibitionLead[] => {
  try {
    const raw = localStorage.getItem(LOCAL_LEADS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalLead = (lead: ExhibitionLead) => {
  try {
    const leads = getLocalLeads();
    const index = leads.findIndex((l) => l.voucher_code === lead.voucher_code);
    if (index >= 0) {
      leads[index] = { ...leads[index], ...lead };
    } else {
      leads.unshift(lead);
    }
    localStorage.setItem(LOCAL_LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving local lead:', e);
  }
};

// Record a new game play / roll to Supabase & Local
export const recordGamePlay = async (voucher: ClaimVoucher, visitorName: string = 'Visitor'): Promise<{ success: boolean; cloud: boolean }> => {
  const leadData: ExhibitionLead = {
    voucher_code: voucher.code,
    prize_id: voucher.prize.id,
    prize_title: voucher.prize.title,
    discount_value: voucher.prize.discountValue,
    visitor_name: visitorName || 'Visitor',
    visitor_phone: voucher.visitorPhone || '',
    is_redeemed: false,
    played_at: voucher.timestamp || new Date().toISOString(),
    repurchase_intent: voucher.repurchaseInterest || 'pending',
    notes: voucher.notes || '',
    booth_id: 'softlogic-lionmax-booth-1',
  };

  // Always save locally first (Offline-first resilient pattern)
  saveLocalLead(leadData);

  const client = getSupabase();
  if (!client) {
    return { success: true, cloud: false };
  }

  try {
    const { error } = await client
      .from('lionmax_leads')
      .upsert([leadData], { onConflict: 'voucher_code' });

    if (error) {
      console.warn('Supabase recordGamePlay notice (saved locally):', error.message);
      return { success: true, cloud: false };
    }
    return { success: true, cloud: true };
  } catch (err) {
    console.warn('Network error syncing to Supabase (saved locally):', err);
    return { success: true, cloud: false };
  }
};

// Record or update redemption with visitor name & staff notes
export const recordRedemption = async (
  voucherCode: string,
  data: {
    visitorName: string;
    visitorPhone?: string;
    notes?: string;
    redeemedAt: string;
  }
): Promise<{ success: boolean; cloud: boolean }> => {
  // Update local storage record
  const leads = getLocalLeads();
  const index = leads.findIndex((l) => l.voucher_code === voucherCode);
  const updatedData: Partial<ExhibitionLead> = {
    is_redeemed: true,
    visitor_name: data.visitorName || (index >= 0 ? leads[index].visitor_name : 'Valued Visitor'),
    visitor_phone: data.visitorPhone,
    notes: data.notes,
    redeemed_at: data.redeemedAt,
  };

  if (index >= 0) {
    leads[index] = { ...leads[index], ...updatedData };
    localStorage.setItem(LOCAL_LEADS_STORAGE_KEY, JSON.stringify(leads));
  } else {
    // If not found in local, insert
    saveLocalLead({
      voucher_code: voucherCode,
      prize_id: 'unknown',
      prize_title: 'Redeemed Offer',
      discount_value: '',
      played_at: new Date().toISOString(),
      ...updatedData,
    } as ExhibitionLead);
  }

  const client = getSupabase();
  if (!client) {
    return { success: true, cloud: false };
  }

  try {
    const { error } = await client
      .from('lionmax_leads')
      .update({
        is_redeemed: true,
        visitor_name: data.visitorName,
        visitor_phone: data.visitorPhone || null,
        notes: data.notes || null,
        redeemed_at: data.redeemedAt,
      })
      .eq('voucher_code', voucherCode);

    if (error) {
      console.warn('Supabase update notice:', error.message);
      return { success: true, cloud: false };
    }
    return { success: true, cloud: true };
  } catch (err) {
    console.warn('Network error updating redemption:', err);
    return { success: true, cloud: false };
  }
};

// Fetch all recorded leads from Supabase (with local fallback)
export const fetchAllLeads = async (): Promise<{ leads: ExhibitionLead[]; isCloud: boolean }> => {
  const localLeads = getLocalLeads();
  const client = getSupabase();

  if (!client) {
    return { leads: localLeads, isCloud: false };
  }

  try {
    const { data, error } = await client
      .from('lionmax_leads')
      .select('*')
      .order('played_at', { ascending: false });

    if (error || !data) {
      return { leads: localLeads, isCloud: false };
    }

    return { leads: data as ExhibitionLead[], isCloud: true };
  } catch {
    return { leads: localLeads, isCloud: false };
  }
};

// SQL Schema for the user to run in Supabase SQL editor
export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS lionmax_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voucher_code TEXT UNIQUE NOT NULL,
  prize_id TEXT,
  prize_title TEXT NOT NULL,
  discount_value TEXT,
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT,
  is_redeemed BOOLEAN DEFAULT FALSE,
  played_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  repurchase_intent TEXT,
  notes TEXT,
  booth_id TEXT DEFAULT 'softlogic-lionmax-booth-1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lionmax_leads ENABLE ROW LEVEL SECURITY;

-- Allow booth app public/anon read & write policies
CREATE POLICY "Allow public insert and update" 
ON lionmax_leads FOR ALL 
USING (true) 
WITH CHECK (true);
`;
