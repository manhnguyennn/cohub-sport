import type { ID, ISODateString, Location, Money } from './common';

/**
 * Course = gói khoá học có lịch (FIXED) hoặc credit (FLEXIBLE).
 *
 * Schema theo FSD §3.3 + PRD Booking §B (Fixed + Flexible).
 * Khác với `CoachCourse` (legacy nested trong Coach detail page): Course là
 * standalone entity, có riêng listing /courses và detail /courses/[id].
 */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type CourseScheduleType = 'FIXED' | 'FLEXIBLE';

/** Trạng thái course (publish lifecycle) */
export type CourseStatus = 'published' | 'started' | 'closed' | 'full';

export type Course = {
  id: ID;
  coachId: ID;
  /** Denormalize cho UI list — tránh fetch coach kèm */
  coachName: string;
  coachAvatar?: string;

  title: string;
  cover: string;
  description: string;                // markdown lite
  whatYoullLearn: string[];           // bullets
  requirements?: string;

  sport: string;                       // sport slug
  level: CourseLevel;
  scheduleType: CourseScheduleType;

  totalSessions: number;
  sessionDurationMin: number;          // 60 / 90

  /** FIXED only */
  startDate?: ISODateString;
  /** [2,4] = T3, T5 (0=CN ... 6=T7) */
  recurringDays?: number[];
  /** "06:00" */
  recurringTime?: string;

  /** FLEXIBLE only — N ngày kể từ ngày enroll */
  flexibleValidityDays?: number;

  maxParticipants: number;
  availableSeats: number;
  status: CourseStatus;

  price: Money;
  pricePerSession: Money;

  location?: Location;
  /** Tag: "Top Rated", "Bestseller", "Mới" */
  tags?: string[];

  /** Giáo trình từng buổi (denormalize khi get detail) */
  syllabus?: CourseSyllabusItem[];
  /** Kỹ năng đạt được (chips) */
  skills?: string[];
};

export type CourseSyllabusItem = {
  /** Thứ tự buổi 1..N */
  order: number;
  title: string;
  durationMinutes: number;
  /** Bullet chi tiết nội dung buổi */
  details?: string[];
};

export type CourseListQuery = {
  q?: string;
  sport?: string;
  level?: CourseLevel;
  scheduleType?: CourseScheduleType;
  /** "available" = còn chỗ + chưa bắt đầu */
  status?: 'available' | 'all';
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'starting_soon';
  page?: number;
  pageSize?: number;
};

// ── Sessions (lịch buổi cụ thể của FIXED course) ──────────────
export type SessionStatus =
  | 'upcoming'
  | 'completed'
  | 'missed'                          // học viên vắng
  | 'cancelled';

export type CourseSession = {
  id: ID;
  courseId: ID;
  /** Thứ tự buổi 1..N */
  sequence: number;
  startsAt: ISODateString;
  durationMinutes: number;
  status: SessionStatus;
  note?: string;
};

// ── Enrollment (1 user đăng ký 1 course) ─────────────────────
export type EnrollmentStatus =
  | 'in_progress'                     // FIXED: đang học / FLEXIBLE: còn credit
  | 'completed'
  | 'cancelled'
  | 'expired';                        // FLEXIBLE hết hạn validity

export type Enrollment = {
  id: ID;
  userId: ID;
  courseId: ID;
  /** Denormalize cho UI */
  courseTitle: string;
  courseCover: string;
  coachName: string;
  scheduleType: CourseScheduleType;
  totalSessions: number;
  /** FLEXIBLE: số credit còn lại */
  creditsRemaining?: number;
  /** FLEXIBLE: ngày hết hạn */
  expiresAt?: ISODateString;
  /** Số session đã completed */
  sessionsCompleted: number;
  status: EnrollmentStatus;
  enrolledAt: ISODateString;
  pricePaid: Money;
  refundAmount?: Money;
};

export type CreateEnrollmentInput = {
  courseId: ID;
  userId?: ID;
  goal?: string;
  healthNote?: string;
  policyAccepted: boolean;
};

/** Refund preview cho cancel enrollment */
export type CancelEnrollmentResult = {
  enrollmentId: ID;
  status: EnrollmentStatus;
  refundAmount: Money;
  refundPercent: number;              // 100 / 70 / 30 / pro-rated
  policyApplied: 'over_7d' | '48h_7d' | 'under_48h' | 'mid_course' | 'flexible_unused';
  message: string;
};
