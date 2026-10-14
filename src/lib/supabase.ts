import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://khixsxyyulxpwlkxtaag.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaXhzeHl5dWx4cHdsa3h0YWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMzY1NzMsImV4cCI6MjEwMjgxMjU3M30.2rSEpQ-7McKuFagMFvoH4wC1CH39P6aW1BaatsEgDnU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Health check helper to verify Supabase backend connectivity
export async function checkSupabaseConnection(): Promise<{ connected: boolean; status: string }> {
  try {
    const { error } = await supabase.from('fairy_posts').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && !error.message?.includes('relation "public.fairy_posts" does not exist')) {
      return { connected: false, status: error.message };
    }
    return { connected: true, status: 'Connected to Supabase' };
  } catch (err: any) {
    return { connected: false, status: err.message || 'Connecting...' };
  }
}
