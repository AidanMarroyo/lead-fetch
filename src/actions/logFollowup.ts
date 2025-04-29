'use server';

import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

export async function logFollowUp(leadId: string) {
  const supabase = await createClient();
const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  // Fetch current contact_attempts
  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('contact_attempts')
    .eq('id', leadId)
    .single();

  if (fetchError || !lead) {
    console.error('Fetch error:', fetchError);
    throw new Error('Failed to fetch lead.');
  }

  const newAttempts = (lead.contact_attempts ?? 0) + 1;

  const { error: updateError } = await supabase
    .from('leads')
    .update({
      contact_attempts: newAttempts,
      last_contacted_at: new Date().toISOString(),
    })
    .eq('id', leadId);

  if (updateError) {
    console.error('Update error:', updateError);
    throw new Error('Failed to log follow-up.');
  }

  return { success: true, attempts: newAttempts };
}
