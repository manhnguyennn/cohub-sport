import { apiClient } from '@lib/apiClient';
import type { CoachDashboard } from '@app-types/dashboard';

export const dashboardService = {
  /** Lấy data dashboard cho coach hiện tại */
  coachOverview: (): Promise<CoachDashboard> =>
    apiClient.get('/coach/dashboard'),
};
