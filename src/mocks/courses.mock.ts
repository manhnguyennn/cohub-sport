import type {
  Course,
  CourseLevel,
  CourseListQuery,
  CourseSession,
  Enrollment,
  CreateEnrollmentInput,
  CancelEnrollmentResult,
} from '@app-types/course';
import type { Paginated } from '@app-types/common';
import { registerMock } from '@lib/mockRegistry';
import { coachesMock } from './coaches.mock';

// ── Helpers ────────────────────────────────────────────────────
function isoFromNow(daysOffset: number, hour = 18): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function coachMeta(coachId: string) {
  const c = coachesMock.find((x) => x.id === coachId);
  return {
    coachName: c?.fullName ?? 'Coach',
    coachAvatar: c?.avatar,
    sport: c?.sports[0] ?? 'gym-fitness',
  };
}

// ── 12 Course preset (FSD §3.3) ──────────────────────────────
// 8 FIXED + 4 FLEXIBLE
// Phân phối: 4 còn 1-2 chỗ (urgency), 1 đầy, 1 đã bắt đầu, 2 cover wow.
type RawCourse = Omit<Course, 'coachName' | 'coachAvatar' | 'pricePerSession'>;

const RAW: RawCourse[] = [
  {
    id: 'cr_yoga_basic',
    coachId: 'c2',          // Trần Minh Hoà (Yoga)
    title: 'Yoga sáng cho người mới — 8 buổi',
    cover: '/images/yoga-2.webp',
    description: 'Khoá Yoga sáng dành cho người mới bắt đầu. Tập trung vào hơi thở, tư thế cơ bản, và xây dựng thói quen luyện tập đều đặn.',
    whatYoullLearn: [
      '12 tư thế Yoga nền tảng (Hatha)',
      'Kỹ thuật thở Pranayama cơ bản',
      'Lộ trình tập tại nhà 15 phút/ngày',
      'Hiểu cơ thể & phòng tránh chấn thương',
    ],
    requirements: 'Thảm Yoga riêng. Trang phục co giãn. Không tập sau khi ăn no.',
    sport: 'yoga',
    level: 'beginner',
    scheduleType: 'FIXED',
    totalSessions: 8,
    sessionDurationMin: 60,
    startDate: isoFromNow(7, 6),
    recurringDays: [2, 4],            // T3, T5
    recurringTime: '06:00',
    maxParticipants: 8,
    availableSeats: 5,
    status: 'published',
    price: { amount: 1_600_000, currency: 'VND' },
    location: { city: 'TP.HCM', district: 'Quận 1', address: 'Studio Yoga 123 Lê Lợi' },
    tags: ['Bestseller'],
  },
  {
    id: 'cr_yoga_vinyasa',
    coachId: 'c2',
    title: 'Vinyasa Flow Trung cấp — 8 buổi',
    cover: '/images/yoga-3.webp',
    description: 'Nâng cao sức bền và linh hoạt với chuỗi Vinyasa Flow. Phù hợp người đã tập Yoga ≥3 tháng.',
    whatYoullLearn: [
      'Chuỗi Sun Salutation A/B nhuần nhuyễn',
      'Tư thế nâng cao (Crow, Headstand prep)',
      'Kết hợp hơi thở Ujjayi với chuyển động',
      'Xây dựng practice 45-60 phút',
    ],
    sport: 'yoga',
    level: 'intermediate',
    scheduleType: 'FIXED',
    totalSessions: 8,
    sessionDurationMin: 75,
    startDate: isoFromNow(14, 18),
    recurringDays: [1, 3, 5],
    recurringTime: '18:30',
    maxParticipants: 6,
    availableSeats: 2,                // URGENCY
    status: 'published',
    price: { amount: 2_400_000, currency: 'VND' },
    location: { city: 'TP.HCM', district: 'Quận 1' },
    tags: ['Sắp đầy'],
  },
  {
    id: 'cr_gym_lose_weight',
    coachId: 'c3',          // Lê Quốc Thái
    title: 'Gym giảm cân 12 buổi — Lộ trình 6 tuần',
    cover: '/images/Fitness.webp',
    description: 'Chương trình toàn diện kết hợp HIIT, kháng lực và tư vấn dinh dưỡng. Cam kết kết quả sau 6 tuần.',
    whatYoullLearn: [
      'Bài tập compound: squat, deadlift, bench',
      'Cardio HIIT 20 phút hiệu quả tối đa',
      'Lên thực đơn 1500-1800 cal/ngày',
      'Đo & theo dõi body composition',
    ],
    sport: 'gym-fitness',
    level: 'beginner',
    scheduleType: 'FIXED',
    totalSessions: 12,
    sessionDurationMin: 60,
    startDate: isoFromNow(3, 19),
    recurringDays: [2, 4, 6],
    recurringTime: '19:00',
    maxParticipants: 4,
    availableSeats: 1,                 // URGENCY
    status: 'published',
    price: { amount: 4_800_000, currency: 'VND' },
    location: { city: 'TP.HCM', district: 'Quận 3' },
    tags: ['Top Rated'],
  },
  {
    id: 'cr_pickleball_basic',
    coachId: 'c1',          // Nguyễn Văn An
    title: 'Pickleball nhập môn — 6 buổi',
    cover: '/images/pickleball-2.webp',
    description: 'Khoá Pickleball cho người mới. Học cầm vợt, di chuyển, các đòn cơ bản và luật chơi.',
    whatYoullLearn: [
      'Cầm vợt continental & eastern grip',
      'Forehand / Backhand groundstroke',
      'Dink, Volley, Third Shot Drop',
      'Luật & chiến thuật doubles cơ bản',
    ],
    sport: 'pickleball',
    level: 'beginner',
    scheduleType: 'FIXED',
    totalSessions: 6,
    sessionDurationMin: 90,
    startDate: isoFromNow(5, 17),
    recurringDays: [3, 6],
    recurringTime: '17:30',
    maxParticipants: 4,
    availableSeats: 3,
    status: 'published',
    price: { amount: 2_400_000, currency: 'VND' },
    location: { city: 'Hà Nội', district: 'Cầu Giấy', address: 'Sân Pickleball Cầu Giấy' },
  },
  {
    id: 'cr_pickleball_inter',
    coachId: 'c1',
    title: 'Pickleball trung cấp & đấu giải — 8 buổi',
    cover: '/images/pickleball-3.webp',
    description: 'Nâng tầm kỹ thuật, chiến thuật và sẵn sàng thi đấu giải hạng 3.5+.',
    whatYoullLearn: [
      'Chiến thuật stacking và poaching',
      'Đọc đối thủ và lựa chọn shot',
      'Tâm lý thi đấu — close out games',
      'Practice match có HLV chỉnh sửa realtime',
    ],
    sport: 'pickleball',
    level: 'intermediate',
    scheduleType: 'FIXED',
    totalSessions: 8,
    sessionDurationMin: 90,
    startDate: isoFromNow(-3, 17),    // ĐÃ BẮT ĐẦU — closed
    recurringDays: [2, 4, 6],
    recurringTime: '17:30',
    maxParticipants: 4,
    availableSeats: 0,
    status: 'started',
    price: { amount: 3_200_000, currency: 'VND' },
    location: { city: 'Hà Nội', district: 'Cầu Giấy' },
  },
  {
    id: 'cr_golf_short_game',
    coachId: 'c5',          // Đỗ Anh Tuấn
    title: 'Golf — Short Game Mastery — 6 buổi',
    cover: '/images/golf-2.webp',
    description: 'Khoá chuyên sâu về Short Game (chip, pitch, bunker, putt) — phần chiếm 60% scoring.',
    whatYoullLearn: [
      'Chip với 3 club: PW/SW/LW',
      'Pitch shot 30-50 yards',
      'Bunker play căn bản đến nâng cao',
      'Putting — đọc green và stroke ổn định',
    ],
    sport: 'golf',
    level: 'intermediate',
    scheduleType: 'FIXED',
    totalSessions: 6,
    sessionDurationMin: 90,
    startDate: isoFromNow(10, 14),
    recurringDays: [0, 6],
    recurringTime: '14:00',
    maxParticipants: 3,
    availableSeats: 1,                 // URGENCY
    status: 'published',
    price: { amount: 4_800_000, currency: 'VND' },
    location: { city: 'Hà Nội', district: 'Long Biên', address: 'Sân golf Long Biên' },
    tags: ['Premium'],
  },
  {
    id: 'cr_boxing_beginner',
    coachId: 'c6',          // Vũ Ngọc Mai
    title: 'Boxing nhập môn — Giảm cân & rèn luyện — 8 buổi',
    cover: '/images/Boxing.webp',
    description: 'Combo Boxing + Cardio thiết kế cho người mới. Đốt 600-800 cal/buổi.',
    whatYoullLearn: [
      'Footwork căn bản — di chuyển boxer',
      '4 đòn cơ bản: Jab, Cross, Hook, Uppercut',
      'Defense: Slip, Bob & Weave, Parry',
      'Pad work — luyện combo với HLV',
    ],
    sport: 'boxing',
    level: 'beginner',
    scheduleType: 'FIXED',
    totalSessions: 8,
    sessionDurationMin: 60,
    startDate: isoFromNow(9, 19),
    recurringDays: [1, 3, 5],
    recurringTime: '19:00',
    maxParticipants: 8,
    availableSeats: 6,
    status: 'published',
    price: { amount: 2_000_000, currency: 'VND' },
    location: { city: 'Đà Nẵng' },
  },
  {
    id: 'cr_tennis_beginner',
    coachId: 'c4',          // Phạm Thuỳ Linh
    title: 'Tennis cho người mới — 10 buổi',
    cover: '/images/tennis.webp',
    description: 'Khoá toàn diện làm quen Tennis. Học vợt, đánh ổn định, ra sân đôi với bạn.',
    whatYoullLearn: [
      'Cầm vợt eastern & continental',
      'Forehand & Backhand 2 tay',
      'Serve cơ bản với 60% in',
      'Đánh đôi & luật chơi',
    ],
    sport: 'tennis',
    level: 'beginner',
    scheduleType: 'FIXED',
    totalSessions: 10,
    sessionDurationMin: 60,
    startDate: isoFromNow(12, 17),
    recurringDays: [3, 5],
    recurringTime: '17:00',
    maxParticipants: 4,
    availableSeats: 0,                 // ĐẦY → waitlist
    status: 'full',
    price: { amount: 4_000_000, currency: 'VND' },
    location: { city: 'Hà Nội', district: 'Tây Hồ' },
  },

  // ── 4 FLEXIBLE ────────────────────────────────────────────────
  {
    id: 'cr_flex_yoga_10',
    coachId: 'c2',
    title: 'Yoga 1-1 linh hoạt — 10 buổi (3 tháng)',
    cover: '/images/yoga-4.webp',
    description: 'Đặt lịch theo nhu cầu trong vòng 90 ngày. Coach Hoà 1-1, lộ trình cá nhân hoá.',
    whatYoullLearn: [
      'Đặt lịch chủ động theo giờ rảnh',
      'Lộ trình cá nhân hoá theo mục tiêu',
      'Hỗ trợ qua chat 24/7',
      'Bonus: bài tập tại nhà mỗi tuần',
    ],
    sport: 'yoga',
    level: 'beginner',
    scheduleType: 'FLEXIBLE',
    totalSessions: 10,
    sessionDurationMin: 60,
    flexibleValidityDays: 90,
    maxParticipants: 1,
    availableSeats: 1,
    status: 'published',
    price: { amount: 3_500_000, currency: 'VND' },
    location: { city: 'TP.HCM' },
    tags: ['Linh hoạt'],
  },
  {
    id: 'cr_flex_gym_20',
    coachId: 'c3',
    title: 'Gym 1-1 linh hoạt — 20 buổi (6 tháng)',
    cover: '/images/running-2.webp',
    description: 'Gói lớn cho người tập serious. 20 buổi 1-1 trong 6 tháng + tư vấn dinh dưỡng.',
    whatYoullLearn: [
      'Lộ trình 6 tháng theo mục tiêu (cut/bulk/strength)',
      'Tư vấn dinh dưỡng hàng tuần',
      'Đo body comp 2 tuần/lần',
      'Lịch đặt linh hoạt theo công việc',
    ],
    sport: 'gym-fitness',
    level: 'intermediate',
    scheduleType: 'FLEXIBLE',
    totalSessions: 20,
    sessionDurationMin: 60,
    flexibleValidityDays: 180,
    maxParticipants: 1,
    availableSeats: 1,
    status: 'published',
    price: { amount: 8_500_000, currency: 'VND' },
    location: { city: 'TP.HCM', district: 'Quận 3' },
    tags: ['Premium', 'Linh hoạt'],
  },
  {
    id: 'cr_flex_tennis_8',
    coachId: 'c4',
    title: 'Tennis 1-1 linh hoạt — 8 buổi (2 tháng)',
    cover: '/images/tennis-2.webp',
    description: 'Lộ trình cải thiện kỹ thuật cá nhân. Coach Linh sẽ review video swing mỗi tuần.',
    whatYoullLearn: [
      'Phân tích swing qua video',
      'Sửa lỗi kỹ thuật cá nhân',
      'Lịch đặt linh hoạt',
      'Mock match với HLV',
    ],
    sport: 'tennis',
    level: 'intermediate',
    scheduleType: 'FLEXIBLE',
    totalSessions: 8,
    sessionDurationMin: 90,
    flexibleValidityDays: 60,
    maxParticipants: 1,
    availableSeats: 1,
    status: 'published',
    price: { amount: 3_200_000, currency: 'VND' },
    location: { city: 'Hà Nội' },
    tags: ['Linh hoạt'],
  },
  {
    id: 'cr_flex_pickleball_5',
    coachId: 'c1',
    title: 'Pickleball 1-1 linh hoạt — 5 buổi (1 tháng)',
    cover: '/images/pickleball-4.webp',
    description: 'Gói nhỏ thử nghiệm — 5 buổi 1-1 với HLV An để sửa kỹ thuật riêng.',
    whatYoullLearn: [
      'Sửa kỹ thuật cá nhân',
      'Tăng tốc độ phản xạ',
      'Chiến thuật doubles',
      'Đặt lịch linh hoạt 30 ngày',
    ],
    sport: 'pickleball',
    level: 'intermediate',
    scheduleType: 'FLEXIBLE',
    totalSessions: 5,
    sessionDurationMin: 90,
    flexibleValidityDays: 30,
    maxParticipants: 1,
    availableSeats: 1,
    status: 'published',
    price: { amount: 2_250_000, currency: 'VND' },
    location: { city: 'Hà Nội', district: 'Cầu Giấy' },
    tags: ['Mới', 'Linh hoạt'],
  },
];

