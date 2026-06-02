import type { Money } from './common';

/**
 * Promo / discount code (mock).
 * Trong MVP chỉ có:
 *   - DEMO50 → flat -50.000đ
 *   - WELCOME10 → percent -10%
 */
export type Promo = {
  code: string;
  type: 'flat' | 'percent';
  /** flat: amount VND. percent: 0-100 */
  value: number;
  /** Min subtotal để apply */
  minSubtotal?: number;
  /** Mô tả hiển thị */
  label: string;
};

export type PromoValidateResult = {
  valid: boolean;
  code: string;
  /** Discount tính sẵn theo subtotal hiện tại */
  discount?: Money;
  message: string;
};
