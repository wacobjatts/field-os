/**
 * Supabase client (clean + direct config)
 *
 * - uses your provided keys
 * - no core dependency
 * - safe module layer placement
 * - single shared client instance
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gagivrinhxdlygvjxthg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HKdBK_fko9nwrpTXywBrXA_MdsuAUZY';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return client;
}

/**
 * Optional convenience export (same behavior as your original)
 */
export const supabase = getSupabaseClient();