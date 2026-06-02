import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'soft' | 'elevated' | 'interactive';
  children: ReactNode;
};

export default function Card({ variant = 'default', className, children, ...rest }: CardProps) {
  return (
    <div className={cn('card', variant !== 'default' && `card--${variant}`, className)} {...rest}>
      {children}
    </div>
  );
}

Card.Body = function CardBody({ small, children }: { small?: boolean; children: ReactNode }) {
  return <div className={cn('card__body', small && 'card__body--sm')}>{children}</div>;
};

Card.Title = function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="card__title">{children}</h3>;
};

Card.Text = function CardText({ children }: { children: ReactNode }) {
  return <p className="card__text">{children}</p>;
};

Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  return <div className="card__footer">{children}</div>;
};
