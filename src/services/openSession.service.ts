import { apiClient } from '@lib/apiClient';
import type {
  CreateOpenSessionInput,
  CreateRecurringSessionsInput,
  OpenSession,
  OpenSessionListQuery,
} from '@app-types/openSession';

export const openSessionService = {
  /** List "Lịch dạy mở" — public dùng cho /coaches/[id], coach dùng cho /coach/sessions */
  list: (query: OpenSessionListQuery = {}): Promise<OpenSession[]> =>
    apiClient.get('/open-sessions', { params: query as Record<string, unknown> }),

  getById: (id: string): Promise<OpenSession> => apiClient.get(`/open-sessions/${id}`),

  /** Tạo 1 lịch đơn lẻ */
  create: (input: CreateOpenSessionInput): Promise<OpenSession> =>
    apiClient.post('/open-sessions', input),

  /** Tạo recurring — server trả về danh sách sessions đã sinh */
  createRecurring: (input: CreateRecurringSessionsInput): Promise<OpenSession[]> =>
    apiClient.post('/open-sessions/bulk', input),

  update: (id: string, patch: Partial<OpenSession>): Promise<OpenSession> =>
    apiClient.patch(`/open-sessions/${id}`, patch),

  cancel: (id: string): Promise<OpenSession> =>
    apiClient.delete(`/open-sessions/${id}`),

  /** Đánh dấu learner đã book — backend sẽ tăng bookedCount */
  book: (id: string): Promise<OpenSession> =>
    apiClient.post(`/open-sessions/${id}/book`),
};
