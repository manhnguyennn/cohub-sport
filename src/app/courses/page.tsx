import { courseService } from '@services/course.service';
import { sportService } from '@services/sport.service';
import CourseListClient from '@features/courses/CourseListClient';
import type { CourseListQuery, CourseLevel, CourseScheduleType } from '@app-types/course';

export const metadata = { title: 'Khoá học' };

type PageProps = {
  searchParams: Record<string, string | undefined>;
};

function toQuery(searchParams: PageProps['searchParams']): CourseListQuery {
  return {
    q: searchParams.q,
    sport: searchParams.sport,
    level: searchParams.level as CourseLevel | undefined,
    scheduleType: searchParams.scheduleType as CourseScheduleType | undefined,
    status: (searchParams.status as 'available' | 'all') ?? 'all',
    sort: (searchParams.sort as CourseListQuery['sort']) || undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
    pageSize: 12,
  };
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const query = toQuery(searchParams);
  const [sports, result] = await Promise.all([
    sportService.list(),
    courseService.list(query),
  ]);

  return <CourseListClient sports={sports} initialResult={result} initialQuery={query} />;
}
