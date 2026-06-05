import { Button } from '@components/ui';
import AppIcon, { type AppIconName } from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';

type PlaceholderPageProps = {
  icon?: AppIconName;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export default function PlaceholderPage({
  icon = 'setting',
  title,
  description,
  primaryHref = ROUTES.home,
  primaryLabel = 'Về trang chủ',
}: PlaceholderPageProps) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-page__icon"><AppIcon name={icon} size={44} /></div>
      <h1 className="placeholder-page__title">{title}</h1>
      <p className="placeholder-page__subtitle">{description}</p>
      <div className="placeholder-page__actions">
        <Button href={primaryHref} variant="primary">{primaryLabel}</Button>
        <Button href={ROUTES.coaches} variant="secondary">Tìm HLV</Button>
      </div>
    </div>
  );
}
