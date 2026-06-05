import { apiClient } from '@lib/apiClient';
import type { Review, CreateReviewInput } from '@app-types/review';

export const reviewService = {
  listByCoach: (coachId: string): Promise<Review[]> =>
    apiClient.get(`/coaches/${coachId}/reviews`),

  /** Gửi đánh giá sau buổi tập hoàn thành (double-blind 7 ngày) */
  create: (input: CreateReviewInput): Promise<Review> =>
    apiClient.post('/reviews', input),
};
