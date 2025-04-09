'use server';

import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from './logActivity';

export async function createLeadNote(leadId: string, message: string) {
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
    .select('name')
    .eq('id', leadId)
    .single();

  const fullName = `${profile?.first_name} ${profile?.last_name}`;

  const { error } = await supabase.from('lead_notes').insert({
    lead_id: leadId,
    author_id: user.id,
    author_name: fullName || 'Unknown',
    message,
  });

  if (error) throw new Error(error.message);

  await logActivity({
    userId: user.id,
    teamId: profile?.team_id,
    leadId,
    action: 'note_added',
    message: `${profile?.first_name} ${profile?.last_name} added a note to lead ${lead?.name}`,
  });
}
