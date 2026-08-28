import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
    const user = await getCurrentUser();
    if (!user) {
      console.error('❌ No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  const { data, error } = await supabase
    .from('team_members')
    .select('role')
    .eq('user_id', user.id).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });



  return NextResponse.json(data, { status: 200 });
}
