'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@config/routes';
import AppIcon from '@components/ui/AppIcon';
import AreaMultiSelect from '@components/ui/AreaMultiSelect';
import type { Sport } from '@app-types/sport';

type Props = {
  sports: Sport[];
  onClose: () => void;
};

const WEEK_DAYS = [
  { key: 't2', label: 'T2' },
  { key: 't3', label: 'T3' },
  { key: 't4', label: 'T4' },
  { key: 't5', label: 'T5' },
  { key: 't6', label: 'T6' },
  { key: 't7', label: 'T7' },
  { key: 'cn', label: 'CN' },
];

const TIME_BUCKETS = [
  { key: 'morning', label: 'Sáng', hint: '5–11h' },
  { key: 'afternoon', label: 'Chiều', hint: '12–17h' },
  { key: 'evening', label: 'Tối', hint: '17–22h' },
];

/**
 * Modal tìm coach — 1 chỗ chọn: môn thể thao + khu vực + (optional) lịch cá nhân.
 * Spec hero redesign: chip môn gọn → khu vực → toggle lịch → Tìm coach.
 */
export default function SportSearchModal({ sports, onClose }: Props) {
  const router = useRouter();

  const sportChips = useMemo(
    () => sports.filter((s) => s.category === 'sport'),
    [sports],
  );

  const [sportSlug, setSportSlug] = useState('');
  const [areaSlugs, setAreaSlugs] = useState<string[]>([]);
  const [scheduleOn, setScheduleOn] = useState(false);
  const [days, setDays] = useState<string[]>([]);
  const [bucket, setBucket] = useState('');

  function toggleDay(key: string) {
    setDays((prev) => (prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]));
  }

  function search() {
    const params = new URLSearchParams();
    if (sportSlug) params.set('sport', sportSlug);
    if (areaSlugs.length) params.set('area', areaSlugs.join(','));
    if (scheduleOn) {
      if (days.length) params.set('days', days.join(','));
      if (bucket) params.set('time', bucket);
    }
    const qs = params.toString();
    router.push(qs ? `${ROUTES.coaches}?${qs}` : ROUTES.coaches);
  }

  return (
    <div className="search-modal" role="dialog" aria-modal="true" aria-label="Tìm coach">
      <div className="search-modal__backdrop" onClick={onClose} />
      <div className="search-modal__sheet">
        <header className="search-modal__head">
          <h3>Tìm coach phù hợp với bạn</h3>
          <button type="button" className="search-modal__close" onClick={onClose} aria-label="Đóng">
            <AppIcon name="close" size={20} />
          </button>
        </header>

        <div className="search-modal__body">
          {/* Môn thể thao */}
          <section className="search-modal__section">
            <span className="search-modal__label">Bạn muốn học môn gì?</span>
            <div className="search-modal__sports">
              {sportChips.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`sport-chip ${sportSlug === s.slug ? 'sport-chip--on' : ''}`}
                  aria-pressed={sportSlug === s.slug}
                  onClick={() => setSportSlug(sportSlug === s.slug ? '' : s.slug)}
                >
                  <span className="sport-chip__thumb">
                    <Image src={s.image} alt="" width={28} height={28} style={{ objectFit: 'cover' }} />
                  </span>
                  <span className="sport-chip__name">{s.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Khu vực — combobox search + multi-select */}
          <section className="search-modal__section">
            <span className="search-modal__label">Khu vực</span>
            <AreaMultiSelect value={areaSlugs} onChange={setAreaSlugs} />
          </section>

          {/* Toggle lịch cá nhân */}
          <section className="search-modal__section">
            <button
              type="button"
              className="search-modal__toggle"
              aria-pressed={scheduleOn}
              onClick={() => setScheduleOn((v) => !v)}
            >
              <span className="search-modal__toggle-text">
                <AppIcon name="calendar" size={16} />
                Lọc theo lịch của tôi
                <small>Chỉ hiện coach rảnh đúng khung giờ bạn chọn</small>
              </span>
              <span className={`search-modal__switch ${scheduleOn ? 'is-on' : ''}`} aria-hidden>
                <span className="search-modal__switch-knob" />
              </span>
            </button>

            {scheduleOn && (
              <div className="search-modal__schedule">
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
                        className={`bucket-chip ${bucket === b.key ? 'bucket-chip--on' : ''}`}
                        aria-pressed={bucket === b.key}
                        onClick={() => setBucket(bucket === b.key ? '' : b.key)}
                      >
                        <strong>{b.label}</strong>
                        <small>{b.hint}</small>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <footer className="search-modal__footer">
          <button type="button" className="search-modal__search" onClick={search}>
            <AppIcon name="search" size={18} color="#fff" />
            Tìm coach
          </button>
        </footer>
      </div>
    </div>
  );
}
