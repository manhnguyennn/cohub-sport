import type { Metadata } from 'next';
import SiteChrome from '@components/layout/SiteChrome';
import AppProviders from '@components/providers/AppProviders';

// Side-effect import — registers all mock handlers into apiClient registry.
// Khi đổi sang real API (NEXT_PUBLIC_DATA_SOURCE=api), import này thành no-op
// vì apiClient.realCall() được gọi thay vì mockCall().
import '@mocks/index';

import '../styles/globals.scss';

export const metadata: Metadata = {
  title: {
    default: 'CoHub — Tìm HLV chuyên môn 1-1',
    template: '%s | CoHub',
  },
  description:
    'Marketplace kết nối bạn với HLV thể thao, công nghệ và phát triển bản thân. Booking 1-1, lịch linh hoạt.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="/fonts.css" />
      </head>
      <body>
        <AppProviders>
          <SiteChrome>{children}</SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
