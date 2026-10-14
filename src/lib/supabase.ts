import { createClient, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://khixsxyyulxpwlkxtaag.supabase.co';
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaXhzeHl5dWx4cHdsa3h0YWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMzY1NzMsImV4cCI6MjEwMjgxMjU3M30.2rSEpQ-7McKuFagMFvoH4wC1CH39P6aW1BaatsEgDnU';

function getValidSupabaseUrl(): string {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (typeof envUrl === 'string') {
    const trimmed = envUrl.trim();
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
      try {
        new URL(trimmed);
        return trimmed;
      } catch {
        // invalid URL format, ignore
      }
    }
  }
  return FALLBACK_URL;
}

function getValidSupabaseAnonKey(): string {
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (typeof envKey === 'string') {
    const trimmed = envKey.trim();
    if (trimmed.length > 20 && (trimmed.includes('.') || trimmed.startsWith('sb_'))) {
      return trimmed;
    }
  }
  return FALLBACK_KEY;
}

export const SUPABASE_URL = getValidSupabaseUrl();
export const SUPABASE_ANON_KEY = getValidSupabaseAnonKey();

// Safe initialization that prevents any runtime crash
function initSupabase(): SupabaseClient {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client with config, retrying with fallback:', err);
    return createClient(FALLBACK_URL, FALLBACK_KEY, {
      auth: {
        persistSession: false,
      },
    });
  }
}

export const supabase = initSupabase();

// Health check helper to verify Supabase backend connectivity
export async function checkSupabaseConnection(): Promise<{ connected: boolean; status: string }> {
  try {
    const { error } = await supabase.from('fairy_posts').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && !error.message?.includes('does not exist')) {
      return { connected: false, status: error.message };
    }
    return { connected: true, status: 'Connected to Supabase' };
  } catch (err: any) {
    return { connected: false, status: err.message || 'Connecting...' };
  }
}
