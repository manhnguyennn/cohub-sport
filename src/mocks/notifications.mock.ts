import type { AppNotification } from '@app-types/notification';
import { registerMock, type MockContext } from '@lib/mockRegistry';
import { ROUTES } from '@config/routes';

/**
 * Mock thông báo theo persona. State in-memory (reset khi full nav).
 * - Linh (learner): booking confirm, message, review reminder, payment, system
 * - Khoa (coach): booking mới, review từ học viên, payout, system
 * - Admin: hồ sơ chờ duyệt, dispute, system
 */

const min = (n: number) => new Date(Date.now() - n * 60_000).toISOString();
const hr = (n: number) => min(n * 60);

let seq = 0;
const id = () => `ntf_${++seq}`;

function build(userId: string, items: Omit<AppNotification, 'id' | 'userId'>[]): AppNotification[] {
  return items.map((it) => ({ id: id(), userId, ...it }));
}

const store: Record<string, AppNotification[]> = {
  u_linh: build('u_linh', [
    { type: 'booking', title: 'Coach Khoa đã xác nhận', body: 'Buổi tập T5 19:00 tại Q1 đã được xác nhận.', createdAt: min(8), read: false, href: ROUTES.myBookings },
    { type: 'message', title: 'Tin nhắn mới từ Coach Khoa', body: 'Em mang giày tập là được nhé.', createdAt: min(35), read: false, href: ROUTES.messages },
    { type: 'payment', title: 'Thanh toán thành công', body: 'Bạn đã thanh toán 450.000đ cho buổi tập với Coach Khoa.', createdAt: hr(3), read: false, href: ROUTES.myBookings },
    { type: 'review', title: 'Đánh giá buổi tập', body: 'Buổi tập gần nhất đã hoàn thành. Để lại đánh giá giúp HLV nhé.', createdAt: hr(20), read: true, href: ROUTES.myBookings },
    { type: 'booking', title: 'Nhắc lịch ngày mai', body: 'Buổi yoga 07:00 sáng mai. Đừng quên nhé!', createdAt: hr(22), read: true, href: ROUTES.myBookings },
    { type: 'message', title: 'Coach Hoà đã trả lời', body: 'Khoá tennis còn 2 chỗ, khai giảng T2 tuần sau.', createdAt: hr(26), read: true, href: ROUTES.messages },
    { type: 'system', title: 'Chào mừng đến CoHub', body: 'Khám phá hơn 50 huấn luyện viên đã xác minh quanh bạn.', createdAt: hr(72), read: true, href: ROUTES.coaches },
    { type: 'payment', title: 'Hoàn tiền thành công', body: 'Bạn được hoàn 225.000đ cho buổi huỷ trước 24h.', createdAt: hr(96), read: true },
  ]),
  u_khoa: build('u_khoa', [
    { type: 'booking', title: 'Yêu cầu đặt lịch mới', body: 'Phạm Quang Huy muốn đặt buổi 60 phút. Vào xác nhận nhé.', createdAt: min(12), read: false, href: ROUTES.coachBookings },
    { type: 'booking', title: 'Đặt lịch riêng chờ duyệt', body: 'Một học viên gửi yêu cầu đặt lịch riêng — cần bạn xác nhận giá.', createdAt: min(50), read: false, href: ROUTES.coachBookings },
    { type: 'review', title: 'Đánh giá mới: 5 sao', body: 'Ngô Thu Vân: "Buổi tập tuyệt vời, Coach rất tận tâm!"', createdAt: hr(5), read: false, href: ROUTES.coachDashboard },
    { type: 'payment', title: 'Đối soát tuần này', body: 'Bạn sẽ nhận 6.460.000đ cho 17 buổi đã hoàn thành.', createdAt: hr(18), read: true, href: ROUTES.coachDashboard },
    { type: 'message', title: 'Tin nhắn từ học viên', body: 'Trần Minh Đức: "Em xin lịch buổi tiếp theo vào T7 ạ."', createdAt: hr(26), read: true, href: ROUTES.messages },
    { type: 'system', title: 'Mẹo tăng booking', body: 'Mở thêm lịch dạy vào khung tối T2–T6 để nhận nhiều booking hơn.', createdAt: hr(40), read: true, href: ROUTES.coachSessions },
  ]),
  u_admin: build('u_admin', [
    { type: 'system', title: '3 hồ sơ chờ duyệt', body: 'Có 3 hồ sơ Tầng 1 sắp tới hạn SLA. Vào xử lý ngay.', createdAt: min(20), read: false, href: ROUTES.adminReviews },
    { type: 'system', title: 'Hồ sơ KYC mới', body: 'Lý Thanh Tùng đã nộp xác minh KYC (Tầng 2).', createdAt: hr(2), read: false, href: ROUTES.adminReviews },
    { type: 'payment', title: 'GMV hôm nay', body: 'Tổng GMV hôm nay đạt 12.4 triệu, tăng 8% so với hôm qua.', createdAt: hr(6), read: true, href: ROUTES.admin },
    { type: 'system', title: 'Báo cáo tranh chấp', body: '1 booking bị báo cáo cần xem xét.', createdAt: hr(30), read: true, href: ROUTES.admin },
  ]),
};

function listFor(userId: string): AppNotification[] {
  return (store[userId] ?? []).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

registerMock('GET /notifications', (ctx: MockContext) => {
  const userId = (ctx.query.userId as string) ?? 'u_linh';
  return listFor(userId);
});

registerMock('PATCH /notifications/:id/read', (ctx: MockContext) => {
  for (const list of Object.values(store)) {
    const n = list.find((x) => x.id === ctx.pathParams.id);
    if (n) { n.read = true; return n; }
  }
  throw new Error('Notification không tồn tại');
});

registerMock('POST /notifications/read-all', (ctx: MockContext) => {
  const userId = ((ctx.body as { userId?: string })?.userId) ?? (ctx.query.userId as string) ?? 'u_linh';
  (store[userId] ?? []).forEach((n) => { n.read = true; });
  return { ok: true };
});
