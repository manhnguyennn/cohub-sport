import Link from 'next/link';
import CoachGrid from '@features/coaches/components/CoachGrid';
import { Button } from '@components/ui';
import { coachService } from '@services/coach.service';
import { ROUTES } from '@config/routes';

export default async function FeaturedCoachesSection() {
  const coaches = await coachService.featured();

  return (
    <section className="home-coaches" id="featured-coaches">
      <div className="home-coaches__container">
        <div className="home-coaches__header">
          <div>
            <h2 className="home-categories__title">HLV nổi bật tuần này</h2>
            <p className="home-categories__subtitle">Đã được CoHub xác minh, đánh giá cao bởi học viên.</p>
          </div>
          <Button href={ROUTES.coaches} variant="ghost">
            Xem tất cả →
          </Button>
        </div>

        <CoachGrid coaches={coaches.slice(0, 8)} />
      </div>
    </section>
  );
}
