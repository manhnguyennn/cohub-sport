import { redirect } from 'next/navigation';

// Legacy path — đã chuyển sang /become-coach
export default function LegacyRegisterCoachRedirect() {
  redirect('/become-coach');
}
