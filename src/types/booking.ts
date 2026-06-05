import type { ID, ISODateString, Money } from './common';

/**
 * Booking status state machine (PRD Booking §A):
 *   DRAFT → PENDING → CONFIRMED → COMPLETED
 *   nhánh: CANCELLED_BY_LEARNER, CANCELLED_BY_COACH, NO_SHOW_*, DISPUTED
 *
 * MVP dùng tập rút gọn:
 *   pending | confirmed | completed | cancelled | no_show
 */
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type BookingLocation = {
  /** coach_place | learner_place | third_party */
  kind: 'coach_place' | 'learner_place' | 'third_party';
  /** Địa chỉ chi tiết — chỉ required khi learner_place hoặc third_party */
  address?: string;
};

export type Booking = {
  id: ID;
  userId: ID;
  /** Denormalize tên học viên — cho coach inbox */
  userName?: string;
  coachId: ID;
  coachName: string;          // denormalize cho UI list
  coachAvatar?: string;       // denormalize
  sportSlug: string;
  startsAt: ISODateString;
  durationMinutes: number;
  price: Money;
  /** Subtotal trước discount */
  subtotal: Money;
  /** Discount nếu apply promo */
  discount?: Money;
  /** Promo code đã dùng */
  promoCode?: string;
  status: BookingStatus;
  location: BookingLocation;
  /** Ghi chú mục tiêu/yêu cầu */
  note?: string;
  /** Tình trạng sức khoẻ */
  healthNote?: string;
  /** Số người tham gia (default 1, group cho phép) */
  participants: number;
  createdAt: ISODateString;
  /** Khi nào học viên/coach huỷ */
  cancelledAt?: ISODateString;
  /** Refund đã trả lại nếu cancel */
  refundAmount?: Money;
};

export type CreateBookingInput = {
  coachId: ID;
  sportSlug: string;
  startsAt: ISODateString;
  durationMinutes: number;
  location: BookingLocation;
  note?: string;
  healthNote?: string;
  participants?: number;
  promoCode?: string;
  /** Giá cụ thể cho buổi này (VND). Open session = giá session; custom = giá tạm tính */
  price?: number;
  /** Nếu đến từ Lịch dạy mở */
  openSessionId?: ID;
  /** Đặt lịch riêng (không theo lịch mở) — giá tạm tính, chờ coach xác nhận */
  isCustomRequest?: boolean;
};

export type TimeSlot = {
  startsAt: ISODateString;
  durationMinutes: number;
  isAvailable: boolean;
};

/** Filter cho /my/bookings + /coach/bookings */
export type BookingListQuery = {
  userId?: ID;
  /** Coach inbox — bookings của 1 coach */
  coachId?: ID;
  status?: BookingStatus | BookingStatus[];
  /** "upcoming" = pending + confirmed sắp tới */
  scope?: 'upcoming' | 'past' | 'cancelled';
};

/** Result trả về khi cancel — show breakdown trên modal */
export type CancelBookingResult = {
  bookingId: ID;
  status: BookingStatus;
  refundAmount: Money;
  refundPercent: number;            // 100 / 50 / 0
  policyApplied: 'over_24h' | '6h_24h' | 'under_6h' | 'coach_cancel';
  message: string;
};
