import { redirect } from 'next/navigation';

// Legacy path — đã đổi sang /auth/signup
export default function LegacyRegisterRedirect() {
  redirect('/auth/signup');
}
