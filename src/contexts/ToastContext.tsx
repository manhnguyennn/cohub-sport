'use client';

/**
 * Toast notification — global stack hiển thị góc phải dưới.
 *
 * Component dùng qua useToast() hook:
 *   const { toast } = useToast();
 *   toast.success('Đặt buổi thành công');
 *   toast.error('Thanh toán thất bại', { duration: 5000 });
 *   toast.info('Coach Khoa đã xác nhận!', { action: { label: 'Xem', onClick: ... } });
 */
import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastInput = {
  variant?: ToastVariant;
  title?: string;
  message: string;
  duration?: number; // ms, 0 = persistent
  action?: ToastAction;
};

type ToastItem = ToastInput & { id: string };

type ToastContextValue = {
  show: (input: ToastInput) => void;
  dismiss: (id: string) => void;
  /** Shortcuts — call signature: (msg, opts?) */
  success: (msg: string, opts?: Omit<ToastInput, 'message' | 'variant'>) => void;
  error:   (msg: string, opts?: Omit<ToastInput, 'message' | 'variant'>) => void;
  info:    (msg: string, opts?: Omit<ToastInput, 'message' | 'variant'>) => void;
  warning: (msg: string, opts?: Omit<ToastInput, 'message' | 'variant'>) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 3500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const show = useCallback((input: ToastInput) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const duration = input.duration ?? DEFAULT_DURATION;
    setToasts((prev) => [...prev, { ...input, id }]);
    if (duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    }
  }, [dismiss]);

  // Cleanup timers on unmount
  useEffect(() => () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
  }, []);

  const value = useMemo<ToastContextValue>(() => ({
    show,
    dismiss,
    success: (msg, opts) => show({ ...opts, message: msg, variant: 'success' }),
    error:   (msg, opts) => show({ ...opts, message: msg, variant: 'error' }),
    info:    (msg, opts) => show({ ...opts, message: msg, variant: 'info' }),
    warning: (msg, opts) => show({ ...opts, message: msg, variant: 'warning' }),
  }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast() must be used inside <ToastProvider>');
  return ctx;
}

// ── Viewport (UI) ─────────────────────────────────────────────
function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="toast-viewport" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} item={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const variant = item.variant ?? 'info';
  return (
    <div className={`toast toast--${variant}`} role="status">
      <span className="toast__icon" aria-hidden>{iconFor(variant)}</span>
      <div className="toast__body">
        {item.title && <div className="toast__title">{item.title}</div>}
        <div className="toast__message">{item.message}</div>
        {item.action && (
          <button
            type="button"
            className="toast__action"
            onClick={() => {
              item.action!.onClick();
              onDismiss(item.id);
            }}
          >
            {item.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        className="toast__close"
        onClick={() => onDismiss(item.id)}
        aria-label="Đóng"
      >
        ×
      </button>
    </div>
  );
}

function iconFor(v: ToastVariant): string {
  switch (v) {
    case 'success': return '✓';
    case 'error':   return '✕';
    case 'warning': return '!';
    default:        return 'i';
  }
}
