import { redirect } from 'next/navigation';

// Legacy path — đã đổi sang /auth/login
export default function LegacyLoginRedirect() {
  redirect('/auth/login');
}
