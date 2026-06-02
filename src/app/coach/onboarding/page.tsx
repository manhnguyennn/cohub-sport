import { sportService } from '@services/sport.service';
import OnboardingWizard from '@features/onboarding/OnboardingWizard';

export const metadata = { title: 'Đăng ký HLV — Wizard 5 bước' };

export default async function CoachOnboardingPage() {
  const sports = await sportService.list();
  return <OnboardingWizard sports={sports} />;
}
