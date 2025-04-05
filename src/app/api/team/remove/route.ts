import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const { memberId } = await req.json();

  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Ensure the requesting user is an admin of this team
  const { data: myMembership } = await supabase
    .from('team_members')
    .select('team_id, role')
    .eq('user_id', user.id)
    .single();

  if (myMembership?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Remove the member
  await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId)
    .eq('team_id', myMembership.team_id);

  return NextResponse.json({ success: true });
}
