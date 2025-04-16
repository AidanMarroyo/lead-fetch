'use server';
import { getBuiltWithData } from './fetchCompetitorData';
import { suggestWebsiteImprovements } from './suggestWebsiteImprovement';
import { createClient } from '@/utils/supabase/server';

interface ScrapeData {
  h1: boolean;
  buttonCount: number;
  imageCount: number; // ✅ Add this
  imagesMissingAlt: number;
  wordCount: number;
  hasMobileMeta: boolean;
  visibleText?: string;
}

interface TechData {
  optimizationLevel: string;
}

export async function analyzeAndSaveLead(
  leadId: string,
  url: string,
  scrapeData: ScrapeData
) {
  const supabase = await createClient();
  const domain = new URL(url).hostname;

  const scrape = scrapeData;
  const techData = await getBuiltWithData(domain);
  const suggestions = await suggestWebsiteImprovements({
    url,
    h1: scrape.h1,
    buttonCount: scrape.buttonCount,
    imageCount: scrape.imageCount, // ✅ REQUIRED
    imagesMissingAlt: scrape.imagesMissingAlt,
    wordCount: scrape.wordCount,
    hasMobileMeta: scrape.hasMobileMeta,
    techStack: techData.techStack,
    optimizationLevel: techData.optimizationLevel,
    trafficRank: techData.trafficRank ?? null,
    adSpendEstimate: techData.adSpendEstimate ?? null,
    visibleText: scrape.visibleText,
  });

  const { error } = await supabase
    .from('leads')
    .update({
      tech_stack: techData.techStack,
      traffic_rank: techData.trafficRank,
      ad_spend_estimate: techData.adSpendEstimate,
      optimization_level: techData.optimizationLevel,
      website_score: scoreFrom(scrape, techData),
      website_grade: suggestions.grade,
      auto_pitch: suggestions.suggestions,
    })
    .eq('id', leadId);

  if (error) {
    console.error('[Save Error]', error.message);
    return { success: false };
  }

  return { success: true, data: suggestions };
}

function scoreFrom(scrape: ScrapeData, techData: TechData): number {
  let score = 50;
  if (!scrape.h1) score -= 10;
  if (scrape.buttonCount < 1) score -= 10;
  if (scrape.imagesMissingAlt > 0) score -= 5;
  if (scrape.wordCount < 300) score -= 5;
  if (!scrape.hasMobileMeta) score -= 10;
  if (techData.optimizationLevel === 'advanced') score += 10;
  return Math.max(0, Math.min(score, 100));
}
