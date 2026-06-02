import type { ReactNode } from 'react';
import { cn } from '@lib/cn';

type SectionProps = {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
};

export default function Section({ children, className, dark, id }: SectionProps) {
  return (
    <section id={id} className={cn('section', dark && 'section--dark', className)}>
      {children}
    </section>
  );
}
