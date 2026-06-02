import PlaceholderPage from '@components/layout/PlaceholderPage';

export const metadata = { title: 'Admin CRM' };

export default function AdminPage() {
  return (
    <PlaceholderPage
      icon="🛡️"
      title="Admin CRM"
      description="Quản lý users, coaches, orders, approval. Cần auth role=admin."
    />
  );
}
