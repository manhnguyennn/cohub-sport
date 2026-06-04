'use client';

/**
 * /coach/calendar — Quản lý lịch dạy (FSD §4.17).
 *
 * Layout:
 *  - Toolbar: tuần trước/sau, range label, view toggle (Tuần/Tháng)
 *  - Grid 8 cols (time + 7 days), 6 rows time slots (07:00 → 21:00)
 *  - Slot color: available / booked / blocked / course
 *  - Click slot trống → toggle blocked (mock)
 *
 * Mock: lấy bookingsMock + sinh course sessions để overlay.
 */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, SkeletonDetail } from '@components/ui';
import { ROUTES } from '@config/routes';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { bookingService } from '@services/booking.service';
import { openSessionService } from '@services/openSession.service';
import { cn } from '@lib/cn';
import type { Booking } from '@app-types/booking';
import type { OpenSession } from '@app-types/openSession';

const TIME_SLOTS = ['07:00', '09:00', '11:00', '14:00', '16:00', '18:00', '20:00'];
const DAY_LABEL = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * SlotState — trạng thái 1 ô trong week grid:
 *   - past:          đã qua
 *   - booked:        có booking đã xác nhận
 *   - blocked:       coach đã block
 *   - course:        có buổi của khoá học cố định
 *   - open-session:  có "Lịch dạy mở" — chưa đầy
 *   - open-full:     có "Lịch dạy mở" — đã đầy
 *   - available:     trống, có thể mở thêm lịch
 */
type SlotState = 'available' | 'booked' | 'blocked' | 'course' | 'past' | 'open-session' | 'open-full';

