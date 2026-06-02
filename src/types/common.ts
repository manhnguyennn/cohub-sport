/**
 * Common DTO types — dùng chung cho mọi service.
 * Shape phải khớp với response BE (khi BE ready).
 */

export type ID = string;

export type ISODateString = string; // e.g. '2026-05-29T08:30:00Z'

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type Money = {
  amount: number; // số tiền nguyên (VND)
  currency: 'VND' | 'USD';
};

export type Location = {
  city: string;
  district?: string;
  address?: string;
};
