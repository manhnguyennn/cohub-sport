'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';

const SORT_OPTIONS = [
  { value: '',                  label: 'Sắp xếp mặc định' },
  { value: 'rating_desc',       label: 'Đánh giá cao nhất' },
  { value: 'price_asc',         label: 'Giá thấp đến cao' },
  { value: 'price_desc',        label: 'Giá cao đến thấp' },
  { value: 'experience_desc',   label: 'Kinh nghiệm nhiều nhất' },
];

export default function CoachListHeader({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [keyword, setKeyword] = useState(params.get('q') ?? '');
  const sortValue = params.get('sort') ?? '';

  useEffect(() => {
    setKeyword(params.get('q') ?? '');
  }, [params]);

  function commit(patch: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (!v) next.delete(k);
      else next.set(k, v);
    });
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  return (
    <div className="coach-list-header">
      <h2 className="coach-list-header__title">
        Danh sách huấn luyện viên
        <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>
          ({total})
        </span>
      </h2>

      <div className="coach-list-header__actions">
        <form
          className="coach-list-header__search"
          onSubmit={(e) => { e.preventDefault(); commit({ q: keyword }); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Tìm kiếm huấn luyện viên…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onBlur={() => commit({ q: keyword })}
          />
        </form>

        <select
          className="coach-list-header__sort"
          value={sortValue}
          onChange={(e) => commit({ sort: e.target.value })}
          aria-label="Sắp xếp"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
