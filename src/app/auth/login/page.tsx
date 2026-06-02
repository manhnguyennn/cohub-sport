import AuthForm from '@features/auth/AuthForm';

export const metadata = { title: 'Đăng nhập' };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
