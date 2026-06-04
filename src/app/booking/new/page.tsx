/**
 * /booking/new — Legacy route. Đã được thay bằng /booking/session/[id]:
 * học viên đặt 1 buổi từ "Lịch dạy mở" mà coach đã sắp xếp sẵn.
 *
 * Nếu có coachId trên query, redirect về coach detail (phần "Lịch mở").
 * Nếu không, redirect về danh sách coach.
 */
import { redirect } from 'next/navigation';
import { coachService } from '@services/coach.service';
import { ROUTES } from '@config/routes';

type PageProps = {
  searchParams: { coachId?: string };
};

export default async function LegacyBookingNewRedirect({ searchParams }: PageProps) {
  let coachSlug: string | undefined;
  if (searchParams.coachId) {
    try {
      const coach = await coachService.getById(searchParams.coachId);
      coachSlug = coach.slug;
    } catch {
      // ignore — fallback below
    }
  }

  if (coachSlug) redirect(`${ROUTES.coachDetail(coachSlug)}#open-sessions`);
  redirect(ROUTES.coaches);
}
