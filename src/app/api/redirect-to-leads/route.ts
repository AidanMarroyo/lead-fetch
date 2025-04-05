import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.set('redirect_reason', 'upgrade', {
    path: '/',
    maxAge: 10,
  });

  return NextResponse.redirect(
    new URL('/dashboard/leads', process.env.NEXT_PUBLIC_SITE_URL)
  );
}
