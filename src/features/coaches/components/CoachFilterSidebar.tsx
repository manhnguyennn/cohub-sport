'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect, useMemo } from 'react';
import { cn } from '@lib/cn';
import { formatMoney } from '@lib/format';
import AreaMultiSelect from '@components/ui/AreaMultiSelect';
import type { Sport } from '@app-types/sport';

type CoachFilterSidebarProps = {
  sports: Sport[];
};

const WEEK_DAYS = [
  { key: 't2', label: 'T2' }, { key: 't3', label: 'T3' }, { key: 't4', label: 'T4' },
  { key: 't5', label: 'T5' }, { key: 't6', label: 'T6' }, { key: 't7', label: 'T7' }, { key: 'cn', label: 'CN' },
];
const TIME_BUCKETS = [
  { key: 'morning', label: 'Sáng' },
  { key: 'afternoon', label: 'Chiều' },
  { key: 'evening', label: 'Tối' },
];
const RATINGS = [
  { value: '',  label: 'Tất cả' },
  { value: '4.5', label: 'Từ 4.5★ trở lên' },
  { value: '4.0', label: 'Từ 4.0★ trở lên' },
];
const FORMATS = [
  { value: '',           label: 'Tất cả' },
  { value: '1on1',       label: 'Huấn luyện 1:1' },
  { value: 'group',      label: 'Học ghép lớp' },
  { value: 'small_group',label: 'Học theo nhóm riêng' },
];
const LANGUAGES = [
  { value: '',   label: 'Tất cả' },
  { value: 'en', label: 'Tiếng Anh' },
  { value: 'zh', label: 'Tiếng Trung' },
  { value: 'ko', label: 'Tiếng Hàn' },
];

const PRICE_MIN = 0;
const PRICE_MAX = 5_000_000;

/**
 * Sidebar filter — state hoàn toàn lưu trong URL searchParams.
 * Khi user thay đổi → router.push() → server component re-fetch với query mới.
 * → Filter deep-linkable + share được.
 */
export default function CoachFilterSidebar({ sports }: CoachFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  // Local state cho price slider (để drag mượt, commit khi mouseup)
  const initialMax = Number(params.get('priceMax') ?? PRICE_MAX);
  const [priceLocal, setPriceLocal] = useState(initialMax);

  useEffect(() => {
    setPriceLocal(Number(params.get('priceMax') ?? PRICE_MAX));
  }, [params]);

  const current = useMemo(
    () => ({
      sport:    params.get('sport') ?? '',
      rating:   params.get('minRating') ?? '',
      format:   params.get('format') ?? '',
      language: params.get('language') ?? '',
      time:     params.get('time') ?? '',
    }),
    [params],
  );
  const areaSlugs = useMemo(() => (params.get('area') ?? '').split(',').filter(Boolean), [params]);
  const days = useMemo(() => (params.get('days') ?? '').split(',').filter(Boolean), [params]);

  function toggleDay(key: string) {
    const next = days.includes(key) ? days.filter((d) => d !== key) : [...days, key];
    update({ days: next.join(',') });
  }

  function update(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === '') next.delete(k);
      else next.set(k, v);
    });
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  function reset() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  const priceBarPct = ((priceLocal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <aside className="coach-filter" aria-label="Bộ lọc">
      <div className="coach-filter__header">
        <div className="coach-filter__header-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Bộ lọc
        </div>
        <button type="button" className="coach-filter__header-reset" onClick={reset}>
          Xoá lọc
        </button>
      </div>

      {/* Bộ môn */}
      <div className="coach-filter__group">
        <label className="coach-filter__label" htmlFor="filter-sport">Bộ môn</label>
        <select
          id="filter-sport"
          className="coach-filter__select"
          value={current.sport}
          onChange={(e) => update({ sport: e.target.value })}
        >
          <option value="">Tất cả bộ môn</option>
          {sports.map((s) => (
            <option key={s.id} value={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Khu vực — combobox search + multi-select */}
      <div className="coach-filter__group">
        <div className="coach-filter__label">Khu vực</div>
        <AreaMultiSelect value={areaSlugs} onChange={(slugs) => update({ area: slugs.join(',') })} />
      </div>

      {/* Lịch của tôi (Flow 1) */}
      <div className="coach-filter__group">
        <div className="coach-filter__label">Lịch của tôi</div>
        <div className="coach-filter__days">
          {WEEK_DAYS.map((d) => (
            <button
              key={d.key}
              type="button"
              className={cn('day-chip', days.includes(d.key) && 'day-chip--on')}
              aria-pressed={days.includes(d.key)}
              onClick={() => toggleDay(d.key)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="coach-filter__buckets">
          {TIME_BUCKETS.map((b) => (
            <button
              key={b.key}
              type="button"
              className={cn('bucket-chip', current.time === b.key && 'bucket-chip--on')}
              aria-pressed={current.time === b.key}
              onClick={() => update({ time: current.time === b.key ? '' : b.key })}
            >
              <strong>{b.label}</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Chi phí */}
      <div className="coach-filter__group">
        <div className="coach-filter__label">Chi phí</div>
        <div className="coach-filter__price">
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50_000}
            value={priceLocal}
            onChange={(e) => setPriceLocal(Number(e.target.value))}
            onMouseUp={() => update({ priceMax: priceLocal === PRICE_MAX ? '' : String(priceLocal) })}
            onTouchEnd={() => update({ priceMax: priceLocal === PRICE_MAX ? '' : String(priceLocal) })}
            style={{ accentColor: 'var(--brand)' }}
          />
          <div className="coach-filter__price-row">
            <span>{formatMoney({ amount: PRICE_MIN, currency: 'VND' })}</span>
            <span>{formatMoney({ amount: priceLocal, currency: 'VND' })}</span>
          </div>
        </div>
      </div>

      {/* Đánh giá */}
      <div className="coach-filter__group">
        <div className="coach-filter__label">Đánh giá</div>
        <div className="coach-filter__radio-list">
          {RATINGS.map((r) => (
            <label key={r.value} className="coach-filter__radio">
              <input
                type="radio"
                name="rating"
                checked={current.rating === r.value}
                onChange={() => update({ minRating: r.value })}
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      {/* Hình thức học */}
      <div className="coach-filter__group">
        <div className="coach-filter__label">Hình thức học</div>
        <div className="coach-filter__radio-list">
          {FORMATS.map((f) => (
            <label key={f.value} className="coach-filter__radio">
              <input
                type="radio"
                name="format"
                checked={current.format === f.value}
                onChange={() => update({ format: f.value })}
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      {/* Ngôn ngữ */}
      <div className="coach-filter__group">
        <div className="coach-filter__label">Ngôn ngữ</div>
        <div className="coach-filter__radio-list">
          {LANGUAGES.map((l) => (
            <label key={l.value} className="coach-filter__radio">
              <input
                type="radio"
                name="language"
                checked={current.language === l.value}
                onChange={() => update({ language: l.value })}
              />
              {l.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
