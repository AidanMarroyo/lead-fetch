'use server';

import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

export async function getLeadNotes(leadId: string) {
  const supabase = await createClient();
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('User not authenticated');
  }
  const { data, error } = await supabase
    .from('lead_notes')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
