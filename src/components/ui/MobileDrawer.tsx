'use client';

/**
 * Mobile bottom-sheet drawer. Chỉ render trên mobile (< 768px).
 * Khi `open` = true, hiển thị backdrop + sheet slide-up.
 *
 * Dùng cho filter sidebar, share sheet, action sheet...
 *
 * Note: render mọi viewport nhưng SCSS sẽ hide ở >= 768px.
 */
import { useEffect, type ReactNode } from 'react';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  /** Footer slot (vd: nút Áp dụng / Reset) */
  footer?: ReactNode;
  children: ReactNode;
};

export default function MobileDrawer({ open, title, onClose, footer, children }: Props) {
  // Khoá body scroll khi drawer mở
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label={title}>
      <div className="mobile-drawer__backdrop" onClick={onClose} aria-hidden />
      <div className="mobile-drawer__sheet">
        <div className="mobile-drawer__handle" aria-hidden />
        <header className="mobile-drawer__header">
          <h3>{title}</h3>
          <button type="button" className="mobile-drawer__close" onClick={onClose} aria-label="Đóng">×</button>
        </header>
        <div className="mobile-drawer__body">{children}</div>
        {footer && <footer className="mobile-drawer__footer">{footer}</footer>}
      </div>
    </div>
  );
}
