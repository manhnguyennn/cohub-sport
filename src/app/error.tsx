'use client';

import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-page__icon"><AppIcon name="warning" size={44} /></div>
      <h1 className="placeholder-page__title">Có lỗi xảy ra</h1>
      <p className="placeholder-page__subtitle">{error.message}</p>
      <div className="placeholder-page__actions">
        <Button variant="primary" onClick={reset}>
          Thử lại
        </Button>
      </div>
    </div>
  );
}
