// app/api/followups/route.ts
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [{ data: sub }, { data: membership }] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single(),

    supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const plan = sub?.plan || 'free';
  const teamId = membership?.team_id;

  // Decide how to scope leads
  const isTeam = plan === 'team' && teamId;

  let query = supabase
  .from('leads')
  .select('*')

  query = isTeam ? query.eq('team_id', teamId) : query.eq('user_id', user.id);

  const { data: leads, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }

  const today = new Date();

  const dueLeads = leads.filter((lead) => {

    // ✅ If never contacted, it's due immediately
    if (!lead.last_contacted_at) return true;

    const followUpDate = lead.next_follow_up_date === null ? today : lead.next_follow_up_date;

    // ✅ Due if today is same or after the calculated follow-up date
    return today >= followUpDate;
  });

  // ✅ Sort by last contacted (oldest first)
  dueLeads.sort((a, b) => {
    const aDate = new Date(a.last_contacted_at || 0).getTime();
    const bDate = new Date(b.last_contacted_at || 0).getTime();
    return aDate - bDate;
  });

  return NextResponse.json(dueLeads);
}
