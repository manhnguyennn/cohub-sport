import { apiClient } from '@lib/apiClient';
import type { Review } from '@app-types/review';

export const reviewService = {
  listByCoach: (coachId: string): Promise<Review[]> =>
    apiClient.get(`/coaches/${coachId}/reviews`),
};
