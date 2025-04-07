'use server';

import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export async function createLeadNote(leadId: string, message: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const { error } = await supabase.from('lead_notes').insert({
    lead_id: leadId,
    author_id: user.id,
    author_name: profile?.full_name || 'Unknown',
    message,
  });

  if (error) throw new Error(error.message);
}
