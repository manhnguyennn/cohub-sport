import type { ID, Money } from './common';

export type CoachDashboardStats = {
  gmvMonth: Money;            // GMV tháng này
  sessionsMonth: number;      // Số buổi đã dạy
  newLearners: number;        // Học viên mới
  avgRating: number;          // Trung bình 1-5
  /** % delta vs tháng trước */
  gmvDelta?: number;
  sessionsDelta?: number;
  newLearnersDelta?: number;
};

export type RevenuePoint = {
  /** ISO date — 'YYYY-MM-DD' */
  date: string;
  /** Doanh thu VND ngày đó (đã trừ commission) */
  revenue: number;
};

export type RecentBookingItem = {
  id: ID;
  learnerName: string;
  learnerAvatar?: string;
  startsAt: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
};

export type InboxThreadPreview = {
  id: ID;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  lastAt: string;
  unread: boolean;
};

export type CoachDashboard = {
  stats: CoachDashboardStats;
  revenue30d: RevenuePoint[];
  recentBookings: RecentBookingItem[];
  inbox: InboxThreadPreview[];
};
