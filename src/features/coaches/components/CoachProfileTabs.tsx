'use client';

import { useEffect, useState } from 'react';
import { cn } from '@lib/cn';

const TABS = [
  { id: 'about',          label: 'Giới thiệu' },
  { id: 'experience',     label: 'Kinh nghiệm' },
  { id: 'videos',         label: 'Videos' },
  { id: 'open-sessions',  label: 'Lịch mở' },
  { id: 'courses',        label: 'Khoá học' },
  { id: 'reviews',        label: 'Đánh giá' },
] as const;

/**
 * Tab nav scroll-spy — đánh dấu tab tương ứng section đang hiển thị.
 * Smooth scroll khi click.
 */
export default function CoachProfileTabs() {
  const [active, setActive] = useState<string>('about');

  useEffect(() => {
    const sections: HTMLElement[] = [];
    TABS.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) sections.push(el);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -65% 0px', threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: 'smooth' });
      setActive(id);
    }
  };

  return (
    <nav className="coach-tabs" aria-label="Phần">
      <div className="coach-tabs__container">
        <ul className="coach-tabs__list">
          {TABS.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                onClick={(e) => handleClick(e, t.id)}
                className={cn(
                  'coach-tabs__link',
                  active === t.id && 'coach-tabs__link--active',
                )}
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
