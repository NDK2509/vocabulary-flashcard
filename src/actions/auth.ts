'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  getCurrentUser,
  authenticateUser,
  registerUser,
  logoutUser,
  setAuthSessionCookie,
} from '@/lib/auth';

export async function getUser() {
  return await getCurrentUser();
}

export async function signIn(formData: FormData): Promise<void> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard';

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent('Email and password are required')}`);
  }

  try {
    const { signedToken } = await authenticateUser(email, password);
    await setAuthSessionCookie(signedToken);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid email or password';
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function signUp(formData: FormData): Promise<void> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    redirect(`/register?error=${encodeURIComponent('Email and password are required')}`);
  }

  if (password.length < 6) {
    redirect(`/register?error=${encodeURIComponent('Password must be at least 6 characters')}`);
  }

  try {
    const { signedToken } = await registerUser(email, password);
    // Instant login without email verification
    await setAuthSessionCookie(signedToken);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    redirect(`/register?error=${encodeURIComponent(message)}`);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut(): Promise<void> {
  await logoutUser();
  revalidatePath('/', 'layout');
  redirect('/login');
}
