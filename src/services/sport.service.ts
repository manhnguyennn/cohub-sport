import { apiClient } from '@lib/apiClient';
import type { Sport } from '@app-types/sport';

export const sportService = {
  list: (): Promise<Sport[]> => apiClient.get('/sports'),

  getBySlug: (slug: string): Promise<Sport> => apiClient.get(`/sports/${slug}`),

  listByCategory: async (category: Sport['category']): Promise<Sport[]> => {
    const all = await apiClient.get<Sport[]>('/sports');
    return all.filter((s) => s.category === category);
  },
};
