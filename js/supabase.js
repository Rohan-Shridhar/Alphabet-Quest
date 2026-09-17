import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;

let status = {
  enabled: false,
  reason: 'Supabase is not configured yet.'
};

function getConfiguredSupabase() {
  const url = SUPABASE_URL;
  const anonKey = SUPABASE_ANON_KEY;

  const hasRealConfig = Boolean(url && anonKey);

  return {
    url,
    anonKey,
    hasRealConfig
  };
}

export function getSupabaseConfig() {
  return getConfiguredSupabase();
}

export function getSupabaseStatus() {
  return status;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseClient());
}

export function getSupabaseClient() {
  if (client) return client;

  const { url, anonKey, hasRealConfig } = getConfiguredSupabase();

  if (!hasRealConfig) {
    status = {
      enabled: false,
      reason:
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    };

    return null;
  }

  try {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    status = {
      enabled: true,
      reason: 'Supabase client ready.'
    };

    return client;
  } catch (error) {
    status = {
      enabled: false,
      reason: error.message
    };

    console.error('Supabase initialization error:', error);

    return null;
  }
}

export const supabase = getSupabaseClient();