// app/actions/deleteSavedSearch.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from './logActivity';

export async function deleteSavedSearch(id: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { data } = await supabase
    .from('profiles')
    .select('team_id, first_name, last_name')
    .eq('id', user.id)
    .single();

  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  await logActivity({
    userId: user.id,
    teamId: data?.team_id,
    action: 'saved_search_deleted',
    message: `${data?.first_name} ${data?.last_name} deleted saved search id ${id}`,
  });
}
