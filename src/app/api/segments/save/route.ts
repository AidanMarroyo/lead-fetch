import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const { name, filters } = await req.json();

  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const teamId = membership?.team_id || null;

  await supabase.from('lead_segments').insert({
    name,
    filters,
    user_id: user.id,
    team_id: teamId,
  });

  return NextResponse.json({ success: true });
}
