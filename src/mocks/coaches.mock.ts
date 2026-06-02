import type { Coach, CoachListQuery, CoachCourse, RatingDistribution } from '@app-types/coach';
import type { Paginated } from '@app-types/common';
import { registerMock } from '@lib/mockRegistry';

// ── Helpers ────────────────────────────────────────────────────

const DEFAULT_TEACHING_FOCUS = [
  'Power Yoga, Hot Yoga, Aerial Yoga.',
  'Yoga cho bà bầu (Prenatal Yoga) và Yoga cho trẻ em.',
  'Kết hợp kiến thức giải phẫu và vật lý trị liệu vào chương trình.',
  'Tổ chức workshop cộng đồng, retreat chuyên sâu.',
];

const DEFAULT_SKILLS = ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin Yoga', 'Pranayama'];

const DEFAULT_EXPERIENCES = [
  { year: '2025', organization: 'Elite Fitness & Yoga', role: 'Professional Coach' },
  { year: '2024', organization: 'California Fitness & Yoga', role: 'Professional Coach' },
  { year: '2021', organization: 'Chương trình đào tạo Yoga chuyên sâu tại Việt Nam.', role: 'Professional Coach' },
];

const DEFAULT_CERTIFICATES = [
  { year: '2024', name: 'RYT 200 (Registered Yoga Teacher Alliance)' },
  { year: '2022', name: 'Fitness & Nutrition hỗ trợ huấn luyện tổng thể' },
];

const DEFAULT_SHORT_VIDEOS = [
  { id: 'sv1', title: 'How to work on swing changes', thumbnail: '/images/Container.webp' },
  { id: 'sv2', title: 'Chicken wing', thumbnail: '/images/Container-_1_.webp' },
  { id: 'sv3', title: 'How your pivot may be causing your slice. Sample lesson', thumbnail: '/images/Container-_2_.webp' },
];

// ── Coaches ────────────────────────────────────────────────────

