import type { ID } from './common';

export type SportCategory = 'sport' | 'tech' | 'language' | 'hr' | 'lifestyle';

export type Sport = {
  id: ID;
  slug: string;
  name: string;
  nameEn?: string;
  category: SportCategory;
  image: string;     // path tới ảnh trong public/images
  icon?: string;
  coachCount?: number;
  description?: string;
};
