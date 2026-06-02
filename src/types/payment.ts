import type { ID, ISODateString, Money } from './common';

export type PaymentMethod = 'vnpay' | 'momo' | 'zalopay';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

export type PaymentReference = {
  /** Tham chiếu booking hoặc enrollment */
  kind: 'booking' | 'enrollment';
  id: ID;
};

export type Payment = {
  id: ID;
  method: PaymentMethod;
  amount: Money;
  status: PaymentStatus;
  reference: PaymentReference;
  providerTxnId?: string;
  failureReason?: string;
  createdAt: ISODateString;
};

export type ChargeInput = {
  method: PaymentMethod;
  amount: Money;
  reference: PaymentReference;
  /** Demo Mode toggle override — bắt fail dù mặc định pass */
  forceFail?: boolean;
};
