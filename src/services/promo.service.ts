import { apiClient } from '@lib/apiClient';
import type { PromoValidateResult } from '@app-types/promo';

export const promoService = {
  validate: (code: string, subtotal: number): Promise<PromoValidateResult> =>
    apiClient.post('/promo/validate', { code, subtotal }),
};
