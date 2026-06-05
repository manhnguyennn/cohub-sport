'use client';

/**
 * Nút "Theo dõi" coach (figma). Mock: toggle + toast.
 */
import { useState } from 'react';
import AppIcon from '@components/ui/AppIcon';
import { useToast } from '@contexts/ToastContext';
import { cn } from '@lib/cn';

export default function CoachFollowButton({ coachName }: { coachName: string }) {
  const toast = useToast();
  const [following, setFollowing] = useState(false);

  function toggle() {
    const next = !following;
    setFollowing(next);
    toast.success(next ? `Đang theo dõi ${coachName}` : `Đã bỏ theo dõi ${coachName}`);
  }

  return (
    <button
      type="button"
      className={cn('coach-follow-btn', following && 'is-on')}
      onClick={toggle}
      aria-pressed={following}
    >
      <AppIcon name={following ? 'check' : 'heart'} size={15} />
      {following ? 'Đang theo dõi' : 'Theo dõi'}
    </button>
  );
}
