// app/actions/suggestWebsiteImprovements.ts
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
You are a website marketing expert. Analyze the following business website based on the given metadata and provide 2-3 suggestions for improving it to increase conversions or professionalism.

Title: ${meta.title}
Description: ${meta.description}
Uses SSL: ${meta.usesSSL ? 'Yes' : 'No'}
URL: ${meta.url}

Respond in clear bullet points.
`;

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return {
      success: true,
      suggestions: res.choices[0].message.content,
    };
  } catch (err) {
    console.error('[OpenAI Error]', err);
    return {
      success: false,
      suggestions: 'Unable to fetch suggestions right now.',
    };
  }
}
