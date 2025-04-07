import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return NextResponse.json({ plan: 'free' });

  const { data } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json({ plan: data?.plan || 'free' });
}
