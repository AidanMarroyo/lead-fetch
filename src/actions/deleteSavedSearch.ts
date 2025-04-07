// app/actions/deleteSavedSearch.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export async function deleteSavedSearch(id: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
}
