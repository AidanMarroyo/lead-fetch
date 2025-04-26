import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('category')
    .not('category', 'is', null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const categories = [...new Set(
    data
      .map((d) => d.category?.toLowerCase().trim())
      .filter(Boolean) // filters out nulls/empty strings
  )].sort();

  return NextResponse.json(categories);
}
