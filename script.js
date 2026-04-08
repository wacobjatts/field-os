import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase
const supabase = createClient(
  'https://gagivrinhxdlygvjxthg.supabase.co',
  'sb_publishable_HKdBK_fko9nwrpTXywBrXA_MdsuAUZY'
);

// 2. Integration function for your pipeline
async function saveSignalToSupabase(signal: any) {
  try {
    const { error } = await supabase.from('Projects').insert([
      { 
        name: `FieldOS Signal: ${signal.dimensionId}`,
        // You can map your kinetic data here:
        // adjusted_value: signal.adjustedValue,
        // precision: signal.effectivePrecision,
        // created_at: new Date(signal.timestamp).toISOString()
      }
    ]);

    if (error) console.error('Supabase Insert Error:', error.message);
  } catch (err) {
    console.error('Supabase Connection Error:', err);
  }
}

// 3. Example of where to call it inside your message loop:
/*
  const result = computeKinetics({...});
  
  // Save to DB
  await saveSignalToSupabase(result[0]); 
  
  // Continue broadcasting to web page...
*/
