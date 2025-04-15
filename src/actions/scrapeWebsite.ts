'use server';

// lib/scrapeWebsite.ts
import puppeteer from 'puppeteer';

export async function scrapeWebsite(url: string) {
  if (!url.startsWith('http')) url = 'https://' + url;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  );
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
  });

  const content = await page.content();

  const data = await page.evaluate(() => {
    const h1 = !!document.querySelector('h1');
    const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(
      (h) => h.textContent?.trim() || ''
    );
    const buttons = Array.from(document.querySelectorAll('button, a')).filter(
      (el) => {
        const text = el.textContent?.toLowerCase() || '';
        return ['contact', 'get quote', 'learn more', 'book'].some((kw) =>
          text.includes(kw)
        );
      }
    );

    const images = Array.from(document.querySelectorAll('img'));
    const missingAlt = images.filter(
      (img) => !img.alt || img.alt.trim() === ''
    ).length;

    return {
      h1,
      headings,
      buttonCount: buttons.length,
      imageCount: images.length,
      imagesMissingAlt: missingAlt,
      wordCount: document.body.innerText.split(/\s+/).length,
      hasMobileMeta: !!document.querySelector('meta[name="viewport"]'),
    };
  });

  await browser.close();

  return {
    ...data,
    success: true,
    rawHtml: content,
    url,
  };
}
