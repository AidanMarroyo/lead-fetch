// app/actions/getTechStack.ts
'use server';

export async function getTechStack(domain: string) {
  const apiKey = process.env.BUILTWITH_API_KEY;
  const url = `https://api.builtwith.com/v20/api.json?KEY=${apiKey}&LOOKUP=${domain}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`BuiltWith API error for domain: ${domain}`);
    return null;
  }

  const data = await res.json();
  return data;
}
