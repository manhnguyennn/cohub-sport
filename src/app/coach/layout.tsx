'use client';

import { usePathname } from 'next/navigation';
import DashboardShell from '@components/layout/DashboardShell';
import { isDashboardRoute } from '@lib/dashboard-routes';

/**
 * Layout cho /coach/*. CRM (dashboard/sessions/courses/calendar/bookings)
 * dùng DashboardShell. Onboarding/verification giữ chrome site (passthrough).
 */
export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!isDashboardRoute(pathname)) return <>{children}</>;
  return <DashboardShell variant="coach">{children}</DashboardShell>;
}
