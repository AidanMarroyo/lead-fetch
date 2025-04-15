'use server';

// lib/suggestWebsiteImprovements.ts
import { openai } from '../lib/openai';

export async function suggestWebsiteImprovements({
  url,
  h1,
  buttonCount,
  imageCount,
  imagesMissingAlt,
  wordCount,
  hasMobileMeta,
  techStack,
  optimizationLevel,
  trafficRank,
  adSpendEstimate,
}: {
  url: string;
  h1: boolean;
  buttonCount: number;
  imageCount: number;
  imagesMissingAlt: number;
  wordCount: number;
  hasMobileMeta: boolean;
  techStack: string[];
  optimizationLevel: string;
  trafficRank: number | null;
  adSpendEstimate: string | null;
}) {
  const prompt = `
You are a senior website consultant. Analyze this business website using the provided technical and visual data. Suggest 2–3 improvements to increase conversions, SEO, or user trust.

Give your advice in a human, casual tone. End with:
Grade: bad | average | good

---
URL: ${url}
Has H1: ${h1 ? 'Yes' : 'No'}
CTA Buttons: ${buttonCount}
Images: ${imageCount} (Missing ALT: ${imagesMissingAlt})
Word Count: ${wordCount}
Mobile Optimized: ${hasMobileMeta ? 'Yes' : 'No'}
Tech Stack: ${techStack.join(', ')}
Optimization Level: ${optimizationLevel}
Traffic Rank: ${trafficRank ?? 'N/A'}
Ad Spend: ${adSpendEstimate ?? 'N/A'}
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const content = res.choices[0].message.content || '';
  const gradeMatch = content.match(/Grade:\s*(bad|average|good)/i);
  const grade = gradeMatch?.[1]?.toLowerCase() as 'bad' | 'average' | 'good';

  return {
    suggestions: content.trim(),
    grade,
  };
}
