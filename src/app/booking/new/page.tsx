import { notFound, redirect } from 'next/navigation';
import { coachService } from '@services/coach.service';
import { ROUTES } from '@config/routes';
import BookingForm from '@features/booking/BookingForm';

export const metadata = { title: 'Đặt buổi tập' };

type PageProps = {
  searchParams: {
    coachId?: string;
    startsAt?: string;
    durationMinutes?: string;
  };
};

export default async function BookingNewPage({ searchParams }: PageProps) {
  if (!searchParams.coachId || !searchParams.startsAt) {
    // Thiếu data → quay về list HLV
    redirect(ROUTES.coaches);
  }

  let coach;
  try {
    coach = await coachService.getById(searchParams.coachId);
  } catch {
    notFound();
  }

  return (
    <BookingForm
      coach={coach}
      startsAt={searchParams.startsAt}
      durationMinutes={Number(searchParams.durationMinutes ?? 60)}
    />
  );
}
