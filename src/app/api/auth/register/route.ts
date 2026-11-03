import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { setResponseAuthCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const { user, signedToken } = await registerUser(email, password);

    const response = NextResponse.json({ user }, { status: 201 });
    setResponseAuthCookie(response.cookies, signedToken);

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    if (message === 'Email is already registered') {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

