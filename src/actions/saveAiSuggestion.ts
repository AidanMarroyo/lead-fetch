// /actions/saveAiSuggestions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveAiSuggestions(leadId: string, suggestions: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('leads')
    .update({ ai_suggestions: suggestions })
    .eq('id', leadId);

  if (error) {
    console.error('Failed to save AI suggestions:', error.message);
    return false;
  }

  return true;
}
