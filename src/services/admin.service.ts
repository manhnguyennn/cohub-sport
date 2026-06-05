import { apiClient } from '@lib/apiClient';
import type { AdminReviewItem, AdminReviewDecision, AdminStats } from '@app-types/admin';

export const adminService = {
  stats: (): Promise<AdminStats> => apiClient.get('/admin/stats'),

  reviews: (): Promise<AdminReviewItem[]> => apiClient.get('/admin/reviews'),

  decide: (id: string, decision: AdminReviewDecision): Promise<{ ok: boolean; remaining: number }> =>
    apiClient.post(`/admin/reviews/${id}/decide`, { decision }),
};
