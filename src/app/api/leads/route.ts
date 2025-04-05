import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json([], { status: 401 });

  // 🧠 Check if user is part of a team
  const { data: membership, error: teamError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (teamError) {
    console.error('❌ Error checking team membership:', teamError);
    return NextResponse.json([], { status: 500 });
  }

  let data = [];

  if (membership?.team_id) {
    // ✅ Fetch team leads if part of a team
    const result = await supabase
      .from('leads')
      .select('*')
      .eq('team_id', membership.team_id)
      .order('score', { ascending: false });

    data = result.data || [];
  } else {
    // 🧍 Fetch personal leads (fallback for individual users)
    const result = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('score', { ascending: false });

    data = result.data || [];
  }

  return NextResponse.json(data);
}
