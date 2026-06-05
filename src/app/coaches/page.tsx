import { coachService } from '@services/coach.service';
import { sportService } from '@services/sport.service';
import { openSessionService } from '@services/openSession.service';
import CoachHero from '@features/coaches/components/CoachHero';
import CoachToolbar from '@features/coaches/components/CoachToolbar';
import CoachCard from '@features/coaches/components/CoachCard';
import CoachLoadMore from '@features/coaches/components/CoachLoadMore';
import CoachCtaStrip from '@features/coaches/components/CoachCtaStrip';
import { EmptyState } from '@components/ui';
import type { Coach, CoachListQuery, Gender, TeachingFormat } from '@app-types/coach';

export const metadata = { title: 'Tìm HLV' };

type PageProps = {
  searchParams: Record<string, string | undefined>;
};

function toQuery(searchParams: PageProps['searchParams']): CoachListQuery {
  return {
    q: searchParams.q,
    sport: searchParams.sport,
    language: searchParams.language,
    city: searchParams.city,
    area: searchParams.area,
    days: searchParams.days,
    time: searchParams.time,
    gender: searchParams.gender as Gender | undefined,
    format: searchParams.format as TeachingFormat | undefined,
    minRating: searchParams.minRating ? Number(searchParams.minRating) : undefined,
    priceMin: searchParams.priceMin ? Number(searchParams.priceMin) : undefined,
    priceMax: searchParams.priceMax ? Number(searchParams.priceMax) : undefined,
    sort: (searchParams.sort as CoachListQuery['sort']) || undefined,
    // Cumulative paging: page=1 luôn, pageSize = pageNum*12 (Tải thêm → tăng pageNum)
    page: 1,
    pageSize: (searchParams.page ? Number(searchParams.page) : 1) * 12,
  };
}

const DAY_TO_DOW: Record<string, number> = { cn: 0, t2: 1, t3: 2, t4: 3, t5: 4, t6: 5, t7: 6 };

function bucketOf(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Flow 1 — lọc coach theo lịch rảnh của learner.
 * Match qua open sessions (tránh circular import ở mock layer).
 * Trả về set coachId có ≥1 buổi khớp ngày + khung giờ đã chọn.
 */
async function coachIdsMatchingSchedule(days?: string, time?: string): Promise<Set<string> | null> {
  if (!days && !time) return null;
  const wantDows = days
    ? new Set(days.split(',').map((d) => DAY_TO_DOW[d.trim()]).filter((n) => n !== undefined))
    : null;
  const sessions = await openSessionService.list({ scope: 'upcoming' }).catch(() => []);
  const ids = new Set<string>();
  for (const s of sessions) {
    if (s.status !== 'open') continue;
    const d = new Date(s.startsAt);
    if (wantDows && !wantDows.has(d.getDay())) continue;
    if (time && bucketOf(d.getHours()) !== time) continue;
    ids.add(s.coachId);
  }
  return ids;
}

export default async function CoachesPage({ searchParams }: PageProps) {
  const query = toQuery(searchParams);
  const pageNum = searchParams.page ? Number(searchParams.page) : 1;

  // Song song — server fetch qua service layer (mock vs API tự động)
  const [sports, result, scheduleIds] = await Promise.all([
    sportService.list(),
    coachService.list(query),
    coachIdsMatchingSchedule(query.days, query.time),
  ]);

  // Lọc theo lịch (Flow 1) sau khi đã có danh sách coach
  let items: Coach[] = result.items;
  let total = result.total;
  const scheduleActive = scheduleIds !== null;
  if (scheduleIds) {
    items = items.filter((c) => scheduleIds.has(c.id));
    total = items.length;
  }

  const selectedSport = query.sport ? sports.find((s) => s.slug === query.sport) : undefined;

  return (
    <>
      <CoachHero selectedSport={selectedSport} sports={sports} />

      <div className="coach-list">
        <div className="coach-list__container">
          <CoachToolbar total={total} sports={sports} />

          {items.length === 0 ? (
            <EmptyState
              title="Không tìm thấy HLV nào"
              description={
                scheduleActive
                  ? 'Chưa có coach nào mở lịch khớp khung giờ bạn chọn. Thử bỏ lọc lịch hoặc đổi khung giờ.'
                  : 'Thử mở rộng bộ lọc hoặc xoá lọc để xem thêm.'
              }
            />
          ) : (
            <>
              <div className="coach-list__cards">
                {items.map((coach) => <CoachCard key={coach.id} coach={coach} />)}
              </div>
              <CoachLoadMore page={pageNum} remaining={total - items.length} />
            </>
          )}
        </div>
      </div>

      <CoachCtaStrip />
    </>
  );
}
