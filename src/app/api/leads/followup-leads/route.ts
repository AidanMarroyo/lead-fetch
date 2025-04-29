// app/api/followups/route.ts
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
