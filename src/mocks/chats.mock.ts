import type { ChatThread, ChatThreadDetail, ChatMessage, SendMessageInput, ChatParticipant } from '@app-types/message';
import { registerMock, type MockContext } from '@lib/mockRegistry';

/**
 * Mock chat 2 chiều.
 * - Phía học viên Linh (u_linh): chat với Coach Khoa, Coach Hoà, Trợ lý CoHub.
 * - Phía Coach Khoa (u_khoa): chat với học viên (gồm cả Linh — thread dùng chung).
 * - `partner` được tính theo NGƯỜI XEM (userId) → mỗi bên thấy đối phương đúng.
 * - State in-memory (reset khi full navigation). Auto-reply: client gọi sau 2s.
 */

// Participants
const LINH: ChatParticipant = { id: 'u_linh', name: 'Trần Thu Linh', avatar: '/images/do-thi-phuong.svg', role: 'learner' };
const KHOA: ChatParticipant = { id: 'u_khoa', name: 'Nguyễn Văn An', avatar: '/images/le-minh-hoang.svg', role: 'coach', verified: true };
const HOA: ChatParticipant = { id: 'u_hoa', name: 'Trần Minh Hoà', avatar: '/images/hoang-thi-hanh.svg', role: 'coach', verified: true };
const BOT: ChatParticipant = { id: 'u_cohub_bot', name: 'Trợ lý CoHub', avatar: '/images/cohub-logo.svg', role: 'coach' };
const HUY: ChatParticipant = { id: 'u_huy', name: 'Phạm Quang Huy', avatar: '/images/do-thi-phuong.svg', role: 'learner' };
const VAN: ChatParticipant = { id: 'u_van', name: 'Ngô Thu Vân', avatar: '/images/le-minh-hoang.svg', role: 'learner' };
const DUC: ChatParticipant = { id: 'u_duc', name: 'Trần Minh Đức', avatar: '/images/hoang-thi-hanh.svg', role: 'learner' };

const min = (n: number) => new Date(Date.now() - n * 60_000).toISOString();

let seq = 100;
const mkId = () => `msg_${++seq}`;

function msg(threadId: string, senderId: string, body: string, agoMin: number): ChatMessage {
  return { id: mkId(), threadId, senderId, body, createdAt: min(agoMin) };
}

type ThreadStore = {
  id: string;
  members: ChatParticipant[]; // đúng 2 người
  unread: boolean;
  messages: ChatMessage[];
};

const threads: ThreadStore[] = [
  {
    id: 'th_khoa',
    members: [LINH, KHOA],
    unread: true,
    messages: [
      msg('th_khoa', LINH.id, 'Chào Coach, em đặt buổi tối T5 này được không ạ?', 180),
      msg('th_khoa', KHOA.id, 'Chào Linh, được nhé. 19h00 ở phòng tập Q1 ổn không em?', 174),
      msg('th_khoa', LINH.id, 'Dạ ổn ạ. Em mới tập gym nên hơi lo về form.', 170),
      msg('th_khoa', KHOA.id, 'Yên tâm, buổi đầu mình tập trung kỹ thuật cơ bản. Em mang giày tập là được.', 165),
    ],
  },
  {
    id: 'th_hoa',
    members: [LINH, HOA],
    unread: false,
    messages: [
      msg('th_hoa', LINH.id, 'Coach ơi khoá tennis còn chỗ không ạ?', 1500),
      msg('th_hoa', HOA.id, 'Còn 2 chỗ em nhé, khai giảng T2 tuần sau.', 1490),
      msg('th_hoa', LINH.id, 'Em cảm ơn, để em sắp xếp rồi đăng ký ạ.', 1480),
    ],
  },
  {
    id: 'th_bot',
    members: [LINH, BOT],
    unread: false,
    messages: [
      msg('th_bot', BOT.id, 'Xin chào! Mình là trợ lý CoHub. Bạn cần hỗ trợ về đặt lịch, thanh toán hay hoàn tiền?', 4000),
    ],
  },
  // Phía Coach Khoa — với học viên khác
  {
    id: 'th_khoa_huy',
    members: [KHOA, HUY],
    unread: true,
    messages: [
      msg('th_khoa_huy', HUY.id, 'Chào Coach, mai em mang giày tập riêng được không ạ?', 25),
      msg('th_khoa_huy', KHOA.id, 'Được nhé Huy, em mang giày phù hợp là tốt nhất.', 20),
    ],
  },
  {
    id: 'th_khoa_van',
    members: [KHOA, VAN],
    unread: false,
    messages: [
      msg('th_khoa_van', VAN.id, 'Cảm ơn Coach! Buổi hôm nay tuyệt vời ạ.', 240),
      msg('th_khoa_van', KHOA.id, 'Cảm ơn Vân, em tiến bộ nhanh lắm. Tuần sau giữ phong độ nhé!', 235),
    ],
  },
  {
    id: 'th_khoa_duc',
    members: [KHOA, DUC],
    unread: true,
    messages: [
      msg('th_khoa_duc', DUC.id, 'Em xin lịch buổi tiếp theo vào T7 ạ.', 1560),
      msg('th_khoa_duc', KHOA.id, 'T7 9h sáng anh trống, em đặt lịch giúp anh nhé.', 1555),
      msg('th_khoa_duc', DUC.id, 'Dạ em đặt luôn ạ!', 1550),
    ],
  },
];

