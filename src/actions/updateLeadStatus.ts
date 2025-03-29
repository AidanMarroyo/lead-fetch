'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient();

  await supabase.from('leads').update({ status }).eq('id', leadId);
}
