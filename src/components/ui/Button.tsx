'use client';

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & { href: string; external?: boolean };

type ButtonProps = ButtonAsButton | ButtonAsLink;

function classes(opts: {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
}) {
  const { variant = 'primary', size = 'md', block, className } = opts;
  return cn(
    'btn',
    `btn--${variant}`,
    size !== 'md' && `btn--${size}`,
    block && 'btn--block',
    className,
  );
}

export default function Button(props: ButtonProps) {
  const { variant, size, block, className, children, iconLeft, iconRight } = props;
  const cls = classes({ variant, size, block, className });
  const inner = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if ('href' in props && props.href) {
    if (props.external) {
      return (
        <a href={props.href} className={cls} target="_blank" rel="noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <Link href={props.href} className={cls}>
        {inner}
      </Link>
    );
  }

  const { variant: _v, size: _s, block: _b, className: _c, children: _ch, iconLeft: _il, iconRight: _ir, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
