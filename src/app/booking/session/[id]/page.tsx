import { notFound } from 'next/navigation';
import { coachService } from '@services/coach.service';
import { openSessionService } from '@services/openSession.service';
import BookingSessionForm from '@features/booking/BookingSessionForm';
import type { OpenSession } from '@app-types/openSession';

export const metadata = { title: 'Đặt buổi tập' };

type PageProps = { params: { id: string } };

export default async function BookingSessionPage({ params }: PageProps) {
  let session: OpenSession;
  try {
    session = await openSessionService.getById(params.id);
  } catch {
    notFound();
  }

  // Fetch coach denorm (denormalized fields trên session đã có, nhưng coach detail full thì cần)
  let coach;
  try {
    coach = await coachService.getById(session.coachId);
  } catch {
    notFound();
  }

  return <BookingSessionForm coach={coach} session={session} />;
}
