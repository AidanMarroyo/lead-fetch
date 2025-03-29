import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json([], { status: 401 });

  const { data } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .order('score', { ascending: false });

  return NextResponse.json(data);
}
