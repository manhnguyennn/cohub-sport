'use client';

import { useMemo, useRef } from 'react';
import Image from 'next/image';
import { detectPii } from '@lib/onboarding-draft';
import AppIcon from '@components/ui/AppIcon';
import { cn } from '@lib/cn';
import type { OnboardingStep3 } from '@app-types/onboarding';

type Props = {
  value: Partial<OnboardingStep3>;
  onChange: (v: Partial<OnboardingStep3>) => void;
};

export default function Step3Bio({ value, onChange }: Props) {
  const portfolioRef = useRef<HTMLInputElement>(null);

  const tagline = value.tagline ?? '';
  const bio     = value.bio ?? '';

  const taglinePii = useMemo(() => detectPii(tagline), [tagline]);
  const bioPii     = useMemo(() => detectPii(bio),     [bio]);

  function handlePortfolio(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    const next = [...(value.portfolioImages ?? []), ...urls].slice(0, 8);
    onChange({ ...value, portfolioImages: next });
    e.target.value = ''; // reset input
  }

  function removePortfolio(idx: number) {
    const next = (value.portfolioImages ?? []).filter((_, i) => i !== idx);
    onChange({ ...value, portfolioImages: next });
  }

  return (
    <div className="step-form">
      <header className="step-form__header">
        <h1>Bio & Profile</h1>
        <p>Đoạn giới thiệu hấp dẫn + ảnh portfolio giúp profile bạn nổi bật giữa hàng trăm coach.</p>
      </header>

      <section className="step-form__section">
        <label className="step-form__label" htmlFor="tagline">
          Tagline <span className="step-form__required">*</span>
          <small style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>
            10-80 ký tự — {tagline.length}/80
          </small>
        </label>
        <input
          id="tagline"
          type="text"
          className={cn('step-form__input', taglinePii.hasIssue && 'step-form__input--error')}
          placeholder="VD: PT Gym 6 năm — chuyên giảm cân & tăng cơ"
          value={tagline}
          maxLength={80}
          onChange={(e) => onChange({ ...value, tagline: e.target.value })}
        />
        {taglinePii.hasIssue && (
          <span className="step-form__error"><AppIcon name="warning" size={13} /> {taglinePii.message}</span>
        )}
      </section>

      <section className="step-form__section">
        <label className="step-form__label" htmlFor="bio">
          Giới thiệu chi tiết <span className="step-form__required">*</span>
          <small style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>
            100-1500 ký tự — {bio.length}/1500
          </small>
        </label>
        <textarea
          id="bio"
          className={cn('step-form__textarea', bioPii.hasIssue && 'step-form__input--error')}
          placeholder={'Mô tả background, phương pháp giảng dạy, thành tích...\n\nKHÔNG được chia sẻ SĐT/Zalo/link external.'}
          rows={8}
          value={bio}
          maxLength={1500}
          onChange={(e) => onChange({ ...value, bio: e.target.value })}
        />
        {bioPii.hasIssue && (
          <span className="step-form__error"><AppIcon name="warning" size={13} /> {bioPii.message}</span>
        )}
      </section>

      <section className="step-form__section">
        <label className="step-form__label" htmlFor="approach">Phương pháp giảng dạy (tuỳ chọn)</label>
        <textarea
          id="approach"
          className="step-form__textarea"
          rows={3}
          placeholder="VD: Tập trung kỹ thuật trước, tăng tải dần. Mỗi 4 tuần test progress + điều chỉnh giáo án."
          value={value.approach ?? ''}
          onChange={(e) => onChange({ ...value, approach: e.target.value })}
        />
      </section>

      <section className="step-form__section">
        <label className="step-form__label" htmlFor="achievements">Thành tích nổi bật (tuỳ chọn)</label>
        <textarea
          id="achievements"
          className="step-form__textarea"
          rows={2}
          placeholder="VD: Huy chương đồng giải Bodybuilding VN 2024 · ACE Certified Personal Trainer"
          value={value.achievements ?? ''}
          onChange={(e) => onChange({ ...value, achievements: e.target.value })}
        />
      </section>

      <section className="step-form__section">
        <label className="step-form__label" htmlFor="video">Video giới thiệu — YouTube/Vimeo URL (tuỳ chọn)</label>
        <input
          id="video"
          type="url"
          className="step-form__input"
          placeholder="https://youtube.com/..."
          value={value.videoUrl ?? ''}
          onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
        />
        <p className="step-form__hint">Profile có video tăng tỷ lệ booking ~40%.</p>
      </section>

      <section className="step-form__section">
        <label className="step-form__label">
          Ảnh portfolio
          <small style={{ marginLeft: 8, color: 'var(--text-muted)', fontWeight: 400 }}>
            {(value.portfolioImages ?? []).length}/8 ảnh
          </small>
        </label>
        <div className="step-form__portfolio">
          {(value.portfolioImages ?? []).map((url, i) => (
            <div key={i} className="step-form__portfolio-item">
              <Image src={url} alt={`portfolio-${i}`} fill sizes="100px" style={{ objectFit: 'cover' }} unoptimized />
              <button
                type="button"
                aria-label="Xoá ảnh"
                onClick={() => removePortfolio(i)}
              >×</button>
            </div>
          ))}
          {(value.portfolioImages ?? []).length < 8 && (
            <button
              type="button"
              className="step-form__portfolio-add"
              onClick={() => portfolioRef.current?.click()}
            >
              + Thêm ảnh
            </button>
          )}
          <input
            ref={portfolioRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handlePortfolio}
          />
        </div>
      </section>
    </div>
  );
}
