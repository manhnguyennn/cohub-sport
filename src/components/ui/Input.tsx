'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  size?: 'sm' | 'md' | 'lg';
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = 'md', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn('input', size !== 'md' && `input--${size}`, className)}
      {...rest}
    />
  );
});

export default Input;
