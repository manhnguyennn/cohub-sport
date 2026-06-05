import type {
  Booking,
  BookingListQuery,
  BookingStatus,
  CancelBookingResult,
  CreateBookingInput,
  TimeSlot,
} from '@app-types/booking';
import { registerMock } from '@lib/mockRegistry';
import { coachesMock } from './coaches.mock';
import { promoMocks } from './promo.mock';

// ── Time slot generator ───────────────────────────────────────
function generateSlots(coachId: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();
  // Deterministic seed based on coachId để slot không random mỗi reload
  const seed = coachId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  let i = 0;
  for (let day = 1; day <= 14; day++) {
    for (const hour of [9, 11, 14, 16, 18, 20]) {
      const d = new Date(now);
      d.setDate(d.getDate() + day);
      d.setHours(hour, 0, 0, 0);
      // pseudo-random nhưng deterministic
      const pseudo = (seed + i * 17) % 10;
      slots.push({
        startsAt: d.toISOString(),
        durationMinutes: 60,
        isAvailable: pseudo > 3,
      });
      i++;
    }
  }
  return slots;
}

registerMock('GET /coaches/:coachId/availability', ({ pathParams }) =>
  generateSlots(pathParams.coachId),
);

// ── Booking store ─────────────────────────────────────────────
function relativeDate(daysOffset: number, hour: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function denormCoach(coachId: string) {
  const c = coachesMock.find((x) => x.id === coachId);
  return {
    coachName:   c?.fullName ?? 'Coach',
    coachAvatar: c?.avatar,
    sportSlug:   c?.sports[0] ?? 'gym-fitness',
    price:       c?.pricePerHour ?? { amount: 450_000, currency: 'VND' as const },
  };
}

const LEARNER_NAMES: Record<string, string> = {
  u_linh: 'Trần Thu Linh',
  u_other_1: 'Lê Thị Hằng',
  u_other_2: 'Phạm Quốc Bảo',
  u_other_3: 'Nguyễn Mỹ Anh',
};
export function denormLearner(userId: string): string {
  return LEARNER_NAMES[userId] ?? 'Học viên';
}

function mkBooking(args: {
  id: string;
  userId: string;
  coachId: string;
  daysOffset: number;
  hour: number;
  status: BookingStatus;
  note?: string;
}): Booking {
  const meta = denormCoach(args.coachId);
  return {
    id: args.id,
    userId: args.userId,
    userName: denormLearner(args.userId),
    coachId: args.coachId,
    coachName: meta.coachName,
    coachAvatar: meta.coachAvatar,
    sportSlug: meta.sportSlug,
    startsAt: relativeDate(args.daysOffset, args.hour),
    durationMinutes: 60,
    price: meta.price,
    subtotal: meta.price,
    status: args.status,
    location: { kind: 'coach_place' },
    note: args.note,
    participants: 1,
    createdAt: relativeDate(args.daysOffset - 5, args.hour - 1),
  };
}

// Preload bookings cho 3 personas (FSD §3.4)
export const bookingsMock: Booking[] = [
  // Persona Linh — Learner
  mkBooking({ id: 'b_linh_1', userId: 'u_linh', coachId: 'c1', daysOffset: 2,  hour: 18, status: 'confirmed', note: 'Mục tiêu: cải thiện forehand' }),
  mkBooking({ id: 'b_linh_2', userId: 'u_linh', coachId: 'c2', daysOffset: -7, hour: 7,  status: 'completed', note: 'Lớp Vinyasa sáng' }),
  mkBooking({ id: 'b_linh_3', userId: 'u_linh', coachId: 'c5', daysOffset: -21,hour: 14, status: 'completed' }),

  // Persona Khoa — Coach (booking coach NHẬN từ learner khác)
  mkBooking({ id: 'b_khoa_1', userId: 'u_other_1', coachId: 'c1', daysOffset: 1,  hour: 19, status: 'pending', note: 'Lần đầu tập' }),
  mkBooking({ id: 'b_khoa_2', userId: 'u_other_2', coachId: 'c1', daysOffset: 3,  hour: 17, status: 'pending' }),
  mkBooking({ id: 'b_khoa_3', userId: 'u_other_3', coachId: 'c1', daysOffset: 5,  hour: 18, status: 'confirmed' }),
];

// ── Filter logic ──────────────────────────────────────────────
function filterBookings(list: Booking[], q: BookingListQuery): Booking[] {
  let out = [...list];
  if (q.userId) out = out.filter((b) => b.userId === q.userId);
  if (q.coachId) out = out.filter((b) => b.coachId === q.coachId);

  if (q.status) {
    const statuses = Array.isArray(q.status) ? q.status : [q.status];
    out = out.filter((b) => statuses.includes(b.status));
  }

  if (q.scope) {
    const nowMs = Date.now();
    if (q.scope === 'upcoming') {
      out = out.filter(
        (b) =>
          (b.status === 'pending' || b.status === 'confirmed') &&
          new Date(b.startsAt).getTime() >= nowMs,
      );
    } else if (q.scope === 'past') {
      out = out.filter(
        (b) =>
          b.status === 'completed' ||
          (b.status === 'confirmed' && new Date(b.startsAt).getTime() < nowMs),
      );
    } else if (q.scope === 'cancelled') {
      out = out.filter((b) => b.status === 'cancelled' || b.status === 'no_show');
    }
  }

  // Sort: upcoming asc, past desc
  return out.sort((a, b) => {
    if (q.scope === 'past') return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });
}

// ── Cancellation policy (PRD §P0.9) ──────────────────────────
function calcRefund(startsAt: string, amount: number): CancelBookingResult['policyApplied'] extends infer P ? { policy: P; percent: number } : never;
function calcRefund(startsAt: string, amount: number) {
  const hoursUntil = (new Date(startsAt).getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntil >= 24) return { policy: 'over_24h' as const, percent: 100 };
  if (hoursUntil >= 6)  return { policy: '6h_24h' as const,  percent: 50  };
  return                       { policy: 'under_6h' as const, percent: 0   };
}

// ── Registered handlers ───────────────────────────────────────

registerMock('GET /bookings', ({ query }) =>
  filterBookings(bookingsMock, query as BookingListQuery),
);

registerMock('GET /bookings/:id', ({ pathParams }) => {
  const found = bookingsMock.find((b) => b.id === pathParams.id);
  if (!found) throw new Error(`Booking not found: ${pathParams.id}`);
  return found;
});

registerMock('POST /bookings', ({ body }): Booking => {
  const input = body as CreateBookingInput & { userId?: string };
  const meta = denormCoach(input.coachId);

  // Giá: ưu tiên giá truyền vào (open session / tạm tính custom), fallback giá coach
  const baseAmount = input.price ?? meta.price.amount;
  const base = { amount: baseAmount, currency: 'VND' as const };

  // Apply promo nếu có
  let discount = 0;
  let promoCode: string | undefined;
  if (input.promoCode) {
    const p = promoMocks.find((x) => x.code.toUpperCase() === input.promoCode!.toUpperCase());
    if (p) {
      promoCode = p.code;
      discount = p.type === 'flat' ? p.value : Math.floor((baseAmount * p.value) / 100);
    }
  }

  const booking: Booking = {
    id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId: input.userId ?? 'u_linh',           // default current learner = Linh
    userName: denormLearner(input.userId ?? 'u_linh'),
    coachId: input.coachId,
    coachName: meta.coachName,
    coachAvatar: meta.coachAvatar,
    sportSlug: input.sportSlug,
    startsAt: input.startsAt,
    durationMinutes: input.durationMinutes ?? 60,
    price: { amount: baseAmount - discount, currency: 'VND' },
    subtotal: base,
    discount: discount > 0 ? { amount: discount, currency: 'VND' } : undefined,
    promoCode,
    status: 'pending',
    location: input.location,
    note: input.isCustomRequest
      ? (input.note ? `${input.note} · (Đặt lịch riêng — chờ coach xác nhận giá)` : 'Đặt lịch riêng — chờ coach xác nhận giá')
      : input.note,
    healthNote: input.healthNote,
    participants: input.participants ?? 1,
    createdAt: new Date().toISOString(),
  };
  bookingsMock.push(booking);
  return booking;
});

/**
 * Force-update status — Demo Mode auto-confirm logic gọi qua endpoint này
 * sau khi countdown delay xong.
 */
registerMock('PATCH /bookings/:id/status', ({ pathParams, body }) => {
  const found = bookingsMock.find((b) => b.id === pathParams.id);
  if (!found) throw new Error(`Booking not found: ${pathParams.id}`);
  const { status } = body as { status: BookingStatus };
  found.status = status;
  return found;
});

registerMock('POST /bookings/:id/cancel', ({ pathParams }): CancelBookingResult => {
  const found = bookingsMock.find((b) => b.id === pathParams.id);
  if (!found) throw new Error(`Booking not found: ${pathParams.id}`);

  const refund = calcRefund(found.startsAt, found.price.amount);
  const refundAmount = Math.floor((found.price.amount * refund.percent) / 100);

  found.status = 'cancelled';
  found.cancelledAt = new Date().toISOString();
  found.refundAmount = { amount: refundAmount, currency: 'VND' };

  return {
    bookingId: found.id,
    status: found.status,
    refundAmount: { amount: refundAmount, currency: 'VND' },
    refundPercent: refund.percent,
    policyApplied: refund.policy,
    message:
      refund.percent === 100 ? 'Hoàn 100% — huỷ trước 24h.'
      : refund.percent === 50 ? 'Hoàn 50% — huỷ trong 6h-24h trước buổi tập.'
      : 'Không hoàn tiền — huỷ trong vòng 6h trước buổi tập.',
  };
});
