// /app/api/scrape/route.ts (App Router)

import puppeteer from 'puppeteer';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures Node.js runtime

export async function POST(req: NextRequest) {
  const body = await req.json();
  let { url } = body;

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL is required' },
      { status: 400 }
    );
  }

  // Force HTTPS and clean up bad formats
  if (!url.startsWith('http')) url = 'https://' + url;
  if (url.startsWith('http://')) url = url.replace('http://', 'https://');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    );

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });
    } catch (gotoErr) {
      console.error('[page.goto failed]', gotoErr);
      await browser.close();
      return NextResponse.json(
        {
          success: false,
          error: `Unable to load URL: ${url}`,
        },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      ...data,
      rawHtml: content,
      url,
      success: true,
    });
  } catch (err) {
    console.error('[scrape error]', err);
    await browser.close();
    return NextResponse.json(
      {
        success: false,
        error: 'Scrape failed. The website may be blocking automated access.',
      },
      { status: 500 }
    );
  }
}
