'use client';

import { cn } from '@lib/cn';
import AppIcon, { type AppIconName } from '@components/ui/AppIcon';
import type { OnboardingStep4 } from '@app-types/onboarding';
import type { TeachingFormat } from '@app-types/coach';

type Props = {
  value: Partial<OnboardingStep4>;
  onChange: (v: Partial<OnboardingStep4>) => void;
};

const DISTRICTS: Record<string, string[]> = {
  'TP.HCM': ['Q1', 'Q3', 'Q4', 'Q5', 'Q7', 'Q10', 'Bình Thạnh', 'Phú Nhuận', 'Tân Bình', 'Gò Vấp', 'Thủ Đức'],
  'Hà Nội': ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Cầu Giấy', 'Tây Hồ', 'Hai Bà Trưng', 'Hà Đông', 'Long Biên', 'Thanh Xuân'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu'],
};

const FORMATS: { value: TeachingFormat; label: string; desc: string; icon: AppIconName }[] = [
  { value: '1on1',        label: '1-1 cá nhân',     desc: 'Tập riêng với học viên, tối ưu kết quả',                icon: 'user' },
  { value: 'small_group', label: 'Nhóm nhỏ 2-4',    desc: 'Nhóm bạn cùng tập, chia chi phí, có không khí cộng đồng', icon: 'people' },
  { value: 'group',       label: 'Lớp đông 5+',     desc: 'Lớp cố định nhiều học viên, phù hợp Yoga/Fitness',        icon: 'peopleAlt' },
];

export default function Step4Area({ value, onChange }: Props) {
  // Hard-coded TP.HCM cho demo nếu chưa có city. Production: đọc từ step1.
  const allDistricts = Object.values(DISTRICTS).flat();
  const selected = value.districts ?? [];
  const selectedFormats = value.teachingFormats ?? [];

  function toggleDistrict(d: string) {
    const has = selected.includes(d);
    if (has) onChange({ ...value, districts: selected.filter((x) => x !== d) });
    else if (selected.length < 5) onChange({ ...value, districts: [...selected, d] });
  }

  function toggleFormat(f: TeachingFormat) {
    const has = selectedFormats.includes(f);
    if (has) onChange({ ...value, teachingFormats: selectedFormats.filter((x) => x !== f) });
    else onChange({ ...value, teachingFormats: [...selectedFormats, f] });
  }

  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Khu vực & Hình thức dạy</h1>
        <p>Học viên gần khu vực bạn dạy sẽ thấy profile trong kết quả search.</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label">
          Khu vực có thể dạy <span className="step-form__required">*</span>
          <small style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>
            Đã chọn {selected.length}/5
          </small>
        </label>

        {Object.entries(DISTRICTS).map(([city, dists]) => (
          <div key={city} className="step-form__district-group">
            <h4>{city}</h4>
            <div className="step-form__chips step-form__chips--grid">
              {dists.map((d) => {
                const isActive = selected.includes(d);
                const disabled = !isActive && selected.length >= 5;
                return (
                  <button
                    key={d}
                    type="button"
                    className={cn('step-form__chip', isActive && 'is-active', disabled && 'is-disabled')}
                    onClick={() => !disabled && toggleDistrict(d)}
                    disabled={disabled}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="step-form__section">
        <label className="step-form__label">
          Hình thức dạy <span className="step-form__required">*</span>
        </label>
        <div className="step-form__level-list">
          {FORMATS.map((f) => (
            <label key={f.value} className={cn('step-form__level', selectedFormats.includes(f.value) && 'is-active')}>
              <input
                type="checkbox"
                checked={selectedFormats.includes(f.value)}
                onChange={() => toggleFormat(f.value)}
              />
              <div>
                <strong><AppIcon name={f.icon} size={16} /> {f.label}</strong>
                <span>{f.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
