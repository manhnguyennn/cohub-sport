import type { Promo, PromoValidateResult } from '@app-types/promo';
import { registerMock } from '@lib/mockRegistry';

export const promoMocks: Promo[] = [
  { code: 'DEMO50',    type: 'flat',    value: 50_000, label: 'Giảm 50.000đ cho demo' },
  { code: 'WELCOME10', type: 'percent', value: 10,     label: 'Giảm 10% cho lần đầu', minSubtotal: 200_000 },
];

function applyPromo(code: string, subtotal: number): PromoValidateResult {
  const found = promoMocks.find((p) => p.code.toUpperCase() === code.toUpperCase().trim());
  if (!found) {
    return {
      valid: false,
      code,
      message: 'Mã giảm giá không hợp lệ',
    };
  }

  if (found.minSubtotal && subtotal < found.minSubtotal) {
    return {
      valid: false,
      code: found.code,
      message: `Cần đặt từ ${found.minSubtotal.toLocaleString('vi-VN')}đ để dùng mã này`,
    };
  }

  const discountAmount =
    found.type === 'flat'
      ? Math.min(found.value, subtotal)
      : Math.floor((subtotal * found.value) / 100);

  return {
    valid: true,
    code: found.code,
    discount: { amount: discountAmount, currency: 'VND' },
    message: `Đã áp dụng: ${found.label}`,
  };
}

registerMock('POST /promo/validate', ({ body }) => {
  const input = body as { code: string; subtotal: number };
  return applyPromo(input.code ?? '', Number(input.subtotal ?? 0));
});
