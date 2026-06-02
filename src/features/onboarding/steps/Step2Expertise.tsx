'use client';

import { cn } from '@lib/cn';
import type { OnboardingStep2 } from '@app-types/onboarding';
import type { Sport } from '@app-types/sport';

type Props = {
  sports: Sport[];
  value: Partial<OnboardingStep2>;
  onChange: (v: Partial<OnboardingStep2>) => void;
};

const LEVELS: { value: NonNullable<OnboardingStep2['level']>; label: string; desc: string }[] = [
  { value: 'beginner',     label: 'Beginner',     desc: '<2 năm kinh nghiệm, đã có kiến thức cơ bản' },
  { value: 'intermediate', label: 'Intermediate', desc: '2-5 năm, có chứng chỉ hoặc thi đấu phong trào' },
  { value: 'advanced',     label: 'Advanced',     desc: '5+ năm, có thành tích thi đấu / chứng chỉ quốc gia' },
  { value: 'professional', label: 'Professional', desc: 'HLV chuyên nghiệp, chứng chỉ quốc tế' },
];

const AUDIENCES = [
  { value: 'beginner',     label: 'Người mới' },
  { value: 'weight_loss',  label: 'Giảm cân' },
  { value: 'muscle_gain',  label: 'Tăng cơ' },
  { value: 'flexibility',  label: 'Tăng dẻo dai' },
  { value: 'competitive',  label: 'Thi đấu' },
  { value: 'rehab',        label: 'Phục hồi chấn thương' },
  { value: 'kids',         label: 'Trẻ em' },
  { value: 'elderly',      label: 'Người cao tuổi' },
];

export default function Step2Expertise({ sports, value, onChange }: Props) {
  const selectedSports = value.sports ?? [];

  function toggleSport(slug: string) {
    const has = selectedSports.includes(slug);
    if (has) onChange({ ...value, sports: selectedSports.filter((s) => s !== slug) });
    else if (selectedSports.length < 3) onChange({ ...value, sports: [...selectedSports, slug] });
  }

  function toggleAudience(slug: string) {
    const list = value.targetAudience ?? [];
    const has = list.includes(slug);
    if (has) onChange({ ...value, targetAudience: list.filter((s) => s !== slug) });
    else onChange({ ...value, targetAudience: [...list, slug] });
  }

  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Chuyên môn của bạn</h1>
        <p>Chọn đến 3 bộ môn bạn dạy chính. Học viên sẽ tìm thấy bạn qua các tag này.</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label">
          Bộ môn dạy <span className="step-form__required">*</span>
          <small style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>
            Đã chọn {selectedSports.length}/3
          </small>
        </label>
        <div className="step-form__chips step-form__chips--grid">
          {sports.filter((s) => s.category === 'sport').map((s) => {
            const isActive = selectedSports.includes(s.slug);
            const disabled = !isActive && selectedSports.length >= 3;
            return (
              <button
                key={s.id}
                type="button"
                className={cn('step-form__chip', isActive && 'is-active', disabled && 'is-disabled')}
                onClick={() => !disabled && toggleSport(s.slug)}
                disabled={disabled}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="step-form__section step-form__section--row">
        <div>
          <label className="step-form__label" htmlFor="exp">
            Năm kinh nghiệm <span className="step-form__required">*</span>
          </label>
          <input
            id="exp"
            type="number"
            min={0}
            max={50}
            className="step-form__input"
            placeholder="VD: 5"
            value={value.experienceYears ?? ''}
            onChange={(e) => onChange({ ...value, experienceYears: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </section>

      <section className="step-form__section">
        <label className="step-form__label">Cấp độ chuyên môn <span className="step-form__required">*</span></label>
        <div className="step-form__level-list">
          {LEVELS.map((l) => (
            <label key={l.value} className={cn('step-form__level', value.level === l.value && 'is-active')}>
              <input
                type="radio"
                name="level"
                checked={value.level === l.value}
                onChange={() => onChange({ ...value, level: l.value })}
              />
              <div>
                <strong>{l.label}</strong>
                <span>{l.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="step-form__section">
        <label className="step-form__label">Đối tượng học viên phù hợp (tuỳ chọn)</label>
        <div className="step-form__chips step-form__chips--grid">
          {AUDIENCES.map((a) => (
            <button
              key={a.value}
              type="button"
              className={cn('step-form__chip', (value.targetAudience ?? []).includes(a.value) && 'is-active')}
              onClick={() => toggleAudience(a.value)}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
