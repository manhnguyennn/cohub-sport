import { apiClient } from '@lib/apiClient';
import type { ChatThread, ChatThreadDetail, ChatMessage, SendMessageInput } from '@app-types/message';

export const messageService = {
  /** Danh sách thread của user hiện tại */
  listThreads: (userId: string): Promise<ChatThread[]> =>
    apiClient.get('/messages/threads', { params: { userId } }),

  /** Chi tiết thread + toàn bộ message (đánh dấu đã đọc) */
  getThread: (threadId: string): Promise<ChatThreadDetail> =>
    apiClient.get(`/messages/threads/${threadId}`),

  /** Gửi 1 tin nhắn */
  send: (threadId: string, input: SendMessageInput): Promise<ChatMessage> =>
    apiClient.post(`/messages/threads/${threadId}/messages`, input),

  /** Lấy auto-reply (client gọi sau 2s để mô phỏng đối phương trả lời) */
  autoReply: (threadId: string): Promise<ChatMessage> =>
    apiClient.post(`/messages/threads/${threadId}/auto-reply`),
};
