import type { ID, ISODateString } from './common';

export type UserRole = 'user' | 'coach' | 'admin';

export type User = {
  id: ID;
  email: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  createdAt: ISODateString;
};

export type LoginInput = { email: string; password: string };
export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'coach';
};

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: ISODateString;
};
