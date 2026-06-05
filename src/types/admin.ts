import type { ID, ISODateString } from './common';

/** Coach đang chờ duyệt trong queue Admin (H6). */
export type AdminReviewTier = 1 | 2; // 1 = duyệt hồ sơ cơ bản · 2 = xác minh KYC

export type AdminReviewItem = {
  id: ID;
  coachName: string;
  avatar?: string;
  sport: string;
  city: string;
  tier: AdminReviewTier;
  submittedAt: ISODateString;
  /** SLA ≤24h kể từ submit */
  slaDeadline: ISODateString;
  experienceYears: number;
  pricePerHour: number;
  bio: string;
  certificates: { name: string; year: string }[];
};

export type AdminReviewDecision = 'approve' | 'reject' | 'request_edit';

export type AdminStats = {
  gmvToday: number;
  bookingsToday: number;
  signupsToday: number;
  pendingReviews: number;
};
