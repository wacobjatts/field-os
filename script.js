import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_URL',
  'YOUR_ANON_KEY'
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