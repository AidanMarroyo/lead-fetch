import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { logActivity } from '@/actions/logActivity';

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

  // change the removed members subscription to free
  await supabase
    .from('subscriptions')
    .update({ plan: 'free', status: 'inactive' })
    .eq('user_id', memberId);

  await supabase.from('profiles').update({ team_id: null }).eq('id', memberId);

  const { data: teamData } = await supabase
    .from('teams')
    .select('name')
    .eq('id', myMembership.team_id)
    .single();

  const { data: adminData } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const { data: memberData } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', memberId)
    .single();

  await logActivity({
    userId: user.id,
    teamId: myMembership.team_id,
    action: 'team_member_removed',
    message: `${adminData?.first_name} ${adminData?.last_name} removed ${memberData?.first_name} ${memberData?.last_name} from ${teamData?.name}`,
  });

  return NextResponse.json({ success: true });
}
