/**
 * Booking draft — lưu form data trong sessionStorage giữa
 * /booking/new → /checkout (đóng tab thì reset, theo FSD §1.2 No.4).
 */
import type { BookingLocation } from '@app-types/booking';

const KEY = 'cohub:booking_draft';

export type BookingDraft = {
  coachId: string;
  sportSlug: string;
  startsAt: string;
  durationMinutes: number;
  location: BookingLocation;
  note?: string;
  healthNote?: string;
  participants: number;
  promoCode?: string;
  /** Subtotal & discount snapshot (tính sẵn để /checkout không phải gọi lại promo) */
  subtotal: number;
  discount: number;
  total: number;
};

export function saveBookingDraft(draft: BookingDraft): void {
  if (typeof window === 'undefined') return;
  try { sessionStorage.setItem(KEY, JSON.stringify(draft)); } catch { /* ignore */ }
}

export function readBookingDraft(): BookingDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BookingDraft) : null;
  } catch { return null; }
}

export function clearBookingDraft(): void {
  if (typeof window === 'undefined') return;
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}
