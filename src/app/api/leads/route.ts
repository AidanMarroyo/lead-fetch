// import { createClient } from '@/utils/supabase/server';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) return NextResponse.json([], { status: 401 });

//   const { data } = await supabase
//     .from('leads')
//     .select('*')
//     .eq('user_id', user.id)
//     .order('score', { ascending: false });

//   return NextResponse.json(data);
// }

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { LeadFilter } from '@/lib/types';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { filters }: { filters: LeadFilter } = await req.json();

  // Get subscription + team info
  const [{ data: sub }, { data: membership }] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single(),

    supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const plan = sub?.plan || 'free';
  const teamId = membership?.team_id;

  // Decide how to scope leads
  const isTeam = plan === 'team' && teamId;

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  query = isTeam ? query.eq('team_id', teamId) : query.eq('user_id', user.id);

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.minScore !== undefined) {
    query = query.gte('score', filters.minScore);
  }

  if (filters?.maxScore !== undefined) {
    query = query.lte('score', filters.maxScore);
  }

  if (filters?.location) {
    query = query.ilike('address', `%${filters.location}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
