import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from './auth';

export async function getUserSubscription() {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data;
}
