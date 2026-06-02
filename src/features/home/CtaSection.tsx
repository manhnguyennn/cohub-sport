import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';

export default function CtaSection() {
  return (
    <section className="home-cta">
      <div className="home-cta__container">
        <h2 className="home-cta__title">Sẵn sàng bứt phá?</h2>
        <p className="home-cta__subtitle">
          Đăng ký miễn phí. Trải nghiệm buổi học đầu tiên không rủi ro.
        </p>
        <div className="home-cta__actions">
          <Button href={ROUTES.register} variant="secondary" size="lg">
            Đăng ký người học
          </Button>
          <Button href={ROUTES.registerCoach} variant="primary" size="lg">
            Trở thành HLV
          </Button>
        </div>
      </div>
    </section>
  );
}
