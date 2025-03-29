'use server';

import { scoreLead } from '@/lib/scoring';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function batchScoreLeads() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, google_place_id')
      .eq('user_id', user.id)
      .lte('score', 0); // only leads that haven't been scored

    if (error || !leads?.length)
      return { success: false, message: 'No leads to score.' };

    const updatedLeads = await Promise.all(
      leads.map(async (lead) => {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${lead.google_place_id}&key=${apiKey}`;
        const res = await fetch(detailsUrl);
        const data = await res.json();
        const details = data.result;

        if (!data.result) {
          console.error(
            `No details returned for place ID: ${lead.google_place_id}`
          );
          return { id: lead.id, score: 0 };
        }

        const score = scoreLead(details);
        console.log('Scoring lead:', lead.id, 'Score:', score);

        return {
          id: lead.id,
          score,
        };
      })
    );

    for (const lead of updatedLeads) {
      const { error } = await supabase
        .from('leads')
        .update({ score: lead.score })
        .eq('id', lead.id);

      if (error) {
        console.error(`Failed to update lead ${lead.id}:`, error.message);
      }
    }

    return { success: true, updated: updatedLeads.length };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Error scoring leads: ${(error as Error).message}`,
    };
  }
}
