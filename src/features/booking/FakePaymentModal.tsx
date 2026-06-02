'use client';

/**
 * Modal mô phỏng cổng thanh toán (VNPay / Momo / ZaloPay).
 * - Progress bar 2s (hoặc accelerated theo Demo Mode investorMode)
 * - default succeeded, fail nếu Demo Mode `forcePaymentFail` ON
 */
import { useEffect, useState } from 'react';
import { useDemoMode } from '@contexts/DemoModeContext';
import type { PaymentMethod } from '@app-types/payment';

type Props = {
  open: boolean;
  method: PaymentMethod;
  amount: number;
  onComplete: (success: boolean) => void;
  onCancel: () => void;
};

const META: Record<PaymentMethod, { name: string; color: string; tagline: string }> = {
  vnpay:   { name: 'VNPay',   color: '#005BAA', tagline: 'Cổng thanh toán quốc gia' },
  momo:    { name: 'MoMo',    color: '#A50064', tagline: 'Quét QR để thanh toán' },
  zalopay: { name: 'ZaloPay', color: '#0068FF', tagline: 'Đang chuyển hướng…' },
};

export default function FakePaymentModal({ open, method, amount, onComplete, onCancel }: Props) {
  const { toggles, withDelay } = useDemoMode();
  const [progress, setProgress] = useState(0);
  const meta = META[method];

  useEffect(() => {
    if (!open) return;
    setProgress(0);

    const total = withDelay(2000);
    const tickInterval = 50;
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += tickInterval;
      const pct = Math.min(100, Math.round((elapsed / total) * 100));
      setProgress(pct);
      if (elapsed >= total) {
        clearInterval(id);
        const success = !toggles.forcePaymentFail;
        // Wait 200ms để user thấy bar full 100%
        setTimeout(() => onComplete(success), 200);
      }
    }, tickInterval);

    return () => clearInterval(id);
  }, [open, method, toggles.forcePaymentFail, withDelay, onComplete]);

  if (!open) return null;

  return (
    <>
      <div className="pay-modal__backdrop" onClick={onCancel} />
      <div className="pay-modal" role="dialog" aria-label={`${meta.name} payment`}>
        <header className="pay-modal__header" style={{ background: meta.color }}>
          <strong>{meta.name}</strong>
          <button type="button" className="pay-modal__close" onClick={onCancel} aria-label="Huỷ">×</button>
        </header>

        <div className="pay-modal__body">
          <div className="pay-modal__amount">
            <span>Số tiền thanh toán</span>
            <strong>{amount.toLocaleString('vi-VN')}đ</strong>
          </div>

          <p className="pay-modal__tagline">{meta.tagline}</p>

          <div className="pay-modal__bar" aria-label="Tiến trình thanh toán">
            <div className="pay-modal__bar-fill" style={{ width: `${progress}%`, background: meta.color }} />
          </div>

          <p className="pay-modal__hint">
            {progress < 100 ? `Đang xử lý… ${progress}%` : 'Đã hoàn tất.'}
          </p>
        </div>
      </div>
    </>
  );
}
