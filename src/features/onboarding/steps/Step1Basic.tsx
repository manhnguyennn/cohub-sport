'use client';

import { useRef } from 'react';
import Image from 'next/image';
import AppIcon from '@components/ui/AppIcon';
import type { OnboardingStep1 } from '@app-types/onboarding';
import type { Gender } from '@app-types/coach';

type Props = {
  value: Partial<OnboardingStep1>;
  onChange: (v: Partial<OnboardingStep1>) => void;
};

const CITIES = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang', 'Hạ Long', 'Đà Lạt'];

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male',   label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other',  label: 'Khác' },
];

export default function Step1Basic({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onChange({ ...value, avatar: url });
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - 18 - i);

  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Thông tin cơ bản</h1>
        <p>Học viên sẽ nhìn thấy đầu tiên — ảnh thật, tên thật giúp tăng tỷ lệ booking 2-3 lần.</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label">Ảnh đại diện</label>
        <div className="step-form__avatar">
          {value.avatar ? (
            <div className="step-form__avatar-preview">
              <Image src={value.avatar} alt="avatar" width={96} height={96} unoptimized />
            </div>
          ) : (
            <div className="step-form__avatar-placeholder"><AppIcon name="user" size={36} /></div>
          )}
          <div>
            <button type="button" className="step-form__upload-btn" onClick={() => fileRef.current?.click()}>
              {value.avatar ? 'Đổi ảnh' : 'Tải ảnh lên'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
            <p className="step-form__hint">JPG/PNG, mặt trực diện, ánh sáng tốt. Tối đa 5MB.</p>
          </div>
        </div>
      </section>

      <section className="step-form__section">
        <label className="step-form__label" htmlFor="fullName">
          Họ và tên <span className="step-form__required">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          className="step-form__input"
          placeholder="VD: Nguyễn Văn An"
          value={value.fullName ?? ''}
          onChange={(e) => onChange({ ...value, fullName: e.target.value })}
        />
      </section>

      <section className="step-form__section step-form__section--row">
        <div>
          <label className="step-form__label">Giới tính <span className="step-form__required">*</span></label>
          <div className="step-form__chips">
            {GENDERS.map((g) => (
              <button
                key={g.value}
                type="button"
                className={`step-form__chip ${value.gender === g.value ? 'is-active' : ''}`}
                onClick={() => onChange({ ...value, gender: g.value })}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="step-form__label" htmlFor="birthYear">Năm sinh <span className="step-form__required">*</span></label>
          <select
            id="birthYear"
            className="step-form__select"
            value={value.birthYear ?? ''}
            onChange={(e) => onChange({ ...value, birthYear: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">Chọn năm</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </section>

      <section className="step-form__section">
        <label className="step-form__label">Thành phố hoạt động <span className="step-form__required">*</span></label>
        <div className="step-form__chips">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`step-form__chip ${value.city === c ? 'is-active' : ''}`}
              onClick={() => onChange({ ...value, city: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
