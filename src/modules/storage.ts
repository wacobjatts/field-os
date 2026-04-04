import { supabase } from './supabase';
import { FieldError, createAIError } from '../core/errors';

/**
 * Storage layer (clean module)
 *
 * - handles persistence
 * - isolated from core
 * - structured for future expansion
 */

export async function getProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) {
      throw createAIError(`Failed to fetch projects: ${error.message}`, error);
    }

    return data;
  } catch (cause) {
    throw createAIError('Unexpected storage failure (getProjects).', cause);
  }
}

export async function createProject(project: Record<string, unknown>) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      throw createAIError(`Failed to create project: ${error.message}`, error);
    }

    return data;
  } catch (cause) {
    throw createAIError('Unexpected storage failure (createProject).', cause);
  }
}
