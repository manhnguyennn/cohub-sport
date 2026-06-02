/**
 * Date utilities — wrapper quanh dayjs với locale tiếng Việt.
 *
 * Format spec (SRS §timezone):
 *   - Date:     'T3, 15/07/2026'
 *   - Time:     '14:30'
 *   - DateTime: 'T3, 15/07/2026 · 14:30'
 *   - Relative: 'Hôm nay, 16:00 - 20:00' / 'Trong 2 giờ' / '3 ngày trước'
 *
 * Timezone hiển thị: Asia/Ho_Chi_Minh (browser auto handle).
 */
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.locale('vi');

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function parseDate(input: string | Date | number): dayjs.Dayjs {
  return dayjs(input);
}

/** 'T3, 15/07/2026' */
export function formatDate(input: string | Date | number): string {
  const d = parseDate(input);
  return `${DAY_LABELS[d.day()]}, ${d.format('DD/MM/YYYY')}`;
}

/** '14:30' */
export function formatTime(input: string | Date | number): string {
  return parseDate(input).format('HH:mm');
}

/** 'T3, 15/07/2026 · 14:30' */
export function formatDateTime(input: string | Date | number): string {
  return `${formatDate(input)} · ${formatTime(input)}`;
}

/**
 * Relative trong tương lai gần — 'Hôm nay, 16:00' / 'Ngày mai, 09:00' / 'T3, 15/07 · 14:30'
 * Dùng cho "next available slot", booking reminder
 */
export function formatNextSlot(start: string | Date | number, end?: string | Date | number): string {
  const d = parseDate(start);
  const base = d.isToday() ? 'Hôm nay' : d.isTomorrow() ? 'Ngày mai' : `${DAY_LABELS[d.day()]}, ${d.format('DD/MM')}`;
  const startTime = d.format('HH:mm');
  if (end) return `${base}, ${startTime} - ${formatTime(end)}`;
  return `${base}, ${startTime}`;
}

/** 'Trong 2 giờ' / '3 ngày trước' */
export function formatRelative(input: string | Date | number): string {
  return parseDate(input).fromNow();
}

/** Số phút giữa 2 mốc thời gian (cho buổi tập) */
export function diffMinutes(a: string | Date | number, b: string | Date | number): number {
  return Math.abs(parseDate(a).diff(parseDate(b), 'minute'));
}

/** Format số tiền VND (legacy alias — match SRS '1.500.000 đ') */
export function formatVND(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} đ`;
}
