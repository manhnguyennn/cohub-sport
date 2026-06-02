import Link from 'next/link';
import { ROUTES } from '@config/routes';
import { cn } from '@lib/cn';
import type { Sport } from '@app-types/sport';

type CoachHeroProps = {
  selectedSport?: Sport;
  sports: Sport[];
};

/**
 * Hero strip cho trang /coaches.
 * Title = tên sport đang chọn (hoặc "Tất cả huấn luyện viên" khi không chọn).
 * Tabs = các sport phổ biến để user switch nhanh.
 */
export default function CoachHero({ selectedSport, sports }: CoachHeroProps) {
  const heroBg = selectedSport?.image ?? '/images/Fitness.webp';

  const tabs: Array<{ slug: string | null; label: string }> = [
    { slug: null, label: 'Tất cả' },
    ...sports.slice(0, 6).map((s) => ({ slug: s.slug, label: s.name })),
  ];

  return (
    <section
      className="coach-hero"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(13,10,44,0.85) 0%, rgba(13,10,44,0.45) 100%), url(${heroBg})` }}
    >
      <div className="coach-hero__container">
        <h1 className="coach-hero__title">
          {selectedSport ? selectedSport.name : 'Tất cả huấn luyện viên'}
        </h1>

        <div className="coach-hero__tabs" role="tablist">
          {tabs.map((t) => {
            const isActive = (t.slug ?? '') === (selectedSport?.slug ?? '');
            const href = t.slug ? `${ROUTES.coaches}?sport=${t.slug}` : ROUTES.coaches;
            return (
              <Link
                key={t.slug ?? 'all'}
                href={href}
                className={cn('coach-hero__tab', isActive && 'coach-hero__tab--active')}
                role="tab"
                aria-selected={isActive}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
