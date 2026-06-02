'use client';

import { cn } from '@lib/cn';
import { formatVND } from '@lib/date';
import type { OnboardingStep5 } from '@app-types/onboarding';

type Props = {
  value: Partial<OnboardingStep5>;
  onChange: (v: Partial<OnboardingStep5>) => void;
};

const DAYS = [
  { id: 1, label: 'T2' },
  { id: 2, label: 'T3' },
  { id: 3, label: 'T4' },
  { id: 4, label: 'T5' },
  { id: 5, label: 'T6' },
  { id: 6, label: 'T7' },
  { id: 0, label: 'CN' },
];

const COMMISSION = 0.15;

export default function Step5Price({ value, onChange }: Props) {
  const days = value.availabilityDays ?? [];

  function toggleDay(d: number) {
    const has = days.includes(d);
    onChange({ ...value, availabilityDays: has ? days.filter((x) => x !== d) : [...days, d] });
  }

  const price60 = value.price60 ?? 0;
  const netPer60 = Math.floor(price60 * (1 - COMMISSION));

  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Giá & Lịch dạy</h1>
        <p>CoHub thu 15% phí nền tảng. Bạn nhận thực 85% mỗi buổi tập sau khi hoàn thành.</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label" htmlFor="price60">
          Giá buổi 60 phút <span className="step-form__required">*</span>
        </label>
        <div className="step-form__price-input">
          <input
            id="price60"
            type="number"
            min={100_000}
            max={5_000_000}
            step={50_000}
            className="step-form__input"
            placeholder="VD: 450000"
            value={value.price60 ?? ''}
            onChange={(e) => onChange({ ...value, price60: e.target.value ? Number(e.target.value) : undefined })}
          />
          <span>đ/buổi</span>
        </div>
        {price60 > 0 && (
          <p className="step-form__hint">
            💰 Bạn thực nhận: <strong>{formatVND(netPer60)}</strong>/buổi (sau phí nền tảng 15%)
          </p>
        )}
      </section>

      <section className="step-form__section step-form__section--row">
        <div>
          <label className="step-form__label" htmlFor="price90">Giá buổi 90 phút (tuỳ chọn)</label>
          <div className="step-form__price-input">
            <input
              id="price90"
              type="number"
              min={100_000}
              step={50_000}
              className="step-form__input"
              placeholder="VD: 650000"
              value={value.price90 ?? ''}
              onChange={(e) => onChange({ ...value, price90: e.target.value ? Number(e.target.value) : undefined })}
            />
            <span>đ/buổi</span>
          </div>
        </div>

        <div>
          <label className="step-form__label" htmlFor="priceGroup">Giá nhóm (tuỳ chọn)</label>
          <div className="step-form__price-input">
            <input
              id="priceGroup"
              type="number"
              min={100_000}
              step={50_000}
              className="step-form__input"
              placeholder="VD: 250000"
              value={value.priceGroup ?? ''}
              onChange={(e) => onChange({ ...value, priceGroup: e.target.value ? Number(e.target.value) : undefined })}
            />
            <span>đ/người</span>
          </div>
        </div>
      </section>

      <section className="step-form__section">
        <label className="step-form__label">Lịch trống — ngày trong tuần <span className="step-form__required">*</span></label>
        <p className="step-form__hint" style={{ marginTop: -4, marginBottom: 12 }}>
          Học viên sẽ thấy bạn rảnh các ngày này. Chi tiết giờ cụ thể setup ở /coach/calendar sau khi profile online.
        </p>
        <div className="step-form__day-grid">
          {DAYS.map((d) => (
            <button
              key={d.id}
              type="button"
              className={cn('step-form__day-btn', days.includes(d.id) && 'is-active')}
              onClick={() => toggleDay(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
