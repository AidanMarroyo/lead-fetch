'use server';

import { createClient } from '@/utils/supabase/server';

type LogInput = {
  userId: string;
  teamId?: string | null;
  leadId?: string;
  action: string;
  message: string;
};

export async function logActivity({
  userId,
  teamId,
  leadId,
  action,
  message,
}: LogInput) {
  const supabase = await createClient();

  const { error } = await supabase.from('activity_logs').insert([
    {
      user_id: userId,
      team_id: teamId ?? null,
      lead_id: leadId ?? null,
      action,
      message,
    },
  ]);

  if (error) {
    console.error('🔴 Failed to log activity:', error);
  }
}
