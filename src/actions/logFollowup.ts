'use server';

import { getCurrentUser } from '@/lib/auth';
import { getNextFollowUpDate } from '@/lib/followup';
import { createClient } from '@/utils/supabase/server';
import { logActivity } from './logActivity';

export async function logFollowUp(leadId: string) {
  const supabase = await createClient();
const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  // Fetch current contact_attempts
  const { data: lead, error: fetchError } = await supabase
    .from('leads')
    .select('contact_attempts, team_id, name')
    .eq('id', leadId)
    .single();

  if (fetchError || !lead) {
    console.error('Fetch error:', fetchError);
    throw new Error('Failed to fetch lead.');
  }

  
const today = new Date().toISOString();
const newAttempts = lead.contact_attempts + 1;

const nextFollowUpDate = getNextFollowUpDate(newAttempts); // ✅ single param


  const { error: updateError } = await supabase
    .from('leads')
    .update({
      contact_attempts: newAttempts,
      last_contacted_at: today,
      next_follow_up_date: nextFollowUpDate,
    })
    .eq('id', leadId);

  if (updateError) {
    console.error('Update error:', updateError);
    throw new Error('Failed to log follow-up.');
  }

  const { data: userData, error: userDataError } = await supabase
  .from('profiles')
  .select('first_name, last_name, team_id, email')
  .eq('id', user.id)
  .single();

  const fullName =
  userData?.first_name === null ||
  userData?.last_name === null
    ? `${userData?.email}`
    : `${userData?.first_name} ${userData?.last_name}`;

if (userDataError || !userData) {
  console.error('Fetch error:', fetchError);
  throw new Error('Failed to fetch lead.');
}

  await logActivity({
    userId: user.id,
    teamId: lead.team_id,
    leadId,
    action: 'follow up overridden',
    message: `${fullName} has overridden the follow-up for ${lead.name}. Next follow-up date: ${nextFollowUpDate}`,
  });

  
  return { success: true, attempts: newAttempts };
}
