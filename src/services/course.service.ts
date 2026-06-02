import { apiClient } from '@lib/apiClient';
import type {
  Course,
  CourseListQuery,
  CourseSession,
  Enrollment,
  CreateEnrollmentInput,
  CancelEnrollmentResult,
} from '@app-types/course';
import type { Paginated } from '@app-types/common';

export const courseService = {
  list: (query: CourseListQuery = {}): Promise<Paginated<Course>> =>
    apiClient.get('/courses', { params: query as Record<string, unknown> }),

  featured: (): Promise<Course[]> => apiClient.get('/courses/featured'),

  getById: (id: string): Promise<Course> => apiClient.get(`/courses/${id}`),

  sessions: (courseId: string): Promise<CourseSession[]> =>
    apiClient.get(`/courses/${courseId}/sessions`),

  enroll: (courseId: string, input: CreateEnrollmentInput): Promise<Enrollment> =>
    apiClient.post(`/courses/${courseId}/enrollments`, input),

  /** Course do 1 coach mở (published) — dùng trong /coaches/[id] tab Khoá học */
  publishedByCoach: (coachId: string): Promise<Course[]> =>
    apiClient.get(`/coaches/${coachId}/published-courses`),
};

export const enrollmentService = {
  list: (userId: string): Promise<Enrollment[]> =>
    apiClient.get('/enrollments', { params: { userId } }),

  getById: (id: string): Promise<Enrollment> =>
    apiClient.get(`/enrollments/${id}`),

  cancel: (id: string): Promise<CancelEnrollmentResult> =>
    apiClient.post(`/enrollments/${id}/cancel`),
};
