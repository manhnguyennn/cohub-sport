import { cn } from '@lib/cn';

type TrustStripProps = {
  /** Thêm class wrapper (vd canh lề trong sidebar / footer mobile) */
  className?: string;
};

const ITEMS: { icon: React.ReactNode; label: string }[] = [
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    label: 'Thanh toán an toàn',
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
    label: 'Coach đã xác minh',
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 7v6h6" />
        <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
      </svg>
    ),
    label: 'Hoàn 100% nếu coach huỷ',
  },
];

/**
 * Trust strip dùng chung ở cuối mọi trang conversion-critical (Flow 2 + Flow 3).
 * Spec §5.5 — icon dùng --accent-green, text --text-secondary.
 */
export default function TrustStrip({ className }: TrustStripProps) {
  return (
    <div className={cn('trust-strip', className)} role="note" aria-label="Cam kết của CoHub">
      {ITEMS.map((it) => (
        <span className="trust-strip__item" key={it.label}>
          <span className="trust-strip__icon" aria-hidden>{it.icon}</span>
          {it.label}
        </span>
      ))}
    </div>
  );
}
