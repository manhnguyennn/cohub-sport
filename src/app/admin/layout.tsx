import DashboardShell from '@components/layout/DashboardShell';

/** Layout cho /admin/* — toàn bộ là Admin Console (SaaS shell). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell variant="admin">{children}</DashboardShell>;
}
