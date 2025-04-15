// lib/getBuiltWithData.ts
import axios from 'axios';

export async function getBuiltWithData(domain: string) {
  const apiKey = process.env.BUILTWITH_API_KEY;
  const url = `https://api.builtwith.com/v20/api.json?KEY=${apiKey}&LOOKUP=${domain}`;
  const response = await axios.get(url);
  const result = response.data?.Results?.[0];

  const techStack =
    result?.Result?.Paths?.flatMap(
      (path: { Technologies?: { Name: string }[] }) =>
        path.Technologies?.map((t) => t.Name)
    ) || [];

  return {
    techStack: Array.from(new Set(techStack)) as string[],
    trafficRank: result?.Meta?.ARank ?? null,
    adSpendEstimate: formatAdSpend(result?.Result?.Spend),
    optimizationLevel: estimateOptimizationLevel(techStack),
  };
}

function estimateOptimizationLevel(
  tech: string[]
): 'basic' | 'intermediate' | 'advanced' {
  const lower = tech.map((t) => t.toLowerCase());
  const hasFramework = lower.some((t) =>
    ['react', 'vue', 'next'].some((f) => t.includes(f))
  );
  const hasAnalytics = lower.some((t) => t.includes('analytics'));
  const hasSEO = lower.some((t) => t.includes('seo') || t.includes('yoast'));
  if (hasFramework && hasAnalytics && hasSEO) return 'advanced';
  if (hasFramework || hasAnalytics || hasSEO) return 'intermediate';
  return 'basic';
}

function formatAdSpend(spend: number | undefined | null): string | null {
  if (spend == null) return null;
  if (spend <= 10) return '$0–100/mo';
  if (spend <= 30) return '$100–500/mo';
  if (spend <= 60) return '$500–1,000/mo';
  if (spend <= 90) return '$1,000–5,000/mo';
  return '$5,000+/mo';
}
