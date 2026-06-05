'use client';

/**
 * Wizard 5 bước tạo Course (FSD §4.16):
 *  1. Loại lịch (FIXED / FLEXIBLE) — visual chọn lớn
 *  2. Thông tin (title, sport, level, mô tả)
 *  3. Lịch & số buổi
 *  4. Giá & sĩ số
 *  5. Cover + preview → Publish
 *
 * Mock: submit thành công luôn → redirect /coach/courses
 */
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Stepper } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { useDemoMode } from '@contexts/DemoModeContext';
import { cn } from '@lib/cn';
import { formatVND } from '@lib/date';
import type { Sport } from '@app-types/sport';
import type { CourseLevel, CourseScheduleType } from '@app-types/course';

const STEPS = [
  { id: 1, label: 'Loại lịch' },
  { id: 2, label: 'Thông tin' },
  { id: 3, label: 'Lịch & Buổi' },
  { id: 4, label: 'Giá & Sĩ số' },
  { id: 5, label: 'Cover & Publish' },
];

type Draft = {
  scheduleType: CourseScheduleType | null;
  title: string;
  sport: string;
  level: CourseLevel | null;
  description: string;
  totalSessions: number;
  sessionDuration: number;     // 60 / 90
  startDate?: string;
  recurringDays: number[];     // 0..6
  recurringTime: string;       // 'HH:mm'
  flexibleValidity: number;    // days
  price: number;
  maxParticipants: number;
  cover: string;               // object URL
};

const EMPTY: Draft = {
  scheduleType: null,
  title: '',
  sport: '',
  level: null,
  description: '',
  totalSessions: 8,
  sessionDuration: 60,
  recurringDays: [],
  recurringTime: '18:00',
  flexibleValidity: 90,
  price: 0,
  maxParticipants: 4,
  cover: '',
};

const LEVELS: { v: CourseLevel; label: string }[] = [
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

export default function CourseCreateWizard({ sports }: { sports: Sport[] }) {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const toast = useToast();
  const { withDelay } = useDemoMode();

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) requireLogin({ redirectTo: ROUTES.coachCourseNew });
    else if (role !== 'coach' && role !== 'admin') router.replace('/');
  }, [isReady, isLoggedIn, role, requireLogin, router]);

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  function patch(p: Partial<Draft>) { setDraft((d) => ({ ...d, ...p })); }

  function validate(): string | null {
    switch (step) {
      case 1: return draft.scheduleType ? null : 'Chọn loại lịch';
      case 2:
        if (!draft.title.trim() || draft.title.length < 8) return 'Tiêu đề ≥ 8 ký tự';
        if (!draft.sport) return 'Chọn bộ môn';
        if (!draft.level) return 'Chọn cấp độ';
        if (!draft.description.trim() || draft.description.length < 50) return 'Mô tả ≥ 50 ký tự';
        return null;
      case 3:
        if (draft.totalSessions < 2) return 'Số buổi ≥ 2';
        if (draft.scheduleType === 'FIXED') {
          if (!draft.startDate) return 'Chọn ngày khai giảng';
          if (draft.recurringDays.length === 0) return 'Chọn ít nhất 1 ngày trong tuần';
        }
        return null;
      case 4:
        if (draft.price < 100_000) return 'Giá ≥ 100.000đ';
        if (draft.maxParticipants < 1) return 'Sĩ số ≥ 1';
        return null;
      case 5:
        if (!draft.cover) return 'Upload cover';
        return null;
    }
    return null;
  }

  function next() {
    const err = validate();
    if (err) { toast.error(err); return; }
    if (step < 5) { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else handlePublish();
  }

  function handlePublish() {
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Đã publish khoá học!', { title: 'Thành công' });
      router.push(ROUTES.coachCourses);
    }, withDelay(1500));
  }

  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    patch({ cover: URL.createObjectURL(f) });
  }

  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="onboarding-wizard">
      <header className="onboarding-wizard__head">
        <div className="onboarding-wizard__head-inner">
          <Link href={ROUTES.coachCourses} className="onboarding-wizard__exit">← Thoát</Link>
          <div className="onboarding-wizard__progress">
            <div className="onboarding-wizard__progress-bar">
              <span style={{ width: `${((step - 1) / 5) * 100}%` }} />
            </div>
            <span>Bước {step}/5</span>
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
          {step === 1 && <Step1ScheduleType value={draft} onChange={patch} />}
          {step === 2 && <Step2Info value={draft} onChange={patch} sports={sports} />}
          {step === 3 && <Step3Schedule value={draft} onChange={patch} />}
          {step === 4 && <Step4Price value={draft} onChange={patch} />}
          {step === 5 && <Step5Cover value={draft} onChange={patch} fileRef={coverRef} onPick={handleCover} sports={sports} />}
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
              {step === 5 ? (submitting ? 'Đang publish…' : 'Publish ngay') : 'Tiếp theo →'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ── Steps ────────────────────────────────────────────────────

function Step1ScheduleType({ value, onChange }: { value: Draft; onChange: (p: Partial<Draft>) => void }) {
  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Loại lịch học</h1>
        <p>Chọn cách học viên sẽ tham gia khoá học của bạn.</p>
      </header>

      <div className="step-form__level-list">
        <label className={cn('step-form__level', value.scheduleType === 'FIXED' && 'is-active')}>
          <input
            type="radio"
            checked={value.scheduleType === 'FIXED'}
            onChange={() => onChange({ scheduleType: 'FIXED' })}
          />
          <div>
            <strong><AppIcon name="calendar" size={16} /> Lịch cố định</strong>
            <span>Set lịch sẵn (vd: T3-T5 18:00, 8 buổi). Học viên đăng ký trước ngày khai giảng. Phù hợp lớp đông.</span>
          </div>
        </label>

        <label className={cn('step-form__level', value.scheduleType === 'FLEXIBLE' && 'is-active')}>
          <input
            type="radio"
            checked={value.scheduleType === 'FLEXIBLE'}
            onChange={() => onChange({ scheduleType: 'FLEXIBLE' })}
          />
          <div>
            <strong><AppIcon name="flash" size={16} /> Linh hoạt</strong>
            <span>Học viên mua N credit, tự đặt lịch trong thời hạn (vd: 10 buổi trong 3 tháng). Phù hợp 1-1.</span>
          </div>
        </label>
      </div>
    </div>
  );
}

