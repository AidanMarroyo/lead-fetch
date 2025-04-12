'use server';

import { createClient } from '@/utils/supabase/server';
import axios from 'axios';

async function getBuiltWithData(domain: string) {
  const apiKey = process.env.BUILTWITH_API_KEY;
  const url = `https://api.builtwith.com/v20/api.json?KEY=${apiKey}&LOOKUP=${domain}`;

  try {
    const response = await axios.get(url);

    const techNames: string[] =
      response.data?.Results?.[0]?.Result?.Paths?.flatMap(
        (path: { Technologies?: { Name: string }[] }) =>
          path.Technologies?.map((tech: { Name: string }) => tech.Name)
      ) || [];

    return {
      techStack: Array.from(new Set(techNames)),
      trafficRank:
        response.data?.Results?.[0]?.Result?.Alexa?.GlobalRank ?? null,
      adSpendEstimate: null, // You may supplement this with another API later
      optimizationLevel: estimateOptimizationLevel(techNames),
    };
  } catch (error) {
    console.error('BuiltWith API error:', error);
    return null;
  }
}

// 🔍 Very simple heuristic – tweak as needed
function estimateOptimizationLevel(
  techStack: string[]
): 'basic' | 'intermediate' | 'advanced' {
  const lower = techStack.map((t) => t.toLowerCase());
  const hasAnalytics = lower.some((t) => t.includes('google analytics'));
  const hasFramework = lower.some((t) =>
    ['react', 'vue', 'angular', 'next'].some((f) => t.includes(f))
  );
  const hasSEO = lower.some((t) => t.includes('yoast') || t.includes('seo'));

  if (hasFramework && hasAnalytics && hasSEO) return 'advanced';
  if (hasFramework || hasAnalytics) return 'intermediate';
  return 'basic';
}

export async function fetchAndSaveCompetitorData(
  leadId: string,
  website: string
) {
  const supabase = await createClient();
  const parsedDomain = website.replace(/^https?:\/\//, '').split('/')[0];

  try {
    const data = await getBuiltWithData(parsedDomain);

    if (!data) {
      return { success: false, message: 'Failed to retrieve competitor data.' };
    }

    const { error } = await supabase
      .from('leads')
      .update({
        tech_stack: data.techStack,
        traffic_rank: data.trafficRank,
        ad_spend_estimate: data.adSpendEstimate,
        optimization_level: data.optimizationLevel,
      })
      .eq('id', leadId);

    if (error) {
      console.error('Supabase save error:', error.message);
      return { success: false, message: 'Failed to save competitor data' };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[Competitor Analysis Error]', err);
    return { success: false, message: 'Error during competitor analysis.' };
  }
}
