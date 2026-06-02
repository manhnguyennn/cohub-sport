import type { ReactNode } from 'react';
import { cn } from '@lib/cn';

type BadgeVariant = 'neutral' | 'brand' | 'success' | 'danger' | 'warning' | 'info';

type BadgeProps = {
  variant?: BadgeVariant;
  pill?: boolean;
  children: ReactNode;
  className?: string;
};

export default function Badge({ variant = 'neutral', pill, className, children }: BadgeProps) {
  return (
    <span className={cn('badge', `badge--${variant}`, pill && 'badge--pill', className)}>
      {children}
    </span>
  );
}
