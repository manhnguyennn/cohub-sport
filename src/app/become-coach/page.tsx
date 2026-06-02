import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';

export const metadata = {
  title: 'Trở thành HLV trên CoHub',
  description: 'Tham gia mạng lưới 500+ HLV chuyên nghiệp. Tự tay xây dựng nguồn thu nhập từ chuyên môn của bạn.',
};

const BENEFITS = [
  {
    icon: '💰',
    title: 'Thu nhập từ 15-30tr/tháng',
    description: 'HLV active trung bình kiếm 22tr/tháng. Top coach Pickleball/Golf đạt 50tr+/tháng.',
  },
  {
    icon: '📅',
    title: 'Linh hoạt 100% thời gian',
    description: 'Tự cài lịch trống, tự chọn học viên. Dạy ngoài giờ chính, cuối tuần — tuỳ bạn.',
  },
  {
    icon: '🎯',
    title: 'Tệp học viên chất lượng',
    description: 'Học viên đã xem profile, chứng chỉ, review trước khi book. Không còn "lùa gà" qua Zalo.',
  },
  {
    icon: '🛡',
    title: 'Thu phí an toàn qua escrow',
    description: 'CoHub giữ tiền hộ tới khi buổi tập hoàn thành. Coach nhận tiền T+3, không lo lừa đảo.',
  },
  {
    icon: '📊',
    title: 'Dashboard quản lý chuyên nghiệp',
    description: 'Theo dõi GMV, học viên, lịch tập, review — như HubSpot mini cho coach cá nhân.',
  },
  {
    icon: '🏆',
    title: 'Verified badge → tăng booking 1.3x',
    description: 'KYC + chứng chỉ pass → badge xanh. HLV verified xuất hiện top trong search.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Trần Minh Hoà',
    role: 'Yoga Coach · TP.HCM',
    avatar: '/images/Container-_1_.webp',
    quote: 'Từ khi lên CoHub, mình nhận 8-12 booking mới mỗi tuần — gấp 3 lần Facebook. Không phải tự sale, tự thu tiền nữa.',
    revenue: '32.5tr/tháng',
  },
  {
    name: 'Nguyễn Văn An',
    role: 'Pickleball Coach · Hà Nội',
    avatar: '/images/Container.webp',
    quote: 'CoHub xử lý lịch, payment, review hết. Mình chỉ tập trung dạy. Học viên cũng tin tưởng hơn vì có hệ thống.',
    revenue: '45tr/tháng',
  },
  {
    name: 'Lê Quốc Thái',
    role: 'Strength Coach · TP.HCM',
    avatar: '/images/Container-_2_.webp',
    quote: 'Build profile mất 1 buổi chiều. Tuần sau đã có booking đầu tiên. ROI cao hơn nhiều so với chạy ads cá nhân.',
    revenue: '58tr/tháng',
  },
];

const PROCESS = [
  { step: '1', title: 'Đăng ký', desc: 'Số điện thoại + email. Mất 2 phút.' },
  { step: '2', title: 'Hoàn thiện profile', desc: '5 bước — ảnh, chuyên môn, bio, khu vực, giá & lịch. 15-20 phút.' },
  { step: '3', title: 'Admin duyệt', desc: 'Tầng 1 review trong 24h. Profile online ngay khi pass.' },
  { step: '4', title: 'Nâng cấp Verified', desc: 'KYC + chứng chỉ → badge xanh, boost 1.3x trong search.' },
  { step: '5', title: 'Nhận booking & dạy', desc: 'Học viên book trực tiếp. Bạn confirm hoặc decline trong 12h.' },
];

export default function BecomeCoachPage() {
  return (
    <div className="become-coach">
      {/* Hero */}
      <section className="become-coach__hero">
        <div className="become-coach__hero-container">
          <span className="become-coach__hero-eyebrow">Dành cho HLV chuyên nghiệp</span>
          <h1 className="become-coach__hero-title">
            Biến chuyên môn thành{' '}
            <span className="text-gradient">nguồn thu nhập bền vững</span>
          </h1>
          <p className="become-coach__hero-sub">
            Tham gia 500+ HLV thể thao trên CoHub. Tự xây profile, nhận học viên, thu phí an toàn —
            tất cả trong 1 nền tảng.
          </p>
          <div className="become-coach__hero-cta">
            <Button href={ROUTES.coachOnboarding} variant="primary" size="lg">
              Bắt đầu đăng ký HLV →
            </Button>
            <Button href={ROUTES.coaches} variant="secondary" size="lg">
              Xem profile mẫu
            </Button>
          </div>

          <div className="become-coach__stats">
            <div>
              <strong>500+</strong>
              <span>HLV active</span>
            </div>
            <div>
              <strong>22tr</strong>
              <span>Thu nhập trung bình/tháng</span>
            </div>
            <div>
              <strong>15%</strong>
              <span>Phí nền tảng</span>
            </div>
            <div>
              <strong>T+3</strong>
              <span>Payout về tài khoản</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="become-coach__benefits">
        <div className="become-coach__container">
          <h2 className="become-coach__section-title">Vì sao chọn CoHub?</h2>
          <p className="become-coach__section-sub">6 lý do HLV chuyên nghiệp ở Việt Nam đang chuyển sang CoHub.</p>
          <div className="become-coach__benefits-grid">
            {BENEFITS.map((b) => (
              <div key={b.title} className="become-coach__benefit">
                <span className="become-coach__benefit-icon" aria-hidden>{b.icon}</span>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="become-coach__process">
        <div className="become-coach__container">
          <h2 className="become-coach__section-title">5 bước lên sàn — từ đăng ký đến nhận booking</h2>
          <ol className="become-coach__process-list">
            {PROCESS.map((p) => (
              <li key={p.step}>
                <span className="become-coach__process-num">{p.step}</span>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section className="become-coach__testimonials">
        <div className="become-coach__container">
          <h2 className="become-coach__section-title">HLV trên CoHub nói gì?</h2>
          <div className="become-coach__testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="become-coach__testimonial">
                <div className="become-coach__testimonial-revenue">{t.revenue}</div>
                <p className="become-coach__testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="become-coach__testimonial-author">
                  <Image src={t.avatar} alt={t.name} width={44} height={44} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="become-coach__final-cta">
        <div className="become-coach__container">
          <h2>Sẵn sàng nhận booking đầu tiên?</h2>
          <p>Mất 15-20 phút để hoàn thành profile. Pass review trong 24h.</p>
          <Button href={ROUTES.coachOnboarding} variant="primary" size="lg">
            Bắt đầu ngay — Miễn phí
          </Button>
          <small>
            Cần đăng nhập trước. Đã có tài khoản? <Link href={ROUTES.login}>Đăng nhập</Link>
          </small>
        </div>
      </section>
    </div>
  );
}
