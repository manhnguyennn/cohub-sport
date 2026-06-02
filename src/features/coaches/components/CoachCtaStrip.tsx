import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';

export default function CoachCtaStrip() {
  return (
    <section className="coach-cta">
      <div className="coach-cta__container">
        <h2 className="coach-cta__title">
          Nếu bạn đã sẵn sàng bứt phá,<br />
          <span className="text-gradient-green">hãy bắt đầu ngay thôi</span>
        </h2>
        <Button href={ROUTES.coaches} variant="primary" size="lg">
          Tìm kiếm huấn luyện viên
        </Button>
      </div>
    </section>
  );
}
