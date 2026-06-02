import { apiClient } from '@lib/apiClient';
import type { AuthSession, LoginInput, RegisterInput, User } from '@app-types/user';

export const authService = {
  login: (input: LoginInput): Promise<AuthSession> => apiClient.post('/auth/login', input),

  register: (input: RegisterInput): Promise<AuthSession> =>
    apiClient.post('/auth/register', input),

  me: (): Promise<User> => apiClient.get('/auth/me'),
};
