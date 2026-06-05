'use client';

/** /admin — Dashboard tổng quan (H6): stats hôm nay + queue duyệt coach. */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkeletonDetail } from '@components/ui';
import AppIcon, { type AppIconName } from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatVND } from '@lib/date';
import { adminService } from '@services/admin.service';
import { useAuth } from '@hooks/useAuth';
import type { AdminStats } from '@app-types/admin';

export default function AdminDashboardClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) { requireLogin({ redirectTo: ROUTES.admin }); return; }
    if (role !== 'admin') { router.replace('/'); return; }
    adminService.stats().then(setStats).catch(() => setStats(null));
  }, [isReady, isLoggedIn, role, requireLogin, router]);

  if (!stats) {
    return <div className="coach-cms"><div className="coach-cms__container"><SkeletonDetail /></div></div>;
  }

  const cards: { icon: AppIconName; label: string; value: string }[] = [
    { icon: 'wallet', label: 'GMV hôm nay', value: formatVND(stats.gmvToday) },
    { icon: 'calendar', label: 'Booking hôm nay', value: `${stats.bookingsToday}` },
    { icon: 'people', label: 'Đăng ký mới', value: `${stats.signupsToday}` },
    { icon: 'shield', label: 'Hồ sơ chờ duyệt', value: `${stats.pendingReviews}` },
  ];

  return (
    <div className="coach-cms">
      <div className="coach-cms__container">
        <header className="cms-page-head">
          <div>
            <h1 className="cms-page-head__title">Admin · Tổng quan</h1>
            <p className="cms-page-head__sub">Theo dõi vận hành nền tảng & duyệt chất lượng coach.</p>
          </div>
        </header>

        <section className="cms-stats">
          {cards.map((c) => (
            <div className="cms-stat" key={c.label}>
              <span className="cms-stat__icon" aria-hidden><AppIcon name={c.icon} size={22} /></span>
              <span className="cms-stat__label">{c.label}</span>
              <strong className="cms-stat__value">{c.value}</strong>
            </div>
          ))}
        </section>

        <Link href={ROUTES.adminReviews} className="admin-cta">
          <div>
            <strong>{stats.pendingReviews} hồ sơ coach đang chờ duyệt</strong>
            <span>Ưu tiên theo hạn SLA — duyệt để coach lên sàn.</span>
          </div>
          <span className="admin-cta__btn">Mở queue duyệt <AppIcon name="next" size={16} color="#fff" /></span>
        </Link>
      </div>
    </div>
  );
}
