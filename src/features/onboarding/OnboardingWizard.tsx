'use client';

/**
 * Wizard 5 bước cho coach onboarding (PRD §O1).
 * - Auto-save 5s vào localStorage (NFR SRS)
 * - Validate per-step trước khi sang bước sau
 * - "Lưu nháp" lưu hiện trạng + redirect /coach/dashboard hoặc /
 * - "Xem preview" → /coach/onboarding/preview
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Stepper } from '@components/ui';
import { ROUTES } from '@config/routes';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { EMPTY_DRAFT, readDraft, writeDraft } from '@lib/onboarding-draft';
import type { CoachOnboardingDraft, OnboardingStep } from '@app-types/onboarding';
import type { Sport } from '@app-types/sport';
import Step1Basic       from './steps/Step1Basic';
import Step2Expertise   from './steps/Step2Expertise';
import Step3Bio         from './steps/Step3Bio';
import Step4Area        from './steps/Step4Area';
import Step5Price       from './steps/Step5Price';

const STEPS = [
  { id: 1, label: 'Cơ bản' },
  { id: 2, label: 'Chuyên môn' },
  { id: 3, label: 'Bio' },
  { id: 4, label: 'Khu vực' },
  { id: 5, label: 'Giá & Lịch' },
];

export default function OnboardingWizard({ sports }: { sports: Sport[] }) {
  const router = useRouter();
  const { isReady, isLoggedIn, requireLogin } = useAuth();
  const toast = useToast();

  const [draft, setDraft] = useState<CoachOnboardingDraft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  const [savedLabel, setSavedLabel] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) requireLogin({ redirectTo: ROUTES.coachOnboarding });
  }, [isReady, isLoggedIn, requireLogin]);

  // Hydrate from localStorage
  useEffect(() => {
    setDraft(readDraft());
    setHydrated(true);
  }, []);

  // Auto-save 5s (debounced)
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      writeDraft(draft);
      setSavedLabel(`Đã lưu ${new Date().toLocaleTimeString('vi-VN')}`);
    }, 5000);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [draft, hydrated]);

  function patch<K extends keyof CoachOnboardingDraft>(key: K, value: CoachOnboardingDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function goToStep(s: OnboardingStep) {
    setDraft((d) => ({ ...d, currentStep: s }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validateCurrent(): string | null {
    switch (draft.currentStep) {
      case 1:
        if (!draft.step1.fullName?.trim()) return 'Vui lòng nhập họ tên';
        if (!draft.step1.gender)           return 'Vui lòng chọn giới tính';
        if (!draft.step1.birthYear)        return 'Vui lòng chọn năm sinh';
        if (!draft.step1.city)             return 'Vui lòng chọn thành phố';
        return null;
      case 2:
        if (!draft.step2.sports || draft.step2.sports.length === 0) return 'Chọn ít nhất 1 bộ môn';
        if (draft.step2.sports.length > 3) return 'Tối đa 3 bộ môn';
        if (!draft.step2.experienceYears)  return 'Nhập số năm kinh nghiệm';
        if (!draft.step2.level)            return 'Chọn cấp độ chuyên môn';
        return null;
      case 3: {
        const tag = draft.step3.tagline?.trim() ?? '';
        const bio = draft.step3.bio?.trim() ?? '';
        if (tag.length < 10 || tag.length > 80)   return 'Tagline cần 10-80 ký tự';
        if (bio.length < 100 || bio.length > 1500) return 'Bio cần 100-1500 ký tự';
        return null;
      }
      case 4:
        if (!draft.step4.districts || draft.step4.districts.length === 0) return 'Chọn ít nhất 1 khu vực';
        if (draft.step4.districts.length > 5)                              return 'Tối đa 5 khu vực';
        if (!draft.step4.teachingFormats || draft.step4.teachingFormats.length === 0)
          return 'Chọn ít nhất 1 hình thức dạy';
        return null;
      case 5:
        if (!draft.step5.price60) return 'Nhập giá buổi 60 phút';
        if (!draft.step5.availabilityDays || draft.step5.availabilityDays.length === 0)
          return 'Chọn ít nhất 1 ngày trong tuần có thể dạy';
        return null;
    }
    return null;
  }

  function handleNext() {
    const err = validateCurrent();
    if (err) {
      toast.error(err);
      return;
    }
    if (draft.currentStep < 5) {
      goToStep((draft.currentStep + 1) as OnboardingStep);
    } else {
      // Final → save & to preview
      writeDraft(draft);
      router.push(ROUTES.coachOnboardingPreview);
    }
  }

  function handleBack() {
    if (draft.currentStep > 1) goToStep((draft.currentStep - 1) as OnboardingStep);
  }

  function handleSaveDraft() {
    writeDraft(draft);
    toast.success('Đã lưu nháp — bạn có thể quay lại sau');
  }

  if (!isReady || !isLoggedIn || !hydrated) return null;

  const current = draft.currentStep;
  const totalProgress = Math.round(((current - 1) / 5) * 100);

  return (
    <div className="onboarding-wizard">
      <header className="onboarding-wizard__head">
        <div className="onboarding-wizard__head-inner">
          <Link href={ROUTES.becomeCoach} className="onboarding-wizard__exit">← Thoát</Link>
          <div className="onboarding-wizard__progress">
            <div className="onboarding-wizard__progress-bar">
              <span style={{ width: `${totalProgress}%` }} />
            </div>
            <span>Bước {current}/5</span>
          </div>
          {savedLabel && (
            <span className="onboarding-wizard__saved">{savedLabel}</span>
          )}
        </div>
      </header>

      <div className="onboarding-wizard__container">
        <Stepper
          steps={STEPS}
          current={current}
          completed={current - 1}
          onStepClick={(s) => goToStep(s as OnboardingStep)}
        />

        <div className="onboarding-wizard__panel">
          {current === 1 && (
            <Step1Basic value={draft.step1} onChange={(v) => patch('step1', v)} />
          )}
          {current === 2 && (
            <Step2Expertise sports={sports} value={draft.step2} onChange={(v) => patch('step2', v)} />
          )}
          {current === 3 && (
            <Step3Bio value={draft.step3} onChange={(v) => patch('step3', v)} />
          )}
          {current === 4 && (
            <Step4Area value={draft.step4} onChange={(v) => patch('step4', v)} />
          )}
          {current === 5 && (
            <Step5Price value={draft.step5} onChange={(v) => patch('step5', v)} />
          )}
        </div>

        <footer className="onboarding-wizard__footer">
          <div>
            {current > 1 && (
              <Button variant="ghost" onClick={handleBack}>← Quay lại</Button>
            )}
          </div>
          <div className="onboarding-wizard__footer-right">
            <Button variant="secondary" onClick={handleSaveDraft}>Lưu nháp</Button>
            <Button variant="primary" onClick={handleNext}>
              {current === 5 ? 'Xem preview →' : 'Tiếp theo →'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