export const coachesMock: Coach[] = [
  {
    id: 'c1',
    slug: 'nguyen-van-an',
    fullName: 'Nguyễn Văn An',
    avatar: '/images/Container.webp',
    coverImage: '/images/Container-_1_.webp',
    bio: 'HLV Pickleball với 8 năm kinh nghiệm thi đấu, đã đào tạo hơn 200 học viên.',
    title: 'Pickleball Coach',
    sports: ['pickleball', 'tennis'],
    languages: ['vi', 'en'],
    level: 'professional',
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 124,
    studentCount: 887,
    courseCount: 4,
    classCount: 3,
    location: { city: 'Hà Nội', district: 'Cầu Giấy' },
    pricePerHour: { amount: 450000, currency: 'VND' },
    isVerified: true,
    isFeatured: true,
    gender: 'male',
    teachingFormats: ['1on1', 'small_group'],
    responseRateMinutes: 15,
    tags: ['Top Rated', 'Phản hồi nhanh'],
    teachingFocus: [
      'Pickleball cơ bản đến nâng cao cho mọi lứa tuổi.',
      'Chiến thuật doubles và đánh đôi nâng cao.',
      'Phân tích kỹ thuật bằng video review.',
      'Lộ trình thi đấu giải trẻ và open.',
    ],
    skills: ['Singles', 'Doubles', 'Drop Shot', 'Third Shot', 'Volley'],
    experiences: DEFAULT_EXPERIENCES,
    certificates: DEFAULT_CERTIFICATES,
    shortVideos: DEFAULT_SHORT_VIDEOS,
    nextAvailableSlot: 'Hôm nay, 16:00 - 20:00',
  },
  {
    id: 'c2',
    slug: 'tran-minh-hoa',
    fullName: 'Trần Minh Hoà',
    avatar: '/images/Container-_1_.webp',
    coverImage: '/images/Yoga.webp',
    bio: 'Anna Nguyễn là huấn luyện viên Yoga và Fitness chuyên nghiệp, với nhiều năm kinh nghiệm trong việc giảng dạy các lớp cá nhân và nhóm. Anna chú trọng đến sự cân bằng giữa thể chất – tinh thần – hơi thở, giúp học viên đạt được sự dẻo dai, giảm căng thẳng và duy trì lối sống lành mạnh.',
    title: 'Yoga Coach',
    sports: ['yoga', 'pilates'],
    languages: ['vi', 'en'],
    level: 'advanced',
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 240,
    studentCount: 40,
    courseCount: 4,
    classCount: 3,
    location: { city: 'TP. Hồ Chí Minh', district: 'Quận 1' },
    pricePerHour: { amount: 300000, currency: 'VND' },
    isVerified: true,
    isFeatured: true,
    gender: 'female',
    teachingFormats: ['1on1', 'group'],
    tags: ['Top Rated', 'Certified'],
    teachingFocus: DEFAULT_TEACHING_FOCUS,
    skills: DEFAULT_SKILLS,
    experiences: DEFAULT_EXPERIENCES,
    certificates: DEFAULT_CERTIFICATES,
    shortVideos: DEFAULT_SHORT_VIDEOS,
    nextAvailableSlot: 'Hôm nay, 16:00 - 20:00',
  },
  {
    id: 'c3',
    slug: 'le-quoc-thai',
    fullName: 'Lê Quốc Thái',
    avatar: '/images/Container-_2_.webp',
    coverImage: '/images/Fitness.webp',
    bio: 'Strength & conditioning coach, từng làm việc với VĐV chuyên nghiệp.',
    title: 'Strength Coach',
    sports: ['gym-fitness'],
    languages: ['vi'],
    level: 'professional',
    experienceYears: 10,
    rating: 4.95,
    reviewCount: 210,
    studentCount: 1240,
    courseCount: 6,
    classCount: 4,
    location: { city: 'TP.HCM', district: 'Quận 3' },
    pricePerHour: { amount: 500000, currency: 'VND' },
    isVerified: true,
    isFeatured: true,
    gender: 'male',
    teachingFormats: ['1on1'],
    tags: ['Top Rated'],
    teachingFocus: [
      'Powerlifting và Olympic lifting cho người mới.',
      'Programming sức mạnh cho VĐV thi đấu.',
      'Hồi phục chấn thương và phòng tránh.',
      'Nutrition coaching đi kèm chương trình tập.',
    ],
    skills: ['Powerlifting', 'Bodybuilding', 'Olympic Lift', 'Mobility', 'Cardio'],
    experiences: DEFAULT_EXPERIENCES,
    certificates: DEFAULT_CERTIFICATES,
    shortVideos: DEFAULT_SHORT_VIDEOS,
    nextAvailableSlot: 'Ngày mai, 09:00 - 11:00',
  },
  {
    id: 'c4',
    slug: 'pham-thuy-linh',
    fullName: 'Phạm Thuỳ Linh',
    avatar: '/images/Container-_3_.webp',
    bio: 'Tennis coach, vô địch giải trẻ quốc gia 2018.',
    title: 'Tennis Coach',
    sports: ['tennis'],
    languages: ['vi', 'en'],
    level: 'advanced',
    experienceYears: 5,
    rating: 4.7,
    reviewCount: 67,
    studentCount: 412,
    courseCount: 3,
    classCount: 2,
    location: { city: 'Hà Nội' },
    pricePerHour: { amount: 400000, currency: 'VND' },
    isVerified: true,
    isFeatured: false,
    gender: 'female',
    teachingFormats: ['1on1', 'small_group'],
    teachingFocus: DEFAULT_TEACHING_FOCUS,
    skills: ['Forehand', 'Backhand', 'Serve', 'Volley', 'Spin'],
    experiences: DEFAULT_EXPERIENCES,
    certificates: DEFAULT_CERTIFICATES,
    shortVideos: DEFAULT_SHORT_VIDEOS,
    nextAvailableSlot: 'Thứ 5, 18:00 - 20:00',
  },
  {
    id: 'c5',
    slug: 'do-anh-tuan',
    fullName: 'Đỗ Anh Tuấn',
    avatar: '/images/Container.webp',
    coverImage: '/images/Golf.webp',
    bio: 'Golf instructor PGA Class A. Sân tập riêng tại Long Biên.',
    title: 'Golf Instructor',
    sports: ['golf'],
    languages: ['vi', 'en', 'ja'],
    level: 'professional',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 156,
    studentCount: 925,
    courseCount: 5,
    classCount: 3,
    location: { city: 'Hà Nội', district: 'Long Biên' },
    pricePerHour: { amount: 800000, currency: 'VND' },
    isVerified: true,
    isFeatured: true,
    gender: 'male',
    teachingFormats: ['1on1'],
    tags: ['PGA Certified'],
    teachingFocus: [
      'Golf swing fundamentals từ A → Z.',
      'Short game: chip, pitch, bunker, putting.',
      'Course management và tâm lý thi đấu.',
      'Phân tích video swing chi tiết.',
    ],
    skills: ['Swing', 'Putting', 'Chipping', 'Bunker', 'Course Management'],
    experiences: DEFAULT_EXPERIENCES,
    certificates: DEFAULT_CERTIFICATES,
    shortVideos: DEFAULT_SHORT_VIDEOS,
    nextAvailableSlot: 'Hôm nay, 14:00 - 17:00',
  },
  {
    id: 'c6',
    slug: 'vu-ngoc-mai',
    fullName: 'Vũ Ngọc Mai',
    avatar: '/images/Container-_1_.webp',
    bio: 'Boxing coach, hỗ trợ giảm cân & rèn luyện thể chất cho người mới.',
    title: 'Boxing Coach',
    sports: ['boxing'],
    languages: ['vi'],
    level: 'advanced',
    experienceYears: 4,
    rating: 4.6,
    reviewCount: 42,
    studentCount: 287,
    courseCount: 2,
    classCount: 2,
    location: { city: 'Đà Nẵng' },
    pricePerHour: { amount: 300000, currency: 'VND' },
    isVerified: true,
    isFeatured: false,
    gender: 'female',
    teachingFormats: ['1on1', 'group'],
    teachingFocus: DEFAULT_TEACHING_FOCUS,
    skills: ['Jab', 'Cross', 'Hook', 'Footwork', 'Defense'],
    experiences: DEFAULT_EXPERIENCES,
    certificates: DEFAULT_CERTIFICATES,
    shortVideos: DEFAULT_SHORT_VIDEOS,
    nextAvailableSlot: 'Thứ 7, 09:00 - 11:00',
  },
  {
    id: 'c7',
    slug: 'hoang-nam-son',
    fullName: 'Hoàng Nam Sơn',
    avatar: '/images/Container-_2_.webp',
    bio: 'Senior engineer @ Big Tech. Coaching cho dev Junior-Mid lên Senior.',
    title: 'Tech Mentor',
    sports: ['coding', 'ai'],
    languages: ['vi', 'en'],
    level: 'professional',
    experienceYears: 11,
    rating: 4.95,
    reviewCount: 89,
    studentCount: 350,
    courseCount: 4,
    classCount: 2,
    location: { city: 'TP.HCM' },
    pricePerHour: { amount: 700000, currency: 'VND' },
    isVerified: true,
    isFeatured: true,
    gender: 'male',
    teachingFormats: ['1on1'],
    tags: ['Tech Mentor'],
    teachingFocus: DEFAULT_TEACHING_FOCUS,
    skills: ['System Design', 'TypeScript', 'React', 'Node.js', 'AWS'],
    experiences: DEFAULT_EXPERIENCES,
    certificates: DEFAULT_CERTIFICATES,
    shortVideos: DEFAULT_SHORT_VIDEOS,
    nextAvailableSlot: 'Tối nay, 21:00 - 22:00',
  },
  {
    id: 'c8',
    slug: 'bui-thu-ha',
    fullName: 'Bùi Thu Hà',
    avatar: '/images/Container-_3_.webp',
    bio: 'UI/UX Designer, 7 năm sản phẩm B2C. Mentor portfolio review.',
    title: 'UX Mentor',
    sports: ['ux'],
    languages: ['vi', 'en'],
    level: 'advanced',
    experienceYears: 7,
    rating: 4.85,
    reviewCount: 53,
    studentCount: 198,
    courseCount: 3,
    classCount: 1,
    location: { city: 'TP.HCM' },
    pricePerHour: { amount: 600000, currency: 'VND' },
    isVerified: true,
    isFeatured: false,
    gender: 'female',
    teachingFormats: ['1on1', 'small_group'],
    teachingFocus: DEFAULT_TEACHING_FOCUS,
    skills: ['UI', 'UX', 'Figma', 'Design System', 'Portfolio'],
    experiences: DEFAULT_EXPERIENCES,
    certificates: DEFAULT_CERTIFICATES,
    shortVideos: DEFAULT_SHORT_VIDEOS,
    nextAvailableSlot: 'Thứ 4, 20:00 - 22:00',
  },
];

