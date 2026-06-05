'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import AppIcon from '@components/ui/AppIcon';
import { useToast } from '@contexts/ToastContext';
import { useAuth } from '@hooks/useAuth';
import { bookingService } from '@services/booking.service';
import { formatVND } from '@lib/date';
import { ROUTES } from '@config/routes';
import type { Coach } from '@app-types/coach';
import type { OpenSession } from '@app-types/openSession';

type Props = {
  coach: Coach;
  openSessions: OpenSession[];
  onClose: () => void;
};

const DURATIONS = [60, 75, 90, 120];
type CustomItem = { id: string; dateKey: string; time: string; duration: number; price: number };

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function monIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}
function dayLabel(dateKey: string): string {
  const [y, m, dd] = dateKey.split('-').map(Number);
  const d = new Date(y, m - 1, dd);
  const wd = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][d.getDay()];
  return `${wd}, ${String(dd).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
}
function hm(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function CoachBookingModal({ coach, openSessions, onClose }: Props) {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const hourPrice = coach.pricePerHour.amount;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Map + nhóm session theo ngày (chỉ buổi mở + tương lai)
  const { sessionsByDay, dayGroups } = useMemo(() => {
    const map = new Map<string, OpenSession[]>();
    const now = Date.now();
    for (const s of openSessions) {
      if (s.status !== 'open' || new Date(s.startsAt).getTime() < now) continue;
      const k = ymd(new Date(s.startsAt));
      const arr = map.get(k) ?? [];
      arr.push(s);
      map.set(k, arr);
    }
    for (const arr of map.values()) arr.sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
    const groups = [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, sessions]) => ({ dateKey, sessions }));
    return { sessionsByDay: map, dayGroups: groups };
  }, [openSessions]);

  const { cells, today, maxDay } = useMemo(() => {
    const t = startOfDay(new Date());
    const max = startOfDay(new Date(t.getTime() + 29 * 86400000));
    const lead = monIndex(t);
    const first = new Date(t.getTime() - lead * 86400000);
    const totalCells = Math.ceil((lead + 30) / 7) * 7;
    const arr: Date[] = [];
    for (let i = 0; i < totalCells; i++) arr.push(new Date(first.getTime() + i * 86400000));
    return { cells: arr, today: t, maxDay: max };
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customOn, setCustomOn] = useState(false);
  const [customDate, setCustomDate] = useState(ymd(today));
  const [customTime, setCustomTime] = useState('18:00');
  const [customDuration, setCustomDuration] = useState(60);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function toggleSession(id: string) {
    setSelectedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }
  function dayState(dateKey: string): 'none' | 'some' | 'all' {
    const ids = (sessionsByDay.get(dateKey) ?? []).map((s) => s.id);
    if (ids.length === 0) return 'none';
    const sel = ids.filter((id) => selectedIds.includes(id)).length;
    return sel === 0 ? 'none' : sel === ids.length ? 'all' : 'some';
  }
  function toggleDay(dateKey: string) {
    const ids = (sessionsByDay.get(dateKey) ?? []).map((s) => s.id);
    if (ids.length === 0) return;
    const allSel = ids.every((id) => selectedIds.includes(id));
    setSelectedIds((p) =>
      allSel ? p.filter((id) => !ids.includes(id)) : [...new Set([...p, ...ids])],
    );
    document.getElementById(`bk-day-${dateKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addCustom() {
    const price = Math.round((hourPrice * customDuration) / 60);
    setCustomItems((p) => [...p, { id: `c_${Date.now()}`, dateKey: customDate, time: customTime, duration: customDuration, price }]);
  }
  function removeCustom(id: string) {
    setCustomItems((p) => p.filter((c) => c.id !== id));
  }

  const selectedSessions = useMemo(
    () => openSessions.filter((s) => selectedIds.includes(s.id)),
    [openSessions, selectedIds],
  );
  const total =
    selectedSessions.reduce((s, x) => s + x.price.amount, 0) +
    customItems.reduce((s, x) => s + x.price, 0);
  const count = selectedSessions.length + customItems.length;

  async function submit() {
    if (count === 0 || submitting) return;
    setSubmitting(true);
    const sport = coach.sports[0] ?? 'gym-fitness';
    try {
      await Promise.all([
        ...selectedSessions.map((s) =>
          bookingService.create({
            userId: user?.id,
            coachId: coach.id,
            sportSlug: s.sportSlug,
            startsAt: s.startsAt,
            durationMinutes: s.durationMinutes,
            location: s.location,
            price: s.price.amount,
            openSessionId: s.id,
            participants: 1,
          }),
        ),
        ...customItems.map((c) => {
          const [y, m, d] = c.dateKey.split('-').map(Number);
          const [hh, mm] = c.time.split(':').map(Number);
          return bookingService.create({
            userId: user?.id,
            coachId: coach.id,
            sportSlug: sport,
            startsAt: new Date(y, m - 1, d, hh, mm).toISOString(),
            durationMinutes: c.duration,
            location: { kind: 'coach_place' },
            price: c.price,
            isCustomRequest: true,
            participants: 1,
          });
        }),
      ]);
      toast.success(`Đã gửi yêu cầu ${count} buổi tới ${coach.fullName}. Chờ coach xác nhận.`, {
        title: 'Đặt lịch thành công',
        duration: 6000,
      });
      onClose();
      router.push(ROUTES.myBookings);
    } catch {
      toast.error('Có lỗi khi đặt lịch. Vui lòng thử lại.');
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  const modal = (
    <div className="search-modal book-modal" role="dialog" aria-modal="true" aria-label="Đặt lịch với coach">
      <div className="search-modal__backdrop" onClick={onClose} />
      <div className="search-modal__sheet book-modal__sheet">
        <header className="search-modal__head">
          <h3>Đặt lịch với {coach.fullName}</h3>
          <button type="button" className="search-modal__close" onClick={onClose} aria-label="Đóng">
            <AppIcon name="close" size={20} />
          </button>
        </header>

        <div className="search-modal__body book-modal__body">
          {/* Calendar — bấm ngày để chọn nhanh buổi của ngày đó */}
          <section className="book-cal">
            <div className="book-cal__legend">
              <span><i className="book-cal__dot" /> Ngày có lịch mở</span>
              <span className="book-cal__hint">Bấm ngày để chọn nhanh các buổi của ngày đó</span>
            </div>
            <div className="book-cal__weekdays">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((w) => <span key={w}>{w}</span>)}
            </div>
            <div className="book-cal__grid">
              {cells.map((d) => {
                const k = ymd(d);
                const inRange = d >= today && d <= maxDay;
                const has = sessionsByDay.has(k);
                const cnt = sessionsByDay.get(k)?.length ?? 0;
                const st = dayState(k);
                return (
                  <button
                    key={k}
                    type="button"
                    disabled={!inRange || !has}
                    className={`book-cal__cell${st !== 'none' ? ' is-selected' : ''}${has ? ' has-session' : ''}${!inRange || !has ? ' is-out' : ''}`}
                    onClick={() => toggleDay(k)}
                  >
                    <span className="book-cal__num">{d.getDate()}</span>
                    {has && <span className="book-cal__badge">{st === 'all' ? '✓' : cnt}</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Danh sách lịch mở — hiện full, không cần bấm calendar */}
          <section className="book-list">
            <h4 className="book-list__title">Buổi tập đang mở ({openSessions.filter((s) => s.status === 'open').length})</h4>
            {dayGroups.length === 0 ? (
              <p className="book-list__empty">Coach chưa mở lịch nào trong 30 ngày tới. Bạn có thể bật “Đặt lịch riêng” bên dưới.</p>
            ) : (
              dayGroups.map((g) => (
                <div key={g.dateKey} id={`bk-day-${g.dateKey}`} className="book-list__group">
                  <div className="book-list__day">{dayLabel(g.dateKey)}</div>
                  {g.sessions.map((s) => {
                    const on = selectedIds.includes(s.id);
                    const seatsLeft = s.capacity - s.bookedCount;
                    return (
                      <button key={s.id} type="button" className={`book-slot${on ? ' book-slot--on' : ''}`} onClick={() => toggleSession(s.id)}>
                        <span className="book-slot__check">{on && <AppIcon name="check" size={14} color="#fff" />}</span>
                        <span className="book-slot__info">
                          <strong>{hm(s.startsAt)} · {s.durationMinutes}&apos;</strong>
                          <small>{s.title ?? 'Buổi tập'} · {s.capacity > 1 ? `Còn ${seatsLeft}/${s.capacity} chỗ` : '1-1'}</small>
                        </span>
                        <span className="book-slot__price">{formatVND(s.price.amount)}</span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </section>

          {/* Đặt lịch riêng — toggle */}
          <section className="book-custom-toggle">
            <button type="button" className="search-modal__toggle" aria-pressed={customOn} onClick={() => setCustomOn((v) => !v)}>
              <span className="search-modal__toggle-text">
                <AppIcon name="calendarTick" size={16} />
                Đặt lịch riêng (tự sắp xếp giờ)
                <small>Buổi đặt riêng ở trạng thái chờ coach xác nhận, giá tạm tính</small>
              </span>
              <span className={`search-modal__switch ${customOn ? 'is-on' : ''}`} aria-hidden>
                <span className="search-modal__switch-knob" />
              </span>
            </button>

            {customOn && (
              <div className="book-custom">
                <div className="book-custom__row">
                  <label>
                    <span>Ngày</span>
                    <input type="date" value={customDate} min={ymd(today)} max={ymd(maxDay)} onChange={(e) => setCustomDate(e.target.value)} />
                  </label>
                  <label>
                    <span>Giờ</span>
                    <input type="time" value={customTime} onChange={(e) => setCustomTime(e.target.value)} />
                  </label>
                  <label>
                    <span>Thời lượng</span>
                    <select value={customDuration} onChange={(e) => setCustomDuration(Number(e.target.value))}>
                      {DURATIONS.map((d) => <option key={d} value={d}>{d} phút</option>)}
                    </select>
                  </label>
                  <div className="book-custom__est">
                    <small>Tạm tính</small>
                    <strong>{formatVND(Math.round((hourPrice * customDuration) / 60))}</strong>
                  </div>
                  <button type="button" className="book-custom__add" onClick={addCustom}>
                    <AppIcon name="next" size={15} /> Thêm
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Cart + tổng */}
        <footer className="book-cart">
          {count > 0 && (
            <div className="book-cart__items">
              {selectedSessions.map((s) => (
                <span key={s.id} className="book-cart__chip">
                  {dayLabel(ymd(new Date(s.startsAt)))} {hm(s.startsAt)} · {formatVND(s.price.amount)}
                  <button type="button" onClick={() => toggleSession(s.id)} aria-label="Bỏ"><AppIcon name="close" size={12} /></button>
                </span>
              ))}
              {customItems.map((c) => (
                <span key={c.id} className="book-cart__chip book-cart__chip--custom">
                  {dayLabel(c.dateKey)} {c.time} · {formatVND(c.price)} · chờ xác nhận
                  <button type="button" onClick={() => removeCustom(c.id)} aria-label="Bỏ"><AppIcon name="close" size={12} /></button>
                </span>
              ))}
            </div>
          )}
          <div className="book-cart__bar">
            <div className="book-cart__total">
              <small>{count > 0 ? `${count} buổi · Tổng tạm tính` : 'Chưa chọn buổi nào'}</small>
              {count > 0 && <strong>{formatVND(total)}</strong>}
            </div>
            <button type="button" className="book-cart__cta" disabled={count === 0 || submitting} onClick={submit}>
              {submitting ? 'Đang gửi…' : `Đặt ${count > 0 ? count + ' buổi' : 'lịch'}`}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
