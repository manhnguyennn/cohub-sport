/**
 * Persona — user mock cho MVP demo & user testing.
 *
 * Mỗi persona có:
 *  - 1 User base (gắn với mock user)
 *  - Optional roles (user có thể có cả learner + coach)
 *  - Pre-populated state (bookings, courses, chats, notifications)
 *
 * Demo Mode panel cho phép swap persona để demo flow nhiều góc nhìn.
 */
import type { ID } from './common';
import type { UserRole } from './user';

export type PersonaKey = 'linh' | 'khoa' | 'admin' | 'guest';

export type Persona = {
  key: PersonaKey;
  /** Hiển thị trong Demo Mode panel + header */
  displayLabel: string;
  /** Mô tả ngắn — Demo Mode hover/info */
  description: string;
  /** User base — nếu null = chưa login (guest) */
  userId: ID | null;
  /** Roles user này có thể switch. Empty = chưa có role. */
  roles: UserRole[];
  /** Role mặc định khi load persona */
  defaultRole: UserRole | null;
  /** Coach slug (nếu role coach) — link tới /coaches/[slug] */
  coachSlug?: string;
};
