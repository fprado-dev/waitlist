import { supabase } from './supabase';

export interface WaitlistEntry {
  email: string;
}

export async function addToWaitlist(email: string): Promise<{ success: boolean; error?: string; }> {
  try {
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }]);

    if (error) {
      console.error('Error adding to waitlist:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Exception adding to waitlist:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unknown error occurred'
    };
  }
}