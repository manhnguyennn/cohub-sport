import PlaceholderPage from '@components/layout/PlaceholderPage';

export const metadata = { title: 'Booking' };

export default function BookingPage() {
  return (
    <PlaceholderPage
      icon="calendar"
      title="Booking flow"
      description="Chọn slot → ghi chú → thanh toán (VNPay/MoMo). bookingService.create + availability đã ready."
    />
  );
}
