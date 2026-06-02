import { apiClient } from '@lib/apiClient';
import type { Coach, CoachCourse, CoachListQuery, RatingDistribution } from '@app-types/coach';
import type { Paginated } from '@app-types/common';

export const coachService = {
  list: (query: CoachListQuery = {}): Promise<Paginated<Coach>> =>
    apiClient.get('/coaches', { params: query as Record<string, unknown> }),

  featured: (): Promise<Coach[]> => apiClient.get('/coaches/featured'),

  getById: (idOrSlug: string): Promise<Coach> => apiClient.get(`/coaches/${idOrSlug}`),

  /** Khoá học do 1 coach tạo */
  courses: (idOrSlug: string): Promise<CoachCourse[]> =>
    apiClient.get(`/coaches/${idOrSlug}/courses`),

  /** Coach gợi ý tương tự */
  similar: (idOrSlug: string): Promise<Coach[]> =>
    apiClient.get(`/coaches/${idOrSlug}/similar`),

  /** Phân bố rating (5★/4★/...) */
  ratingDistribution: (idOrSlug: string): Promise<RatingDistribution> =>
    apiClient.get(`/coaches/${idOrSlug}/rating-distribution`),
};
