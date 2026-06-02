/**
 * 3 personas chuẩn cho MVP demo & user testing (FSD §3.4):
 *   - Linh: Learner — có booking, course, chat
 *   - Khoa: Coach — Verified, dashboard có data
 *   - Admin: Admin — queue review, dispute
 *
 * + 1 guest persona = chưa login (default cho first-time visitor).
 *
 * Component KHÔNG import trực tiếp file này — dùng usePersona() hook.
 */
import type { Persona } from '@app-types/persona';
import type { User } from '@app-types/user';

// ── User base records ────────────────────────────────────────
export const userMocks: Record<string, User> = {
  u_linh: {
    id: 'u_linh',
    email: 'linh.tran@example.com',
    fullName: 'Trần Thu Linh',
    avatar: '/images/do-thi-phuong.svg',
    role: 'user',
    phone: '+84901234567',
    createdAt: '2026-01-15T08:00:00Z',
  },
  u_khoa: {
    id: 'u_khoa',
    email: 'khoa.nguyen@example.com',
    fullName: 'Nguyễn Văn An',                // map sang coach c1 trong mock
    avatar: '/images/le-minh-hoang.svg',
    role: 'coach',
    phone: '+84909876543',
    createdAt: '2025-09-10T08:00:00Z',
  },
  u_admin: {
    id: 'u_admin',
    email: 'admin@cohub.vn',
    fullName: 'Admin Trần',
    avatar: '/images/hoang-thi-hanh.svg',
    role: 'admin',
    phone: '+84988888888',
    createdAt: '2025-06-01T08:00:00Z',
  },
};

// ── Persona registry ────────────────────────────────────────
export const personas: Record<Persona['key'], Persona> = {
  guest: {
    key: 'guest',
    displayLabel: 'Khách (chưa login)',
    description: 'Trải nghiệm như visitor lần đầu vào site — không có booking, chat, dashboard.',
    userId: null,
    roles: [],
    defaultRole: null,
  },
  linh: {
    key: 'linh',
    displayLabel: 'Linh — Learner',
    description: 'Học viên 28t Q3 HCM. Đã có 1 booking sắp tới + 2 completed, 1 course yoga IN_PROGRESS, 1 chat với coach Khoa.',
    userId: 'u_linh',
    roles: ['user'],
    defaultRole: 'user',
  },
  khoa: {
    key: 'khoa',
    displayLabel: 'Khoa — Coach (Verified)',
    description: 'PT Gym Q1 HCM, ACE Certified, ACTIVE_VERIFIED. 23 buổi/tháng, dashboard có data đẹp, 2 booking pending confirm.',
    userId: 'u_khoa',
    roles: ['user', 'coach'],          // dual-role (PRD onboarding spec)
    defaultRole: 'coach',
    coachSlug: 'nguyen-van-an',
  },
  admin: {
    key: 'admin',
    displayLabel: 'Admin — Cohub Ops',
    description: 'Queue: 3 profile pending Tầng 1, 1 verification Tầng 2. Dashboard data tháng đẹp.',
    userId: 'u_admin',
    roles: ['admin'],
    defaultRole: 'admin',
  },
};

export const PERSONA_KEYS: Persona['key'][] = ['guest', 'linh', 'khoa', 'admin'];
