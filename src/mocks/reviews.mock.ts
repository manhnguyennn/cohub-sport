import type { Review } from '@app-types/review';
import { registerMock } from '@lib/mockRegistry';

const REVIEW_TEMPLATE_C2 =
  'Anna hướng dẫn chi tiết, sửa tư thế nhẹ nhàng, giúp tôi thấy cơ thể dẻo dai hơn chỉ sau 2 tháng.';

function buildBatch(coachId: string, comment: string, count: number): Review[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${coachId}-r${i + 1}`,
    coachId,
    userId: `u${i + 1}`,
    userName: 'Huong Nguyen',
    userAvatar: '/images/do-thi-phuong.svg',
    rating: 5,
    comment,
    createdAt: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

export const reviewsMock: Review[] = [
  // Coach c1
  {
    id: 'r1', coachId: 'c1', userId: 'u1', userName: 'Mai L.',
    userAvatar: '/images/do-thi-phuong.svg',
    rating: 5, comment: 'Anh An dạy rất chi tiết, có lộ trình cụ thể. Rất recommend!',
    createdAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 'r2', coachId: 'c1', userId: 'u2', userName: 'Hùng N.',
    userAvatar: '/images/le-minh-hoang.svg',
    rating: 5, comment: 'Sau 2 tháng đã đánh ổn định hơn hẳn. Cảm ơn coach.',
    createdAt: '2026-04-20T14:30:00Z',
  },

  // Coach c2 — Anna Nguyễn (5 reviews như PDF)
  ...buildBatch('c2', REVIEW_TEMPLATE_C2, 5),

  // Coach c3
  {
    id: 'r3', coachId: 'c3', userId: 'u3', userName: 'Thảo V.',
    userAvatar: '/images/hoang-thi-hanh.svg',
    rating: 5, comment: 'Anh Thái lên programming rõ ràng, kết quả cực tốt.',
    createdAt: '2026-05-01T09:00:00Z',
  },
];

registerMock('GET /coaches/:coachId/reviews', ({ pathParams }) =>
  reviewsMock.filter((r) => r.coachId === pathParams.coachId),
);
