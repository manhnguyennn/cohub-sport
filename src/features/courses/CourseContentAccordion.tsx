'use client';

/**
 * Accordion "Nội dung khoá học" (figma): mỗi buổi = pill "Buổi NN" + tiêu đề +
 * thời lượng + chevron, mở ra xem bullet chi tiết. Buổi đầu mở sẵn.
 */
import { useState } from 'react';
import AppIcon from '@components/ui/AppIcon';
import { cn } from '@lib/cn';
import type { CourseSyllabusItem } from '@app-types/course';

export default function CourseContentAccordion({ items }: { items: CourseSyllabusItem[] }) {
  const [open, setOpen] = useState<number | null>(items[0]?.order ?? null);

  return (
    <div className="course-syllabus">
      {items.map((it) => {
        const isOpen = open === it.order;
        const hasDetails = !!it.details?.length;
        return (
          <div key={it.order} className={cn('course-syllabus__item', isOpen && 'is-open')}>
            <button
              type="button"
              className="course-syllabus__head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : it.order)}
            >
              <span className="course-syllabus__num">Buổi {String(it.order).padStart(2, '0')}</span>
              <span className="course-syllabus__title">{it.title}</span>
              <span className="course-syllabus__dur">
                <AppIcon name="clock" size={14} /> {Math.round(it.durationMinutes / 60 * 10) / 10} tiếng
              </span>
              <span className="course-syllabus__chevron" aria-hidden>
                <AppIcon name="chevronDown" size={16} />
              </span>
            </button>

            {isOpen && hasDetails && (
              <ul className="course-syllabus__details">
                {it.details!.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
