'use client';

/**
 * Nút chat ở header — cạnh bell. Hiện cho user + coach đã đăng nhập.
 * Badge = số hội thoại chưa đọc. Link điều hướng theo role:
 *   coach → /coach/messages (CRM)   ·   user → /messages
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { messageService } from '@services/message.service';
import { useAuth } from '@hooks/useAuth';

export default function HeaderChatButton() {
  const { user, role, isLoggedIn } = useAuth();
  const [unread, setUnread] = useState(0);

  const userId = user?.id ?? '';
  const show = isLoggedIn && (role === 'user' || role === 'coach');

  useEffect(() => {
    if (!show || !userId) { setUnread(0); return; }
    messageService.listThreads(userId)
      .then((threads) => setUnread(threads.filter((t) => t.unread).length))
      .catch(() => setUnread(0));
  }, [show, userId]);

  if (!show) return null;

  const href = role === 'coach' ? ROUTES.coachMessages : ROUTES.messages;

  return (
    <Link
      href={href}
      className="header-chat"
      aria-label={`Tin nhắn${unread ? `, ${unread} chưa đọc` : ''}`}
    >
      <AppIcon name="chat" size={20} />
      {unread > 0 && <span className="header-chat__badge">{unread > 9 ? '9+' : unread}</span>}
    </Link>
  );
}
