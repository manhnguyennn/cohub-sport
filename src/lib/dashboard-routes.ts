/**
 * Route nào dùng "dashboard shell" (CRM coach + admin) thay vì header/footer site.
 * Onboarding/verification của coach KHÔNG phải CRM → vẫn giữ chrome site.
 */
export function isDashboardRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return true;
  if (pathname.startsWith('/coach/onboarding') || pathname.startsWith('/coach/verification')) return false;
  if (pathname === '/coach' || pathname.startsWith('/coach/')) return true;
  return false;
}
