'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import AppIcon from '@components/ui/AppIcon';
import { ALL_AREAS } from '@/data/areas';
import type { Sport } from '@app-types/sport';

type Props = { sports: Sport[] };

const FORMAT_LABEL: Record<string, string> = {
  '1on1': 'Huấn luyện 1:1',
  group: 'Học ghép lớp',
  small_group: 'Nhóm riêng',
};
const LANG_LABEL: Record<string, string> = { en: 'Tiếng Anh', zh: 'Tiếng Trung', ko: 'Tiếng Hàn' };
const DAY_LABEL: Record<string, string> = { t2: 'T2', t3: 'T3', t4: 'T4', t5: 'T5', t6: 'T6', t7: 'T7', cn: 'CN' };
const TIME_LABEL: Record<string, string> = { morning: 'Sáng', afternoon: 'Chiều', evening: 'Tối' };

function fmtVnd(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ';
}

/**
 * Hàng chip lọc đang áp dụng — mỗi chip xoá được, có "Xoá tất cả".
 * Giúp user thấy rõ đang lọc gì + bỏ nhanh từng tiêu chí.
 */
export default function CoachActiveFilters({ sports }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  function setParams(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    startTransition(() => router.push(next.toString() ? `${pathname}?${next}` : pathname, { scroll: false }));
  }

  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  const sportSlug = params.get('sport');
  if (sportSlug) {
    const s = sports.find((x) => x.slug === sportSlug);
    chips.push({ key: 'sport', label: s?.name ?? sportSlug, onRemove: () => setParams((p) => p.delete('sport')) });
  }

  const areaCsv = params.get('area');
  if (areaCsv) {
    areaCsv.split(',').filter(Boolean).forEach((slug) => {
      const a = ALL_AREAS.find((x) => x.slug === slug);
      chips.push({
        key: `area-${slug}`,
        label: a?.label ?? slug,
        onRemove: () => setParams((p) => {
          const rest = (p.get('area') ?? '').split(',').filter((s) => s && s !== slug);
          if (rest.length) p.set('area', rest.join(',')); else p.delete('area');
        }),
      });
    });
  }

  const days = params.get('days');
  if (days) {
    const labels = days.split(',').filter(Boolean).map((d) => DAY_LABEL[d] ?? d).join(', ');
    chips.push({ key: 'days', label: `Ngày: ${labels}`, onRemove: () => setParams((p) => p.delete('days')) });
  }

  const time = params.get('time');
  if (time) {
    chips.push({ key: 'time', label: `Buổi ${TIME_LABEL[time] ?? time}`, onRemove: () => setParams((p) => p.delete('time')) });
  }

  const rating = params.get('minRating');
  if (rating) {
    chips.push({ key: 'rating', label: `Từ ${rating}★`, onRemove: () => setParams((p) => p.delete('minRating')) });
  }

  const format = params.get('format');
  if (format) {
    chips.push({ key: 'format', label: FORMAT_LABEL[format] ?? format, onRemove: () => setParams((p) => p.delete('format')) });
  }

  const language = params.get('language');
  if (language) {
    chips.push({ key: 'language', label: LANG_LABEL[language] ?? language, onRemove: () => setParams((p) => p.delete('language')) });
  }

  const priceMax = params.get('priceMax');
  if (priceMax) {
    chips.push({ key: 'priceMax', label: `≤ ${fmtVnd(Number(priceMax))}`, onRemove: () => setParams((p) => p.delete('priceMax')) });
  }

  const q = params.get('q');
  if (q) {
    chips.push({ key: 'q', label: `“${q}”`, onRemove: () => setParams((p) => p.delete('q')) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="coach-active-filters">
      {chips.map((c) => (
        <button key={c.key} type="button" className="coach-active-filters__chip" onClick={c.onRemove}>
          {c.label}
          <AppIcon name="close" size={13} />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          className="coach-active-filters__clear"
          onClick={() => startTransition(() => router.push(pathname, { scroll: false }))}
        >
          Xoá tất cả
        </button>
      )}
    </div>
  );
}
