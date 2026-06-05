'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AppIcon, { type AppIconName } from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@lib/cn';

type Variant = 'coach' | 'admin';
type NavItem = { href: string; label: string; icon: AppIconName };

const NAV: Record<Variant, NavItem[]> = {
  coach: [
    { href: ROUTES.coachDashboard, label: 'Tổng quan', icon: 'chart' },
    { href: ROUTES.coachBookings, label: 'Booking', icon: 'briefcase' },
    { href: ROUTES.coachMessages, label: 'Tin nhắn', icon: 'chat' },
    { href: ROUTES.coachSessions, label: 'Lịch dạy mở', icon: 'calendar' },
    { href: ROUTES.coachCourses, label: 'Khoá học', icon: 'book' },
    { href: ROUTES.coachCalendar, label: 'Lịch tổng quan', icon: 'calendarTick' },
  ],
  admin: [
    { href: ROUTES.admin, label: 'Tổng quan', icon: 'chart' },
    { href: ROUTES.adminReviews, label: 'Duyệt HLV', icon: 'shield' },
  ],
};

const VARIANT_LABEL: Record<Variant, string> = { coach: 'Coach Studio', admin: 'Admin Console' };
const ROLE_LABEL: Record<string, string> = { coach: 'Huấn luyện viên', admin: 'Quản trị', user: 'Học viên' };

export default function DashboardShell({ variant, children }: { variant: Variant; children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);

  const items = NAV[variant];
  const active = items.reduce<NavItem | null>((best, it) => {
    const match = pathname === it.href || pathname?.startsWith(it.href + '/');
    if (match && it.href.length > (best?.href.length ?? 0)) return it;
    return best;
  }, null);

  return (
    <div className="dash-shell">
      {/* Sidebar */}
      <aside className={cn('dash-shell__sidebar', open && 'is-open')}>
        <div className="dash-shell__brand">
          <Link href={ROUTES.home} className="dash-shell__logo">
            <Image src="/images/cohub-logo.svg" alt="CoHub" width={28} height={28} />
            <span>CoHub</span>
          </Link>
          <span className="dash-shell__variant">{VARIANT_LABEL[variant]}</span>
        </div>

        <nav className="dash-shell__nav" aria-label="Dashboard">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={cn('dash-shell__navitem', it === active && 'is-active')}
              onClick={() => setOpen(false)}
            >
              <AppIcon name={it.icon} size={18} />
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="dash-shell__foot">
          {user && (
            <div className="dash-shell__user">
              <Image src={user.avatar ?? '/images/Container.webp'} alt={user.fullName} width={36} height={36} className="dash-shell__user-av" />
              <div className="dash-shell__user-info">
                <strong>{user.fullName}</strong>
                <small>{(role && ROLE_LABEL[role]) ?? role ?? ''}</small>
              </div>
            </div>
          )}
          <Link href={ROUTES.home} className="dash-shell__back">
            <AppIcon name="global" size={16} /> Về trang chủ
          </Link>
        </div>
      </aside>

      {open && <div className="dash-shell__overlay" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="dash-shell__main">
        <header className="dash-shell__topbar">
          <button type="button" className="dash-shell__burger" aria-label="Mở menu" onClick={() => setOpen(true)}>
            <span /><span /><span />
          </button>
          <h1 className="dash-shell__pagetitle">{active?.label ?? VARIANT_LABEL[variant]}</h1>
          <Link href={ROUTES.home} className="dash-shell__site-link">
            Xem trang web <AppIcon name="next" size={15} />
          </Link>
        </header>

        <div className="dash-shell__content">{children}</div>
      </div>
    </div>
  );
}
