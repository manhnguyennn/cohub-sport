/**
 * Thông báo (Tuần 7). Bell dropdown header + trang /notifications.
 */
import type { AppIconName } from '@components/ui/AppIcon';

export type NotificationType = 'booking' | 'message' | 'review' | 'payment' | 'system';

export type AppNotification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  /** Link điều hướng khi click (route path) */
  href?: string;
  /** Icon override; nếu thiếu, map theo type */
  icon?: AppIconName;
};

export const NOTIF_ICON: Record<NotificationType, AppIconName> = {
  booking: 'calendarTick',
  message: 'chat',
  review: 'star',
  payment: 'wallet',
  system: 'info',
};

export const NOTIF_TYPE_LABEL: Record<NotificationType, string> = {
  booking: 'Đặt lịch',
  message: 'Tin nhắn',
  review: 'Đánh giá',
  payment: 'Thanh toán',
  system: 'Hệ thống',
};
