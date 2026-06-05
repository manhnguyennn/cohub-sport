'use client';

import { useState } from 'react';
import { cn } from '@lib/cn';

export type PolicyTier = { label: string; value: string };

type CancellationPolicyProps = {
  /** session = booking 1-1 theo buổi; course = gói khoá học 3 bậc */
  variant?: 'session' | 'course';
  /** Ghi đè tiers nếu cần */
  tiers?: PolicyTier[];
  className?: string;
};

const SESSION_TIERS: PolicyTier[] = [
  { label: 'Huỷ trước 24 giờ', value: 'hoàn 100%' },
  { label: 'Huỷ trong vòng 24 giờ', value: 'hoàn 50%' },
  { label: 'Coach huỷ buổi', value: 'hoàn 100%' },
];

const COURSE_TIERS: PolicyTier[] = [
  { label: 'Trước khai giảng từ 7 ngày', value: 'hoàn 100%' },
  { label: 'Trước khai giảng 48 giờ – 7 ngày', value: 'hoàn 70%' },
  { label: 'Dưới 48 giờ / đã khai giảng', value: 'hoàn theo buổi còn lại' },
];

/**
 * Cancellation policy display dùng chung (spec §5.4).
 * 3 dòng cốt lõi luôn hiển thị — KHÔNG ẩn sau dropdown.
 * Nút "Xem chi tiết" chỉ mở thêm phần lưu ý mở rộng.
 */
export default function CancellationPolicy({
  variant = 'session',
  tiers,
  className,
}: CancellationPolicyProps) {
  const [expanded, setExpanded] = useState(false);
  const rows = tiers ?? (variant === 'course' ? COURSE_TIERS : SESSION_TIERS);

  return (
    <div className={cn('cancel-policy', className)}>
      <div className="cancel-policy__head">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
        </svg>
        Chính sách huỷ
      </div>

      <ul className="cancel-policy__tiers">
        {rows.map((t) => (
          <li key={t.label}>
            <span>{t.label}</span>
            <strong>{t.value}</strong>
          </li>
        ))}
      </ul>

      {expanded && (
        <p className="cancel-policy__detail">
          {variant === 'course'
            ? 'Sau khi khoá học khai giảng, mức hoàn được tính theo số buổi chưa diễn ra. Trường hợp coach huỷ khoá, bạn được hoàn 100% học phí.'
            : 'Nếu coach không xác nhận buổi tập trong thời hạn, hệ thống tự huỷ và hoàn 100%. Mọi khoản hoàn được xử lý về phương thức thanh toán gốc trong 3–5 ngày làm việc.'}
        </p>
      )}

      <button
        type="button"
        className="cancel-policy__toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? 'Thu gọn' : 'Xem chính sách đầy đủ'}
      </button>
    </div>
  );
}
