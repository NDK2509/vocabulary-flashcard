import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifySignedToken, deleteDbSession } from '@/lib/auth';
import { clearResponseAuthCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const signedToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (signedToken) {
    const rawToken = verifySignedToken(signedToken);
    if (rawToken) {
      await deleteDbSession(rawToken);
    }
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  clearResponseAuthCookie(response.cookies);

  return response;
}

