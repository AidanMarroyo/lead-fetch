'use server';

import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { logActivity } from './logActivity';

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, team_id')
    .eq('id', user.id)
    .single();

  const { data: lead } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)
    .select('name')
    .single();

  await logActivity({
    userId: user.id,
    teamId: profile?.team_id,
    leadId,
    action: 'lead_status_changed',
    message: `${profile?.first_name} ${profile?.last_name} updated the status of lead ${lead?.name} to ${status}`,
  });
}
