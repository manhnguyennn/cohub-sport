import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';

export default function NotFound() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-page__icon">🔍</div>
      <h1 className="placeholder-page__title">404 — Không tìm thấy</h1>
      <p className="placeholder-page__subtitle">Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
      <div className="placeholder-page__actions">
        <Button href={ROUTES.home} variant="primary">
          Về trang chủ
        </Button>
        <Button href={ROUTES.coaches} variant="secondary">
          Tìm HLV
        </Button>
      </div>
    </div>
  );
}
