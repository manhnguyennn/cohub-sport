'use client';

/**
 * Modal huỷ booking — hiển thị refund preview theo policy
 * (PRD §P0.9): ≥24h hoàn 100% / 6-24h hoàn 50% / <6h hoàn 0%.
 *
 * Call backend chỉ khi user xác nhận "Huỷ booking".
 */
import { useMemo, useState } from 'react';
import { Button } from '@components/ui';
import { formatVND } from '@lib/date';
import { bookingService } from '@services/booking.service';
import { useToast } from '@contexts/ToastContext';
import type { Booking, BookingStatus } from '@app-types/booking';

type Props = {
  open: boolean;
  booking: Booking;
  onClose: () => void;
  onCancelled: (status: BookingStatus) => void;
};

function previewRefund(startsAt: string, amount: number) {
  const hoursUntil = (new Date(startsAt).getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntil >= 24) return { percent: 100, label: 'Huỷ trước 24h — hoàn 100%' };
  if (hoursUntil >= 6)  return { percent: 50,  label: 'Huỷ 6-24h trước — hoàn 50%' };
  return                       { percent: 0,   label: 'Huỷ trong 6h — không hoàn' };
}

export default function CancelBookingModal({ open, booking, onClose, onCancelled }: Props) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const preview = useMemo(
    () => previewRefund(booking.startsAt, booking.price.amount),
    [booking.startsAt, booking.price.amount],
  );

  if (!open) return null;

  const refundAmount = Math.floor((booking.price.amount * preview.percent) / 100);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      const res = await bookingService.cancel(booking.id);
      toast.success(res.message);
      onCancelled(res.status);
    } catch {
      toast.error('Huỷ thất bại. Vui lòng thử lại.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="auth-modal__backdrop" onClick={onClose} />
      <div className="auth-modal" role="dialog" aria-label="Huỷ booking">
        <header className="auth-modal__header">
          <strong>Huỷ buổi tập?</strong>
          <button type="button" onClick={onClose} aria-label="Đóng" className="auth-modal__close">×</button>
        </header>

        <div style={{ padding: 20 }}>
          <div style={{
            background: preview.percent === 0 ? 'var(--danger-light)' : preview.percent === 50 ? 'var(--warning-light)' : 'var(--success-light)',
            color: preview.percent === 0 ? 'var(--danger)' : preview.percent === 50 ? 'var(--warning)' : 'var(--success)',
            padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, fontWeight: 600,
          }}>
            {preview.label}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Số tiền đã trả</span>
            <span>{formatVND(booking.price.amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--divider)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Hoàn tiền ({preview.percent}%)</span>
            <strong style={{ color: 'var(--brand)' }}>{formatVND(refundAmount)}</strong>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
            Tiền hoàn sẽ chuyển về phương thức gốc trong 7 ngày làm việc.
          </p>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" block onClick={onClose} disabled={submitting}>
              Giữ lại
            </Button>
            <Button variant="danger" block onClick={handleConfirm} disabled={submitting}>
              {submitting ? 'Đang huỷ…' : 'Xác nhận huỷ'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
