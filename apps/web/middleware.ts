import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function middleware(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('reason', 'authentication-required');
  const cookie = request.headers.get('cookie');
  if (!cookie) return NextResponse.redirect(loginUrl);

  try {
    const result = await fetch(`${API_URL}/auth/me`, { headers: { cookie }, cache: 'no-store' });
    if (result.ok) return NextResponse.next();
  } catch {
    // An unavailable API is treated as unauthenticated.
  }

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('access_token');
  return response;
}

export const config = { matcher: ['/admin/:path*'] };
