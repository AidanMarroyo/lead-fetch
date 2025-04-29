
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
    .order('score', { ascending: false });

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
  if (filters?.name) {
    query = query.ilike('name', `%${filters.name}%`);
  }

  if (filters?.recentOnly) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    query = query.gte('created_at', oneWeekAgo.toISOString());
  }

  if (filters.websiteStatus === 'no') {
    query = query.is('website', null);
  } else if (filters.websiteStatus === 'has')
    query = query.neq('website', null);

  if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters.dueOnly) {
      const today = new Date().toISOString().split('T')[0];
      query = query.or(`next_follow_up_date.lte.${today},next_follow_up_date.is.null`, { foreignTable: 'leads' });
    }
    

    if (filters.assignedTo) {
      query = query.eq('assigned_to_user_id', filters.assignedTo);
    }
    

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
