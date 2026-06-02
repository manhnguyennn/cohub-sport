/**
 * Draft auto-save cho coach onboarding wizard.
 * localStorage để persist qua reload (NFR SRS auto-save 5s).
 */
import type { CoachOnboardingDraft, PiiDetection } from '@app-types/onboarding';

const KEY = 'cohub:coach_onboarding_draft';

export const EMPTY_DRAFT: CoachOnboardingDraft = {
  step1: {},
  step2: { sports: [], targetAudience: [] },
  step3: { tagline: '', bio: '', portfolioImages: [] },
  step4: { districts: [], teachingFormats: [] },
  step5: { availabilityDays: [] },
  currentStep: 1,
};

export function readDraft(): CoachOnboardingDraft {
  if (typeof window === 'undefined') return EMPTY_DRAFT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY_DRAFT, ...(JSON.parse(raw) as CoachOnboardingDraft) } : EMPTY_DRAFT;
  } catch { return EMPTY_DRAFT; }
}

export function writeDraft(draft: CoachOnboardingDraft): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...draft, lastSavedAt: new Date().toISOString() }));
  } catch { /* ignore */ }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// ── Anti-PII detector (PRD §O1.3) ────────────────────────────
const RE_PHONE_VN = /(\+?84|0)\s?[\-\.]?\s?(\d[\s\-\.]?){9,10}/;
const RE_URL = /\bhttps?:\/\/[^\s]+|www\.[^\s]+/i;
const RE_SOCIAL = /\b(zalo|telegram|messenger|facebook|whatsapp|viber|fb\.com|t\.me|m\.me)\b/i;

export function detectPii(text: string): PiiDetection {
  const issues: PiiDetection['issues'] = [];
  if (RE_PHONE_VN.test(text)) issues.push('phone');
  if (RE_URL.test(text)) issues.push('url');
  if (RE_SOCIAL.test(text)) issues.push('social_link');

  if (issues.length === 0) return { hasIssue: false, issues };

  const labels = issues.map((i) =>
    i === 'phone' ? 'số điện thoại'
    : i === 'url' ? 'link bên ngoài'
    : 'tên ứng dụng chat (Zalo/Telegram/Messenger…)',
  );
  return {
    hasIssue: true,
    issues,
    message: `Vui lòng không chia sẻ ${labels.join(', ')} trong profile. Giao dịch phải qua CoHub.`,
  };
}