// ── Generate thêm course để dày data (tổng ~50) ────────────────
const COURSE_COVERS: Record<string, string[]> = {
  yoga: ['/images/yoga-2.webp', '/images/yoga-3.webp', '/images/yoga-4.webp', '/images/yoga-5.webp'],
  pilates: ['/images/Pilates.webp', '/images/swiming-4.webp'],
  pickleball: ['/images/pickleball-2.webp', '/images/pickleball-3.webp', '/images/pickleball-4.webp'],
  tennis: ['/images/tennis.webp', '/images/tennis-2.webp', '/images/tennis-3.webp'],
  golf: ['/images/golf-2.webp', '/images/golf-3.webp', '/images/golf-4.webp', '/images/golf-5.webp'],
  'gym-fitness': ['/images/Fitness.webp', '/images/running-2.webp', '/images/running-3.webp'],
  boxing: ['/images/Boxing.webp', '/images/Fitness.webp'],
  basketball: ['/images/Basketball.webp'],
  football: ['/images/Football.webp'],
};
const SPORT_NAME: Record<string, string> = {
  yoga: 'Yoga', pilates: 'Pilates', pickleball: 'Pickleball', tennis: 'Tennis', golf: 'Golf',
  'gym-fitness': 'Gym & Fitness', boxing: 'Boxing', basketball: 'Bóng rổ', football: 'Bóng đá',
};
const LEVEL_VI = { beginner: 'cơ bản', intermediate: 'trung cấp', advanced: 'nâng cao' } as const;
const COURSE_CITIES = [
  { city: 'TP. Hồ Chí Minh', district: 'Quận 1' }, { city: 'TP. Hồ Chí Minh', district: 'Bình Thạnh' },
  { city: 'Hà Nội', district: 'Cầu Giấy' }, { city: 'Hà Nội', district: 'Đống Đa' },
  { city: 'Đà Nẵng', district: 'Hải Châu' }, { city: 'Hải Phòng', district: 'Lê Chân' },
  { city: 'Cần Thơ', district: 'Ninh Kiều' },
];

