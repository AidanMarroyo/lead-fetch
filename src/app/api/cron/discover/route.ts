import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { fetchLeadsFromGoogle } from '@/actions/fetchLeads';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = await createClient();

  const { data: searches, error } = await supabase
    .from('saved_searches')
    .select('*');
  if (error) {
    console.error('Failed to load saved searches:', error);
    return NextResponse.json(
      { error: 'Failed to load saved searches' },
      { status: 500 }
    );
  }

  for (const search of searches) {
    const { keyword, location, user_id, id } = search;

    try {
      const result = await fetchLeadsFromGoogle({
        keyword,
        location,
        user_id,
        withWebsites: false,
      });


      await supabase
        .from('saved_searches')
        .update({ last_ran: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.error(`❌ Error running search for user ${user_id}`, err);
    }
  }

  return NextResponse.json({ success: true });
}
