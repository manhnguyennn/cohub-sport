'use client';

/**
 * /coach/dashboard — Tổng quan HLV (FSD §4.14).
 *
 * Layout:
 *  - Banner welcome "🎉 Profile online! Tạo khoá học..."
 *  - 4 stat cards (GMV, sessions, learners, rating)
 *  - Revenue line chart 30d (Recharts)
 *  - Recent bookings table 5 rows
 *  - Inbox preview 3 chat threads
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, SkeletonDetail } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatVND, formatNextSlot } from '@lib/date';
import { dashboardService } from '@services/dashboard.service';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@lib/cn';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import type { CoachDashboard } from '@app-types/dashboard';

export default function CoachDashboardClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const [data, setData] = useState<CoachDashboard | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) { requireLogin({ redirectTo: ROUTES.coachDashboard }); return; }
    if (role !== 'coach' && role !== 'admin') {
      // Persona không có role coach → đẩy về home
      router.replace('/');
      return;
    }
    dashboardService.coachOverview().then(setData).catch(() => setData(null));
  }, [isReady, isLoggedIn, role, requireLogin, router]);

  if (!isReady || !isLoggedIn) return null;
  if (!data) {
    return (
      <div className="coach-cms__container">
        <SkeletonDetail />
      </div>
    );
  }

  return (
    <div className="coach-cms">
      <div className="coach-cms__container">
        {/* Welcome banner */}
        <header className="cms-banner">
          <div>
            <strong>🎉 Profile của bạn đang online</strong>
            <p>
              Mở <em>lịch dạy mở</em> để học viên đặt từng buổi linh hoạt, hoặc tạo <em>khoá học</em>{' '}
              dài hạn cho gói trọn vẹn.
            </p>
          </div>
          <div className="cms-banner__actions">
            <Button href={ROUTES.coachSessionNew} variant="primary" size="md">
              + Mở lịch dạy mới
            </Button>
            <Button href={ROUTES.coachCourseNew} variant="secondary" size="md">
              + Tạo khoá học
            </Button>
          </div>
        </header>

        {/* Quick nav strip — coach CMS modules */}
        <nav className="cms-quicknav" aria-label="Coach modules">
          <Link href={ROUTES.coachSessions} className="cms-quicknav__item">
            <span className="cms-quicknav__icon" aria-hidden>🗓</span>
            <strong>Lịch dạy mở</strong>
            <small>Từng buổi cụ thể có giá riêng</small>
          </Link>
          <Link href={ROUTES.coachCourses} className="cms-quicknav__item">
            <span className="cms-quicknav__icon" aria-hidden>📚</span>
            <strong>Khoá học</strong>
            <small>Gói nhiều buổi trọn gói</small>
          </Link>
          <Link href={ROUTES.coachCalendar} className="cms-quicknav__item">
            <span className="cms-quicknav__icon" aria-hidden>📅</span>
            <strong>Lịch tổng quan</strong>
            <small>Xem tuần/tháng, block giờ</small>
          </Link>
          <Link href={ROUTES.coachBookings} className="cms-quicknav__item">
            <span className="cms-quicknav__icon" aria-hidden>💼</span>
            <strong>Booking đang chờ</strong>
            <small>Phản hồi đặt lịch của học viên</small>
          </Link>
        </nav>

        {/* 4 stat cards */}
        <section className="cms-stats">
          <StatCard
            label="GMV tháng này"
            value={formatVND(data.stats.gmvMonth.amount)}
            delta={data.stats.gmvDelta}
            icon="💰"
          />
          <StatCard
            label="Buổi đã dạy"
            value={`${data.stats.sessionsMonth} buổi`}
            delta={data.stats.sessionsDelta}
            icon="🎯"
          />
          <StatCard
            label="Học viên mới"
            value={`${data.stats.newLearners} người`}
            delta={data.stats.newLearnersDelta}
            icon="👥"
          />
          <StatCard
            label="Đánh giá trung bình"
            value={`${data.stats.avgRating.toFixed(1)} ★`}
            icon="⭐"
            valueClass="cms-stat__value--warning"
          />
        </section>

        {/* Revenue chart */}
        <section className="cms-card">
          <header className="cms-card__head">
            <div>
              <h2>Doanh thu 30 ngày</h2>
              <small>Sau khi trừ phí nền tảng 15%</small>
            </div>
            <strong className="cms-card__head-value">
              {formatVND(data.revenue30d.reduce((a, b) => a + b.revenue, 0))}
            </strong>
          </header>

          <div className="cms-chart">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.revenue30d} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="cms-rev-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A2ADF" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#1A2ADF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--divider)" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v: string) => v.slice(5).replace('-', '/')}
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tickFormatter={(v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  formatter={(v: unknown) => formatVND(Number(v) || 0)}
                  labelFormatter={(label: unknown) => {
                    const s = String(label ?? '');
                    return `Ngày ${s.slice(5).replace('-', '/')}`;
                  }}
                  contentStyle={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1A2ADF"
                  strokeWidth={2}
                  fill="url(#cms-rev-grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent bookings + Inbox preview side-by-side */}
        <div className="cms-grid-2">
          <section className="cms-card">
            <header className="cms-card__head">
              <h2>Buổi tập gần đây</h2>
              <Link href={ROUTES.coachBookings} className="cms-card__link">Xem tất cả →</Link>
            </header>

            <table className="cms-table">
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="cms-table__user">
                      {b.learnerAvatar && (
                        <Image src={b.learnerAvatar} alt={b.learnerName} width={28} height={28} />
                      )}
                      <span>{b.learnerName}</span>
                    </td>
                    <td>{formatNextSlot(b.startsAt)}</td>
                    <td>
                      <span className={cn('cms-badge', `cms-badge--${b.status}`)}>
                        {b.status === 'pending'   ? 'Chờ xác nhận' :
                         b.status === 'confirmed' ? 'Đã xác nhận' :
                         b.status === 'completed' ? 'Hoàn thành' : 'Đã huỷ'}
                      </span>
                    </td>
                    <td><strong>{formatVND(b.amount)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="cms-card">
            <header className="cms-card__head">
              <h2>Tin nhắn mới</h2>
              <Link href="/messages" className="cms-card__link">Xem tất cả →</Link>
            </header>

            <ul className="cms-inbox">
              {data.inbox.map((t) => (
                <li key={t.id} className={cn('cms-inbox__item', t.unread && 'cms-inbox__item--unread')}>
                  {t.partnerAvatar && (
                    <Image src={t.partnerAvatar} alt={t.partnerName} width={36} height={36} />
                  )}
                  <div className="cms-inbox__body">
                    <div className="cms-inbox__head">
                      <strong>{t.partnerName}</strong>
                      <time>{timeShort(t.lastAt)}</time>
                    </div>
                    <p>{t.lastMessage}</p>
                  </div>
                  {t.unread && <span className="cms-inbox__dot" aria-label="Chưa đọc" />}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, icon, valueClass }: {
  label: string;
  value: string;
  delta?: number;
  icon: string;
  valueClass?: string;
}) {
  return (
    <div className="cms-stat">
      <span className="cms-stat__icon" aria-hidden>{icon}</span>
      <span className="cms-stat__label">{label}</span>
      <strong className={cn('cms-stat__value', valueClass)}>{value}</strong>
      {delta !== undefined && (
        <span className={cn('cms-stat__delta', delta >= 0 ? 'is-pos' : 'is-neg')}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% so với tháng trước
        </span>
      )}
    </div>
  );
}

function timeShort(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}p`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}g`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}n`;
  return `${Math.floor(days / 7)}w`;
}
