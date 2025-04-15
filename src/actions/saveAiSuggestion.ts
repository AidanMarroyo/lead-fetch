// /actions/saveAiSuggestions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

// export async function saveAiSuggestions(
//   leadId: string,
//   suggestions: string,
//   grade?: 'bad' | 'average' | 'good'
// ) {
//   const supabase = await createClient();

//   const { error } = await supabase
//     .from('leads')
//     .update({
//       ai_suggestions: suggestions,
//       ...(grade && { website_grade: grade }),
//     })
//     .eq('id', leadId);

//   if (error) {
//     console.error('Failed to save AI suggestions:', error.message);
//     return false;
//   }

//   return true;
// }

export async function saveAiSuggestions(
  leadId: string,
  suggestions: string,
  grade?: 'bad' | 'average' | 'good',
  score?: number
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('leads')
    .update({
      ai_suggestions: suggestions,
      ...(grade && { website_grade: grade }),
      ...(score && { website_score: score }),
    })
    .eq('id', leadId);

  if (error) {
    console.error('Failed to save AI suggestions:', error.message);
    return false;
  }

  return true;
}
