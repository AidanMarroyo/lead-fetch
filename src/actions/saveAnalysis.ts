'use server';;
import { Lead } from '@/components/crm-board/types';
import { createClient } from '@/utils/supabase/server';



export async function saveAnalysis(
internalLead: Lead
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('leads')
    .update({
      tech_stack: internalLead.tech_stack,
      traffic_rank: internalLead.traffic_rank,
      ad_spend_estimate: internalLead.ad_spend_estimate,
      optimization_level: internalLead.optimization_level,
      website_score: internalLead.website_score,
      website_grade: internalLead.website_grade,
      auto_pitch: internalLead.auto_pitch,
    })
    .eq('id', internalLead.id);

  if (error) {
    console.error('[Save Error]', error.message);
    return { success: false };
  }

  return { success: true, message: 'Analysis saved successfully!' };
}


