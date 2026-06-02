import { apiClient } from '@lib/apiClient';
import type { CoachOnboardingDraft, OnboardingStatus } from '@app-types/onboarding';

type SubmitResult = {
  status: OnboardingStatus;
  submittedAt: string;
  estimatedReviewSeconds: number;
};

export const onboardingService = {
  submitBasicReview: (draft: CoachOnboardingDraft): Promise<SubmitResult> =>
    apiClient.post('/coaches/onboarding/submit', draft),

  submitVerification: (input: { idImages: string[]; selfie?: string; certificates: { name: string; year: number }[] }): Promise<SubmitResult> =>
    apiClient.post('/coaches/verification/submit', input),
};
