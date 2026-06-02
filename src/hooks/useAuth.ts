'use client';

/**
 * useAuth() — auth state giả dựa trên persona đang active.
 *
 * Khi MVP swap sang BE thật:
 *  - Thay logic này bằng call NextAuth / JWT / Cookie session
 *  - Component không cần đổi (API: isLoggedIn, role, user, requireLogin)
 */
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { usePersona } from '@contexts/PersonaContext';
import { ROUTES } from '@config/routes';
import type { UserRole } from '@app-types/user';

export type UseAuthValue = {
  user: ReturnType<typeof usePersona>['user'];
  role: UserRole | null;
  isLoggedIn: boolean;
  isReady: boolean;
  /**
   * Đảm bảo user đã login. Nếu chưa → push /auth/login?next=<currentPath>.
   * Return true nếu đã login, false nếu vừa redirect.
   */
  requireLogin: (opts?: { redirectTo?: string }) => boolean;
  /**
   * Đảm bảo user có role required. Nếu thiếu → redirect login / unauthorized.
   */
  requireRole: (required: UserRole) => boolean;
  logout: () => void;
};

export function useAuth(): UseAuthValue {
  const { user, role, isLoggedIn, isReady, logout } = usePersona();
  const router = useRouter();
  const pathname = usePathname();

  const requireLogin = useCallback(
    (opts?: { redirectTo?: string }): boolean => {
      if (!isReady) return false; // chờ hydrate
      if (isLoggedIn) return true;
      const next = opts?.redirectTo ?? pathname ?? ROUTES.home;
      router.push(`${ROUTES.login}?next=${encodeURIComponent(next)}`);
      return false;
    },
    [isLoggedIn, isReady, pathname, router],
  );

  const requireRole = useCallback(
    (required: UserRole): boolean => {
      if (!requireLogin()) return false;
      if (role === required) return true;
      // Thiếu role → đẩy về home (đơn giản hoá cho MVP)
      router.push(ROUTES.home);
      return false;
    },
    [requireLogin, role, router],
  );

  return {
    user,
    role,
    isLoggedIn,
    isReady,
    requireLogin,
    requireRole,
    logout,
  };
}
