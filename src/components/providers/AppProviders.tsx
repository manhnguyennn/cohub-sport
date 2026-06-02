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