// Canned auto-reply cho bot (5 câu) — xoay vòng
const BOT_REPLIES = [
  'Mình đã ghi nhận. Bạn có thể xem chi tiết booking trong mục "Buổi tập của tôi" nhé.',
  'Về chính sách hoàn tiền: huỷ trước 24h hoàn 100%, 6–24h hoàn 50%, dưới 6h không hoàn.',
  'Thanh toán của bạn được bảo vệ — CoHub chỉ chuyển cho HLV sau khi buổi tập hoàn thành.',
  'Nếu cần đổi lịch, bạn nhắn trực tiếp HLV trong khung chat tương ứng giúp mình nhé.',
  'Mình đã chuyển yêu cầu tới bộ phận hỗ trợ. Bạn sẽ nhận phản hồi trong ít phút.',
];
let botTurn = 0;

/** Partner = thành viên không phải người xem (viewerId). */
function partnerOf(t: ThreadStore, viewerId: string): ChatParticipant {
  return t.members.find((m) => m.id !== viewerId) ?? t.members[0];
}

function toThread(t: ThreadStore, viewerId: string): ChatThread {
  const last = t.messages[t.messages.length - 1];
  return {
    id: t.id,
    participantIds: t.members.map((m) => m.id),
    partner: partnerOf(t, viewerId),
    lastMessage: last?.body ?? '',
    lastAt: last?.createdAt ?? new Date().toISOString(),
    unread: t.unread,
  };
}

function find(id: string): ThreadStore | undefined {
  return threads.find((t) => t.id === id);
}

// ── List threads (filter + partner theo userId) ──────────────
registerMock('GET /messages/threads', (ctx: MockContext) => {
  const userId = (ctx.query.userId as string) ?? LINH.id;
  return threads
    .filter((t) => t.members.some((m) => m.id === userId))
    .map((t) => toThread(t, userId))
    .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
});

// ── Thread detail (partner theo ?userId nếu có) ──────────────
registerMock('GET /messages/threads/:id', (ctx: MockContext) => {
  const t = find(ctx.pathParams.id);
  if (!t) throw new Error('Thread không tồn tại');
  t.unread = false; // mở thread = đã đọc
  const viewerId = (ctx.query.userId as string) ?? t.members[0].id;
  const detail: ChatThreadDetail = { ...toThread(t, viewerId), messages: t.messages };
  return detail;
});

// ── Gửi tin nhắn ─────────────────────────────────────────────
registerMock('POST /messages/threads/:id/messages', (ctx: MockContext) => {
  const t = find(ctx.pathParams.id);
  if (!t) throw new Error('Thread không tồn tại');
  const input = ctx.body as SendMessageInput;
  const m: ChatMessage = {
    id: mkId(),
    threadId: t.id,
    senderId: input.senderId,
    body: input.body,
    createdAt: new Date().toISOString(),
  };
  t.messages.push(m);
  t.unread = false;
  return m;
});

// ── Auto-reply (client gọi sau 2s) ───────────────────────────
registerMock('POST /messages/threads/:id/auto-reply', (ctx: MockContext) => {
  const t = find(ctx.pathParams.id);
  if (!t) throw new Error('Thread không tồn tại');
  // Người trả lời = thành viên không phải người gửi tin cuối
  const lastSender = t.messages[t.messages.length - 1]?.senderId;
  const replier = t.members.find((m) => m.id !== lastSender) ?? t.members[0];
  const body = replier.id === BOT.id
    ? BOT_REPLIES[botTurn++ % BOT_REPLIES.length]
    : 'Mình nhận được tin của bạn rồi nhé, sẽ phản hồi sớm!';
  const m: ChatMessage = {
    id: mkId(),
    threadId: t.id,
    senderId: replier.id,
    body,
    createdAt: new Date().toISOString(),
  };
  t.messages.push(m);
  return m;
});
