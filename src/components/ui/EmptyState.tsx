import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {icon && <div style={{ color: 'var(--text-muted)' }}>{icon}</div>}
      <h3 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 600 }}>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
