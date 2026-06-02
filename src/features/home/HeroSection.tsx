import HeroSearch from './HeroSearch';
import { sportService } from '@services/sport.service';

export default async function HeroSection() {
  const sports = await sportService.list();

  return (
    <section className="home-hero">
      <div className="home-hero__container">
        <span className="home-hero__eyebrow">🚀 CoHub MVP — Demo với mock data</span>

        <h1 className="home-hero__title">
          Tìm <span className="text-gradient">HLV phù hợp</span><br />
          và bứt phá kỹ năng của bạn
        </h1>

        <p className="home-hero__subtitle">
          Marketplace kết nối bạn với chuyên gia hàng đầu — từ thể thao, công nghệ tới phát triển bản thân.
          Booking 1-1, lịch học linh hoạt, thanh toán an toàn.
        </p>

        <HeroSearch sports={sports.slice(0, 12)} />

        <div className="home-hero__cta-row">
          <span><strong>{sports.length}+</strong> lĩnh vực</span>
          <span>•</span>
          <span><strong>200+</strong> HLV đã xác minh</span>
          <span>•</span>
          <span><strong>4.9★</strong> đánh giá trung bình</span>
        </div>
      </div>
    </section>
  );
}
