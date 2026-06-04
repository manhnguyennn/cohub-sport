import type { CoachDashboard, RevenuePoint, RecentBookingItem, InboxThreadPreview } from '@app-types/dashboard';
import { registerMock } from '@lib/mockRegistry';

/**
 * Mock dashboard cho coach (persona Khoa = c1).
 * - Revenue trend tăng ~5% mỗi tuần để demo investor đẹp
 * - Recent bookings = booking thực từ bookingsMock + sinh thêm
 */

function dailyRevenue(): RevenuePoint[] {
  const out: RevenuePoint[] = [];
  const now = new Date();
  // Sinh 30 ngày trend tăng dần với noise nhẹ
  const base = 800_000;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const day = 29 - i;
    // Trend ~3.5% per day + noise
    const trend = Math.pow(1.0035, day);
    const noise = (((day * 17) % 7) - 3) * 80_000;
    const revenue = Math.max(0, Math.round(base * trend + noise));
    out.push({
      date: d.toISOString().slice(0, 10),
      revenue,
    });
  }
  return out;
}

const recentBookings: RecentBookingItem[] = [
  {
    id: 'rb1',
    learnerName: 'Phạm Quang Huy',
    learnerAvatar: '/images/do-thi-phuong.svg',
    startsAt: new Date(Date.now() + 86_400_000 * 1 + 8 * 3600_000).toISOString(),
    duration: 60,
    status: 'pending',
    amount: 450_000,
  },
  {
    id: 'rb2',
    learnerName: 'Ngô Thu Vân',
    learnerAvatar: '/images/le-minh-hoang.svg',
    startsAt: new Date(Date.now() + 86_400_000 * 2 + 18 * 3600_000).toISOString(),
    duration: 60,
    status: 'confirmed',
    amount: 450_000,
  },
  {
    id: 'rb3',
    learnerName: 'Trần Minh Đức',
    learnerAvatar: '/images/hoang-thi-hanh.svg',
    startsAt: new Date(Date.now() + 86_400_000 * 3 + 19 * 3600_000).toISOString(),
    duration: 60,
    status: 'confirmed',
    amount: 450_000,
  },
  {
    id: 'rb4',
    learnerName: 'Lê Thị Hồng',
    learnerAvatar: '/images/do-thi-phuong.svg',
    startsAt: new Date(Date.now() - 86_400_000 * 2 + 17 * 3600_000).toISOString(),
    duration: 60,
    status: 'completed',
    amount: 450_000,
  },
  {
    id: 'rb5',
    learnerName: 'Nguyễn Văn Sang',
    learnerAvatar: '/images/le-minh-hoang.svg',
    startsAt: new Date(Date.now() - 86_400_000 * 4 + 18 * 3600_000).toISOString(),
    duration: 60,
    status: 'completed',
    amount: 450_000,
  },
];

const inbox: InboxThreadPreview[] = [
  {
    id: 'th1',
    partnerName: 'Phạm Quang Huy',
    partnerAvatar: '/images/do-thi-phuong.svg',
    lastMessage: 'Mai em mang giày tập riêng được không Coach?',
    lastAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    unread: true,
  },
  {
    id: 'th2',
    partnerName: 'Ngô Thu Vân',
    partnerAvatar: '/images/le-minh-hoang.svg',
    lastMessage: 'Cảm ơn Coach! Buổi hôm nay tuyệt vời ạ.',
    lastAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    unread: false,
  },
  {
    id: 'th3',
    partnerName: 'Trần Minh Đức',
    partnerAvatar: '/images/hoang-thi-hanh.svg',
    lastMessage: 'Em xin lịch buổi tiếp theo vào T7 ạ.',
    lastAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    unread: true,
  },
];

const dashboard: CoachDashboard = {
  stats: {
    gmvMonth: { amount: 24_750_000, currency: 'VND' },
    sessionsMonth: 23,
    newLearners: 7,
    avgRating: 4.9,
    gmvDelta: 18,
    sessionsDelta: 12,
    newLearnersDelta: 40,
  },
  revenue30d: dailyRevenue(),
  recentBookings,
  inbox,
};

registerMock('GET /coach/dashboard', () => dashboard);
