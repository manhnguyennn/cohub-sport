import AuthForm from '@features/auth/AuthForm';

export const metadata = { title: 'Đăng ký' };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
