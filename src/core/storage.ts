import { supabase } from './supabase';

export async function getProjects() {
  const { data, error } = await supabase.from('projects').select('*');

  if (error) throw error;
  return data;
}

export async function createProject(project: any) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}
