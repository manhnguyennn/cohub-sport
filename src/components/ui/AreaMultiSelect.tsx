'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import AppIcon from '@components/ui/AppIcon';
import { AREA_GROUPS, ALL_AREAS } from '@/data/areas';

type Props = {
  value: string[];
  onChange: (slugs: string[]) => void;
  placeholder?: string;
};

/** Bỏ dấu tiếng Việt để search dễ khớp */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

/**
 * Combobox khu vực kiểu Select2 — search/autocomplete + multi-select.
 * Panel mở inline (không bị clip trong modal cuộn). Chip chọn xoá được.
 */
export default function AreaMultiSelect({ value, onChange, placeholder = 'Tất cả khu vực' }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const selectedAreas = useMemo(
    () => ALL_AREAS.filter((a) => value.includes(a.slug)),
    [value],
  );

  const filteredGroups = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return AREA_GROUPS;
    return AREA_GROUPS.map((g) => {
      const cityMatch = norm(g.city).includes(q);
      const options = cityMatch ? g.options : g.options.filter((o) => norm(o.label).includes(q));
      return { city: g.city, options };
    }).filter((g) => g.options.length > 0);
  }, [query]);

  function toggle(slug: string) {
    onChange(value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug]);
  }

  function remove(slug: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(value.filter((s) => s !== slug));
  }

  const hasResults = filteredGroups.length > 0;

  return (
    <div className={`area-select ${open ? 'is-open' : ''}`} ref={ref}>
      <div
        className="area-select__control"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}
      >
        <AppIcon name="location" size={16} />
        <div className="area-select__tags">
          {selectedAreas.length === 0 && <span className="area-select__placeholder">{placeholder}</span>}
          {selectedAreas.map((a) => (
            <span key={a.slug} className="area-select__tag">
              {a.label}
              <button type="button" aria-label={`Bỏ ${a.label}`} onClick={(e) => remove(a.slug, e)}>
                <AppIcon name="close" size={12} />
              </button>
            </span>
          ))}
        </div>
        <span className={`area-select__chev ${open ? 'is-open' : ''}`} aria-hidden>
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
            <path d="M1 1l4.5 4L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {open && (
        <div className="area-select__panel">
          <div className="area-select__search">
            <AppIcon name="search" size={16} />
            <input
              type="text"
              autoFocus
              placeholder="Tìm khu vực hoặc thành phố..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="area-select__options">
            {hasResults ? (
              filteredGroups.map((g) => (
                <div key={g.city} className="area-select__optgroup">
                  <div className="area-select__optgroup-label">{g.city}</div>
                  {g.options.map((o) => {
                    const on = value.includes(o.slug);
                    return (
                      <button
                        key={o.slug}
                        type="button"
                        className={`area-select__option ${on ? 'is-selected' : ''}`}
                        onClick={() => toggle(o.slug)}
                      >
                        <span>{o.label}</span>
                        {on && <AppIcon name="check" size={16} />}
                      </button>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="area-select__empty">Không tìm thấy khu vực phù hợp</div>
            )}
          </div>

          {value.length > 0 && (
            <div className="area-select__panel-foot">
              <button type="button" onClick={() => onChange([])}>Bỏ chọn tất cả</button>
              <button type="button" className="area-select__done" onClick={() => { setOpen(false); setQuery(''); }}>
                Xong ({value.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
