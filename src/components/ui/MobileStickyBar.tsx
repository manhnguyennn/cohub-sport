'use client';

/**
 * Sticky bottom action bar — hiển thị duy nhất trên mobile (< 768px).
 *
 * Pattern: thông tin tóm tắt bên trái (giá, label) + CTA bên phải.
 * Dùng cho /coaches/[id], /courses/[id], booking detail...
 *
 * SCSS class trong _responsive.scss:
 *   .mobile-sticky-bar (display: none → flex ở mobile)
 *
 * Body cha cần có `.bottom-safe-pad` để dành chỗ scroll cuối page.
 */
import type { ReactNode } from 'react';

type Props = {
  /** Nội dung bên trái — thường là giá + label */
  info: ReactNode;
  /** Action bên phải — Button hoặc Link */
  action: ReactNode;
  className?: string;
};

export default function MobileStickyBar({ info, action, className }: Props) {
  return (
    <div className={`mobile-sticky-bar ${className ?? ''}`} role="region" aria-label="Hành động chính">
      <div className="mobile-sticky-bar__info">{info}</div>
      <div className="mobile-sticky-bar__action">{action}</div>
    </div>
  );
}
