import type { AuthSession, LoginInput, RegisterInput, User } from '@app-types/user';
import { registerMock } from '@lib/mockRegistry';

const mockUsers: User[] = [
  {
    id: 'u-demo',
    email: 'demo@cohub.vn',
    fullName: 'Demo User',
    role: 'user',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

function buildSession(user: User): AuthSession {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return {
    user,
    accessToken: `mock-token-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    expiresAt,
  };
}

registerMock('POST /auth/login', ({ body }) => {
  const input = body as LoginInput;
  const found = mockUsers.find((u) => u.email === input.email);
  if (!found) throw new Error('Email hoặc mật khẩu không đúng');
  return buildSession(found);
});

registerMock('POST /auth/register', ({ body }) => {
  const input = body as RegisterInput;
  const newUser: User = {
    id: `u-${Date.now()}`,
    email: input.email,
    fullName: input.fullName,
    role: input.role,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return buildSession(newUser);
});

registerMock('GET /auth/me', () => mockUsers[0]);
