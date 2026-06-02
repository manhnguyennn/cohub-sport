'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, OtpInput } from '@components/ui';
import { ROUTES } from '@config/routes';
import { usePersona } from '@contexts/PersonaContext';
import { useToast } from '@contexts/ToastContext';
import { useDemoMode } from '@contexts/DemoModeContext';

/**
 * /auth/otp — verify 6-digit OTP.
 * FSD §3.5: "111111" → fail. Bất kỳ 6 chữ số khác → pass.
 * Sau pass → switchPersona('linh') default cho demo, redirect ?next.
 */
export default function OtpPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const phone = sp.get('phone') ?? '';
  const nextPath = sp.get('next') ?? ROUTES.home;

  const { switchPersona } = usePersona();
  const toast = useToast();
  const { withDelay } = useDemoMode();

  const [otp, setOtp]   = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(45);

  // Cooldown resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function handleComplete(code: string) {
    if (submitting) return;
    setError(null);

    if (code === '111111') {
      setError('Mã OTP không đúng. Vui lòng thử lại.');
      return;
    }

    setSubmitting(true);
    // Mock verify delay
    setTimeout(() => {
      // Default switch sang Linh (Learner) khi login bằng OTP
      switchPersona('linh');
      toast.success('Xác thực thành công!');
      router.push(nextPath);
    }, withDelay(600));
  }

  function handleResend() {
    if (cooldown > 0) return;
    setCooldown(45);
    toast.info('Mã OTP mới đã được gửi (demo).');
  }

  const maskedPhone = phone
    ? phone.replace(/^(\+?\d{2,3})\d{3,4}(\d{3})$/, '$1•••$2')
    : '••• •••';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Nhập mã OTP</h1>
        <p className="auth-card__subtitle">
          Mã 6 chữ số đã gửi đến <strong>{maskedPhone}</strong>.
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Demo: nhập bất kỳ 6 chữ số khác <code>111111</code> để pass.
          </span>
        </p>

        <OtpInput onChange={(c) => { setOtp(c); if (error) setError(null); }} onComplete={handleComplete} error={!!error} />

        {error && <div className="auth-form__error" style={{ textAlign: 'center', marginTop: 12 }}>{error}</div>}

        <Button
          variant="primary"
          size="lg"
          block
          disabled={otp.length !== 6 || submitting}
          onClick={() => handleComplete(otp)}
          className="auth-form__submit"
        >
          {submitting ? 'Đang xác thực…' : 'Xác nhận'}
        </Button>

        <div className="auth-card__footer">
          {cooldown > 0 ? (
            <>Gửi lại mã sau <strong>{cooldown}s</strong></>
          ) : (
            <button type="button" onClick={handleResend} className="auth-card__alt" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>
              Gửi lại mã OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
