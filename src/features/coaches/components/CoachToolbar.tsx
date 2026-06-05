'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import AppIcon from '@components/ui/AppIcon';
import CoachActiveFilters from './CoachActiveFilters';
import CoachFilterModal from './CoachFilterModal';
import type { Sport } from '@app-types/sport';

type Props = { total: number; sports: Sport[] };

const SORT_OPTIONS = [
  { value: '', label: 'Phù hợp nhất' },
  { value: 'rating_desc', label: 'Đánh giá cao nhất' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
  { value: 'experience_desc', label: 'Kinh nghiệm nhiều nhất' },
];

// Param thuộc nhóm "lọc chi tiết" (đếm cho nút Bộ lọc)
const FILTER_KEYS = ['sport', 'area', 'days', 'time', 'minRating', 'format', 'language', 'priceMax'];

export default function CoachToolbar({ total, sports }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [keyword, setKeyword] = useState(params.get('q') ?? '');
  const [filterOpen, setFilterOpen] = useState(false);
  const currentQ = params.get('q') ?? '';
  const sortValue = params.get('sort') ?? '';

  useEffect(() => { setKeyword(params.get('q') ?? ''); }, [params]);

  function commit(patch: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => { if (!v) next.delete(k); else next.set(k, v); });
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  // Live search debounce 450ms
  useEffect(() => {
    if (keyword === currentQ) return;
    const t = setTimeout(() => commit({ q: keyword }), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const filterCount = FILTER_KEYS.reduce((n, k) => {
    const v = params.get(k);
    if (!v) return n;
    // area/days là CSV → đếm số lượng
    if (k === 'area' || k === 'days') return n + v.split(',').filter(Boolean).length;
    return n + 1;
  }, 0);

  return (
    <div className="coach-toolbar">
      <div className="coach-toolbar__row">
        <div className="coach-toolbar__count">
          <strong>{total}</strong> huấn luyện viên
        </div>

        <div className="coach-toolbar__controls">
          <div className="coach-toolbar__search">
            <AppIcon name="search" size={18} />
            <input
              type="search"
              placeholder="Tìm theo tên, chuyên môn…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="coach-toolbar__select">
            <select value={sortValue} onChange={(e) => commit({ sort: e.target.value })} aria-label="Sắp xếp">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <button type="button" className="coach-toolbar__filter-btn" onClick={() => setFilterOpen(true)}>
            <AppIcon name="setting" size={18} />
            Bộ lọc
            {filterCount > 0 && <span className="coach-toolbar__filter-count">{filterCount}</span>}
          </button>
        </div>
      </div>

      <CoachActiveFilters sports={sports} />

      {filterOpen && <CoachFilterModal sports={sports} onClose={() => setFilterOpen(false)} />}
    </div>
  );
}
