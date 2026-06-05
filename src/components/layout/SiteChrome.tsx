'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { isDashboardRoute } from '@lib/dashboard-routes';

/**
 * Chrome của site (Header + Footer). Ẩn trên các route CRM/admin —
 * những route đó tự render DashboardShell riêng (SaaS layout).
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isDashboardRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
