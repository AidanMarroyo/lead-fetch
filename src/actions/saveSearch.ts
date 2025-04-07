'use server';

import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth';

type Props = {
  keyword: string;
  location: string;
};

export async function saveSearch({ keyword, location }: Props) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('saved_searches').insert({
    user_id: user.id,
    keyword,
    location,
  });

  if (error) throw new Error(error.message);
}