function genCourses(count: number): RawCourse[] {
  const out: RawCourse[] = [];
  const levels: CourseLevel[] = ['beginner', 'intermediate', 'advanced'];
  const recPairs = [[2, 4], [3, 5], [2, 4, 6], [1, 3, 5], [0, 6]];
  const times = ['06:00', '18:00', '07:00', '19:00', '09:00'];
  for (let i = 0; i < count; i++) {
    const coachId = `c${1 + (i % 50)}`;
    const meta = coachMeta(coachId);
    const sport = meta.sport;
    const sportName = SPORT_NAME[sport] ?? 'Thể thao';
    const level = levels[i % 3];
    const flexible = i % 3 === 2;
    const total = flexible ? [8, 10, 12, 16, 20][i % 5] : [6, 8, 10, 12][i % 4];
    const dur = [60, 75, 90][i % 3];
    const perSession = 150000 + ((i * 7) % 8) * 50000; // 150k–500k
    const price = perSession * total;
    const max = flexible ? 1 : [3, 4, 6, 8, 10][i % 5];
    const startedPast = !flexible && i % 11 === 7;
    const seats = flexible ? 1 : (i % 9 === 4 ? 0 : Math.max(0, max - (i % (max + 1))));
    const status: Course['status'] = startedPast ? 'started' : seats === 0 ? 'full' : 'published';
    const cover = (COURSE_COVERS[sport] ?? ['/images/Fitness.webp'])[i % (COURSE_COVERS[sport]?.length ?? 1)];
    const cov = COURSE_CITIES[i % COURSE_CITIES.length];

    out.push({
      id: `cr_gen_${i + 1}`,
      coachId,
      title: flexible
        ? `${sportName} 1-1 linh hoạt ${LEVEL_VI[level]} — ${total} buổi`
        : `${sportName} ${LEVEL_VI[level]} — ${total} buổi`,
      cover,
      description: `Khoá ${sportName} ${LEVEL_VI[level]} cùng ${meta.coachName}. Lộ trình rõ ràng, bài bản, phù hợp với người muốn tiến bộ nhanh và duy trì thói quen tập luyện đều đặn.`,
      whatYoullLearn: [
        `Kỹ thuật ${sportName} nền tảng và đúng chuẩn`,
        'Bài tập tăng dần độ khó theo trình độ',
        'Lộ trình tự luyện tại nhà giữa các buổi',
        'Cách phòng tránh chấn thương và hồi phục',
      ],
      requirements: 'Trang phục thoải mái. Đến sớm 10 phút. Mang theo nước uống.',
      sport,
      level,
      scheduleType: flexible ? 'FLEXIBLE' : 'FIXED',
      totalSessions: total,
      sessionDurationMin: dur,
      startDate: flexible ? undefined : isoFromNow(startedPast ? -4 : 3 + (i % 18), Number(times[i % times.length].slice(0, 2))),
      recurringDays: flexible ? undefined : recPairs[i % recPairs.length],
      recurringTime: flexible ? undefined : times[i % times.length],
      flexibleValidityDays: flexible ? [60, 90, 120][i % 3] : undefined,
      maxParticipants: max,
      availableSeats: seats,
      status,
      price: { amount: price, currency: 'VND' },
      location: cov,
      tags: i % 4 === 0 ? ['Bestseller'] : i % 4 === 1 ? ['Mới'] : undefined,
    });
  }
  return out;
}

