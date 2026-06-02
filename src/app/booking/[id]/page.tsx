import { notFound } from 'next/navigation';
import { bookingService } from '@services/booking.service';
import BookingDetailClient from '@features/booking/BookingDetailClient';

type PageProps = {
  params: { id: string };
  searchParams: { status?: string };
};

export async function generateMetadata({ params }: PageProps) {
  try {
    const b = await bookingService.getById(params.id);
    return { title: `Buổi tập với ${b.coachName}` };
  } catch {
    return { title: 'Booking không tồn tại' };
  }
}

export default async function BookingDetailPage({ params, searchParams }: PageProps) {
  let booking;
  try {
    booking = await bookingService.getById(params.id);
  } catch {
    notFound();
  }

  const isFresh = searchParams.status === 'success';

  return <BookingDetailClient booking={booking} isFresh={isFresh} />;
}
