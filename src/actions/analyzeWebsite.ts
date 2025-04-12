// app/actions/analyzeWebsite.ts
'use server';

import { JSDOM } from 'jsdom';

export async function analyzeWebsite(url: string) {
  try {
    if (!url.startsWith('http')) {
      url = 'http://' + url;
    }

    const res = await fetch(url, { redirect: 'follow' });
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = doc.querySelector('title')?.textContent || '';
    const description =
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      '';
    const favicon =
      doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
      doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
      '/favicon.ico';

    const usesSSL = url.startsWith('https://');

    return {
      success: true,
      data: {
        title,
        description,
        favicon: favicon.startsWith('http')
          ? favicon
          : new URL(favicon, url).href,
        usesSSL,
        url,
      },
    };
  } catch (err) {
    console.error('Failed to analyze website:', err);
    return { success: false, error: 'Could not fetch website metadata.' };
  }
}
