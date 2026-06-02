'use client';

/**
 * AuthForm — shared component cho /auth/login và /auth/signup.
 * Tab: SĐT (gửi OTP) | Google (modal persona picker — FSD §3.5)
 */
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';
import { cn } from '@lib/cn';
import { usePersona } from '@contexts/PersonaContext';
import { useToast } from '@contexts/ToastContext';
import { personas, PERSONA_KEYS } from '@mocks/personas.mock';
import type { PersonaKey } from '@app-types/persona';

type Mode = 'login' | 'signup';

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const sp = useSearchParams();
  const nextPath = sp.get('next') ?? ROUTES.home;

  const [tab, setTab] = useState<'phone' | 'google'>('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const { switchPersona } = usePersona();
  const toast = useToast();

  function handleSubmitPhone(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!/^\+?\d{9,12}$/.test(cleaned)) {
      setPhoneError('Số điện thoại không hợp lệ (9-12 chữ số)');
      return;
    }
    setPhoneError(null);
    // → /auth/otp?phone=...&next=...&mode=...
    const params = new URLSearchParams({
      phone: cleaned,
      next: nextPath,
      mode,
    });
    router.push(`${ROUTES.otp}?${params.toString()}`);
  }

  function handlePickPersona(key: PersonaKey) {
    switchPersona(key);
    setGoogleModalOpen(false);
    toast.success(`Đăng nhập thành công — ${personas[key].displayLabel}`);
    router.push(nextPath);
  }

  const title    = mode === 'login' ? 'Đăng nhập CoHub' : 'Tạo tài khoản CoHub';
  const subtitle = mode === 'login'
    ? 'Tiếp tục hành trình rèn luyện của bạn'
    : 'Kết nối với HLV phù hợp chỉ trong vài phút';
  const altText  = mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?';
  const altLink  = mode === 'login' ? ROUTES.register : ROUTES.login;
  const altLabel = mode === 'login' ? 'Đăng ký' : 'Đăng nhập';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{title}</h1>
        <p className="auth-card__subtitle">{subtitle}</p>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'phone'}
            className={cn('auth-tabs__btn', tab === 'phone' && 'auth-tabs__btn--active')}
            onClick={() => setTab('phone')}
          >
            Số điện thoại
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'google'}
            className={cn('auth-tabs__btn', tab === 'google' && 'auth-tabs__btn--active')}
            onClick={() => setTab('google')}
          >
            Google
          </button>
        </div>

        {tab === 'phone' ? (
          <form onSubmit={handleSubmitPhone} className="auth-form">
            <label className="auth-form__label" htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="VD: 0901 234 567"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setPhoneError(null); }}
              className={cn('auth-form__input', phoneError && 'auth-form__input--error')}
              autoComplete="tel"
            />
            {phoneError && <span className="auth-form__error">{phoneError}</span>}

            <Button type="submit" variant="primary" size="lg" block>
              Gửi mã OTP
            </Button>

            <p className="auth-form__legal">
              Tiếp tục đồng nghĩa bạn đồng ý với{' '}
              <Link href="/terms">Điều khoản dịch vụ</Link> và{' '}
              <Link href="/privacy">Chính sách bảo mật</Link>.
            </p>
          </form>
        ) : (
          <div className="auth-form">
            <button
              type="button"
              className="auth-google"
              onClick={() => setGoogleModalOpen(true)}
            >
              <GoogleIcon /> Tiếp tục với Google
            </button>
            <p className="auth-form__legal">
              MVP demo: bấm để chọn 1 trong 3 persona thử nghiệm.
            </p>
          </div>
        )}

        <div className="auth-card__footer">
          {altText} <Link href={altLink} className="auth-card__alt">{altLabel}</Link>
        </div>
      </div>

      {googleModalOpen && (
        <PersonaPickerModal
          onPick={handlePickPersona}
          onClose={() => setGoogleModalOpen(false)}
        />
      )}
    </div>
  );
}

// ── Google persona picker modal ───────────────────────────────
function PersonaPickerModal({
  onPick,
  onClose,
}: {
  onPick: (key: PersonaKey) => void;
  onClose: () => void;
}) {
  const real = PERSONA_KEYS.filter((k) => k !== 'guest');

  return (
    <>
      <div className="auth-modal__backdrop" onClick={onClose} />
      <div className="auth-modal" role="dialog" aria-label="Chọn tài khoản demo">
        <header className="auth-modal__header">
          <strong>Chọn tài khoản demo</strong>
          <button type="button" onClick={onClose} aria-label="Đóng" className="auth-modal__close">×</button>
        </header>
        <div className="auth-modal__list">
          {real.map((key) => {
            const p = personas[key];
            return (
              <button
                key={key}
                type="button"
                className="auth-modal__item"
                onClick={() => onPick(key)}
              >
                <strong>{p.displayLabel}</strong>
                <small>{p.description}</small>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.22-4.74 3.22-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.97 6.97 0 0 1 5.47 12c0-.73.13-1.44.37-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
