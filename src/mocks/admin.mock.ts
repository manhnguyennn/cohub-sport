import type { AdminReviewItem, AdminStats } from '@app-types/admin';
import { registerMock } from '@lib/mockRegistry';

function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3600_000).toISOString();
}

export const adminQueueMock: AdminReviewItem[] = [
  {
    id: 'rv_1',
    coachName: 'Đặng Hữu Long',
    avatar: '/images/le-minh-hoang.svg',
    sport: 'pickleball',
    city: 'TP. Hồ Chí Minh',
    tier: 1,
    submittedAt: hoursFromNow(-3),
    slaDeadline: hoursFromNow(21),
    experienceYears: 5,
    pricePerHour: 350000,
    bio: 'HLV Pickleball 5 năm, từng dẫn dắt CLB phong trào. Chú trọng kỹ thuật cơ bản và an toàn cho người mới.',
    certificates: [{ name: 'Chứng nhận HLV Pickleball cấp 1', year: '2023' }],
  },
  {
    id: 'rv_2',
    coachName: 'Ngô Thị Mai',
    avatar: '/images/hoang-thi-hanh.svg',
    sport: 'yoga',
    city: 'Hà Nội',
    tier: 1,
    submittedAt: hoursFromNow(-8),
    slaDeadline: hoursFromNow(16),
    experienceYears: 7,
    pricePerHour: 300000,
    bio: 'Giáo viên Yoga RYT-200, chuyên Hatha & Vinyasa cho dân văn phòng. Lớp nhỏ, cá nhân hoá theo thể trạng.',
    certificates: [
      { name: 'RYT 200 (Yoga Alliance)', year: '2022' },
      { name: 'Prenatal Yoga Certification', year: '2024' },
    ],
  },
  {
    id: 'rv_3',
    coachName: 'Vũ Quốc Khánh',
    avatar: '/images/phan-tuan-kiet.svg',
    sport: 'gym-fitness',
    city: 'Đà Nẵng',
    tier: 1,
    submittedAt: hoursFromNow(-20),
    slaDeadline: hoursFromNow(4),
    experienceYears: 9,
    pricePerHour: 450000,
    bio: 'PT thể hình & giảm cân, từng làm tại chuỗi phòng gym lớn. Lập trình tập + dinh dưỡng theo mục tiêu.',
    certificates: [{ name: 'NASM Personal Trainer', year: '2021' }],
  },
  {
    id: 'rv_4',
    coachName: 'Lý Thanh Tùng',
    avatar: '/images/nguyen-van-huy.svg',
    sport: 'tennis',
    city: 'TP. Hồ Chí Minh',
    tier: 2,
    submittedAt: hoursFromNow(-12),
    slaDeadline: hoursFromNow(12),
    experienceYears: 11,
    pricePerHour: 600000,
    bio: 'Tennis coach 11 năm, cựu VĐV tỉnh. Đang chờ xác minh CCCD + chứng chỉ để lên badge Verified.',
    certificates: [
      { name: 'ITF Coaching Level 2', year: '2019' },
      { name: 'Chứng nhận trọng tài quốc gia', year: '2020' },
    ],
  },
];

const adminStats: AdminStats = {
  gmvToday: 12_450_000,
  bookingsToday: 37,
  signupsToday: 14,
  pendingReviews: adminQueueMock.length,
};

registerMock('GET /admin/stats', (): AdminStats => ({
  ...adminStats,
  pendingReviews: adminQueueMock.length,
}));

registerMock('GET /admin/reviews', (): AdminReviewItem[] =>
  [...adminQueueMock].sort((a, b) => +new Date(a.slaDeadline) - +new Date(b.slaDeadline)),
);

registerMock('POST /admin/reviews/:id/decide', ({ pathParams }) => {
  const idx = adminQueueMock.findIndex((x) => x.id === pathParams.id);
  if (idx >= 0) adminQueueMock.splice(idx, 1);
  return { ok: true, remaining: adminQueueMock.length };
});