RAW.push(...genCourses(38)); // tổng ~50 course

export const coursesMock: Course[] = RAW.map((c) => {
  const meta = coachMeta(c.coachId);
  return {
    ...c,
    coachName: meta.coachName,
    coachAvatar: meta.coachAvatar,
    pricePerSession: { amount: Math.floor(c.price.amount / c.totalSessions), currency: 'VND' },
  };
});

// ── Sessions (sinh từ Course FIXED) ──────────────────────────
function generateSessions(course: Course): CourseSession[] {
  if (course.scheduleType !== 'FIXED' || !course.startDate || !course.recurringDays) return [];
  const out: CourseSession[] = [];
  const [hh, mm] = (course.recurringTime ?? '06:00').split(':').map(Number);
  const cursor = new Date(course.startDate);
  const startMs = cursor.getTime();
  let count = 0;
  let dayCheck = new Date(cursor);

  while (count < course.totalSessions) {
    if (course.recurringDays.includes(dayCheck.getDay())) {
      const d = new Date(dayCheck);
      d.setHours(hh, mm, 0, 0);
      out.push({
        id: `${course.id}_s${count + 1}`,
        courseId: course.id,
        sequence: count + 1,
        startsAt: d.toISOString(),
        durationMinutes: course.sessionDurationMin,
        status: d.getTime() < Date.now() ? 'completed' : 'upcoming',
      });
      count++;
    }
    dayCheck.setDate(dayCheck.getDate() + 1);
    if (dayCheck.getTime() > startMs + 365 * 24 * 60 * 60 * 1000) break; // safety
  }
  return out;
}

