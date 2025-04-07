// app/actions/getSavedSearches.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export async function getSavedSearches() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
