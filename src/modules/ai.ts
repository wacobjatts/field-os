import { supabase } from './supabase';
import { FieldError, createAIError } from '../core/errors';
import { ID } from '../core/types';

export interface FieldAIRequest {
  projectId: ID;
  context: string;
  prompt: string;
  metadata?: Record<string, unknown>;
}

export interface FieldAIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: FieldError;
}

export async function callFieldAI<T = unknown>(
  input: FieldAIRequest
): Promise<FieldAIResponse<T>> {
  try {
    const { data, error } = await supabase.functions.invoke('process-ai-query', {
      body: input
    });

    if (error) {
      return {
        success: false,
        error: createAIError(`Edge Function call failed: ${error.message}`, error)
      };
    }

    return {
      success: true,
      data: data as T
    };
  } catch (cause) {
    return {
      success: false,
      error: createAIError('Unexpected AI gateway failure.', cause)
    };
  }
}