export const sessionsMock: Record<string, CourseSession[]> = Object.fromEntries(
  coursesMock.map((c) => [c.id, generateSessions(c)]),
);

// ── Enrollments preload (Persona Linh có 1 IN_PROGRESS) ──────
export const enrollmentsMock: Enrollment[] = [
  {
    id: 'en_linh_yoga',
    userId: 'u_linh',
    courseId: 'cr_yoga_basic',
    courseTitle: coursesMock.find((c) => c.id === 'cr_yoga_basic')!.title,
    courseCover: coursesMock.find((c) => c.id === 'cr_yoga_basic')!.cover,
    coachName: coursesMock.find((c) => c.id === 'cr_yoga_basic')!.coachName,
    scheduleType: 'FIXED',
    totalSessions: 8,
    sessionsCompleted: 3,
    status: 'in_progress',
    enrolledAt: isoFromNow(-20, 9),
    pricePaid: { amount: 1_600_000, currency: 'VND' },
  },
];

// ── Filter logic ──────────────────────────────────────────────
function filterCourses(list: Course[], q: CourseListQuery): Course[] {
  let out = [...list];
  if (q.q) {
    const needle = q.q.toLowerCase();
    out = out.filter((c) =>
      c.title.toLowerCase().includes(needle) ||
      c.description.toLowerCase().includes(needle) ||
      c.coachName.toLowerCase().includes(needle),
    );
  }
  if (q.sport)        out = out.filter((c) => c.sport === q.sport);
  if (q.level)        out = out.filter((c) => c.level === q.level);
  if (q.scheduleType) out = out.filter((c) => c.scheduleType === q.scheduleType);
  if (q.status === 'available') {
    out = out.filter((c) => c.availableSeats > 0 && c.status === 'published');
  }

  switch (q.sort) {
    case 'price_asc':      out.sort((a, b) => a.price.amount - b.price.amount); break;
    case 'price_desc':     out.sort((a, b) => b.price.amount - a.price.amount); break;
    case 'starting_soon':  out.sort((a, b) => {
      const aT = a.startDate ? new Date(a.startDate).getTime() : Infinity;
      const bT = b.startDate ? new Date(b.startDate).getTime() : Infinity;
      return aT - bT;
    }); break;
  }
  return out;
}

