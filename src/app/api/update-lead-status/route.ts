import { logActivity } from '@/actions/logActivity';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const { id, status } = await req.json();
  
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, team_id, email')
      .eq('id', user.id)
      .single();
  
      const fullName =
      profile?.first_name === null ||
      profile?.last_name === null
        ? `${profile?.email}`
        : `${profile?.first_name} ${profile?.last_name}`;
  
  
    const { data: lead } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select('name')
      .single();
  
    await logActivity({
      userId: user.id,
      teamId: profile?.team_id,
      leadId: id,
      action: 'lead_status_changed',
      message: `${fullName} updated the status of lead ${lead?.name} to ${status}`,
    });
  

  return NextResponse.json({ success: true });
}
