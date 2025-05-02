// /app/api/save-lead-manual/route.ts
import { getCurrentUser } from '@/lib/auth';
import { scoreLead } from '@/lib/scoring';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lead = await req.json();

  const { data: existing } = await supabase
    .from('leads')
    .select('id')
    .eq('google_place_id', lead.google_place_id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'Lead already exists.' }, { status: 400 });
  }

  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const calculatedScore = scoreLead(lead);

  const { error } = await supabase.from('leads').insert({
    ...lead,
    user_id: user.id,
    team_id: membership?.team_id || null,
    score: calculatedScore,
    assigned_to_user_id: user.id,
    next_follow_up_date: new Date()
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