// ── Courses (per coach) ────────────────────────────────────────

function defaultCourses(coachId: string): CoachCourse[] {
  const base = [
    {
      title: 'Yoga Cơ Bản',
      subtitle: 'Khởi đầu cho sức khỏe & cân bằng',
      description: 'Khóa học nền tảng cho người mới bắt đầu Yoga. Để giúp bạn cải thiện sức khỏe và giảm căng thẳng.',
      thumbnail: '/images/Container.webp',
      oldPrice: 4_500_000,
      newPrice: 3_999_000,
    },
    {
      title: 'Vinyasa Flow',
      subtitle: 'Năng Lượng & Cân Bằng (Trung cấp)',
      description: 'Khóa học Vinyasa nâng cao sức bền và độ dẻo dai, giúp bạn cải thiện thể chất và cân bằng tinh thần.',
      thumbnail: '/images/Container-_1_.webp',
      oldPrice: 8_500_000,
      newPrice: 5_999_000,
    },
    {
      title: 'Power Yoga',
      subtitle: 'Sức Mạnh & Sức Bền (Cao cấp)',
      description: 'Khóa học thử thách giới hạn bản thân với các động tác cường độ cao, tăng sức mạnh và cải thiện vóc dáng.',
      thumbnail: '/images/Container-_2_.webp',
      oldPrice: 9_500_000,
      newPrice: 6_999_000,
    },
  ];
  // Duplicate × 2 → 6 cards (theo design 2 hàng × 3)
  return [...base, ...base].map((c, i) => ({
    id: `${coachId}-course-${i + 1}`,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    thumbnail: c.thumbnail,
    sessions: 15,
    bullets: [
      'Coaching 1-1 hoặc theo nhóm riêng của bạn',
      'Cá nhân hoá bài tập theo nhu cầu',
    ],
    oldPrice: { amount: c.oldPrice, currency: 'VND' as const },
    newPrice: { amount: c.newPrice, currency: 'VND' as const },
    isHotDeal: true,
  }));
}

