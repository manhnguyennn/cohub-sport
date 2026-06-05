'use client';

/**
 * /notifications — Trang thông báo đầy đủ (Tuần 7).
 * Filter theo loại + "Đánh dấu tất cả đã đọc". Click → điều hướng + mark read.
 */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState, SkeletonList } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatRelative } from '@lib/date';
import { notificationService } from '@services/notification.service';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@lib/cn';
import type { AppNotification, NotificationType } from '@app-types/notification';
import { NOTIF_ICON, NOTIF_TYPE_LABEL } from '@app-types/notification';

type Filter = 'all' | NotificationType;
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'booking', label: 'Đặt lịch' },
  { key: 'message', label: 'Tin nhắn' },
  { key: 'payment', label: 'Thanh toán' },
  { key: 'review', label: 'Đánh giá' },
  { key: 'system', label: 'Hệ thống' },
];

export default function NotificationsClient() {
  const router = useRouter();
  const { user, isReady, isLoggedIn, requireLogin } = useAuth();
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const userId = user?.id ?? '';

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) { requireLogin({ redirectTo: ROUTES.notifications }); return; }
    if (!userId) return;
    notificationService.list(userId).then(setItems).catch(() => setItems([]));
  }, [isReady, isLoggedIn, userId, requireLogin]);

  const visible = useMemo(
    () => (items ?? []).filter((n) => filter === 'all' || n.type === filter),
    [items, filter],
  );
  const unreadCount = (items ?? []).filter((n) => !n.read).length;

  function open(n: AppNotification) {
    setItems((prev) => prev ? prev.map((x) => x.id === n.id ? { ...x, read: true } : x) : prev);
    notificationService.markRead(n.id).catch(() => {});
    if (n.href) router.push(n.href);
  }

  function markAll() {
    setItems((prev) => prev ? prev.map((x) => ({ ...x, read: true })) : prev);
    if (userId) notificationService.markAllRead(userId).catch(() => {});
  }

  return (
    <div className="ntf-page">
      <div className="ntf-page__container">
        <header className="ntf-head">
          <div>
            <h1 className="ntf-head__title">Thông báo</h1>
            <p className="ntf-head__sub">{unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc hết thông báo'}</p>
          </div>
          {unreadCount > 0 && (
            <button type="button" className="ntf-head__mark" onClick={markAll}>
              <AppIcon name="check" size={15} /> Đánh dấu tất cả đã đọc
            </button>
          )}
        </header>

        <nav className="ntf-filters" aria-label="Lọc thông báo">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={cn('ntf-filters__chip', filter === f.key && 'is-active')}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        {items === null ? (
          <SkeletonList rows={5} />
        ) : visible.length === 0 ? (
          <EmptyState title="Không có thông báo" description="Các cập nhật về booking, tin nhắn và thanh toán sẽ hiện ở đây." />
        ) : (
          <ul className="ntf-list">
            {visible.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={cn('ntf-item', !n.read && 'is-unread')}
                  onClick={() => open(n)}
                >
                  <span className={cn('ntf-item__icon', `ntf-item__icon--${n.type}`)}>
                    <AppIcon name={n.icon ?? NOTIF_ICON[n.type]} size={18} />
                  </span>
                  <span className="ntf-item__body">
                    <span className="ntf-item__top">
                      <strong className="ntf-item__title">{n.title}</strong>
                      <span className="ntf-item__time">{formatRelative(n.createdAt)}</span>
                    </span>
                    <span className="ntf-item__text">{n.body}</span>
                    <span className="ntf-item__tag">{NOTIF_TYPE_LABEL[n.type]}</span>
                  </span>
                  {!n.read && <span className="ntf-item__dot" aria-label="Chưa đọc" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
