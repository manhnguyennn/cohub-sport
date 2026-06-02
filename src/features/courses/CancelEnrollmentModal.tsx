'use client';

import { useMemo, useState } from 'react';
import { Button } from '@components/ui';
import { formatVND } from '@lib/date';
import { enrollmentService } from '@services/course.service';
import { useToast } from '@contexts/ToastContext';
import type { Course, Enrollment } from '@app-types/course';

type Props = {
  open: boolean;
  enrollment: Enrollment;
  course: Course;
  onClose: () => void;
  onCancelled: (updated: Enrollment) => void;
};

function previewRefund(course: Course, enrollment: Enrollment) {
  // FLEXIBLE
  if (course.scheduleType === 'FLEXIBLE') {
    const unusedRatio = enrollment.sessionsCompleted >= enrollment.totalSessions
      ? 0
      : (enrollment.totalSessions - enrollment.sessionsCompleted) / enrollment.totalSessions;
    return {
      percent: Math.round(unusedRatio * 100),
      label: 'Hoàn theo credit chưa dùng',
    };
  }

  const startMs = course.startDate ? new Date(course.startDate).getTime() : Date.now();
  const hours = (startMs - Date.now()) / (1000 * 60 * 60);
  if (hours >= 7 * 24)  return { percent: 100, label: 'Huỷ ≥7 ngày trước khai giảng — hoàn 100%' };
  if (hours >= 48)      return { percent: 70,  label: 'Huỷ 48h-7 ngày trước — hoàn 70%' };
  if (hours >= 0)       return { percent: 30,  label: 'Huỷ <48h trước — hoàn 30%' };
  const remainingRatio = Math.max(0, (enrollment.totalSessions - enrollment.sessionsCompleted) / enrollment.totalSessions);
  return { percent: Math.round(remainingRatio * 50), label: `Mid-course — hoàn pro-rated 50% buổi chưa học` };
}

export default function CancelEnrollmentModal({ open, enrollment, course, onClose, onCancelled }: Props) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const preview = useMemo(() => previewRefund(course, enrollment), [course, enrollment]);

  if (!open) return null;

  const refundAmount = Math.floor((enrollment.pricePaid.amount * preview.percent) / 100);

  async function handleConfirm() {
    setSubmitting(true);
    try {
      const res = await enrollmentService.cancel(enrollment.id);
      toast.success(res.message);
      onCancelled({ ...enrollment, status: res.status, refundAmount: res.refundAmount });
    } catch {
      toast.error('Huỷ thất bại. Vui lòng thử lại.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="auth-modal__backdrop" onClick={onClose} />
      <div className="auth-modal" role="dialog" aria-label="Huỷ khoá học">
        <header className="auth-modal__header">
          <strong>Huỷ khoá học?</strong>
          <button type="button" onClick={onClose} aria-label="Đóng" className="auth-modal__close">×</button>
        </header>

        <div style={{ padding: 20 }}>
          <div style={{
            background: preview.percent >= 70 ? 'var(--success-light)' : preview.percent >= 30 ? 'var(--warning-light)' : 'var(--danger-light)',
            color:      preview.percent >= 70 ? 'var(--success)'       : preview.percent >= 30 ? 'var(--warning)'       : 'var(--danger)',
            padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 16, fontWeight: 600,
          }}>
            {preview.label}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Đã trả</span>
            <span>{formatVND(enrollment.pricePaid.amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--divider)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Hoàn tiền ({preview.percent}%)</span>
            <strong style={{ color: 'var(--brand)' }}>{formatVND(refundAmount)}</strong>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
            Tiền hoàn sẽ chuyển về phương thức gốc trong 7 ngày làm việc.
            Sau khi huỷ bạn không thể tham gia các buổi còn lại.
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
