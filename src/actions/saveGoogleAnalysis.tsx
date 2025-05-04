'use server';

import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

export async function saveGoogleAnalysis({
  analysis,
  placeId,
}: {
  analysis: string;
  placeId: string;
}) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('leads')
    .update({
      google_analysis: analysis,
    })
    .eq('google_place_id', placeId);

  if (error) {
    console.error('Error saving Google analysis:', error);
    throw new Error('Failed to save Google analysis');
  }

  return { success: true };
}
