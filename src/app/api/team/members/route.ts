import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    console.error('❌ No user found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }



  // Step 1: Get the team_id for the current user
  const { data: teamMembership, error: membershipError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .single();

  if (membershipError || !teamMembership) {
    console.error('❌ Error fetching team membership:', membershipError);
    return NextResponse.json({ error: 'Not in a team' }, { status: 404 });
  }



  // Step 2: Get members of that team via profiles

  const { data: members, error: membersError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, id, teams(owner_id)')
    .eq('team_id', teamMembership.team_id);

  if (membersError) {
    console.error('❌ Error fetching team members:', membersError);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }



  return NextResponse.json({ members });
}
