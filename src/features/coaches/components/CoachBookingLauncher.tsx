'use client';

import { useState } from 'react';
import { Button, MobileStickyBar } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import CoachBookingModal from './CoachBookingModal';
import { formatVND } from '@lib/date';
import type { Coach } from '@app-types/coach';
import type { OpenSession } from '@app-types/openSession';

type Props = {
  coach: Coach;
  openSessions: OpenSession[];
  /** 'block' = nút trong sidebar; 'sticky' = thanh sticky mobile */
  variant?: 'block' | 'sticky';
};

/**
 * Trigger mở modal đặt lịch (calendar 30 ngày).
 * Dùng ở sidebar (block) và thanh sticky mobile (sticky).
 */
export default function CoachBookingLauncher({ coach, openSessions, variant = 'block' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {variant === 'sticky' ? (
        <MobileStickyBar
          info={
            <>
              <span className="mobile-sticky-bar__label">Học phí từ</span>
              <span className="mobile-sticky-bar__price">
                {formatVND(coach.pricePerHour.amount)}<small>/giờ</small>
              </span>
            </>
          }
          action={
            <Button variant="primary" size="md" onClick={() => setOpen(true)}>
              Đặt lịch
            </Button>
          }
        />
      ) : (
        <Button
          variant="primary"
          size="lg"
          block
          className="coach-booking-panel__cta"
          onClick={() => setOpen(true)}
          iconLeft={<AppIcon name="calendar" size={18} color="#fff" />}
        >
          Đặt lịch
        </Button>
      )}

      {open && (
        <CoachBookingModal coach={coach} openSessions={openSessions} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
