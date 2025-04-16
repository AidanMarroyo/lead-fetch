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
    .select('first_name, last_name, team_id, email')
    .eq('id', user.id)
    .single();

    const fullName =
    profile?.first_name === null ||
    profile?.last_name === null
      ? `${profile?.email}`
      : `${profile?.first_name} ${profile?.last_name}`;


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
    message: `${fullName} updated the status of lead ${lead?.name} to ${status}`,
  });
}
