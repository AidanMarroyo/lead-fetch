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
  const isTeam = plan === 'team' && teamId;

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  query = isTeam ? query.eq('team_id', teamId) : query.eq('user_id', user.id);

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.minScore !== undefined)
    query = query.gte('score', filters.minScore);
  if (filters?.maxScore !== undefined)
    query = query.lte('score', filters.maxScore);
  if (filters?.location)
    query = query.ilike('address', `%${filters.location}%`);

  const { data: leads, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = ['Name', 'Address', 'Phone', 'Score', 'Status'];
  const rows = leads.map((lead) => [
    lead.name,
    lead.address,
    lead.phone || '',
    lead.score,
    lead.status || '',
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(','))
    .join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=leads.csv',
    },
  });
}
