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
  visibleText, 
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
  visibleText?: string;
}) {
  const prompt = `
You are a professional website consultant. Analyze this business website using the provided technical and visual data.

Provide actionable improvement suggestions for increasing conversions, SEO, and user trust.

Use a neutral, direct tone with no casual language or personality.

Format the output as a list of bullet points or numbered items, with each recommendation on its own line.

Each point must be on a separate line

Avoid conversational phrases like "buddy", "let's", or "you gotta".

If website content is provided, include suggestions related to improving it for relevance, clarity, and industry alignment.

End with:
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
${visibleText ? `\nPage Content:\n${visibleText.slice(0, 1500)}` : ''}
\n\nList your improvement suggestions below. Each point on its own line.
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
