import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { sendInviteEmail } from '@/lib/email'; // using Resend
import { logActivity } from '@/actions/logActivity';

type UserRecord = {
  id: string;
  email: string;
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { email } = await req.json();

  const inviter = await getCurrentUser();
  if (!inviter) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get inviter's team and role
  const { data: teamMember } = await supabase
    .from('team_members')
    .select('team_id, role')
    .eq('user_id', inviter.id)
    .single();

  if (!teamMember?.team_id || teamMember.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const teamId = teamMember.team_id;

  // Try to find the user by email
  const { data: rawUserData } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();

  const userData = rawUserData as UserRecord | null;

  if (userData) {
    // Check if they are already in the team
    const { data: existing } = await supabase
      .from('team_members')
      .select('id')
      .eq('user_id', userData.id)
      .eq('team_id', teamId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'User already in team' },
        { status: 400 }
      );
    }

    // Add them to the team
    await supabase.from('team_members').insert({
      user_id: userData.id,
      team_id: teamId,
      role: 'member',
    });
  } else {
    // Create a pending invite
    const { error } = await supabase.from('team_invites').insert({
      team_id: teamId,
      invited_by: inviter.id,
      email,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Could not create invite' },
        { status: 500 }
      );
    }
  }

  // Send invite email via Resend
  await sendInviteEmail({
    to: email,
    inviterEmail: inviter.email!,
  });

  const { data: teamData } = await supabase
    .from('teams')
    .select('name')
    .eq('id', teamId)
    .single();

  const { data: inviterData } = await supabase
    .from('profiles')
    .select('first_name, last_name, email')
    .eq('id', inviter.id)
    .single();

    const fullName =
    inviterData?.first_name === null ||
    inviterData?.last_name === null
      ? `${inviterData?.email}`
      : `${inviterData?.first_name} ${inviterData?.last_name}`;


  await logActivity({
    userId: inviter.id,
    teamId: teamId,
    action: 'team_member_invite',
    message: `${fullName} invited ${email} to team ${teamData?.name}`,
  });

  return NextResponse.json({ success: true });
}