// ── Cancellation policy (PRD §A2 cancellation course) ────────
function calcCourseRefund(
  course: Course,
  enrollment: Enrollment,
): { policy: CancelEnrollmentResult['policyApplied']; percent: number } {
  // FLEXIBLE — chỉ refund credit chưa dùng
  if (course.scheduleType === 'FLEXIBLE') {
    const used = enrollment.sessionsCompleted;
    const unusedRatio = used >= enrollment.totalSessions ? 0 : (enrollment.totalSessions - used) / enrollment.totalSessions;
    return { policy: 'flexible_unused', percent: Math.round(unusedRatio * 100) };
  }

  // FIXED
  const startMs = course.startDate ? new Date(course.startDate).getTime() : Date.now();
  const hoursUntilStart = (startMs - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilStart >= 7 * 24)  return { policy: 'over_7d',     percent: 100 };
  if (hoursUntilStart >= 48)      return { policy: '48h_7d',      percent: 70 };
  if (hoursUntilStart >= 0)       return { policy: 'under_48h',   percent: 30 };

  // Mid-course pro-rated 50%
  const remainingRatio = Math.max(0, (enrollment.totalSessions - enrollment.sessionsCompleted) / enrollment.totalSessions);
  return { policy: 'mid_course', percent: Math.round(remainingRatio * 50) };
}

