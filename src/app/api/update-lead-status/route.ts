import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { id, status } = await req.json();
  await supabase.from('leads').update({ status }).eq('id', id);
  return NextResponse.json({ success: true });
}
