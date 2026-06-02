import type { Money } from '@app-types/common';

export function formatMoney(money: Money): string {
  if (money.currency === 'USD') return `$${money.amount.toLocaleString('en-US')}`;
  return `${money.amount.toLocaleString('vi-VN')}đ`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function pluralize(n: number, singular: string, plural?: string): string {
  // VN không có plural, dùng cho EN labels nếu cần
  return n === 1 ? singular : (plural ?? `${singular}s`);
}
