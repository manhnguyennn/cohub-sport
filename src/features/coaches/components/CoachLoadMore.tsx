'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

type Props = { page: number; remaining: number };

/**
 * "Tải thêm" — cumulative paging. Bấm → tăng ?page → server render thêm
 * (giữ scroll). Ẩn khi đã hết.
 */
export default function CoachLoadMore({ page, remaining }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  if (remaining <= 0) return null;

  function more() {
    const next = new URLSearchParams(params.toString());
    next.set('page', String(page + 1));
    startTransition(() => router.push(`${pathname}?${next}`, { scroll: false }));
  }

  return (
    <div className="coach-list__more">
      <button type="button" className="coach-list__more-btn" onClick={more} disabled={pending}>
        {pending ? 'Đang tải…' : `Tải thêm (còn ${remaining})`}
      </button>
    </div>
  );
}
