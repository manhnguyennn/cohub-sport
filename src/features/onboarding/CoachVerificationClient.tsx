'use client';

/**
 * /coach/verification — Tier 2 KYC + chứng chỉ (PRD §O7).
 *
 * 2 phần:
 *  - KYC: upload CCCD front/back + selfie → mô phỏng eKYC 3-step 4s
 *  - Chứng chỉ: multi upload + metadata (tên, năm, tổ chức)
 *
 * Submit → status 'pending_verification' → 4s background → 'active_verified' + toast
 */
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { useDemoMode } from '@contexts/DemoModeContext';
import { onboardingService } from '@services/onboarding.service';
import { cn } from '@lib/cn';

type Cert = { id: string; name: string; org?: string; year: number; file?: string };

const EKYC_STEPS = [
  { id: 1, label: 'OCR thông tin CCCD', icon: '📋' },
  { id: 2, label: 'Face match với selfie', icon: '🔍' },
  { id: 3, label: 'Cross-check chứng chỉ', icon: '✓' },
];

export default function CoachVerificationClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, requireLogin } = useAuth();
  const toast = useToast();
  const { withDelay } = useDemoMode();

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) requireLogin({ redirectTo: ROUTES.coachVerification });
  }, [isReady, isLoggedIn, requireLogin]);

  // KYC files
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  // Certificates
  const [certs, setCerts] = useState<Cert[]>([]);

  // Submission state
  const [stage, setStage] = useState<'idle' | 'submitting' | 'ekyc' | 'done'>('idle');
  const [ekycStep, setEkycStep] = useState(0);

  const canSubmit = front && back && selfie && stage === 'idle';

  function handleFileSet(setter: (url: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setter(URL.createObjectURL(f));
    };
  }

  function addCert() {
    if (certs.length >= 10) return;
    const id = `c_${Date.now()}`;
    setCerts((cs) => [...cs, { id, name: '', year: new Date().getFullYear() }]);
  }

  function updateCert(id: string, patch: Partial<Cert>) {
    setCerts((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCert(id: string) {
    setCerts((cs) => cs.filter((c) => c.id !== id));
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setStage('submitting');
    try {
      await onboardingService.submitVerification({
        idImages: [front!, back!],
        selfie: selfie!,
        certificates: certs.filter((c) => c.name.trim()).map((c) => ({ name: c.name, year: c.year })),
      });

      // eKYC mô phỏng 3-step total 4s (hoặc withDelay)
      setStage('ekyc');
      const total = withDelay(4000);
      const perStep = total / EKYC_STEPS.length;

      for (let i = 0; i < EKYC_STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, perStep));
        setEkycStep(i + 1);
      }

      setStage('done');
      toast.success('Bạn đã được xác minh — badge Verified xuất hiện trên profile.', {
        title: '🎉 Verified Coach',
        duration: 6000,
      });
      setTimeout(() => router.push(ROUTES.coachCms), 1500);
    } catch {
      toast.error('Verification thất bại. Vui lòng thử lại.');
      setStage('idle');
    }
  }

  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="verification-page">
      <div className="verification-page__container">
        <header className="verification-page__head">
          <h1>Xác minh để trở thành Verified Coach</h1>
          <p>
            Pass xác minh → badge xanh trên profile, boost <strong>1.3×</strong> trong search.
            KYC + ít nhất 1 chứng chỉ. SLA xét duyệt: 48h (mock: 4s).
          </p>
        </header>

        {stage === 'ekyc' || stage === 'done' ? (
          <EkycProgress currentStep={stage === 'done' ? EKYC_STEPS.length : ekycStep} />
        ) : (
          <div className="verification-page__grid">
            {/* KYC */}
            <section className="verification-card">
              <header>
                <h2>1. KYC — Định danh cá nhân</h2>
                <p>Upload CCCD/CMND mặt trước, mặt sau và 1 ảnh selfie cầm CCCD.</p>
              </header>

              <div className="verification-card__upload-grid">
                <UploadSlot label="CCCD — Mặt trước" url={front} onChange={handleFileSet(setFront)} />
                <UploadSlot label="CCCD — Mặt sau" url={back} onChange={handleFileSet(setBack)} />
                <UploadSlot label="Selfie cầm CCCD" url={selfie} onChange={handleFileSet(setSelfie)} />
              </div>

              <p className="step-form__hint">
                🔒 Tài liệu được mã hoá at-rest theo Nghị định 13/2023. Không chia sẻ bên thứ 3 ngoài eKYC vendor.
              </p>
            </section>

            {/* Certificates */}
            <section className="verification-card">
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <h2>2. Chứng chỉ chuyên môn (tối đa 10)</h2>
                  <p>Càng nhiều chứng chỉ uy tín, profile càng được tin tưởng.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={addCert} disabled={certs.length >= 10}>
                  + Thêm chứng chỉ
                </Button>
              </header>

              {certs.length === 0 ? (
                <div className="verification-card__cert-empty">
                  Chưa có chứng chỉ nào. <button type="button" onClick={addCert}>Thêm chứng chỉ đầu tiên</button>
                </div>
              ) : (
                <div className="verification-card__cert-list">
                  {certs.map((c) => (
                    <div key={c.id} className="verification-card__cert-row">
                      <input
                        type="text"
                        placeholder="Tên chứng chỉ (VD: ACE Personal Trainer)"
                        value={c.name}
                        onChange={(e) => updateCert(c.id, { name: e.target.value })}
                        className="step-form__input"
                      />
                      <input
                        type="text"
                        placeholder="Tổ chức cấp"
                        value={c.org ?? ''}
                        onChange={(e) => updateCert(c.id, { org: e.target.value })}
                        className="step-form__input"
                      />
                      <input
                        type="number"
                        placeholder="Năm cấp"
                        min={1980}
                        max={new Date().getFullYear()}
                        value={c.year}
                        onChange={(e) => updateCert(c.id, { year: Number(e.target.value) })}
                        className="step-form__input"
                        style={{ maxWidth: 100 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeCert(c.id)}
                        className="verification-card__cert-remove"
                        aria-label="Xoá"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="verification-page__submit">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {stage === 'submitting' ? 'Đang gửi…' : 'Gửi xác minh'}
              </Button>
              <small>Bằng cách gửi, bạn xác nhận tài liệu là của chính bạn và đồng ý cho CoHub xác minh.</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadSlot({ label, url, onChange }: { label: string; url: string | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={cn('verification-card__slot', url && 'is-filled')} onClick={() => inputRef.current?.click()}>
      {url ? (
        <Image src={url} alt={label} fill sizes="200px" style={{ objectFit: 'cover' }} unoptimized />
      ) : (
        <span className="verification-card__slot-placeholder">
          📷 <strong>{label}</strong>
        </span>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onChange} />
    </div>
  );
}

function EkycProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="ekyc-progress">
      <h2>🔄 Đang xử lý eKYC...</h2>
      <p>Vui lòng giữ trang mở. Quá trình mất khoảng 4-5 giây.</p>

      <ol className="ekyc-progress__steps">
        {EKYC_STEPS.map((s, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <li key={s.id} className={cn(isDone && 'is-done', isActive && 'is-active')}>
              <span className="ekyc-progress__icon">{isDone ? '✓' : s.icon}</span>
              <span className="ekyc-progress__label">{s.label}</span>
              {isActive && <span className="ekyc-progress__spinner" aria-hidden />}
            </li>
          );
        })}
      </ol>

      {currentStep >= EKYC_STEPS.length && (
        <div className="ekyc-progress__success">
          <strong>✅ Xác minh thành công!</strong>
          <p>Badge <span style={{ color: 'var(--success)' }}>✓ Verified Coach</span> đã được kích hoạt. Đang chuyển dashboard...</p>
        </div>
      )}
    </div>
  );
}
