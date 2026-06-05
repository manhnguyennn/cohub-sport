/**
 * Chat 2 chiều (Tuần 7 — Communication).
 * Learner ↔ Coach. Mock có auto-reply bot 2s + content filter PII (PRD A2).
 */

export type ChatParticipant = {
  id: string;
  name: string;
  avatar?: string;
  /** Hiển thị badge verified (coach đã xác minh) */
  verified?: boolean;
  /** Vai trò trong thread — để render subtitle */
  role?: 'coach' | 'learner';
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  createdAt: string;
  /** Tin nhắn bị chặn vì chứa thông tin liên hệ ngoài (chỉ dùng phía gửi, không lưu) */
  flaggedPii?: boolean;
};

export type ChatThread = {
  id: string;
  /** id 2 người tham gia — filter theo user hiện tại */
  participantIds: string[];
  /** Đối phương (người còn lại, không phải user hiện tại) — mock tính sẵn */
  partner: ChatParticipant;
  lastMessage: string;
  lastAt: string;
  unread: boolean;
};

export type ChatThreadDetail = ChatThread & {
  messages: ChatMessage[];
};

export type SendMessageInput = {
  senderId: string;
  body: string;
};
