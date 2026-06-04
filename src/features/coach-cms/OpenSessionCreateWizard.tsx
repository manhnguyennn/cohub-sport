'use client';

/**
 * Wizard tạo "Lịch dạy mở" — phân biệt rõ với "Khoá học".
 *
 * Concept cốt lõi:
 *   - Mỗi "Lịch dạy mở" = 1 buổi tập cụ thể, có ngày-giờ + giá riêng
 *   - Coach có thể mở 1 buổi đơn lẻ (chế độ ĐƠN LẺ) hoặc
 *     loạt nhiều buổi lặp lại trong N tuần (chế độ LẶP LẠI)
 *   - Học viên xem trên trang HLV và đặt trực tiếp từng buổi
 *
 * 3 bước:
 *   1. Loại lịch (ĐƠN LẺ / LẶP LẠI) → quyết định form bước 2
 *   2. Thông tin & Lịch (sport, level, ngày/giờ, sĩ số, địa điểm)
 *   3. Giá + Preview → tạo
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Stepper } from '@components/ui';
import { ROUTES } from '@config/routes';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { useDemoMode } from '@contexts/DemoModeContext';
import { cn } from '@lib/cn';
import { formatVND, formatNextSlot } from '@lib/date';
import { openSessionService } from '@services/openSession.service';
import type { Sport } from '@app-types/sport';
import type {
  BookingLocation,
  CreateOpenSessionInput,
  CreateRecurringSessionsInput,
  OpenSession,
} from '@app-types/index';

type Mode = 'single' | 'recurring';
type LevelOption = NonNullable<OpenSession['level']>;
type LocKind = BookingLocation['kind'];

const STEPS = [
  { id: 1, label: 'Loại lịch' },
  { id: 2, label: 'Thông tin & Lịch' },
  { id: 3, label: 'Giá & Preview' },
];

const LEVELS: { v: LevelOption; label: string }[] = [
  { v: 'all',          label: 'Mọi cấp độ' },
  { v: 'beginner',     label: 'Người mới' },
  { v: 'intermediate', label: 'Trung cấp' },
  { v: 'advanced',     label: 'Nâng cao' },
];

const WEEKDAYS = [
  { id: 1, label: 'T2' },
  { id: 2, label: 'T3' },
  { id: 3, label: 'T4' },
  { id: 4, label: 'T5' },
  { id: 5, label: 'T6' },
  { id: 6, label: 'T7' },
  { id: 0, label: 'CN' },
];

const LOCATIONS: { kind: LocKind; label: string; hint: string }[] = [
  { kind: 'coach_place',   label: 'Tại sân/phòng coach',  hint: 'Học viên đến địa điểm cố định của bạn' },
  { kind: 'learner_place', label: 'Đến nhà học viên',     hint: 'Bạn di chuyển tới chỗ học viên' },
  { kind: 'third_party',   label: 'Sân/phòng thuê khác',   hint: 'Cả 2 cùng đến địa điểm thuê' },
];

type Draft = {
  mode: Mode | null;
  title: string;
  sport: string;
  level: LevelOption;
  durationMinutes: number;
  capacity: number;
  price: number;
  locationKind: LocKind;
  address: string;
  note: string;

  // Single mode
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm

  // Recurring mode
  startDate: string;
  weeksCount: number;
  weekdays: number[];
};

const EMPTY: Draft = {
  mode: null,
  title: '',
  sport: '',
  level: 'all',
  durationMinutes: 60,
  capacity: 1,
  price: 0,
  locationKind: 'coach_place',
  address: '',
  note: '',
  date: '',
  time: '18:00',
  startDate: '',
  weeksCount: 4,
  weekdays: [],
};

export default function OpenSessionCreateWizard({ sports }: { sports: Sport[] }) {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const toast = useToast();
  const { withDelay } = useDemoMode();

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) requireLogin({ redirectTo: ROUTES.coachSessionNew });
    else if (role !== 'coach' && role !== 'admin') router.replace('/');
  }, [isReady, isLoggedIn, role, requireLogin, router]);

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  function patch(p: Partial<Draft>) { setDraft((d) => ({ ...d, ...p })); }

  function validate(): string | null {
    switch (step) {
      case 1: return draft.mode ? null : 'Chọn loại lịch';
      case 2:
        if (!draft.sport) return 'Chọn bộ môn';
        if (draft.capacity < 1) return 'Sĩ số tối thiểu 1';
        if (draft.locationKind !== 'coach_place' && !draft.address.trim()) {
          return 'Nhập địa chỉ chi tiết';
        }
        if (draft.mode === 'single') {
          if (!draft.date) return 'Chọn ngày dạy';
          if (!draft.time) return 'Chọn giờ bắt đầu';
          const start = new Date(`${draft.date}T${draft.time}:00`);
          if (start.getTime() < Date.now()) return 'Ngày/giờ phải ở tương lai';
        } else {
          if (!draft.startDate) return 'Chọn ngày bắt đầu chuỗi';
          if (draft.weekdays.length === 0) return 'Chọn ít nhất 1 ngày trong tuần';
          if (draft.weeksCount < 1) return 'Số tuần tối thiểu 1';
        }
        return null;
      case 3:
        if (draft.price < 50_000) return 'Giá ≥ 50.000đ';
        return null;
    }
    return null;
  }

  function next() {
    const err = validate();
    if (err) { toast.error(err); return; }
    if (step < STEPS.length) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      // Mock: persona Khoa = c1
      const coachId = 'c1';
      const location: BookingLocation = {
        kind: draft.locationKind,
        address: draft.locationKind === 'coach_place' ? undefined : draft.address.trim(),
      };
      const price = { amount: draft.price, currency: 'VND' as const };
      const common = {
        coachId,
        title: draft.title.trim() || undefined,
        sportSlug: draft.sport,
        level: draft.level,
        durationMinutes: draft.durationMinutes,
        capacity: draft.capacity,
        price,
        location,
        note: draft.note.trim() || undefined,
      };

      if (draft.mode === 'single') {
        const startsAt = new Date(`${draft.date}T${draft.time}:00`).toISOString();
        const input: CreateOpenSessionInput = { ...common, startsAt };
        await openSessionService.create(input);
        setTimeout(() => {
          toast.success('Đã mở 1 lịch dạy!', { title: '✨ Thành công' });
          router.push(ROUTES.coachSessions);
        }, withDelay(800));
      } else {
        const input: CreateRecurringSessionsInput = {
          ...common,
          startDate: draft.startDate,
          weeksCount: draft.weeksCount,
          weekdays: draft.weekdays,
          time: draft.time,
        };
        const created = await openSessionService.createRecurring(input);
        setTimeout(() => {
          toast.success(`Đã mở ${created.length} lịch dạy!`, { title: '✨ Thành công' });
          router.push(ROUTES.coachSessions);
        }, withDelay(800));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="onboarding-wizard">
      <header className="onboarding-wizard__head">
        <div className="onboarding-wizard__head-inner">
          <Link href={ROUTES.coachSessions} className="onboarding-wizard__exit">← Thoát</Link>
          <div className="onboarding-wizard__progress">
            <div className="onboarding-wizard__progress-bar">
              <span style={{ width: `${((step - 1) / STEPS.length) * 100}%` }} />
            </div>
            <span>Bước {step}/{STEPS.length}</span>
          </div>
        </div>
      </header>

      <div className="onboarding-wizard__container">
        <Stepper
          steps={STEPS}
          current={step}
          completed={step - 1}
          onStepClick={(s) => setStep(s)}
        />

        <div className="onboarding-wizard__panel">
          {step === 1 && <Step1Mode value={draft} onChange={patch} />}
          {step === 2 && <Step2InfoSchedule value={draft} onChange={patch} sports={sports} />}
          {step === 3 && <Step3PricePreview value={draft} onChange={patch} sports={sports} />}
        </div>

        <footer className="onboarding-wizard__footer">
          <div>
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
                ← Quay lại
              </Button>
            )}
          </div>
          <div className="onboarding-wizard__footer-right">
            <Button variant="primary" onClick={next} disabled={submitting}>
              {step === STEPS.length
                ? (submitting ? 'Đang mở…' : (draft.mode === 'recurring' ? 'Mở tất cả lịch' : 'Mở lịch dạy'))
                : 'Tiếp theo →'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ── Steps ────────────────────────────────────────────────────

function Step1Mode({ value, onChange }: { value: Draft; onChange: (p: Partial<Draft>) => void }) {
  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Mở 1 lịch hay loạt lịch?</h1>
        <p>
          <em>Lịch dạy mở</em> là từng buổi tập cụ thể. Bạn có thể mở 1 buổi đơn lẻ
          hoặc tạo loạt nhiều buổi lặp lại trong vài tuần.
        </p>
      </header>

      <div className="step-form__level-list">
        <label className={cn('step-form__level', value.mode === 'single' && 'is-active')}>
          <input
            type="radio"
            checked={value.mode === 'single'}
            onChange={() => onChange({ mode: 'single' })}
          />
          <div>
            <strong>🎯 Đơn lẻ</strong>
            <span>1 buổi cụ thể (vd: T7 15/06, 18:00). Mở nhanh khi có khung giờ rảnh bất chợt.</span>
          </div>
        </label>

        <label className={cn('step-form__level', value.mode === 'recurring' && 'is-active')}>
          <input
            type="radio"
            checked={value.mode === 'recurring'}
            onChange={() => onChange({ mode: 'recurring' })}
          />
          <div>
            <strong>🔁 Lặp lại theo tuần</strong>
            <span>Loạt nhiều buổi cùng giờ-giá (vd: T2+T4+T6 lúc 18:00 trong 4 tuần → 12 lịch). Tiết kiệm thời gian.</span>
          </div>
        </label>
      </div>
    </div>
  );
}

function Step2InfoSchedule({
  value, onChange, sports,
}: {
  value: Draft; onChange: (p: Partial<Draft>) => void; sports: Sport[];
}) {
  const showAddress = value.locationKind !== 'coach_place';
  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Thông tin & Lịch</h1>
        <p>{value.mode === 'single' ? 'Cài nội dung và ngày-giờ buổi này.' : 'Cài nội dung và các khung lặp lại.'}</p>
      </header>

      {/* Title */}
      <section className="step-form__section">
        <label className="step-form__label">
          Tên lịch dạy (tuỳ chọn)
          <small style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>
            Bỏ trống sẽ dùng tên bộ môn
          </small>
        </label>
        <input
          type="text"
          className="step-form__input"
          placeholder="VD: PT 1-1 Pickleball giờ peak"
          value={value.title}
          maxLength={80}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </section>

      {/* Sport + Level */}
      <section className="step-form__section step-form__section--row">
        <div>
          <label className="step-form__label">Bộ môn <span className="step-form__required">*</span></label>
          <select className="step-form__select" value={value.sport} onChange={(e) => onChange({ sport: e.target.value })}>
            <option value="">Chọn bộ môn</option>
            {sports.filter((s) => s.category === 'sport').map((s) => (
              <option key={s.id} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="step-form__label">Cấp độ phù hợp</label>
          <div className="step-form__chips">
            {LEVELS.map((l) => (
              <button
                key={l.v}
                type="button"
                className={cn('step-form__chip', value.level === l.v && 'is-active')}
                onClick={() => onChange({ level: l.v })}
              >{l.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Duration + Capacity */}
      <section className="step-form__section step-form__section--row">
        <div>
          <label className="step-form__label">Thời lượng mỗi buổi</label>
          <div className="step-form__chips">
            {[45, 60, 75, 90, 120].map((m) => (
              <button
                key={m}
                type="button"
                className={cn('step-form__chip', value.durationMinutes === m && 'is-active')}
                onClick={() => onChange({ durationMinutes: m })}
              >{m} phút</button>
            ))}
          </div>
        </div>
        <div>
          <label className="step-form__label">Sĩ số tối đa <span className="step-form__required">*</span></label>
          <div className="step-form__chips">
            {[1, 2, 4, 6, 8, 12].map((n) => (
              <button
                key={n}
                type="button"
                className={cn('step-form__chip', value.capacity === n && 'is-active')}
                onClick={() => onChange({ capacity: n })}
              >{n === 1 ? '1-1' : `${n} người`}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Mode-specific schedule */}
      {value.mode === 'single' ? (
        <section className="step-form__section step-form__section--row">
          <div>
            <label className="step-form__label">Ngày dạy <span className="step-form__required">*</span></label>
            <input
              type="date"
              className="step-form__input"
              value={value.date}
              min={minDate}
              onChange={(e) => onChange({ date: e.target.value })}
            />
          </div>
          <div>
            <label className="step-form__label">Giờ bắt đầu <span className="step-form__required">*</span></label>
            <input
              type="time"
              className="step-form__input"
              value={value.time}
              onChange={(e) => onChange({ time: e.target.value })}
            />
          </div>
        </section>
      ) : (
        <>
          <section className="step-form__section">
            <label className="step-form__label">Ngày bắt đầu chuỗi <span className="step-form__required">*</span></label>
            <input
              type="date"
              className="step-form__input"
              value={value.startDate}
              min={minDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              style={{ maxWidth: 240 }}
            />
          </section>

          <section className="step-form__section">
            <label className="step-form__label">Các thứ trong tuần <span className="step-form__required">*</span></label>
            <div className="step-form__day-grid">
              {WEEKDAYS.map((d) => {
                const active = value.weekdays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={cn('step-form__day-btn', active && 'is-active')}
                    onClick={() => {
                      const next = active
                        ? value.weekdays.filter((x) => x !== d.id)
                        : [...value.weekdays, d.id];
                      onChange({ weekdays: next });
                    }}
                  >{d.label}</button>
                );
              })}
            </div>
          </section>

          <section className="step-form__section step-form__section--row">
            <div>
              <label className="step-form__label">Giờ bắt đầu</label>
              <input
                type="time"
                className="step-form__input"
                value={value.time}
                onChange={(e) => onChange({ time: e.target.value })}
              />
            </div>
            <div>
              <label className="step-form__label">Lặp trong bao nhiêu tuần</label>
              <div className="step-form__chips">
                {[1, 2, 4, 8, 12].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={cn('step-form__chip', value.weeksCount === w && 'is-active')}
                    onClick={() => onChange({ weeksCount: w })}
                  >{w} tuần</button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Location */}
      <section className="step-form__section">
        <label className="step-form__label">Địa điểm tập</label>
        <div className="step-form__radio-group">
          {LOCATIONS.map((opt) => (
            <label
              key={opt.kind}
              className={cn('step-form__radio', value.locationKind === opt.kind && 'is-active')}
            >
              <input
                type="radio"
                name="loc"
                checked={value.locationKind === opt.kind}
                onChange={() => onChange({ locationKind: opt.kind })}
              />
              <div>
                <strong>{opt.label}</strong>
                <span>{opt.hint}</span>
              </div>
            </label>
          ))}
        </div>
        {showAddress && (
          <input
            type="text"
            className="step-form__input"
            placeholder="VD: 123 Nguyễn Trãi, Q.1, TP.HCM"
            value={value.address}
            onChange={(e) => onChange({ address: e.target.value })}
            style={{ marginTop: 12 }}
          />
        )}
      </section>

      {/* Note */}
      <section className="step-form__section">
        <label className="step-form__label">
          Ghi chú gửi học viên (tuỳ chọn)
          <small style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>
            {value.note.length}/300
          </small>
        </label>
        <textarea
          className="step-form__textarea"
          rows={3}
          maxLength={300}
          placeholder="VD: Mang theo thảm tập + chai nước. Có thể mượn vợt tại sân."
          value={value.note}
          onChange={(e) => onChange({ note: e.target.value })}
        />
      </section>
    </div>
  );
}

function Step3PricePreview({ value, onChange, sports }: { value: Draft; onChange: (p: Partial<Draft>) => void; sports: Sport[] }) {
  const COMMISSION = 0.15;
  const net = Math.floor(value.price * (1 - COMMISSION));
  const sportName = sports.find((s) => s.slug === value.sport)?.name ?? value.sport;
  const isGroup = value.capacity > 1;

  // Preview list — for recurring, generate first 4 dates
  const previewSessions = useMemo(() => {
    if (value.mode === 'single') {
      if (!value.date || !value.time) return [];
      const startsAt = new Date(`${value.date}T${value.time}:00`).toISOString();
      return [{ startsAt, label: '1 lịch sẽ được mở' }];
    }
    if (!value.startDate || value.weekdays.length === 0) return [];
    const start = new Date(`${value.startDate}T00:00:00`);
    const [hh, mm] = value.time.split(':').map(Number);
    const out: { startsAt: string }[] = [];
    for (let week = 0; week < value.weeksCount; week++) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(start);
        d.setDate(d.getDate() + week * 7 + day);
        if (!value.weekdays.includes(d.getDay())) continue;
        d.setHours(hh, mm, 0, 0);
        out.push({ startsAt: d.toISOString() });
      }
    }
    return out;
  }, [value.mode, value.date, value.time, value.startDate, value.weekdays, value.weeksCount]);

  const total = previewSessions.length;

  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Giá & Xem trước</h1>
        <p>Cài giá mỗi buổi. Bạn có thể đổi giá riêng cho từng buổi sau bằng nút "Sửa lịch".</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label">Giá mỗi buổi <span className="step-form__required">*</span></label>
        <div className="step-form__price-input">
          <input
            type="number"
            className="step-form__input"
            min={50_000}
            step={50_000}
            placeholder="VD: 450000"
            value={value.price || ''}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
          />
          <span>đ</span>
        </div>
        {value.price > 0 && (
          <p className="step-form__hint">
            💰 Bạn nhận: <strong>{formatVND(net)}</strong>/buổi (sau phí 15%)
            {isGroup && (
              <>
                {' '}· Doanh thu tối đa: <strong>{formatVND(net * value.capacity)}</strong>/buổi
              </>
            )}
          </p>
        )}
      </section>

      {total > 0 && (
        <section className="step-form__section">
          <label className="step-form__label">
            Xem trước — {total} lịch sẽ được mở
          </label>
          <div className="cms-preview-list">
            {previewSessions.slice(0, 6).map((s, i) => (
              <div key={s.startsAt + i} className="cms-preview-list__item">
                <strong>⏱ {formatNextSlot(s.startsAt)}</strong>
                <span>· {value.durationMinutes} phút</span>
                <span>· {isGroup ? `Nhóm tối đa ${value.capacity}` : '1-1'}</span>
                <span className="cms-preview-list__price">{value.price > 0 ? formatVND(value.price) : '—'}</span>
              </div>
            ))}
            {total > 6 && (
              <div className="cms-preview-list__more">
                + {total - 6} lịch khác…
              </div>
            )}
          </div>
          {value.mode === 'recurring' && (
            <p className="step-form__hint">
              💡 Các lịch sẽ được mở với cùng giá, sĩ số, địa điểm. Sau khi mở, bạn vẫn có thể sửa giá riêng từng buổi.
            </p>
          )}
        </section>
      )}

      <section className="step-form__section">
        <label className="step-form__label">Tóm tắt nội dung</label>
        <div className="cms-summary">
          <div><span>Bộ môn:</span> <strong>{sportName || '—'}</strong></div>
          <div><span>Hình thức:</span> <strong>{isGroup ? `Lớp nhóm tối đa ${value.capacity}` : '1-1 cá nhân'}</strong></div>
          <div><span>Cấp độ:</span> <strong>{LEVELS.find((l) => l.v === value.level)?.label}</strong></div>
          <div><span>Địa điểm:</span> <strong>{LOCATIONS.find((l) => l.kind === value.locationKind)?.label}</strong></div>
        </div>
      </section>
    </div>
  );
}
