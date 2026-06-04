import type { ID, ISODateString, Money } from './common';
import type { BookingLocation } from './booking';

/**
 * OpenSession — "Lịch dạy mở" (UX writing chính thức).
 *
 * KHÁC với Course (khoá học):
 *   - Course = gói nhiều buổi cố định/linh hoạt, 1 giá trọn gói
 *   - OpenSession = 1 buổi tập cụ thể coach đăng trước trên calendar,
 *     có ngày-giờ + giá riêng. Học viên xem & book trực tiếp.
 *
 * KHÁC với TimeSlot (availability):
 *   - TimeSlot = chỉ marker "tôi rảnh" — internal, không bán
 *   - OpenSession = đã được coach publish ra cho learner đặt
 *
 * Capacity:
 *   - 1 → 1-1 PT session
 *   - >1 → group class (vd: Yoga 8 người)
 */
export type OpenSessionStatus =
  | 'open'        // còn slot trống, book được
  | 'full'        // hết slot
  | 'cancelled'   // coach huỷ
  | 'completed';  // đã diễn ra

export type OpenSession = {
  id: ID;
  coachId: ID;
  /** Tên gợi nhớ — VD "Yoga sáng cuối tuần", "PT Pickleball 1-1". Optional, fallback = sport label */
  title?: string;
  sportSlug: string;
  /** Cấp độ phù hợp — beginner | intermediate | advanced | all */
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  startsAt: ISODateString;
  durationMinutes: number;
  price: Money;
  /** Sĩ số tối đa (1 = 1-1, ≥2 = group class) */
  capacity: number;
  /** Số học viên đã book */
  bookedCount: number;
  status: OpenSessionStatus;
  location: BookingLocation;
  /** Ghi chú coach gửi tới learner — VD "Mang theo thảm tập" */
  note?: string;
  /** Snapshot coach denorm cho UI list */
  coachName?: string;
  coachAvatar?: string;
  createdAt: ISODateString;
};

/**
 * Input tạo 1 lịch dạy đơn lẻ.
 */
export type CreateOpenSessionInput = {
  coachId: ID;
  title?: string;
  sportSlug: string;
  level?: OpenSession['level'];
  startsAt: ISODateString;
  durationMinutes: number;
  price: Money;
  capacity: number;
  location: BookingLocation;
  note?: string;
};

/**
 * Input tạo nhiều lịch dạy lặp lại (recurring).
 *
 * VD: "Tạo lịch mỗi T2 + T4 + T6, từ 06:00, kéo dài 4 tuần, giá 250k/buổi".
 *
 * weekdays: 0=CN, 1=T2, ..., 6=T7 (chuẩn JS Date.getDay)
 * Backend (mock) sẽ explode thành N OpenSession riêng biệt.
 */
export type CreateRecurringSessionsInput = {
  coachId: ID;
  title?: string;
  sportSlug: string;
  level?: OpenSession['level'];
  /** Ngày bắt đầu chuỗi (YYYY-MM-DD) */
  startDate: string;
  /** Số tuần lặp lại */
  weeksCount: number;
  /** Các ngày trong tuần cần tạo (0-6) */
  weekdays: number[];
  /** Giờ bắt đầu mỗi buổi — HH:mm */
  time: string;
  durationMinutes: number;
  price: Money;
  capacity: number;
  location: BookingLocation;
  note?: string;
};

export type OpenSessionListQuery = {
  coachId?: ID;
  /** 'upcoming' = startsAt ≥ now & status=open|full | 'past' = status=completed */
  scope?: 'upcoming' | 'past' | 'all';
  /** Lọc theo status cụ thể */
  status?: OpenSessionStatus | OpenSessionStatus[];
  sport?: string;
};
