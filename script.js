import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gagivrinhxdlygvjxthg.supabase.co',
  'sb_publishable_HKdBK_fko9nwrpTXywBrXA_MdsuAUZY'
);

async function runTest() {
  console.log('Creating project...');

  await supabase.from('Projects').insert([
    { name: 'From App Test' }
  ]);

  const { data } = await supabase.from('Projects').select('*');

  console.log('Projects:', data);
}

runTest();