// ── Filter / sort logic ─────────────────────────────────────────
function filterCoaches(list: Coach[], q: CoachListQuery): Coach[] {
  let out = [...list];
  if (q.q) {
    const needle = q.q.toLowerCase();
    out = out.filter(
      (c) =>
        c.fullName.toLowerCase().includes(needle) ||
        c.bio.toLowerCase().includes(needle) ||
        c.sports.some((s) => s.includes(needle)),
    );
  }
  if (q.sport)     out = out.filter((c) => c.sports.includes(q.sport!));
  if (q.language)  out = out.filter((c) => c.languages.includes(q.language!));
  if (q.minRating) out = out.filter((c) => c.rating >= q.minRating!);
  if (q.city)      out = out.filter((c) => c.location.city === q.city);
  if (q.gender)    out = out.filter((c) => c.gender === q.gender);
  if (q.format)    out = out.filter((c) => c.teachingFormats?.includes(q.format!));
  if (q.priceMin !== undefined) out = out.filter((c) => c.pricePerHour.amount >= q.priceMin!);
  if (q.priceMax !== undefined) out = out.filter((c) => c.pricePerHour.amount <= q.priceMax!);

  switch (q.sort) {
    case 'rating_desc':      out.sort((a, b) => b.rating - a.rating); break;
    case 'price_asc':        out.sort((a, b) => a.pricePerHour.amount - b.pricePerHour.amount); break;
    case 'price_desc':       out.sort((a, b) => b.pricePerHour.amount - a.pricePerHour.amount); break;
    case 'experience_desc':  out.sort((a, b) => b.experienceYears - a.experienceYears); break;
  }
  return out;
}

// ── Register handlers ───────────────────────────────────────────
registerMock('GET /coaches', ({ query }): Paginated<Coach> => {
  const q = query as CoachListQuery;
  const page = Number(q.page ?? 1);
  const pageSize = Number(q.pageSize ?? 12);
  const filtered = filterCoaches(coachesMock, q);
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
});

registerMock('GET /coaches/featured', () => coachesMock.filter((c) => c.isFeatured));

registerMock('GET /coaches/:id', ({ pathParams }) => {
  const id = pathParams.id;
  const found = coachesMock.find((c) => c.id === id || c.slug === id);
  if (!found) throw new Error(`Coach not found: ${id}`);
  return found;
});

registerMock('GET /coaches/:id/courses', ({ pathParams }): CoachCourse[] => {
  const id = pathParams.id;
  const coach = coachesMock.find((c) => c.id === id || c.slug === id);
  if (!coach) return [];
  return defaultCourses(coach.id);
});

registerMock('GET /coaches/:id/similar', ({ pathParams }): Coach[] => {
  const id = pathParams.id;
  const coach = coachesMock.find((c) => c.id === id || c.slug === id);
  if (!coach) return [];
  const sameSport = coachesMock.filter(
    (c) => c.id !== coach.id && c.sports.some((s) => coach.sports.includes(s)),
  );
  const others = coachesMock.filter((c) => c.id !== coach.id && !sameSport.includes(c));
  return [...sameSport, ...others].slice(0, 8);
});

registerMock('GET /coaches/:id/rating-distribution', ({ pathParams }): RatingDistribution => {
  const id = pathParams.id;
  const coach = coachesMock.find((c) => c.id === id || c.slug === id);
  return {
    average: coach?.rating ?? 4.8,
    total: coach?.reviewCount ?? 0,
    breakdown: { 5: 75, 4: 21, 3: 3, 2: 1, 1: 0.5 },
  };
});
