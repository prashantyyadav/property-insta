import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase connection — always used, ignoring env vars.
// The anon key is safe to expose — it's meant for client-side use.
const SUPABASE_URL = 'https://ioblbfugnhtghvxbyeos.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvYmxiZnVnbmh0Z2h2eGJ5ZW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NTM2NzcsImV4cCI6MjA5NTUyOTY3N30.fyCOdUh5M4x4KeLaEG6Apsfe6U2AvT0acm1a5_JSBQA';

console.log('[PropertyInsta] Connecting to Supabase:', SUPABASE_URL);

/**
 * Supabase client instance — always connected to the ioblbfugnhtghvxbyeos project.
 * Row-Level Security (RLS) policies on the properties table enforce:
 *  - Anyone can SELECT (read)
 *  - Anyone can INSERT (write — anon policy enabled)
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});