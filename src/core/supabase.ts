import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gagivrinhxdlygvjxthg.supabase.co';
const supabaseKey = 'sb_publishable_HKdBK_fko9nwrpTXywBrXA_MdsuAUZY';

export const supabase = createClient(supabaseUrl, supabaseKey);
