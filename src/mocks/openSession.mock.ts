/**
 * Mock OpenSession ("Lịch dạy mở") — coach pre-publish các buổi tập cụ thể
 * với ngày-giờ + giá riêng. Learner xem & book trực tiếp.
 */
import type {
  CreateOpenSessionInput,
  CreateRecurringSessionsInput,
  OpenSession,
  OpenSessionListQuery,
  OpenSessionStatus,
} from '@app-types/openSession';
import { registerMock } from '@lib/mockRegistry';
import { coachesMock } from './coaches.mock';

// ── Helpers ───────────────────────────────────────────────────

function relativeDate(daysOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function denormCoach(coachId: string): Pick<OpenSession, 'coachName' | 'coachAvatar'> {
  const c = coachesMock.find((x) => x.id === coachId);
  return {
    coachName: c?.fullName ?? 'Coach',
    coachAvatar: c?.avatar,
  };
}

function mkSession(args: {
  id: string;
  coachId: string;
  title?: string;
  sportSlug: string;
  daysOffset: number;
  hour: number;
  minute?: number;
  durationMinutes?: number;
  price: number;
  capacity: number;
  bookedCount?: number;
  status?: OpenSessionStatus;
  level?: OpenSession['level'];
  locationKind?: OpenSession['location']['kind'];
  address?: string;
  note?: string;
}): OpenSession {
  const meta = denormCoach(args.coachId);
  return {
    id: args.id,
    coachId: args.coachId,
    title: args.title,
    sportSlug: args.sportSlug,
    level: args.level ?? 'all',
    startsAt: relativeDate(args.daysOffset, args.hour, args.minute ?? 0),
    durationMinutes: args.durationMinutes ?? 60,
    price: { amount: args.price, currency: 'VND' },
    capacity: args.capacity,
    bookedCount: args.bookedCount ?? 0,
    status: args.status ?? 'open',
    location: { kind: args.locationKind ?? 'coach_place', address: args.address },
    note: args.note,
    coachName: meta.coachName,
    coachAvatar: meta.coachAvatar,
    createdAt: relativeDate(-3, 9, 0),
  };
}

// ── Preload ───────────────────────────────────────────────────

/**
 * Khoa (c1) — coach chính. Mở 6 lịch tới + 2 lịch quá khứ:
 *  - 1-1 PT Pickleball các tối T2/T4/T6 (giá khác nhau peak/off-peak)
 *  - Group class T7 sáng (8 người)
 */
const KHOA_SESSIONS: OpenSession[] = [
  mkSession({
    id: 's_c1_1',
    coachId: 'c1',
    sportSlug: 'pickleball',
    title: 'PT 1-1 Pickleball cơ bản',
    daysOffset: 1,
    hour: 18,
    price: 450_000,
    capacity: 1,
    level: 'beginner',
    note: 'Mang giày đế bằng, vợt có thể mượn tại sân.',
  }),
  mkSession({
    id: 's_c1_2',
    coachId: 'c1',
    sportSlug: 'pickleball',
    title: 'PT 1-1 Pickleball giờ peak',
    daysOffset: 2,
    hour: 19,
    price: 550_000, // peak hour cao hơn
    capacity: 1,
    level: 'intermediate',
  }),
  mkSession({
    id: 's_c1_3',
    coachId: 'c1',
    sportSlug: 'pickleball',
    title: 'PT 1-1 Pickleball nâng cao',
    daysOffset: 4,
    hour: 18,
    price: 500_000,
    capacity: 1,
    level: 'advanced',
    bookedCount: 1,
    status: 'full',
  }),
  mkSession({
    id: 's_c1_4',
    coachId: 'c1',
    sportSlug: 'pickleball',
    title: 'Group class Pickleball sáng cuối tuần',
    daysOffset: 5,
    hour: 7,
    price: 250_000, // group cheaper per-head
    capacity: 8,
    bookedCount: 3,
    level: 'all',
    note: 'Lớp nhóm tối đa 8 người. Có HLV phụ.',
  }),
  mkSession({
    id: 's_c1_5',
    coachId: 'c1',
    sportSlug: 'pickleball',
    title: 'PT 1-1 Pickleball ban ngày',
    daysOffset: 7,
    hour: 14,
    price: 400_000, // off-peak rẻ hơn
    capacity: 1,
    level: 'all',
  }),
  mkSession({
    id: 's_c1_6',
    coachId: 'c1',
    sportSlug: 'pickleball',
    title: 'PT 1-1 Pickleball nâng cao',
    daysOffset: 9,
    hour: 18,
    price: 500_000,
    capacity: 1,
    level: 'advanced',
  }),
  // Past — for "Lịch dạy đã xong" tab demo
  mkSession({
    id: 's_c1_past_1',
    coachId: 'c1',
    sportSlug: 'pickleball',
    daysOffset: -3,
    hour: 18,
    price: 450_000,
    capacity: 1,
    bookedCount: 1,
    status: 'completed',
  }),
  mkSession({
    id: 's_c1_past_2',
    coachId: 'c1',
    sportSlug: 'pickleball',
    daysOffset: -7,
    hour: 19,
    price: 450_000,
    capacity: 1,
    bookedCount: 1,
    status: 'completed',
  }),
];

/**
 * Hoà (c2) — Yoga. Thêm vài session để learner browse từ coach detail.
 */
const HOA_SESSIONS: OpenSession[] = [
  mkSession({
    id: 's_c2_1',
    coachId: 'c2',
    sportSlug: 'yoga',
    title: 'Yoga sáng — Vinyasa Flow',
    daysOffset: 1,
    hour: 6,
    minute: 30,
    durationMinutes: 75,
    price: 200_000,
    capacity: 6,
    bookedCount: 2,
    level: 'all',
  }),
  mkSession({
    id: 's_c2_2',
    coachId: 'c2',
    sportSlug: 'yoga',
    title: 'Yoga tối — Yin Restorative',
    daysOffset: 2,
    hour: 19,
    durationMinutes: 60,
    price: 220_000,
    capacity: 6,
    bookedCount: 1,
  }),
  mkSession({
    id: 's_c2_3',
    coachId: 'c2',
    sportSlug: 'yoga',
    title: 'Yoga 1-1 chữa lành',
    daysOffset: 3,
    hour: 9,
    durationMinutes: 60,
    price: 500_000,
    capacity: 1,
    level: 'all',
  }),
];

export const openSessionsMock: OpenSession[] = [...KHOA_SESSIONS, ...HOA_SESSIONS];

// ── Filter ────────────────────────────────────────────────────

function filterSessions(list: OpenSession[], q: OpenSessionListQuery): OpenSession[] {
  let out = [...list];
  if (q.coachId) out = out.filter((s) => s.coachId === q.coachId);
  if (q.sport) out = out.filter((s) => s.sportSlug === q.sport);

  if (q.status) {
    const ss = Array.isArray(q.status) ? q.status : [q.status];
    out = out.filter((s) => ss.includes(s.status));
  }

  if (q.scope === 'upcoming') {
    const now = Date.now();
    out = out.filter(
      (s) =>
        new Date(s.startsAt).getTime() >= now &&
        (s.status === 'open' || s.status === 'full'),
    );
  } else if (q.scope === 'past') {
    out = out.filter(
      (s) => s.status === 'completed' || new Date(s.startsAt).getTime() < Date.now(),
    );
  }

  return out.sort((a, b) => {
    if (q.scope === 'past') return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });
}

// ── Recurring expansion ───────────────────────────────────────

function expandRecurring(input: CreateRecurringSessionsInput): OpenSession[] {
  const [hh, mm] = input.time.split(':').map(Number);
  const start = new Date(`${input.startDate}T00:00:00`);
  const out: OpenSession[] = [];
  const meta = denormCoach(input.coachId);

  for (let week = 0; week < input.weeksCount; week++) {
    for (let day = 0; day < 7; day++) {
      const d = new Date(start);
      d.setDate(d.getDate() + week * 7 + day);
      if (!input.weekdays.includes(d.getDay())) continue;
      d.setHours(hh, mm, 0, 0);

      out.push({
        id: `s_${input.coachId}_r_${Date.now()}_${week}_${day}`,
        coachId: input.coachId,
        title: input.title,
        sportSlug: input.sportSlug,
        level: input.level,
        startsAt: d.toISOString(),
        durationMinutes: input.durationMinutes,
        price: input.price,
        capacity: input.capacity,
        bookedCount: 0,
        status: 'open',
        location: input.location,
        note: input.note,
        coachName: meta.coachName,
        coachAvatar: meta.coachAvatar,
        createdAt: new Date().toISOString(),
      });
    }
  }
  return out;
}

// ── Registered handlers ───────────────────────────────────────

registerMock('GET /open-sessions', ({ query }) =>
  filterSessions(openSessionsMock, query as OpenSessionListQuery),
);

registerMock('GET /open-sessions/:id', ({ pathParams }) => {
  const found = openSessionsMock.find((s) => s.id === pathParams.id);
  if (!found) throw new Error(`OpenSession not found: ${pathParams.id}`);
  return found;
});

registerMock('POST /open-sessions', ({ body }): OpenSession => {
  const input = body as CreateOpenSessionInput;
  const meta = denormCoach(input.coachId);
  const session: OpenSession = {
    id: `s_${Date.now()}`,
    coachId: input.coachId,
    title: input.title,
    sportSlug: input.sportSlug,
    level: input.level ?? 'all',
    startsAt: input.startsAt,
    durationMinutes: input.durationMinutes,
    price: input.price,
    capacity: input.capacity,
    bookedCount: 0,
    status: 'open',
    location: input.location,
    note: input.note,
    coachName: meta.coachName,
    coachAvatar: meta.coachAvatar,
    createdAt: new Date().toISOString(),
  };
  openSessionsMock.push(session);
  return session;
});

registerMock('POST /open-sessions/bulk', ({ body }): OpenSession[] => {
  const input = body as CreateRecurringSessionsInput;
  const sessions = expandRecurring(input);
  openSessionsMock.push(...sessions);
  return sessions;
});

registerMock('PATCH /open-sessions/:id', ({ pathParams, body }) => {
  const found = openSessionsMock.find((s) => s.id === pathParams.id);
  if (!found) throw new Error(`OpenSession not found: ${pathParams.id}`);
  Object.assign(found, body);
  return found;
});

registerMock('DELETE /open-sessions/:id', ({ pathParams }) => {
  const idx = openSessionsMock.findIndex((s) => s.id === pathParams.id);
  if (idx === -1) throw new Error(`OpenSession not found: ${pathParams.id}`);
  openSessionsMock[idx].status = 'cancelled';
  return openSessionsMock[idx];
});

/**
 * Khi learner book → tăng bookedCount, đổi status nếu full.
 * Trả về session đã update để booking flow dùng.
 */
registerMock('POST /open-sessions/:id/book', ({ pathParams }) => {
  const found = openSessionsMock.find((s) => s.id === pathParams.id);
  if (!found) throw new Error(`OpenSession not found: ${pathParams.id}`);
  if (found.status !== 'open') throw new Error('Lịch dạy này không còn nhận đặt.');
  if (found.bookedCount >= found.capacity) throw new Error('Lịch dạy này đã đầy.');
  found.bookedCount += 1;
  if (found.bookedCount >= found.capacity) found.status = 'full';
  return found;
});
