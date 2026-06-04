import { redirect } from 'next/navigation';

// Legacy path — đã chuyển sang /coach/dashboard
export default function LegacyCoachCmsRedirect() {
  redirect('/coach/dashboard');
}
