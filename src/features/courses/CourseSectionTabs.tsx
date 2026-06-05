'use client';

/**
 * Tab điều hướng nội dung khoá học (figma): Giới thiệu / Lợi ích / Nội dung / Videos.
 * Sticky dưới header, click → smooth-scroll tới section, active theo scroll-spy.
 */
import { useEffect, useState } from 'react';
import { cn } from '@lib/cn';

export type CourseTab = { id: string; label: string };

const DEFAULT_TABS: CourseTab[] = [
  { id: 'gioi-thieu', label: 'Giới thiệu' },
  { id: 'loi-ich', label: 'Lợi ích' },
  { id: 'noi-dung', label: 'Nội dung khoá học' },
  { id: 'videos', label: 'Videos' },
];

const OFFSET = 110; // chừa header + tab bar

export default function CourseSectionTabs({ tabs = DEFAULT_TABS }: { tabs?: CourseTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    function onScroll() {
      let current = tabs[0]?.id;
      for (const t of tabs) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top - OFFSET <= 4) current = t.id;
      }
      setActive(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [tabs]);

  function go(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  return (
    <nav className="course-tabs" aria-label="Mục nội dung khoá học">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={cn('course-tabs__tab', active === t.id && 'is-active')}
          onClick={() => go(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
