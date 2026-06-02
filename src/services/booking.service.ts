import { apiClient } from '@lib/apiClient';
import type {
  Booking,
  BookingListQuery,
  BookingStatus,
  CancelBookingResult,
  CreateBookingInput,
  TimeSlot,
} from '@app-types/booking';

export const bookingService = {
  /** Lịch trống coach 14 ngày tới */
  availability: (coachId: string): Promise<TimeSlot[]> =>
    apiClient.get(`/coaches/${coachId}/availability`),

  /** Tạo booking — return record với status=pending */
  create: (input: CreateBookingInput & { userId?: string }): Promise<Booking> =>
    apiClient.post('/bookings', input),

  /** List booking cho /my/bookings (filter scope upcoming/past/cancelled) */
  list: (query: BookingListQuery = {}): Promise<Booking[]> =>
    apiClient.get('/bookings', { params: query as Record<string, unknown> }),

  getById: (id: string): Promise<Booking> => apiClient.get(`/bookings/${id}`),

  /** Force-set status (Demo Mode auto-confirm 3s gọi qua đây) */
  setStatus: (id: string, status: BookingStatus): Promise<Booking> =>
    apiClient.patch(`/bookings/${id}/status`, { status }),

  /** Huỷ — trả refund breakdown */
  cancel: (id: string): Promise<CancelBookingResult> =>
    apiClient.post(`/bookings/${id}/cancel`),
};
