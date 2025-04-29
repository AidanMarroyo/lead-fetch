import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
    // 1️⃣ If lead has NEVER been contacted, it should show immediately
    if (!lead.last_contacted_at) return true;

    // 2️⃣ Otherwise, check days since last contact
    const lastContacted = new Date(lead.last_contacted_at);
    const daysSinceContact = Math.floor(
      (today.getTime() - lastContacted.getTime()) / (1000 * 60 * 60 * 24)
    );

    const nextFollowUpGap = (lead.contact_attempts || 0) * 3; // 3 days per attempt

    return daysSinceContact >= nextFollowUpGap;
  });

  dueLeads.sort((a, b) => {
    const aDate = new Date(a.last_contacted_at || 0);
    const bDate = new Date(b.last_contacted_at || 0);
    return aDate.getTime() - bDate.getTime();
  })
  
  

  return NextResponse.json(dueLeads);
}
