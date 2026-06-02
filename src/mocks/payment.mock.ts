import type { ChargeInput, Payment } from '@app-types/payment';
import { registerMock } from '@lib/mockRegistry';

export const paymentsMock: Payment[] = [];

/**
 * Fake gateway — mặc định succeeded.
 * Component checkout đọc Demo Mode toggle `forcePaymentFail`,
 * gắn vào `forceFail: true` để giả lập fail.
 */
registerMock('POST /payments/charge', ({ body }): Payment => {
  const input = body as ChargeInput;
  const status = input.forceFail ? 'failed' : 'succeeded';

  const payment: Payment = {
    id: `pay_${Date.now()}`,
    method: input.method,
    amount: input.amount,
    status,
    reference: input.reference,
    providerTxnId: status === 'succeeded' ? `txn_${Math.random().toString(36).slice(2, 10)}` : undefined,
    failureReason: status === 'failed' ? 'Demo: thanh toán bị từ chối bởi ngân hàng.' : undefined,
    createdAt: new Date().toISOString(),
  };

  paymentsMock.push(payment);
  return payment;
});
