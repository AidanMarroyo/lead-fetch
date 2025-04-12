'use server';

import { openai } from '../lib/openai';

type WebsiteMeta = {
  title: string;
  description: string;
  usesSSL: boolean;
  url: string;
};

export async function suggestWebsiteImprovements(meta: WebsiteMeta) {
  const prompt = `
You are a website marketing expert. Analyze the following business website based on the given metadata and provide 2–3 suggestions for improving it to increase conversions or professionalism.

At the end of your suggestions, include a line like this:
Grade: bad | average | good

Only use one of those three values for the grade.

---
Title: ${meta.title}
Description: ${meta.description}
SSL Enabled: ${meta.usesSSL ? 'Yes' : 'No'}
URL: ${meta.url}
`;

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = res.choices[0].message.content || '';
    const gradeMatch = content.match(/Grade:\s*(bad|average|good)/i);
    const grade = gradeMatch?.[1]?.toLowerCase() as
      | 'bad'
      | 'average'
      | 'good'
      | undefined;

    return {
      success: true,
      suggestions: content.trim(),
      grade,
    };
  } catch (err) {
    console.error('[OpenAI Error]', err);
    return {
      success: false,
      suggestions: 'Unable to fetch suggestions right now.',
    };
  }
}
