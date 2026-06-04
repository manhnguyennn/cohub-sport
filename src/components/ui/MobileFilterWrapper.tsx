'use client';

/**
 * Wrap filter sidebar component để có 2 mode:
 *  - Desktop (≥ md): hiển thị inline như aside trong grid
 *  - Mobile (< md): hiện trigger button "Bộ lọc" + drawer khi mở
 *
 * Usage:
 *   <MobileFilterWrapper title="Bộ lọc" activeCount={3}>
 *     <CoachFilterSidebar sports={sports} />
 *   </MobileFilterWrapper>
 */
import { useState, type ReactNode } from 'react';
import MobileDrawer from './MobileDrawer';

type Props = {
  title?: string;
  /** Số filter đang active để show badge */
  activeCount?: number;
  children: ReactNode;
};

export default function MobileFilterWrapper({ title = 'Bộ lọc', activeCount, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger button */}
      <button
        type="button"
        className="mobile-filter-trigger"
        onClick={() => setOpen(true)}
        aria-label={`Mở ${title}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span>{title}</span>
        {activeCount && activeCount > 0 ? <span className="badge">{activeCount}</span> : null}
      </button>

      {/* Inline desktop sidebar — wraps the original filter component */}
      <div className="mobile-filter-wrapper__desktop">
        {children}
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        open={open}
        title={title}
        onClose={() => setOpen(false)}
      >
        <div className="mobile-filter-wrapper__sheet-body">
          {children}
        </div>
      </MobileDrawer>
    </>
  );
}
