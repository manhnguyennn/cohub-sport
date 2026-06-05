import { apiClient } from '@lib/apiClient';
import type { AppNotification } from '@app-types/notification';

export const notificationService = {
  list: (userId: string): Promise<AppNotification[]> =>
    apiClient.get('/notifications', { params: { userId } }),

  markRead: (id: string): Promise<AppNotification> =>
    apiClient.patch(`/notifications/${id}/read`),

  markAllRead: (userId: string): Promise<{ ok: boolean }> =>
    apiClient.post('/notifications/read-all', { userId }),
};
