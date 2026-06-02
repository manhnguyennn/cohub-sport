/**
 * Coach onboarding draft state (PRD §O1).
 * 5 bước → 5 partial sections; user có thể save & resume.
 *
 * Status state machine (PRD §O0-O9):
 *   SIGNED_UP → PROFILE_DRAFT → PENDING_BASIC_REVIEW → ACTIVE_UNVERIFIED → ACTIVE_VERIFIED
 *   Nhánh: REJECTED, SUSPENDED
 */
import type { Gender, TeachingFormat } from './coach';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export type OnboardingStatus =
  | 'signed_up'             // mới đăng ký, chưa start wizard
  | 'profile_draft'         // đang điền wizard, chưa submit
  | 'pending_basic_review'  // submit, đang chờ admin Tầng 1 (mock 5s)
  | 'active_unverified'     // pass Tầng 1, profile public, chưa verified
  | 'pending_verification'  // submit verification, chờ Tầng 2 (mock 4s)
  | 'active_verified'       // pass Tầng 2, có badge xanh
  | 'rejected';

// ── Step 1: Thông tin cơ bản ──────────────────────────────────
export type OnboardingStep1 = {
  avatar?: string;            // object URL (mock — không upload thật)
  fullName: string;
  gender?: Gender;
  birthYear?: number;
  city?: string;
};

// ── Step 2: Chuyên môn ────────────────────────────────────────
export type OnboardingStep2 = {
  sports: string[];           // sport slug (max 3)
  experienceYears?: number;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  targetAudience?: string[];  // ["beginner", "weight_loss", "muscle_gain", ...]
};

// ── Step 3: Bio ───────────────────────────────────────────────
export type OnboardingStep3 = {
  tagline: string;            // 10-80 chars
  bio: string;                // 100-1500 chars
  approach?: string;          // phương pháp
  achievements?: string;
  videoUrl?: string;
  portfolioImages: string[];  // object URLs
};

// ── Step 4: Khu vực & Hình thức dạy ──────────────────────────
export type OnboardingStep4 = {
  districts: string[];        // max 5
  teachingFormats: TeachingFormat[];   // ít nhất 1
};

// ── Step 5: Giá & Lịch ────────────────────────────────────────
export type OnboardingStep5 = {
  price60: number;
  price90?: number;
  priceGroup?: number;
  /** Lịch trống mặc định — mock: chỉ là array các weekday đánh dấu */
  availabilityDays: number[]; // [1,2,3,4,5]
};

export type CoachOnboardingDraft = {
  step1: Partial<OnboardingStep1>;
  step2: Partial<OnboardingStep2>;
  step3: Partial<OnboardingStep3>;
  step4: Partial<OnboardingStep4>;
  step5: Partial<OnboardingStep5>;
  /** Bước hiện tại đang ở */
  currentStep: OnboardingStep;
  /** Lần auto-save gần nhất (display "Đã lưu 5s trước") */
  lastSavedAt?: string;
};

/** Anti-PII detect result */
export type PiiDetection = {
  hasIssue: boolean;
  issues: ('phone' | 'url' | 'social_link')[];
  message?: string;
};
