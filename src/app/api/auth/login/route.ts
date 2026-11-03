import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { setResponseAuthCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { user, signedToken } = await authenticateUser(email, password);

    const response = NextResponse.json({ user }, { status: 200 });
    setResponseAuthCookie(response.cookies, signedToken);

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    if (message === 'Invalid email or password') {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