// ── Handlers ──────────────────────────────────────────────────

registerMock('GET /courses', ({ query }): Paginated<Course> => {
  const q = query as CourseListQuery;
  const page = Number(q.page ?? 1);
  const pageSize = Number(q.pageSize ?? 12);
  const filtered = filterCourses(coursesMock, q);
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
});

registerMock('GET /courses/featured', () =>
  coursesMock.filter((c) => c.status === 'published').slice(0, 6),
);

// ── Giáo trình + kỹ năng (sinh khi xem detail) ───────────────
const SYLLABUS_TITLES = [
  'Khởi động & đánh giá trình độ',
  'Kỹ thuật nền tảng',
  'Nâng cao kiểm soát & độ chính xác',
  'Phối hợp & di chuyển (footwork)',
  'Tư duy chiến thuật',
  'Thực hành tình huống thi đấu',
  'Tâm lý & xử lý áp lực',
  'Tổng ôn kỹ thuật nâng cao',
  'Thi đấu cọ xát',
  'Tổng kết & lộ trình tiếp theo',
];

const SKILLS_BY_SPORT: Record<string, string[]> = {
  pickleball: ['Dink', 'Drop', 'Reset', 'Drive forehand', 'Drive backhand'],
  tennis: ['Forehand', 'Backhand', 'Serve', 'Volley', 'Footwork'],
  yoga: ['Hơi thở', 'Thăng bằng', 'Dẻo dai', 'Tư thế nền tảng', 'Thiền'],
  'gym-fitness': ['Sức mạnh', 'Sức bền', 'Form chuẩn', 'Core', 'Dinh dưỡng'],
  golf: ['Swing', 'Putting', 'Chipping', 'Tư thế', 'Đọc sân'],
  boxing: ['Jab', 'Cross', 'Hook', 'Footwork', 'Phòng thủ'],
  pilates: ['Core', 'Kiểm soát', 'Hơi thở', 'Linh hoạt', 'Tư thế'],
  football: ['Khống bóng', 'Chuyền', 'Sút', 'Rê dắt', 'Thể lực'],
  basketball: ['Dribbling', 'Shooting', 'Passing', 'Phòng thủ', 'Thể lực'],
};

function genSyllabus(course: Course): import('@app-types/course').CourseSyllabusItem[] {
  const n = course.totalSessions;
  return Array.from({ length: n }).map((_, i) => {
    const last = i === n - 1;
    const title = last
      ? 'Tổng kết & lộ trình tiếp theo'
      : SYLLABUS_TITLES[Math.min(i, SYLLABUS_TITLES.length - 2)];
    return {
      order: i + 1,
      title,
      durationMinutes: course.sessionDurationMin,
      details: i === 0
        ? [
            'Kiểm tra kỹ năng hiện tại của học viên.',
            'Làm quen phương pháp & lộ trình khoá học.',
            'Sửa các lỗi kỹ thuật cơ bản thường gặp.',
          ]
        : undefined,
    };
  });
}

function genSkills(course: Course): string[] {
  return SKILLS_BY_SPORT[course.sport] ?? ['Kỹ thuật', 'Thể lực', 'Chiến thuật', 'Tư duy', 'Phản xạ'];
}

