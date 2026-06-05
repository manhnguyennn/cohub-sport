'use client';

/**
 * Bell dropdown ở header — 5 thông báo gần nhất + badge unread.
 * Click item → mark read + điều hướng. "Xem tất cả" → /notifications.
 */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatRelative } from '@lib/date';
import { notificationService } from '@services/notification.service';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@lib/cn';
import type { AppNotification } from '@app-types/notification';
import { NOTIF_ICON } from '@app-types/notification';

export default function NotificationBell() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  const userId = user?.id ?? '';
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isLoggedIn || !userId) { setItems([]); return; }
    notificationService.list(userId).then(setItems).catch(() => setItems([]));
  }, [isLoggedIn, userId]);

  // Đóng khi click ngoài
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!isLoggedIn) return null;

  function openItem(n: AppNotification) {
    setItems((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
    notificationService.markRead(n.id).catch(() => {});
    setOpen(false);
    if (n.href) router.push(n.href);
  }

  const recent = items.slice(0, 5);

  return (
    <div className="notif-bell" ref={ref}>
      <button
        type="button"
        className="notif-bell__btn"
        aria-label={`Thông báo${unread ? `, ${unread} chưa đọc` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        <AppIcon name="bell" size={20} />
        {unread > 0 && <span className="notif-bell__badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="notif-pop" role="menu">
          <div className="notif-pop__head">
            <strong>Thông báo</strong>
            {unread > 0 && <span className="notif-pop__count">{unread} mới</span>}
          </div>

          <div className="notif-pop__list">
            {recent.length === 0 ? (
              <p className="notif-pop__empty">Chưa có thông báo nào.</p>
            ) : (
              recent.map((n) => (
                <button key={n.id} type="button" className={cn('notif-pop__item', !n.read && 'is-unread')} onClick={() => openItem(n)}>
                  <span className={cn('notif-pop__icon', `notif-pop__icon--${n.type}`)}>
                    <AppIcon name={n.icon ?? NOTIF_ICON[n.type]} size={16} />
                  </span>
                  <span className="notif-pop__body">
                    <span className="notif-pop__title">{n.title}</span>
                    <span className="notif-pop__text">{n.body}</span>
                    <span className="notif-pop__time">{formatRelative(n.createdAt)}</span>
                  </span>
                  {!n.read && <span className="notif-pop__dot" />}
                </button>
              ))
            )}
          </div>

          <Link href={ROUTES.notifications} className="notif-pop__all" onClick={() => setOpen(false)}>
            Xem tất cả thông báo
          </Link>
        </div>
      )}
    </div>
  );
}
