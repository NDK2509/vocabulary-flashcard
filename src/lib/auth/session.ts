import { cookies } from 'next/headers';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export const AUTH_COOKIE_NAME = 'auth_session';
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
}

export function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

export async function setAuthSessionCookie(signedToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, signedToken, getCookieOptions());
}

export async function clearAuthSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, '', {
    ...getCookieOptions(),
    maxAge: 0,
  });
}

export async function getAuthSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export function setResponseAuthCookie(
  responseCookies: ResponseCookies,
  signedToken: string
): void {
  responseCookies.set(AUTH_COOKIE_NAME, signedToken, getCookieOptions());
}

export function clearResponseAuthCookie(responseCookies: ResponseCookies): void {
  responseCookies.set(AUTH_COOKIE_NAME, '', {
    ...getCookieOptions(),
    maxAge: 0,
  });
}

