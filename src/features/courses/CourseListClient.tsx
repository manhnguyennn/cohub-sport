'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { EmptyState, MobileFilterWrapper } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatVND, formatDate } from '@lib/date';
import { cn } from '@lib/cn';
import type { Course, CourseLevel, CourseScheduleType } from '@app-types/course';
import type { Paginated } from '@app-types/common';
import type { Sport } from '@app-types/sport';

type Props = {
  sports: Sport[];
  initialResult: Paginated<Course>;
  initialQuery: { sport?: string; level?: CourseLevel; scheduleType?: CourseScheduleType; status?: 'available' | 'all'; q?: string; sort?: string };
};

const LEVELS: { value: CourseLevel | ''; label: string }[] = [
  { value: '',             label: 'Mọi cấp độ' },
  { value: 'beginner',     label: 'Người mới' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced',     label: 'Nâng cao' },
];

const SORT_OPTIONS = [
  { value: '',              label: 'Mặc định' },
  { value: 'starting_soon', label: 'Sắp khai giảng' },
  { value: 'price_asc',     label: 'Giá thấp đến cao' },
  { value: 'price_desc',    label: 'Giá cao đến thấp' },
];

export default function CourseListClient({ sports, initialResult, initialQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const [keyword, setKeyword] = useState(initialQuery.q ?? '');

  useEffect(() => { setKeyword(params.get('q') ?? ''); }, [params]);

  const current = {
    sport:        params.get('sport') ?? '',
    level:        params.get('level') ?? '',
    scheduleType: params.get('scheduleType') ?? '',
    status:       params.get('status') ?? 'all',
    sort:         params.get('sort') ?? '',
  };

  function commit(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === '') next.delete(k);
      else next.set(k, v);
    });
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  function reset() {
    startTransition(() => router.push(pathname, { scroll: false }));
  }

  return (
    <>
      {/* Hero strip dark */}
      <section className="courses-hero">
        <div className="courses-hero__container">
          <h1>Khoá học có lịch</h1>
          <p>Đăng ký 1 lần — học cả lộ trình. Lịch cố định hoặc linh hoạt theo thời gian rảnh.</p>
          <div className="courses-hero__tabs">
            <button
              type="button"
              className={cn('courses-hero__tab', !current.scheduleType && 'is-active')}
              onClick={() => commit({ scheduleType: '' })}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={cn('courses-hero__tab', current.scheduleType === 'FIXED' && 'is-active')}
              onClick={() => commit({ scheduleType: 'FIXED' })}
            >
              Lịch cố định
            </button>
            <button
              type="button"
              className={cn('courses-hero__tab', current.scheduleType === 'FLEXIBLE' && 'is-active')}
              onClick={() => commit({ scheduleType: 'FLEXIBLE' })}
            >
              Linh hoạt
            </button>
          </div>
        </div>
      </section>

      {/* Body: filter sidebar + grid */}
      <div className="courses-list">
        <div className="courses-list__container">
          <div className="courses-list__grid">
            <MobileFilterWrapper title="Bộ lọc khoá học">
            <aside className="courses-filter" aria-label="Bộ lọc">
              <div className="courses-filter__head">
                <span>Bộ lọc</span>
                <button type="button" onClick={reset}>Xoá lọc</button>
              </div>

              <div className="courses-filter__group">
                <label className="courses-filter__label" htmlFor="filter-sport">Bộ môn</label>
                <select
                  id="filter-sport"
                  value={current.sport}
                  onChange={(e) => commit({ sport: e.target.value })}
                >
                  <option value="">Tất cả bộ môn</option>
                  {sports.map((s) => (
                    <option key={s.id} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="courses-filter__group">
                <div className="courses-filter__label">Cấp độ</div>
                <div className="courses-filter__radio-list">
                  {LEVELS.map((l) => (
                    <label key={l.value} className="courses-filter__radio">
                      <input
                        type="radio"
                        name="level"
                        checked={current.level === l.value}
                        onChange={() => commit({ level: l.value || undefined })}
                      />
                      {l.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="courses-filter__group">
                <label className="courses-filter__radio">
                  <input
                    type="checkbox"
                    checked={current.status === 'available'}
                    onChange={(e) => commit({ status: e.target.checked ? 'available' : '' })}
                  />
                  Chỉ hiện khoá còn chỗ
                </label>
              </div>
            </aside>
            </MobileFilterWrapper>

            <div className="courses-list__content">
              <div className="courses-list__header">
                <h2>
                  Có {initialResult.total} khoá học
                </h2>

                <div className="courses-list__actions">
                  <form
                    className="courses-list__search"
                    onSubmit={(e) => { e.preventDefault(); commit({ q: keyword }); }}
                  >
                    <input
                      type="search"
                      placeholder="Tìm khoá học…"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onBlur={() => commit({ q: keyword })}
                    />
                  </form>

                  <select
                    value={current.sort}
                    onChange={(e) => commit({ sort: e.target.value || undefined })}
                    aria-label="Sắp xếp"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {initialResult.items.length === 0 ? (
                <EmptyState
                  title="Không tìm thấy khoá học phù hợp"
                  description="Thử bỏ bớt bộ lọc hoặc đổi từ khoá tìm."
                />
              ) : (
                <>
                  <div className="courses-grid">
                    {initialResult.items.map((c) => (
                      <CourseCard key={c.id} course={c} />
                    ))}
                  </div>
                  {initialResult.total > initialResult.items.length && (
                    <div className="coach-list__more">
                      <button
                        type="button"
                        className="coach-list__more-btn"
                        onClick={() => {
                          const cur = Number(params.get('page') ?? 1);
                          commit({ page: String(cur + 1) });
                        }}
                      >
                        Tải thêm (còn {initialResult.total - initialResult.items.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Course card ───────────────────────────────────────────────
function CourseCard({ course }: { course: Course }) {
  const isFull = course.status === 'full' || course.availableSeats === 0;
  const isStarted = course.status === 'started';
  const isLow = !isFull && course.availableSeats <= 2;

  return (
    <Link href={ROUTES.courseDetail(course.id)} className={cn('course-card', (isFull || isStarted) && 'course-card--disabled')}>
      <div className="course-card__media">
        <Image
          src={course.cover}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          style={{ objectFit: 'cover' }}
        />
        {isStarted && <span className="course-card__badge course-card__badge--gray">Đã bắt đầu</span>}
        {!isStarted && isFull && <span className="course-card__badge course-card__badge--gray">Đã đầy</span>}
        {!isStarted && !isFull && isLow && (
          <span className="course-card__badge course-card__badge--urgency">
            Còn {course.availableSeats} chỗ
          </span>
        )}
        <span className={`course-card__type course-card__type--${course.scheduleType.toLowerCase()}`}>
          <AppIcon name={course.scheduleType === 'FIXED' ? 'calendar' : 'flash'} size={13} />
          {course.scheduleType === 'FIXED' ? 'Lịch cố định' : 'Linh hoạt'}
        </span>
      </div>

      <div className="course-card__body">
        <h3 className="course-card__title">{course.title}</h3>

        <div className="course-card__coach">
          {course.coachAvatar && (
            <Image src={course.coachAvatar} alt={course.coachName} width={20} height={20} />
          )}
          <span>{course.coachName}</span>
        </div>

        <div className="course-card__meta">
          <span>{course.totalSessions} buổi · {course.sessionDurationMin} phút</span>
          {course.scheduleType === 'FIXED' && course.startDate && (
            <span>Khai giảng {formatDate(course.startDate)}</span>
          )}
          {course.scheduleType === 'FLEXIBLE' && course.flexibleValidityDays && (
            <span>Hết hạn sau {course.flexibleValidityDays} ngày</span>
          )}
        </div>

        <div className="course-card__footer">
          <div className="course-card__price">
            <small>Trọn gói</small>
            <strong>{formatVND(course.price.amount)}</strong>
          </div>
          {course.tags && course.tags.length > 0 && (
            <span className="course-card__tag">{course.tags[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
