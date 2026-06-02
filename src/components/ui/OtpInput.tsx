'use client';

/**
 * 6-cell OTP input.
 * - Auto-focus next ô khi gõ
 * - Backspace lùi
 * - Paste 6 chữ số phân phát cho 6 ô
 * - onComplete(code) khi đủ 6 chữ số
 */
import { useEffect, useRef, useState } from 'react';
import { cn } from '@lib/cn';

type OtpInputProps = {
  length?: number;
  autoFocus?: boolean;
  error?: boolean;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
};

export default function OtpInput({
  length = 6,
  autoFocus = true,
  error = false,
  onComplete,
  onChange,
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  function emitChange(next: string[]) {
    const code = next.join('');
    onChange?.(code);
    if (code.length === length && !next.includes('')) onComplete?.(code);
  }

  function handleChange(idx: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...values];
    next[idx] = digit;
    setValues(next);
    if (digit && idx < length - 1) inputsRef.current[idx + 1]?.focus();
    emitChange(next);
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) inputsRef.current[idx + 1]?.focus();
  }

  function handlePaste(idx: number, e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = [...values];
    for (let i = 0; i < pasted.length && idx + i < length; i++) {
      next[idx + i] = pasted[i];
    }
    setValues(next);
    const focusAt = Math.min(idx + pasted.length, length - 1);
    inputsRef.current[focusAt]?.focus();
    emitChange(next);
  }

  return (
    <div className={cn('otp-input', error && 'otp-input--error')}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => { if (el) inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
