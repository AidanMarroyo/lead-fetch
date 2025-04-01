'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateLeadNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('leads')
    .update({ notes })
    .eq('id', id)
    .select()
    .single();

  return data;
}