export default function CoachCalendarClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const toast = useToast();

  const [view, setView] = useState<'week' | 'month'>('week');
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1); // Monday
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [openSessions, setOpenSessions] = useState<OpenSession[]>([]);
  const [blockedKeys, setBlockedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) { requireLogin({ redirectTo: ROUTES.coachCalendar }); return; }
    if (role !== 'coach' && role !== 'admin') { router.replace('/'); return; }
    // Khoa = coach 'c1' nhận booking từ Linh
    bookingService.list({}).then((all) => {
      setBookings(all.filter((b) => b.coachId === 'c1'));
    }).catch(() => setBookings([]));
    openSessionService.list({ coachId: 'c1', scope: 'upcoming' })
      .then(setOpenSessions)
      .catch(() => setOpenSessions([]));
  }, [isReady, isLoggedIn, role, requireLogin, router]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  function slotKey(date: Date, time: string): string {
    return `${date.toISOString().slice(0, 10)}_${time}`;
  }

  function slotState(date: Date, time: string): SlotState {
    const [h] = time.split(':').map(Number);
    const slotMs = new Date(date).setHours(h, 0, 0, 0);
    if (slotMs < Date.now()) return 'past';

    const key = slotKey(date, time);
    if (blockedKeys.has(key)) return 'blocked';

    // Has OpenSession in this hour? — ưu tiên trước booking để hiển thị "Lịch mở"
    const dateStr = date.toISOString().slice(0, 10);
    const os = openSessions.find((s) => {
      const t = new Date(s.startsAt);
      return t.toISOString().slice(0, 10) === dateStr
        && Math.abs(t.getHours() - h) < 1
        && (s.status === 'open' || s.status === 'full');
    });
    if (os) return os.status === 'full' ? 'open-full' : 'open-session';

    // Has booking nearby? (custom slot bookings — sẽ giảm dần khi user chuyển hết sang OpenSession)
    const match = bookings?.find((b) => {
      const t = new Date(b.startsAt);
      return t.toISOString().slice(0, 10) === dateStr
        && Math.abs(t.getHours() - h) < 1
        && (b.status === 'confirmed' || b.status === 'pending');
    });
    if (match) return 'booked';

    // Mock course session marker — sample days = T3, T5 at 18:00
    if ((date.getDay() === 2 || date.getDay() === 4) && time === '18:00') return 'course';

    return 'available';
  }

  function handleSlotClick(date: Date, time: string) {
    const state = slotState(date, time);
    if (state === 'past' || state === 'booked' || state === 'course') return;
    if (state === 'open-session' || state === 'open-full') {
      // Click vào ô đã có Lịch dạy mở → navigate sang quản lý lịch
      router.push(ROUTES.coachSessions);
      return;
    }

    const key = slotKey(date, time);
    setBlockedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        toast.info('Đã mở lại slot này');
      } else {
        next.add(key);
        toast.info('Đã block slot này');
      }
      return next;
    });
  }

  function navWeek(delta: number) {
    setWeekStart((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + delta * 7);
      return next;
    });
  }

  if (!isReady || !isLoggedIn) return null;
  if (!bookings) return <div className="coach-cms__container"><SkeletonDetail /></div>;

  const rangeLabel = formatRange(weekDays[0], weekDays[6]);

  return (
    <div className="coach-cms">
      <div className="coach-cms__container">
        <header className="cms-banner">
          <div>
            <strong>Lịch tổng quan</strong>
            <p>Ô <em>Lịch mở</em> là buổi bạn đã đăng cho học viên đặt. Ô trống có thể block hoặc mở thêm lịch mới.</p>
          </div>
          <Button href={ROUTES.coachSessionNew} variant="primary" size="md">
            + Mở lịch dạy mới
          </Button>
        </header>

        <section className="cms-card">
          <div className="cms-calendar-toolbar">
            <div className="cms-calendar-toolbar__nav">
              <button type="button" className="cms-calendar-toolbar__nav-btn" onClick={() => navWeek(-1)} aria-label="Tuần trước">‹</button>
              <strong>{rangeLabel}</strong>
              <button type="button" className="cms-calendar-toolbar__nav-btn" onClick={() => navWeek(1)} aria-label="Tuần sau">›</button>
            </div>

            <div className="cms-calendar-toolbar__view-toggle">
              <button type="button" className={cn(view === 'week' && 'is-active')} onClick={() => setView('week')}>Tuần</button>
              <button type="button" className={cn(view === 'month' && 'is-active')} onClick={() => setView('month')} disabled>Tháng</button>
            </div>
          </div>

          <div className="cms-calendar">
            {/* Header row */}
            <div className="cms-calendar__head cms-calendar__head--time" />
            {weekDays.map((d) => (
              <div key={d.toISOString()} className="cms-calendar__head">
                <strong>{d.getDate()}</strong>
                <small>{DAY_LABEL[d.getDay()]}</small>
              </div>
            ))}

            {/* Time rows */}
            {TIME_SLOTS.map((t) => (
              <FragmentRow key={t} time={t} days={weekDays} stateOf={slotState} onClick={handleSlotClick} />
            ))}
          </div>

          <div className="cms-calendar__legend">
            <span className="available">Trống</span>
            <span className="open-session">Lịch mở</span>
            <span className="open-full">Lịch mở đã đầy</span>
            <span className="booked">Đã đặt</span>
            <span className="blocked">Block</span>
            <span className="course">Khoá học</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function FragmentRow({
  time, days, stateOf, onClick,
}: {
  time: string;
  days: Date[];
  stateOf: (d: Date, t: string) => SlotState;
  onClick: (d: Date, t: string) => void;
}) {
  return (
    <>
      <div className="cms-calendar__time">{time}</div>
      {days.map((d) => {
        const st = stateOf(d, time);
        return (
          <button
            key={d.toISOString() + time}
            type="button"
            className={cn('cms-calendar__slot', `cms-calendar__slot--${st}`)}
            onClick={() => onClick(d, time)}
            disabled={st === 'past' || st === 'booked' || st === 'course'}
          >
            {st === 'booked'       ? 'Booked'    :
             st === 'blocked'      ? 'Block'     :
             st === 'course'       ? 'Khoá học'  :
             st === 'open-session' ? 'Lịch mở'   :
             st === 'open-full'    ? 'Đã đầy'    :
             st === 'past'         ? '·' : '+'}
          </button>
        );
      })}
    </>
  );
}

function formatRange(start: Date, end: Date): string {
  const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  return `${fmt(start)} → ${fmt(end)}, ${end.getFullYear()}`;
}
