'use server';

import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

export async function getActivityLogs() {
  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Fetch user's team (if any)
  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  let query = supabase
    .from('activity_logs')
    .select('*, profiles(first_name, last_name, email)')
    .order('created_at', { ascending: false })
    .limit(30);

  if (membership?.team_id) {
    // Show all logs from the team
    query = query.eq('team_id', membership.team_id);
  } else {
    // Show only personal logs
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }

  return data;
}
