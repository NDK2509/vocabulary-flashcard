import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as registerHandler } from './register/route';
import { POST as loginHandler } from './login/route';
import { POST as logoutHandler } from './logout/route';
import { GET as meHandler } from './me/route';
import * as authService from '@/lib/auth';

vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual<typeof authService>('@/lib/auth');
  return {
    ...actual,
    registerUser: vi.fn(),
    authenticateUser: vi.fn(),
    findSessionAndUser: vi.fn(),
    deleteDbSession: vi.fn(),
  };
});

describe('Custom Auth REST API Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('AC-3: returns 400 when email or password is missing or password < 6 chars', async () => {
      const req1 = new NextRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: '', password: '123' }),
      });
      const res1 = await registerHandler(req1);
      expect(res1.status).toBe(400);

      const req2 = new NextRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com', password: '123' }),
      });
      const res2 = await registerHandler(req2);
      expect(res2.status).toBe(400);
      const data2 = await res2.json();
      expect(data2.error).toContain('at least 6 characters');
    });

    it('AC-2: returns 409 when email already exists', async () => {
      vi.mocked(authService.registerUser).mockRejectedValueOnce(
        new Error('Email is already registered')
      );

      const req = new NextRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'existing@example.com', password: 'password123' }),
      });
      const res = await registerHandler(req);
      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.error).toBe('Email is already registered');
    });

    it('AC-1: returns 201 with user and sets auth_session cookie on success', async () => {
      vi.mocked(authService.registerUser).mockResolvedValueOnce({
        user: { id: 'user-1', email: 'new@example.com', createdAt: new Date().toISOString() },
        signedToken: 'mockToken.mockSig',
      });

      const req = new NextRequest('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'new@example.com', password: 'password123' }),
      });
      const res = await registerHandler(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.user.email).toBe('new@example.com');
      expect(res.cookies.get('auth_session')?.value).toBe('mockToken.mockSig');
    });
  });

  describe('POST /api/auth/login', () => {
    it('AC-5: returns 401 on invalid credentials', async () => {
      vi.mocked(authService.authenticateUser).mockRejectedValueOnce(
        new Error('Invalid email or password')
      );

      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'wrong@example.com', password: 'wrong' }),
      });
      const res = await loginHandler(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Invalid email or password');
    });

    it('AC-4: returns 200 with user and session cookie on valid credentials', async () => {
      vi.mocked(authService.authenticateUser).mockResolvedValueOnce({
        user: { id: 'user-1', email: 'valid@example.com', createdAt: new Date().toISOString() },
        signedToken: 'mockLoginToken.mockSig',
      });

      const req = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'valid@example.com', password: 'correctPassword' }),
      });
      const res = await loginHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email).toBe('valid@example.com');
      expect(res.cookies.get('auth_session')?.value).toBe('mockLoginToken.mockSig');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('AC-6: clears session cookie and returns success 200', async () => {
      const req = new NextRequest('http://localhost/api/auth/logout', {
        method: 'POST',
      });
      const res = await logoutHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      // Cookie is cleared with maxAge 0
      expect(res.cookies.get('auth_session')?.maxAge).toBe(0);
    });
  });

  describe('GET /api/auth/me', () => {
    it('AC-8: returns 401 when no session cookie is provided', async () => {
      const req = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
      });
      const res = await meHandler(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.user).toBeNull();
    });

    it('AC-7: returns 200 with user profile when valid session cookie exists', async () => {
      const rawToken = authService.generateToken();
      const signedToken = authService.signToken(rawToken);

      vi.mocked(authService.findSessionAndUser).mockResolvedValueOnce({
        session: {
          id: 'sess-1',
          token: rawToken,
          user_id: 'user-1',
          expires_at: new Date(Date.now() + 100000),
          created_at: new Date(),
        },
        user: { id: 'user-1', email: 'profile@example.com', createdAt: new Date().toISOString() },
      });

      const req = new NextRequest('http://localhost/api/auth/me', {
        method: 'GET',
        headers: {
          cookie: `auth_session=${signedToken}`,
        },
      });
      const res = await meHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email).toBe('profile@example.com');
    });
  });
});

