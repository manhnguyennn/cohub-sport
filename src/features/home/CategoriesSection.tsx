'use client';

import { useMemo, useState } from 'react';
import SportCard from '@features/sports/components/SportCard';
import { cn } from '@lib/cn';
import type { Sport, SportCategory } from '@app-types/sport';

type CategoriesSectionProps = {
  sports: Sport[];
};

const TABS: { value: SportCategory | 'all'; label: string }[] = [
  { value: 'all',      label: 'Tất cả' },
  { value: 'sport',    label: '⚽ Thể thao' },
  { value: 'tech',     label: '💻 Công nghệ' },
  { value: 'language', label: '🌐 Ngôn ngữ' },
  { value: 'hr',       label: '👥 HR' },
];

export default function CategoriesSection({ sports }: CategoriesSectionProps) {
  const [active, setActive] = useState<SportCategory | 'all'>('all');

  const filtered = useMemo(
    () => (active === 'all' ? sports : sports.filter((s) => s.category === active)),
    [sports, active],
  );

  return (
    <section className="home-categories" id="categories">
      <div className="home-categories__container">
        <div className="home-categories__header">
          <div>
            <h2 className="home-categories__title">Lĩnh vực bạn quan tâm?</h2>
            <p className="home-categories__subtitle">Chọn lĩnh vực để xem danh sách HLV.</p>
          </div>
        </div>

        <div className="home-categories__tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={active === t.value}
              className={cn('home-categories__tab', active === t.value && 'home-categories__tab--active')}
              onClick={() => setActive(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="home-categories__grid">
          {filtered.map((sport) => (
            <SportCard key={sport.id} sport={sport} />
          ))}
        </div>
      </div>
    </section>
  );
}
