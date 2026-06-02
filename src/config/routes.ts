/**
 * Single source of truth cho mọi route path.
 * Component và Header phải import từ đây, KHÔNG hardcode '/coaches'.
 */

export const ROUTES = {
  home: '/',
  coaches: '/coaches',
  coachDetail: (id: string) => `/coaches/${id}`,
  booking: '/booking',
  bookingNew: '/booking/new',
  bookingDetail: (id: string) => `/booking/${id}`,
  checkout: '/checkout',
  myBookings: '/my/bookings',

  // Course
  courses: '/courses',
  courseDetail: (id: string) => `/courses/${id}`,
  courseEnroll: (id: string) => `/courses/${id}/enroll`,
  myCourses: '/my/courses',
  myCourseDetail: (id: string) => `/my/courses/${id}`,

  // Auth
  login: '/auth/login',
  register: '/auth/signup',
  otp: '/auth/otp',
  registerCoach: '/become-coach',
  becomeCoach: '/become-coach',
  coachOnboarding: '/coach/onboarding',
  coachOnboardingPreview: '/coach/onboarding/preview',
  coachVerification: '/coach/verification',

  // Coach CMS
  coachCms: '/coach-cms',
  coachCmsProfile: '/coach-cms/profile',
  coachCmsSchedule: '/coach-cms/schedule',
  coachCmsBookings: '/coach-cms/bookings',
  coachCmsEarnings: '/coach-cms/earnings',

  // Admin CRM
  admin: '/admin',
  adminUsers: '/admin/users',
  adminCoaches: '/admin/coaches',
  adminBookings: '/admin/bookings',

  // Marketing
  about: '/about',
  contact: '/contact',
  aiAgent: '/ai-agent',

  // Legacy
  showcase: '/showcase',

  // Errors
  notFound: '/404',
} as const;

/**
 * Nav config cho Header. Mỗi item có:
 * - label: text hiển thị
 * - href: ROUTES key
 * - showInNav: hiện trong nav chính
 * - status: 'ready' | 'wip' (chưa làm xong)
 */
export type NavItem = {
  label: string;
  href: string;
  status: 'ready' | 'wip';
};

export const MAIN_NAV: NavItem[] = [
  { label: 'Trang chủ', href: ROUTES.home, status: 'ready' },
  { label: 'Tìm HLV', href: ROUTES.coaches, status: 'ready' },
  { label: 'Khoá học', href: ROUTES.courses, status: 'ready' },
  { label: 'Trở thành HLV', href: ROUTES.registerCoach, status: 'wip' },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: 'Sản phẩm',
    items: [
      { label: 'Tìm HLV', href: ROUTES.coaches, status: 'ready' },
      { label: 'Booking', href: ROUTES.booking, status: 'wip' },
      { label: 'AI Agent', href: ROUTES.aiAgent, status: 'wip' },
    ],
  },
  {
    title: 'Dành cho HLV',
    items: [
      { label: 'Đăng ký HLV', href: ROUTES.registerCoach, status: 'wip' },
      { label: 'Trang quản lý', href: ROUTES.coachCms, status: 'wip' },
    ],
  },
  {
    title: 'Công ty',
    items: [
      { label: 'Về CoHub', href: ROUTES.about, status: 'wip' },
      { label: 'Liên hệ', href: ROUTES.contact, status: 'wip' },
      { label: 'Showcase (v1)', href: ROUTES.showcase, status: 'ready' },
    ],
  },
];
