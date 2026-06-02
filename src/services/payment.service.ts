import { apiClient } from '@lib/apiClient';
import type { ChargeInput, Payment } from '@app-types/payment';

export const paymentService = {
  /** Charge fake gateway — return Payment.status = 'succeeded' | 'failed' */
  charge: (input: ChargeInput): Promise<Payment> =>
    apiClient.post('/payments/charge', input),
};
