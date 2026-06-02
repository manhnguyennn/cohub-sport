'use client';

import { cn } from '@lib/cn';

type StepperProps = {
  steps: { id: number; label: string }[];
  current: number;
  /** Step nào đã được visit / completed (số) */
  completed?: number;
  onStepClick?: (step: number) => void;
};

export default function Stepper({ steps, current, completed = 0, onStepClick }: StepperProps) {
  return (
    <ol className="stepper" aria-label="Onboarding progress">
      {steps.map((s, i) => {
        const isDone = s.id <= completed;
        const isCurrent = s.id === current;
        const isClickable = onStepClick && (isDone || isCurrent);
        return (
          <li
            key={s.id}
            className={cn(
              'stepper__item',
              isDone && 'stepper__item--done',
              isCurrent && 'stepper__item--current',
              isClickable && 'stepper__item--clickable',
            )}
          >
            <button
              type="button"
              className="stepper__dot"
              onClick={() => isClickable && onStepClick?.(s.id)}
              disabled={!isClickable}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {isDone ? '✓' : s.id}
            </button>
            <span className="stepper__label">{s.label}</span>
            {i < steps.length - 1 && <span className="stepper__line" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