registerMock('GET /courses/:id', ({ pathParams }) => {
  const found = coursesMock.find((c) => c.id === pathParams.id);
  if (!found) throw new Error(`Course not found: ${pathParams.id}`);
  return {
    ...found,
    syllabus: found.syllabus ?? genSyllabus(found),
    skills: found.skills ?? genSkills(found),
  };
});

registerMock('GET /courses/:id/sessions', ({ pathParams }) =>
  sessionsMock[pathParams.id] ?? [],
);

registerMock('POST /courses/:id/enrollments', ({ pathParams, body }): Enrollment => {
  const courseId = pathParams.id;
  const course = coursesMock.find((c) => c.id === courseId);
  if (!course) throw new Error(`Course not found: ${courseId}`);
  if (course.availableSeats <= 0) throw new Error('Khoá học đã hết chỗ');

  const input = body as CreateEnrollmentInput;
  const enrollment: Enrollment = {
    id: `en_${Date.now()}`,
    userId: input.userId ?? 'u_linh',
    courseId: course.id,
    courseTitle: course.title,
    courseCover: course.cover,
    coachName: course.coachName,
    scheduleType: course.scheduleType,
    totalSessions: course.totalSessions,
    creditsRemaining: course.scheduleType === 'FLEXIBLE' ? course.totalSessions : undefined,
    expiresAt: course.scheduleType === 'FLEXIBLE'
      ? isoFromNow(course.flexibleValidityDays ?? 90)
      : undefined,
    sessionsCompleted: 0,
    status: 'in_progress',
    enrolledAt: new Date().toISOString(),
    pricePaid: course.price,
  };

  // Decrement seat
  course.availableSeats -= 1;
  if (course.availableSeats === 0) course.status = 'full';

  enrollmentsMock.push(enrollment);
  return enrollment;
});

registerMock('GET /enrollments', ({ query }) => {
  const q = query as { userId?: string; status?: string };
  let out = [...enrollmentsMock];
  if (q.userId) out = out.filter((e) => e.userId === q.userId);
  if (q.status) out = out.filter((e) => e.status === q.status);
  return out;
});

registerMock('GET /enrollments/:id', ({ pathParams }) => {
  const found = enrollmentsMock.find((e) => e.id === pathParams.id);
  if (!found) throw new Error(`Enrollment not found: ${pathParams.id}`);
  return found;
});

registerMock('POST /enrollments/:id/cancel', ({ pathParams }): CancelEnrollmentResult => {
  const enrollment = enrollmentsMock.find((e) => e.id === pathParams.id);
  if (!enrollment) throw new Error(`Enrollment not found: ${pathParams.id}`);
  const course = coursesMock.find((c) => c.id === enrollment.courseId);
  if (!course) throw new Error('Course not found');

  const refund = calcCourseRefund(course, enrollment);
  const refundAmount = Math.floor((enrollment.pricePaid.amount * refund.percent) / 100);

  enrollment.status = 'cancelled';
  enrollment.refundAmount = { amount: refundAmount, currency: 'VND' };

  // Trả seat lại
  if (course.availableSeats >= 0) {
    course.availableSeats += 1;
    if (course.status === 'full') course.status = 'published';
  }

  return {
    enrollmentId: enrollment.id,
    status: enrollment.status,
    refundAmount: { amount: refundAmount, currency: 'VND' },
    refundPercent: refund.percent,
    policyApplied: refund.policy,
    message:
      refund.policy === 'over_7d'     ? 'Hoàn 100% — huỷ trước 7 ngày khai giảng.'
    : refund.policy === '48h_7d'      ? 'Hoàn 70% — huỷ 48h-7 ngày trước khai giảng.'
    : refund.policy === 'under_48h'   ? 'Hoàn 30% — huỷ trong 48h trước khai giảng.'
    : refund.policy === 'mid_course'  ? 'Hoàn pro-rated 50% buổi chưa học.'
    : 'Hoàn tiền theo số credit chưa dùng.',
  };
});

// ── Featured (Home / future) ──────────────────────────────────
registerMock('GET /coaches/:id/published-courses', ({ pathParams }) =>
  coursesMock.filter((c) => c.coachId === pathParams.id && c.status === 'published'),
);
