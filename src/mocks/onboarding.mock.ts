import { registerMock } from '@lib/mockRegistry';
import type { CoachOnboardingDraft, OnboardingStatus } from '@app-types/onboarding';

/**
 * Onboarding mock — luôn trả 'pending_basic_review' → client wait + setStatus.
 * Auto-approve logic xử lý ở client (qua withDelay từ Demo Mode).
 */
registerMock('POST /coaches/onboarding/submit', ({ body }) => {
  const draft = body as CoachOnboardingDraft;
  return {
    status: 'pending_basic_review' as OnboardingStatus,
    submittedAt: new Date().toISOString(),
    estimatedReviewSeconds: 5,
    draft,
  };
});

/**
 * Tier 2 verification submit (KYC + cert).
 * Mock luôn pass sau eKYC 4s.
 */
registerMock('POST /coaches/verification/submit', () => ({
  status: 'pending_verification' as OnboardingStatus,
  submittedAt: new Date().toISOString(),
  estimatedReviewSeconds: 4,
}));
