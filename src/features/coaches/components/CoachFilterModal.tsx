'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import AppIcon from '@components/ui/AppIcon';
import AreaMultiSelect from '@components/ui/AreaMultiSelect';
import { formatMoney } from '@lib/format';
import type { Sport } from '@app-types/sport';

type Props = {
  sports: Sport[];
  onClose: () => void;
};

const WEEK_DAYS = [
  { key: 't2', label: 'T2' }, { key: 't3', label: 'T3' }, { key: 't4', label: 'T4' },
  { key: 't5', label: 'T5' }, { key: 't6', label: 'T6' }, { key: 't7', label: 'T7' }, { key: 'cn', label: 'CN' },
];
const TIME_BUCKETS = [
  { key: 'morning', label: 'Sáng', hint: '5–11h' },
  { key: 'afternoon', label: 'Chiều', hint: '12–17h' },
  { key: 'evening', label: 'Tối', hint: '17–22h' },
];
const RATINGS = [
  { value: '4.5', label: 'Từ 4.5★' },
  { value: '4.0', label: 'Từ 4.0★' },
];
const FORMATS = [
  { value: '1on1', label: 'Huấn luyện 1:1' },
  { value: 'group', label: 'Học ghép lớp' },
  { value: 'small_group', label: 'Nhóm riêng' },
];
const LANGUAGES = [
  { value: 'en', label: 'Tiếng Anh' },
  { value: 'zh', label: 'Tiếng Trung' },
  { value: 'ko', label: 'Tiếng Hàn' },
];
const PRICE_MAX = 5_000_000;

/**
 * Modal lọc chi tiết coach — dùng lại style `.search-modal` của hero.
 * Draft state nội bộ; "Áp dụng" mới ghi vào URL.
 */
export default function CoachFilterModal({ sports, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const sportChips = sports.filter((s) => s.category === 'sport');

  // Draft khởi tạo từ URL hiện tại
  const [sport, setSport] = useState(params.get('sport') ?? '');
  const [area, setArea] = useState<string[]>((params.get('area') ?? '').split(',').filter(Boolean));
  const [days, setDays] = useState<string[]>((params.get('days') ?? '').split(',').filter(Boolean));
  const [time, setTime] = useState(params.get('time') ?? '');
  const [rating, setRating] = useState(params.get('minRating') ?? '');
  const [format, setFormat] = useState(params.get('format') ?? '');
  const [language, setLanguage] = useState(params.get('language') ?? '');
  const [priceMax, setPriceMax] = useState(Number(params.get('priceMax') ?? PRICE_MAX));

  function toggleDay(key: string) {
    setDays((p) => (p.includes(key) ? p.filter((d) => d !== key) : [...p, key]));
  }

  function apply() {
    const next = new URLSearchParams(params.toString());
    const set = (k: string, v: string) => (v ? next.set(k, v) : next.delete(k));
    set('sport', sport);
    set('area', area.join(','));
    set('days', days.join(','));
    set('time', time);
    set('minRating', rating);
    set('format', format);
    set('language', language);
    set('priceMax', priceMax < PRICE_MAX ? String(priceMax) : '');
    next.delete('page');
    router.push(next.toString() ? `${pathname}?${next}` : pathname, { scroll: false });
    onClose();
  }

  function clearAll() {
    setSport(''); setArea([]); setDays([]); setTime('');
    setRating(''); setFormat(''); setLanguage(''); setPriceMax(PRICE_MAX);
  }

  return (
    <div className="search-modal" role="dialog" aria-modal="true" aria-label="Bộ lọc huấn luyện viên">
      <div className="search-modal__backdrop" onClick={onClose} />
      <div className="search-modal__sheet">
        <header className="search-modal__head">
          <h3>Bộ lọc huấn luyện viên</h3>
          <button type="button" className="search-modal__close" onClick={onClose} aria-label="Đóng">
            <AppIcon name="close" size={20} />
          </button>
        </header>

        <div className="search-modal__body">
          {/* Bộ môn */}
          <section className="search-modal__section">
            <span className="search-modal__label">Bộ môn</span>
            <div className="search-modal__sports">
              {sportChips.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`sport-chip ${sport === s.slug ? 'sport-chip--on' : ''}`}
                  aria-pressed={sport === s.slug}
                  onClick={() => setSport(sport === s.slug ? '' : s.slug)}
                >
                  <span className="sport-chip__thumb">
                    <Image src={s.image} alt="" width={28} height={28} style={{ objectFit: 'cover' }} />
                  </span>
                  <span className="sport-chip__name">{s.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Khu vực */}
          <section className="search-modal__section">
            <span className="search-modal__label">Khu vực</span>
            <AreaMultiSelect value={area} onChange={setArea} />
          </section>

          {/* Lịch */}
          <section className="search-modal__section">
            <span className="search-modal__label">Lịch rảnh của bạn</span>
            <div className="search-modal__field">
              <span className="search-modal__sublabel">Ngày trong tuần</span>
              <div className="search-modal__days">
                {WEEK_DAYS.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    className={`day-chip ${days.includes(d.key) ? 'day-chip--on' : ''}`}
                    aria-pressed={days.includes(d.key)}
                    onClick={() => toggleDay(d.key)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="search-modal__field">
              <span className="search-modal__sublabel">Khung giờ</span>
              <div className="search-modal__buckets">
                {TIME_BUCKETS.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    className={`bucket-chip ${time === b.key ? 'bucket-chip--on' : ''}`}
                    aria-pressed={time === b.key}
                    onClick={() => setTime(time === b.key ? '' : b.key)}
                  >
                    <strong>{b.label}</strong>
                    <small>{b.hint}</small>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Đánh giá */}
          <section className="search-modal__section">
            <span className="search-modal__label">Đánh giá</span>
            <div className="search-modal__chiprow">
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`pill-chip ${rating === r.value ? 'pill-chip--on' : ''}`}
                  onClick={() => setRating(rating === r.value ? '' : r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </section>

          {/* Hình thức học */}
          <section className="search-modal__section">
            <span className="search-modal__label">Hình thức học</span>
            <div className="search-modal__chiprow">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`pill-chip ${format === f.value ? 'pill-chip--on' : ''}`}
                  onClick={() => setFormat(format === f.value ? '' : f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {/* Ngôn ngữ */}
          <section className="search-modal__section">
            <span className="search-modal__label">Ngôn ngữ</span>
            <div className="search-modal__chiprow">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  className={`pill-chip ${language === l.value ? 'pill-chip--on' : ''}`}
                  onClick={() => setLanguage(language === l.value ? '' : l.value)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </section>

          {/* Chi phí */}
          <section className="search-modal__section">
            <span className="search-modal__label">
              Học phí tối đa
              <span className="search-modal__price-val">{formatMoney({ amount: priceMax, currency: 'VND' })}/giờ</span>
            </span>
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={50_000}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="search-modal__range"
            />
          </section>
        </div>

        <footer className="search-modal__footer search-modal__footer--split">
          <button type="button" className="search-modal__clear" onClick={clearAll}>Xoá lọc</button>
          <button type="button" className="search-modal__search" onClick={apply}>
            Áp dụng
          </button>
        </footer>
      </div>
    </div>
  );
}
