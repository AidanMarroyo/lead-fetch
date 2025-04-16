'use server';

import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { startOfWeek, format } from 'date-fns';

export async function getLeadTrends() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return [];

  // Get team_id if applicable
  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const teamId = membership?.team_id;

  const filter = teamId
    ? { team_id: teamId }
    : { user_id: user.id };

  const { data: leads, error } = await supabase
    .from('leads')
    .select('created_at')
    .match(filter);

  if (error || !leads) {
    console.error('Failed to fetch lead trend data:', error);
    return [];
  }

  // Group leads by start of the week
  const trend: Record<string, number> = {};

  leads.forEach((lead) => {
    const created = new Date(lead.created_at);
    const weekStart = format(startOfWeek(created, { weekStartsOn: 1 }), 'MMM dd'); // Monday start
    trend[weekStart] = (trend[weekStart] || 0) + 1;
  });

  // Return sorted by date
  return Object.entries(trend)
    .sort((a, b) =>
      new Date(a[0]).getTime() - new Date(b[0]).getTime()
    )
    .map(([week, count]) => ({ week, count }));
}