function Step2Info({ value, onChange, sports }: { value: Draft; onChange: (p: Partial<Draft>) => void; sports: Sport[] }) {
  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Thông tin khoá học</h1>
        <p>Tiêu đề và mô tả hấp dẫn giúp tăng đăng ký 2-3 lần.</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label">Tiêu đề <span className="step-form__required">*</span></label>
        <input
          type="text"
          className="step-form__input"
          placeholder="VD: Yoga sáng cho người mới — 8 buổi"
          value={value.title}
          maxLength={100}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </section>

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
          <label className="step-form__label">Cấp độ <span className="step-form__required">*</span></label>
          <div className="step-form__chips">
            {LEVELS.map((l) => (
              <button
                key={l.v}
                type="button"
                className={cn('step-form__chip', value.level === l.v && 'is-active')}
                onClick={() => onChange({ level: l.v })}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="step-form__section">
        <label className="step-form__label">
          Mô tả khoá học <span className="step-form__required">*</span>
          <small style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>
            {value.description.length}/2000
          </small>
        </label>
        <textarea
          className="step-form__textarea"
          rows={6}
          maxLength={2000}
          placeholder="Mô tả nội dung khoá học, học viên sẽ học được gì..."
          value={value.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </section>
    </div>
  );
}

function Step3Schedule({ value, onChange }: { value: Draft; onChange: (p: Partial<Draft>) => void }) {
  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Lịch & Số buổi</h1>
        <p>{value.scheduleType === 'FIXED' ? 'Cài lịch lặp lại hàng tuần.' : 'Cài thời hạn sử dụng credit.'}</p>
      </header>

      <section className="step-form__section step-form__section--row">
        <div>
          <label className="step-form__label">Số buổi <span className="step-form__required">*</span></label>
          <input
            type="number"
            className="step-form__input"
            min={2}
            max={50}
            value={value.totalSessions}
            onChange={(e) => onChange({ totalSessions: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="step-form__label">Thời lượng mỗi buổi</label>
          <div className="step-form__chips">
            {[60, 75, 90, 120].map((m) => (
              <button
                key={m}
                type="button"
                className={cn('step-form__chip', value.sessionDuration === m && 'is-active')}
                onClick={() => onChange({ sessionDuration: m })}
              >
                {m} phút
              </button>
            ))}
          </div>
        </div>
      </section>

      {value.scheduleType === 'FIXED' && (
        <>
          <section className="step-form__section">
            <label className="step-form__label">Ngày khai giảng <span className="step-form__required">*</span></label>
            <input
              type="date"
              className="step-form__input"
              value={value.startDate ?? ''}
              onChange={(e) => onChange({ startDate: e.target.value })}
              min={new Date().toISOString().slice(0, 10)}
            />
          </section>

          <section className="step-form__section">
            <label className="step-form__label">Các ngày trong tuần <span className="step-form__required">*</span></label>
            <div className="step-form__day-grid">
              {WEEKDAYS.map((d) => {
                const active = value.recurringDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={cn('step-form__day-btn', active && 'is-active')}
                    onClick={() => {
                      const next = active
                        ? value.recurringDays.filter((x) => x !== d.id)
                        : [...value.recurringDays, d.id];
                      onChange({ recurringDays: next });
                    }}
                  >{d.label}</button>
                );
              })}
            </div>
          </section>

          <section className="step-form__section">
            <label className="step-form__label">Giờ bắt đầu</label>
            <input
              type="time"
              className="step-form__input"
              value={value.recurringTime}
              onChange={(e) => onChange({ recurringTime: e.target.value })}
              style={{ maxWidth: 200 }}
            />
          </section>
        </>
      )}

      {value.scheduleType === 'FLEXIBLE' && (
        <section className="step-form__section">
          <label className="step-form__label">Thời hạn sử dụng (ngày) <span className="step-form__required">*</span></label>
          <div className="step-form__chips">
            {[30, 60, 90, 180].map((d) => (
              <button
                key={d}
                type="button"
                className={cn('step-form__chip', value.flexibleValidity === d && 'is-active')}
                onClick={() => onChange({ flexibleValidity: d })}
              >
                {d} ngày
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Step4Price({ value, onChange }: { value: Draft; onChange: (p: Partial<Draft>) => void }) {
  const COMMISSION = 0.15;
  const net = Math.floor(value.price * (1 - COMMISSION));
  const perSession = value.totalSessions > 0 ? Math.floor(value.price / value.totalSessions) : 0;

  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Giá & Sĩ số</h1>
        <p>Cài giá trọn gói và số học viên tối đa.</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label">Giá trọn gói (VND) <span className="step-form__required">*</span></label>
        <div className="step-form__price-input">
          <input
            type="number"
            className="step-form__input"
            min={100_000}
            step={50_000}
            placeholder="VD: 2000000"
            value={value.price || ''}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
          />
          <span>đ</span>
        </div>
        {value.price > 0 && (
          <p className="step-form__hint">
            <AppIcon name="wallet" size={14} /> Bạn nhận: <strong>{formatVND(net)}</strong> · ~ {formatVND(perSession)}/buổi (trước phí 15%)
          </p>
        )}
      </section>

      <section className="step-form__section">
        <label className="step-form__label">Số học viên tối đa</label>
        <div className="step-form__chips">
          {[1, 2, 4, 6, 8, 12, 20].map((n) => (
            <button
              key={n}
              type="button"
              className={cn('step-form__chip', value.maxParticipants === n && 'is-active')}
              onClick={() => onChange({ maxParticipants: n })}
            >{n}</button>
          ))}
        </div>
        <p className="step-form__hint">
          {value.scheduleType === 'FLEXIBLE' && value.maxParticipants > 1 && (
            <><AppIcon name="warning" size={14} /> Khoá linh hoạt thường là 1-1. Để 1 nếu là gói riêng.</>
          )}
        </p>
      </section>
    </div>
  );
}

function Step5Cover({
  value, onChange, fileRef, onPick, sports,
}: {
  value: Draft; onChange: (p: Partial<Draft>) => void; fileRef: React.RefObject<HTMLInputElement>;
  onPick: (e: React.ChangeEvent<HTMLInputElement>) => void; sports: Sport[];
}) {
  const sportName = sports.find((s) => s.slug === value.sport)?.name ?? value.sport;
  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Ảnh cover & Preview</h1>
        <p>Ảnh đẹp giúp khoá học nổi bật trong listing.</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label">Ảnh cover <span className="step-form__required">*</span></label>
        <div className="step-form__avatar">
          {value.cover ? (
            <div style={{ position: 'relative', width: 180, height: 120, borderRadius: 8, overflow: 'hidden' }}>
              <Image src={value.cover} alt="cover" fill style={{ objectFit: 'cover' }} unoptimized />
            </div>
          ) : (
            <div style={{ width: 180, height: 120, borderRadius: 8, background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <AppIcon name="camera" size={28} />
            </div>
          )}
          <div>
            <button type="button" className="step-form__upload-btn" onClick={() => fileRef.current?.click()}>
              {value.cover ? 'Đổi ảnh' : 'Tải ảnh lên'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
            <p className="step-form__hint">JPG/PNG, 16:10 ratio, ≥ 800px width.</p>
          </div>
        </div>
      </section>

      {/* Preview card */}
      <section className="step-form__section">
        <label className="step-form__label">Preview thẻ khoá học</label>
        <div className="course-card" style={{ maxWidth: 320 }}>
          <div className="course-card__media" style={{ background: value.cover ? '' : 'var(--bg-subtle)' }}>
            {value.cover && <Image src={value.cover} alt="" fill style={{ objectFit: 'cover' }} unoptimized />}
            <span className={`course-card__type course-card__type--${value.scheduleType?.toLowerCase()}`}>
              <AppIcon name={value.scheduleType === 'FIXED' ? 'calendar' : 'flash'} size={13} />
              {value.scheduleType === 'FIXED' ? 'Lịch cố định' : 'Linh hoạt'}
            </span>
          </div>
          <div className="course-card__body">
            <h3 className="course-card__title">{value.title || 'Tiêu đề khoá học'}</h3>
            <div className="course-card__coach">
              <span>{sportName}</span>
            </div>
            <div className="course-card__meta">
              <span>{value.totalSessions} buổi · {value.sessionDuration} phút</span>
            </div>
            <div className="course-card__footer">
              <div className="course-card__price">
                <small>Trọn gói</small>
                <strong>{formatVND(value.price)}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
