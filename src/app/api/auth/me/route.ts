import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifySignedToken, findSessionAndUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const signedToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!signedToken) {
    return NextResponse.json({ user: null, error: 'Unauthorized' }, { status: 401 });
  }

  const rawToken = verifySignedToken(signedToken);
  if (!rawToken) {
    return NextResponse.json({ user: null, error: 'Unauthorized' }, { status: 401 });
  }

  const sessionData = await findSessionAndUser(rawToken);
  if (!sessionData) {
    return NextResponse.json({ user: null, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user: sessionData.user }, { status: 200 });
}

