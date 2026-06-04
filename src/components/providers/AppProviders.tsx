'use client';

/**
 * AppProviders — gom mọi client Context provider để layout.tsx
 * (server component) chỉ cần mount 1 lần.
 *
 * Thứ tự nested:
 *  - PersonaProvider (no deps)
 *  - DemoModeProvider (no deps, listen Ctrl+Shift+D)
 *  - ToastProvider (deps: nothing, dùng cho mọi component bên trong)
 */

// Side-effect: register mock handlers vào registry trên CLIENT bundle.
// Server-side đã register qua layout.tsx, nhưng client component
// (vd: CoachDashboardClient, MyBookings) gọi apiClient ở browser, cần registry sẵn ở client.
import '@mocks/index';

import { PersonaProvider } from '@contexts/PersonaContext';
import { DemoModeProvider } from '@contexts/DemoModeContext';
import { ToastProvider } from '@contexts/ToastContext';
import DemoModePanel from '@components/demo/DemoModePanel';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PersonaProvider>
      <DemoModeProvider>
        <ToastProvider>
          {children}
          {/* Panel ẩn — chỉ render khi mở qua Ctrl+Shift+D */}
          <DemoModePanel />
        </ToastProvider>
      </DemoModeProvider>
    </PersonaProvider>
  );
}
