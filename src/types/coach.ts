import type { ID, Location, Money } from './common';

export type CoachLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export type Gender = 'male' | 'female' | 'other';

export type TeachingFormat = '1on1' | 'group' | 'small_group';

/** Một mục trong timeline kinh nghiệm của coach */
export type CoachExperience = {
  year: string;          // VD '2024'
  organization: string;  // VD 'Elite Fitness & Yoga'
  role: string;          // VD 'Professional Coach'
};

/** Chứng chỉ */
export type CoachCertificate = {
  year: string;
  name: string;          // VD 'RYT 200 (Registered Yoga Teacher Alliance)'
};

/** Video ngắn / sample lesson */
export type CoachShortVideo = {
  id: ID;
  title: string;
  thumbnail: string;
  videoUrl?: string;
};

/** Khoá học do coach tạo */
export type CoachCourse = {
  id: ID;
  title: string;          // VD 'Yoga Cơ Bản'
  subtitle?: string;      // VD 'Khởi đầu cho sức khoẻ & cân bằng'
  description: string;
  thumbnail: string;
  sessions: number;       // số buổi
  bullets: string[];      // các gạch đầu dòng (lịch học, format,...)
  oldPrice?: Money;
  newPrice: Money;
  isHotDeal?: boolean;
};

export type Coach = {
  id: ID;
  slug: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  title?: string;
  sports: string[];
  languages: string[];
  level: CoachLevel;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  studentCount?: number;
  courseCount?: number;        // số khoá học đang dạy
  classCount?: number;         // số lớp đang mở
  location: Location;
  pricePerHour: Money;
  isVerified: boolean;
  isFeatured: boolean;
  gender?: Gender;
  teachingFormats?: TeachingFormat[];
  responseRateMinutes?: number;
  tags?: string[];

  // ──── Detail page ────
  teachingFocus?: string[];       // các bullet "Giảng dạy"
  skills?: string[];              // tags: Hatha, Vinyasa, ...
  experiences?: CoachExperience[];
  certificates?: CoachCertificate[];
  shortVideos?: CoachShortVideo[];
  nextAvailableSlot?: string;     // VD 'Hôm nay, 16:00 - 20:00'
};

export type CoachListQuery = {
  q?: string;
  sport?: string;
  language?: string;
  city?: string;
  /** CSV slug khu vực (vd "q1,q3,hoan-kiem") — map sang city/district */
  area?: string;
  /** CSV ngày rảnh "t2,t4" — Flow 1 (matching ở page qua open sessions) */
  days?: string;
  /** Khung giờ "morning|afternoon|evening" — Flow 1 */
  time?: string;
  gender?: Gender;
  format?: TeachingFormat;
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: 'rating_desc' | 'price_asc' | 'price_desc' | 'experience_desc';
  page?: number;
  pageSize?: number;
};

/** Phân bố rating (cho UI thanh tiến trình bên trang detail) */
export type RatingDistribution = {
  average: number;
  total: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;   // tỉ lệ phần trăm
};
