'use client';

/**
 * Preview profile như learner thấy + button Submit.
 * Submit → status 'pending_basic_review' → 5s background auto-approve
 * → toast "Profile đang online" → redirect /coach/dashboard (mock)
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { useDemoMode } from '@contexts/DemoModeContext';
import { onboardingService } from '@services/onboarding.service';
import { clearDraft, EMPTY_DRAFT, readDraft } from '@lib/onboarding-draft';
import { formatVND } from '@lib/date';
import type { CoachOnboardingDraft } from '@app-types/onboarding';

export default function OnboardingPreview() {
  const router = useRouter();
  const { isReady, isLoggedIn, requireLogin } = useAuth();
  const toast = useToast();
  const { withDelay } = useDemoMode();

  const [draft, setDraft] = useState<CoachOnboardingDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  const [stage, setStage] = useState<'preview' | 'submitting' | 'pending' | 'approved'>('preview');

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      requireLogin({ redirectTo: ROUTES.coachOnboardingPreview });
      return;
    }
    const d = readDraft();
    setDraft(d);
    setHydrated(true);
  }, [isReady, isLoggedIn, requireLogin]);

  if (!isReady || !isLoggedIn || !hydrated) return null;

  const { step1, step2, step3, step4, step5 } = draft;
  const isEmpty = !step1.fullName;

  async function handleSubmit() {
    setStage('submitting');
    try {
      await onboardingService.submitBasicReview(draft);
      setStage('pending');

      // Auto-approve sau 5s (qua withDelay → investor mode 1s)
      const reviewDelay = withDelay(5000);
      setTimeout(() => {
        setStage('approved');
        clearDraft();
        toast.success('Profile của bạn đã online! Tạo khoá học để thu hút học viên.', {
          title: 'Đã duyệt',
          duration: 6000,
        });
        // Auto redirect dashboard sau 1.5s
        setTimeout(() => router.push(ROUTES.coachCms), 1500);
      }, reviewDelay);
    } catch {
      toast.error('Gửi review thất bại. Vui lòng thử lại.');
      setStage('preview');
    }
  }

  if (isEmpty) {
    return (
      <div className="booking-form-page">
        <div className="booking-form-page__container">
          <div style={{ textAlign: 'center', padding: 48 }}>
            <h1>Chưa có thông tin profile</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '12px 0 20px' }}>
              Vui lòng quay lại wizard để điền thông tin.
            </p>
            <Button href={ROUTES.coachOnboarding} variant="primary">Quay lại wizard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-preview">
      {/* Status banner */}
      <header className="onboarding-preview__banner">
        <div className="onboarding-preview__banner-inner">
          <Link href={ROUTES.coachOnboarding} className="onboarding-preview__edit">← Sửa thông tin</Link>
          <div className="onboarding-preview__banner-status">
            {stage === 'preview' && <span><AppIcon name="eye" size={15} /> Đây là cách học viên thấy profile của bạn</span>}
            {stage === 'submitting' && <span><AppIcon name="send" size={15} /> Đang gửi review...</span>}
            {stage === 'pending' && (
              <span className="onboarding-preview__pending">
                <AppIcon name="clock" size={15} /> Đang chờ Admin duyệt (Tầng 1, SLA ≤24h)
              </span>
            )}
            {stage === 'approved' && (
              <span className="onboarding-preview__approved"><AppIcon name="check" size={15} /> Đã duyệt — đang chuyển dashboard...</span>
            )}
          </div>
        </div>
      </header>

      {/* Profile preview — giống Coach Detail page nhưng simplified */}
      <section className="onboarding-preview__hero">
        <div className="onboarding-preview__hero-bg" />
        <div className="onboarding-preview__container">
          <div className="onboarding-preview__avatar">
            {step1.avatar ? (
              <Image src={step1.avatar} alt={step1.fullName ?? ''} width={120} height={120} unoptimized />
            ) : (
              <div className="onboarding-preview__avatar-placeholder"><AppIcon name="user" size={44} /></div>
            )}
          </div>
          <h1>{step1.fullName}</h1>
          {step3.tagline && <p className="onboarding-preview__tagline">{step3.tagline}</p>}

          <div className="onboarding-preview__meta">
            {step1.city && <span><AppIcon name="location" size={14} /> {step1.city}</span>}
            {step2.experienceYears && <span><AppIcon name="cup" size={14} /> {step2.experienceYears} năm kinh nghiệm</span>}
            {step2.level && <span><AppIcon name="teacher" size={14} /> {labelLevel(step2.level)}</span>}
          </div>
        </div>
      </section>

      <div className="onboarding-preview__container onboarding-preview__body">
        <div className="onboarding-preview__grid">
          <main className="onboarding-preview__main">
            {step3.bio && (
              <section>
                <h2>Giới thiệu</h2>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{step3.bio}</p>
              </section>
            )}

            {step2.sports && step2.sports.length > 0 && (
              <section>
                <h2>Bộ môn dạy</h2>
                <div className="onboarding-preview__chips">
                  {step2.sports.map((s) => (
                    <span key={s} className="onboarding-preview__chip">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {step3.approach && (
              <section>
                <h2>Phương pháp</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{step3.approach}</p>
              </section>
            )}

            {step3.achievements && (
              <section>
                <h2>Thành tích</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{step3.achievements}</p>
              </section>
            )}

            {step3.portfolioImages && step3.portfolioImages.length > 0 && (
              <section>
                <h2>Portfolio</h2>
                <div className="onboarding-preview__portfolio">
                  {step3.portfolioImages.map((url, i) => (
                    <div key={i} className="onboarding-preview__portfolio-item">
                      <Image src={url} alt="" fill sizes="200px" style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {step4.districts && step4.districts.length > 0 && (
              <section>
                <h2>Khu vực dạy</h2>
                <div className="onboarding-preview__chips">
                  {step4.districts.map((d) => (
                    <span key={d} className="onboarding-preview__chip">{d}</span>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sticky booking-like CTA + submit button */}
          <aside className="onboarding-preview__aside">
            <div className="course-detail-aside__card">
              {step5.price60 != null && (
                <div className="course-detail-aside__price">
                  <small>Học phí từ</small>
                  <strong>{formatVND(step5.price60)}</strong>
                  <small>/buổi 60 phút</small>
                </div>
              )}

              <Button variant="primary" block disabled>
                Đặt lịch (preview)
              </Button>

              <hr style={{ border: 0, borderTop: '1px solid var(--divider)', margin: '8px 0' }} />

              {stage === 'preview' && (
                <Button variant="primary" size="lg" block onClick={handleSubmit}>
                  <AppIcon name="send" size={16} /> Gửi review để online
                </Button>
              )}
              {(stage === 'submitting' || stage === 'pending') && (
                <Button variant="secondary" size="lg" block disabled>
                  {stage === 'submitting' ? 'Đang gửi…' : 'Chờ duyệt — Tầng 1'}
                </Button>
              )}
              {stage === 'approved' && (
                <Button variant="primary" size="lg" block disabled>
                  ✓ Đã duyệt — Đang chuyển dashboard
                </Button>
              )}

              <p className="booking-form__policy" style={{ marginTop: 0 }}>
                Mock: Admin sẽ duyệt trong 5s (1s nếu bật Investor Mode).
                Thực tế: SLA ≤ 24h.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function labelLevel(level: string): string {
  switch (level) {
    case 'beginner':     return 'Beginner';
    case 'intermediate': return 'Intermediate';
    case 'advanced':     return 'Advanced';
    case 'professional': return 'Professional Coach';
    default:             return level;
  }
}
