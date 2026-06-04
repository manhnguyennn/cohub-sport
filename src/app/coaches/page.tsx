import { coachService } from '@services/coach.service';
import { sportService } from '@services/sport.service';
import CoachHero from '@features/coaches/components/CoachHero';
import CoachFilterSidebar from '@features/coaches/components/CoachFilterSidebar';
import CoachListHeader from '@features/coaches/components/CoachListHeader';
import CoachListItem from '@features/coaches/components/CoachListItem';
import CoachCtaStrip from '@features/coaches/components/CoachCtaStrip';
import { EmptyState, MobileFilterWrapper } from '@components/ui';
import type { CoachListQuery, Gender, TeachingFormat } from '@app-types/coach';

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
    gender: searchParams.gender as Gender | undefined,
    format: searchParams.format as TeachingFormat | undefined,
    minRating: searchParams.minRating ? Number(searchParams.minRating) : undefined,
    priceMin: searchParams.priceMin ? Number(searchParams.priceMin) : undefined,
    priceMax: searchParams.priceMax ? Number(searchParams.priceMax) : undefined,
    sort: (searchParams.sort as CoachListQuery['sort']) || undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
    pageSize: 12,
  };
}

export default async function CoachesPage({ searchParams }: PageProps) {
  const query = toQuery(searchParams);

  // Song song — server fetch qua service layer (mock vs API tự động)
  const [sports, result] = await Promise.all([
    sportService.list(),
    coachService.list(query),
  ]);

  const selectedSport = query.sport ? sports.find((s) => s.slug === query.sport) : undefined;

  return (
    <>
      <CoachHero selectedSport={selectedSport} sports={sports} />

      <div className="coach-list">
        <div className="coach-list__container">
          <div className="coach-list__grid">
            <MobileFilterWrapper title="Bộ lọc HLV">
              <CoachFilterSidebar sports={sports} />
            </MobileFilterWrapper>

            <div className="coach-list__content">
              <CoachListHeader total={result.total} />

              {result.items.length === 0 ? (
                <EmptyState
                  title="Không tìm thấy HLV nào"
                  description="Thử mở rộng bộ lọc hoặc xoá lọc để xem thêm."
                />
              ) : (
                result.items.map((coach) => <CoachListItem key={coach.id} coach={coach} />)
              )}
            </div>
          </div>
        </div>
      </div>

      <CoachCtaStrip />
    </>
  );
}
