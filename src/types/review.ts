import type { ID, ISODateString } from './common';

export type Review = {
  id: ID;
  coachId: ID;
  userId: ID;
  userName: string;
  userAvatar?: string;
  rating: number; // 1..5
  comment: string;
  createdAt: ISODateString;
};
