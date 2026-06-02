'use client';

/**
 * DemoModeContext — toggles & state cho Demo Mode panel (FSD §5).
 *
 * Panel mở bằng Ctrl+Shift+D hoặc query param ?demo=1.
 * Toggles persist trong sessionStorage (reset khi đóng tab — không "leak" sang user thật).
 *
 * Component đọc toggle qua useDemoMode():
 *   const { forcePaymentFail, accelerateTimers } = useDemoMode();
 *
 *   // Apply trong logic:
 *   const delay = accelerateTimers ? 1000 : 5000;
 */
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';

export type DemoModeToggles = {
  /** Mọi fake payment sau toggle này = fail */
  forcePaymentFail: boolean;
  /** Loading state slow để demo skeleton */
  slowNetwork: boolean;
  /** Coach KHÔNG auto-confirm sau 3s (demo flow 12h chờ) */
  coachAutoConfirmOff: boolean;
  /** Investor mode: chế độ perfect path — disable error, 5s → 1s */
  investorMode: boolean;
};

type DemoModeContextValue = {
  isPanelOpen: boolean;
  isEnabled: boolean;          // panel đã từng mở/được bật ít nhất 1 lần
  toggles: DemoModeToggles;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setToggle: <K extends keyof DemoModeToggles>(key: K, value: DemoModeToggles[K]) => void;
  resetAll: () => void;
  /**
   * Wrap timeout: nếu investorMode → chia 5x, nếu slowNetwork → ×3
   * Dùng cho mọi mock delay trong app.
   */
  withDelay: (defaultMs: number) => number;
};

const DEFAULT_TOGGLES: DemoModeToggles = {
  forcePaymentFail: false,
  slowNetwork: false,
  coachAutoConfirmOff: false,
  investorMode: false,
};

const KEY_TOGGLES = 'cohub:demo:toggles';

const DemoModeContext = createContext<DemoModeContextValue | undefined>(undefined);

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [toggles, setToggles] = useState<DemoModeToggles>(DEFAULT_TOGGLES);

  // Hydrate from sessionStorage + URL ?demo=1
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = sessionStorage.getItem(KEY_TOGGLES);
      if (stored) {
        setToggles({ ...DEFAULT_TOGGLES, ...JSON.parse(stored) });
        setIsEnabled(true);
      }
    } catch { /* ignore */ }

    // Auto-open via ?demo=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') {
      setIsPanelOpen(true);
      setIsEnabled(true);
    }
  }, []);

  // Persist toggles
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isEnabled) return;
    try {
      sessionStorage.setItem(KEY_TOGGLES, JSON.stringify(toggles));
    } catch { /* ignore */ }
  }, [toggles, isEnabled]);

  // Global hotkey: Ctrl+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsPanelOpen((v) => !v);
        setIsEnabled(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const setToggle = useCallback(<K extends keyof DemoModeToggles>(key: K, value: DemoModeToggles[K]) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setToggles(DEFAULT_TOGGLES);
    if (typeof window !== 'undefined') {
      try { sessionStorage.removeItem(KEY_TOGGLES); } catch { /* ignore */ }
    }
  }, []);

  const withDelay = useCallback((defaultMs: number): number => {
    if (toggles.investorMode) return Math.max(200, Math.floor(defaultMs / 5));
    if (toggles.slowNetwork)  return defaultMs * 3;
    return defaultMs;
  }, [toggles.investorMode, toggles.slowNetwork]);

  const value = useMemo<DemoModeContextValue>(() => ({
    isPanelOpen,
    isEnabled,
    toggles,
    openPanel: () => { setIsPanelOpen(true); setIsEnabled(true); },
    closePanel: () => setIsPanelOpen(false),
    togglePanel: () => { setIsPanelOpen((v) => !v); setIsEnabled(true); },
    setToggle,
    resetAll,
    withDelay,
  }), [isPanelOpen, isEnabled, toggles, setToggle, resetAll, withDelay]);

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
}

export function useDemoMode(): DemoModeContextValue {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error('useDemoMode() must be used inside <DemoModeProvider>');
  return ctx;
}
