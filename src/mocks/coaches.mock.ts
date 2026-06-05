import type { Coach, CoachListQuery, CoachCourse, RatingDistribution } from '@app-types/coach';
import type { Paginated } from '@app-types/common';
import { registerMock } from '@lib/mockRegistry';
import { matchesArea, cityKey } from '@lib/area-match';

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
  { id: 'sv1', title: 'How to work on swing changes', thumbnail: '/images/golf-3.webp' },
  { id: 'sv2', title: 'Chicken wing', thumbnail: '/images/tennis-3.webp' },
  { id: 'sv3', title: 'How your pivot may be causing your slice. Sample lesson', thumbnail: '/images/yoga-5.webp' },
];

// ── Coaches ────────────────────────────────────────────────────

export const coachesMock: Coach[] = [
  {
    id: 'c1',
    slug: 'nguyen-van-an',
    fullName: 'Nguyễn Văn An',
    avatar: '/images/nguyen-van-huy.svg',
    coverImage: '/images/pickleball-4.webp',
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
    avatar: '/images/do-thi-phuong.svg',
    coverImage: '/images/yoga-2.webp',
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
    responseRateMinutes: 120,
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
    avatar: '/images/phan-tuan-kiet.svg',
    coverImage: '/images/running-3.webp',
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
    avatar: '/images/pham-thi-linh.svg',
    coverImage: '/images/tennis-4.webp',
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
    avatar: '/images/vo-quoc-dat.svg',
    coverImage: '/images/golf-4.webp',
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
    avatar: '/images/hoang-thi-hanh.svg',
    coverImage: '/images/Boxing.webp',
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
    avatar: '/images/le-minh-hoang.svg',
    coverImage: '/images/Coding.webp',
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
    avatar: '/images/nguyen-thi-an.svg',
    coverImage: '/images/Ux.webp',
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

// ── Generate thêm coach để dày data (tổng ~50) ─────────────────
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const GEN_AVATARS = [
  '/images/nguyen-van-huy.svg', '/images/do-thi-phuong.svg', '/images/phan-tuan-kiet.svg',
  '/images/pham-thi-linh.svg', '/images/le-minh-hoang.svg', '/images/nguyen-thi-an.svg',
  '/images/hoang-thi-hanh.svg', '/images/bui-van-long.svg',
];

const SPORT_COVERS: Record<string, string[]> = {
  yoga: ['/images/yoga-2.webp', '/images/yoga-3.webp', '/images/yoga-4.webp', '/images/yoga-5.webp'],
  pilates: ['/images/Pilates.webp', '/images/swiming-4.webp', '/images/yoga-4.webp'],
  pickleball: ['/images/pickleball-2.webp', '/images/pickleball-3.webp', '/images/pickleball-4.webp'],
  tennis: ['/images/tennis.webp', '/images/tennis-2.webp', '/images/tennis-3.webp', '/images/tennis-4.webp'],
  golf: ['/images/golf-2.webp', '/images/golf-3.webp', '/images/golf-4.webp', '/images/golf-5.webp'],
  'gym-fitness': ['/images/Fitness.webp', '/images/running-2.webp', '/images/running-3.webp'],
  boxing: ['/images/Boxing.webp', '/images/Fitness.webp'],
  basketball: ['/images/Basketball.webp', '/images/running-3.webp'],
  football: ['/images/Football.webp', '/images/running-2.webp'],
};
function coverFor(sport: string, i: number): string {
  const pool = SPORT_COVERS[sport] ?? ['/images/Fitness.webp'];
  return pool[i % pool.length];
}

const SPORT_TITLE: Record<string, string> = {
  pickleball: 'Pickleball Coach', yoga: 'Yoga Coach', 'gym-fitness': 'Personal Trainer',
  tennis: 'Tennis Coach', golf: 'Golf Coach', football: 'Football Coach',
  basketball: 'Basketball Coach', boxing: 'Boxing Coach', pilates: 'Pilates Coach',
};
const SPORT_SKILLS: Record<string, string[]> = {
  pickleball: ['Singles', 'Doubles', 'Drop Shot', 'Third Shot', 'Volley'],
  yoga: ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin Yoga', 'Pranayama'],
  pilates: ['Mat Pilates', 'Reformer', 'Core', 'Mobility', 'Rehab'],
  tennis: ['Forehand', 'Backhand', 'Serve', 'Footwork', 'Volley'],
  golf: ['Driving', 'Short Game', 'Putting', 'Swing Analysis', 'Course Mgmt'],
  'gym-fitness': ['Strength', 'Hypertrophy', 'Fat Loss', 'Mobility', 'Nutrition'],
  boxing: ['Footwork', 'Combo', 'Defense', 'Conditioning', 'Sparring'],
  basketball: ['Shooting', 'Dribbling', 'Defense', 'IQ', 'Conditioning'],
  football: ['Passing', 'Finishing', 'Tactics', 'Fitness', 'Set-piece'],
};
const GEN_SPORTS = ['pickleball', 'yoga', 'gym-fitness', 'tennis', 'golf', 'boxing', 'pilates', 'basketball', 'football'];
const GEN_PLACES: { city: string; district: string }[] = [
  { city: 'TP. Hồ Chí Minh', district: 'Quận 1' }, { city: 'TP. Hồ Chí Minh', district: 'Quận 3' },
  { city: 'TP. Hồ Chí Minh', district: 'Quận 5' }, { city: 'TP. Hồ Chí Minh', district: 'Quận 7' },
  { city: 'TP. Hồ Chí Minh', district: 'Bình Thạnh' }, { city: 'TP. Hồ Chí Minh', district: 'Phú Nhuận' },
  { city: 'TP. Hồ Chí Minh', district: 'TP. Thủ Đức' }, { city: 'TP. Hồ Chí Minh', district: 'Gò Vấp' },
  { city: 'Hà Nội', district: 'Hoàn Kiếm' }, { city: 'Hà Nội', district: 'Ba Đình' },
  { city: 'Hà Nội', district: 'Cầu Giấy' }, { city: 'Hà Nội', district: 'Đống Đa' },
  { city: 'Hà Nội', district: 'Hai Bà Trưng' }, { city: 'Hà Nội', district: 'Tây Hồ' },
  { city: 'Đà Nẵng', district: 'Hải Châu' }, { city: 'Đà Nẵng', district: 'Sơn Trà' },
  { city: 'Đà Nẵng', district: 'Ngũ Hành Sơn' }, { city: 'Hải Phòng', district: 'Lê Chân' },
  { city: 'Hải Phòng', district: 'Ngô Quyền' }, { city: 'Cần Thơ', district: 'Ninh Kiều' },
  { city: 'Cần Thơ', district: 'Cái Răng' },
];
const LAST = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const MID_M = ['Văn', 'Hữu', 'Quang', 'Đức', 'Công', 'Thanh', 'Bá', 'Gia', 'Nhật', 'Khắc'];
const MID_F = ['Thị', 'Ngọc', 'Thu', 'Diệu', 'Bích', 'Khánh', 'Phương', 'Thanh', 'Quỳnh', 'Mỹ'];
const FIRST_M = ['Minh', 'Hoàng', 'Quốc', 'Tuấn', 'Long', 'Khoa', 'Nam', 'Sơn', 'Kiệt', 'Phong', 'Huy', 'Đạt', 'Trung', 'Bảo', 'Vinh'];
const FIRST_F = ['Lan', 'Hương', 'Mai', 'Linh', 'Trang', 'Hà', 'Quỳnh', 'Yến', 'Vy', 'Thảo', 'Ngân', 'Châu', 'Nhi', 'Anh', 'Hằng'];
const TAG_POOL = ['Top Rated', 'Phản hồi nhanh', 'Certified', 'Bestseller', 'Mới'];

function genCoaches(start: number, count: number): Coach[] {
  const out: Coach[] = [];
  const seen = new Set(coachesMock.map((c) => c.slug));
  for (let n = 0; n < count; n++) {
    const i = start + n;
    const female = i % 2 === 0;
    const last = LAST[i % LAST.length];
    const mid = female ? MID_F[(i * 3) % MID_F.length] : MID_M[(i * 3) % MID_M.length];
    const first = female ? FIRST_F[(i * 5) % FIRST_F.length] : FIRST_M[(i * 5) % FIRST_M.length];
    const fullName = `${last} ${mid} ${first}`;
    let slug = slugify(fullName);
    while (seen.has(slug)) slug = `${slugify(fullName)}-${i}`;
    seen.add(slug);

    const sport = GEN_SPORTS[i % GEN_SPORTS.length];
    const sport2 = GEN_SPORTS[(i + 3) % GEN_SPORTS.length];
    const place = GEN_PLACES[i % GEN_PLACES.length];
    const rating = Math.round((4.3 + ((i * 7) % 7) / 10) * 10) / 10; // 4.3–4.9
    const exp = 2 + (i % 13);
    const price = 150000 + ((i * 5) % 10) * 50000; // 150k–600k
    const reviews = 18 + ((i * 13) % 380);
    const verified = i % 7 !== 0;
    const tags: string[] = [];
    if (rating >= 4.7) tags.push('Top Rated');
    if (i % 3 === 0) tags.push('Phản hồi nhanh');
    if (i % 4 === 0) tags.push(TAG_POOL[(i) % TAG_POOL.length]);

    out.push({
      id: `c${i}`,
      slug,
      fullName,
      avatar: GEN_AVATARS[i % GEN_AVATARS.length],
      coverImage: coverFor(sport, i),
      bio: `${SPORT_TITLE[sport] ?? 'Coach'} với ${exp} năm kinh nghiệm. Đồng hành cùng học viên từ cơ bản đến nâng cao, xây dựng lộ trình phù hợp từng người và duy trì động lực tập luyện lâu dài.`,
      title: SPORT_TITLE[sport] ?? 'Coach',
      sports: sport === sport2 ? [sport] : [sport, sport2],
      languages: i % 3 === 0 ? ['vi', 'en'] : ['vi'],
      level: exp >= 10 ? 'professional' : exp >= 6 ? 'advanced' : exp >= 3 ? 'intermediate' : 'beginner',
      experienceYears: exp,
      rating,
      reviewCount: reviews,
      studentCount: 20 + ((i * 17) % 900),
      courseCount: i % 4,
      classCount: i % 3,
      location: place,
      pricePerHour: { amount: price, currency: 'VND' },
      isVerified: verified,
      isFeatured: i % 6 === 0,
      gender: female ? 'female' : 'male',
      teachingFormats: i % 2 === 0 ? ['1on1', 'group'] : ['1on1', 'small_group'],
      responseRateMinutes: [15, 60, 120, 240, 1440][i % 5],
      tags,
      teachingFocus: [
        `${SPORT_TITLE[sport] ?? 'Bộ môn'} cơ bản đến nâng cao cho mọi lứa tuổi.`,
        'Cá nhân hoá bài tập theo mục tiêu và thể trạng.',
        'Phân tích kỹ thuật, sửa lỗi chi tiết từng buổi.',
        'Theo dõi tiến độ và điều chỉnh lộ trình định kỳ.',
      ],
      skills: SPORT_SKILLS[sport] ?? DEFAULT_SKILLS,
      experiences: DEFAULT_EXPERIENCES,
      certificates: DEFAULT_CERTIFICATES,
      shortVideos: DEFAULT_SHORT_VIDEOS,
      nextAvailableSlot: 'Tuần này',
    });
  }
  return out;
}

coachesMock.push(...genCoaches(9, 42)); // c9 → c50 (tổng 50 coach)

// ── Courses (per coach) ────────────────────────────────────────

function defaultCourses(coachId: string): CoachCourse[] {
  const base = [
    {
      title: 'Yoga Cơ Bản',
      subtitle: 'Khởi đầu cho sức khỏe & cân bằng',
      description: 'Khóa học nền tảng cho người mới bắt đầu Yoga. Để giúp bạn cải thiện sức khỏe và giảm căng thẳng.',
      thumbnail: '/images/yoga-5.webp',
      oldPrice: 4_500_000,
      newPrice: 3_999_000,
    },
    {
      title: 'Vinyasa Flow',
      subtitle: 'Năng Lượng & Cân Bằng (Trung cấp)',
      description: 'Khóa học Vinyasa nâng cao sức bền và độ dẻo dai, giúp bạn cải thiện thể chất và cân bằng tinh thần.',
      thumbnail: '/images/golf-5.webp',
      oldPrice: 8_500_000,
      newPrice: 5_999_000,
    },
    {
      title: 'Power Yoga',
      subtitle: 'Sức Mạnh & Sức Bền (Cao cấp)',
      description: 'Khóa học thử thách giới hạn bản thân với các động tác cường độ cao, tăng sức mạnh và cải thiện vóc dáng.',
      thumbnail: '/images/swiming-3.webp',
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
  if (q.city)      out = out.filter((c) => cityKey(c.location.city) === cityKey(q.city!));
  if (q.area)      out = out.filter((c) => matchesArea(q.area!, c.location));
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
