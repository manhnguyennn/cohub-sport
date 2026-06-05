import type { ID, ISODateString } from './common';

export type Review = {
  id: ID;
  coachId: ID;
  userId: ID;
  userName: string;
  userAvatar?: string;
  rating: number; // 1..5
  comment: string;
  tags?: string[];
  createdAt: ISODateString;
  /** Double-blind: công khai sau 7 ngày hoặc khi cả 2 bên đã đánh giá */
  visibleAt?: ISODateString;
};

export type CreateReviewInput = {
  coachId: ID;
  bookingId: ID;
  rating: number;
  comment: string;
  tags?: string[];
};

/** Tag gợi ý cho form đánh giá (chọn nhiều) */
export const REVIEW_TAGS: string[] = [
  'Đúng giờ',
  'Nhiệt tình',
  'Chuyên môn tốt',
  'Dễ hiểu',
  'Cơ sở vật chất tốt',
  'Đáng giá tiền',
];
