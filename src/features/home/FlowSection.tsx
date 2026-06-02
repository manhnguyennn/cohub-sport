const STEPS = [
  { num: 1, title: 'Tìm HLV', text: 'Search theo lĩnh vực, lọc theo giá, ngôn ngữ, vị trí.' },
  { num: 2, title: 'Xem hồ sơ', text: 'Đọc bio, review, lịch trống — chọn HLV phù hợp nhất.' },
  { num: 3, title: 'Đặt lịch', text: 'Chọn slot, ghi chú yêu cầu, thanh toán an toàn.' },
  { num: 4, title: 'Bắt đầu học', text: 'Học 1-1, theo dõi tiến độ, đánh giá sau buổi.' },
];

export default function FlowSection() {
  return (
    <section className="home-flow" id="how">
      <div className="home-flow__container">
        <h2 className="home-flow__title">CoHub hoạt động thế nào?</h2>
        <p className="home-flow__subtitle">4 bước đơn giản để bắt đầu hành trình của bạn.</p>

        <div className="home-flow__steps">
          {STEPS.map((s) => (
            <div key={s.num} className="home-flow__step">
              <div className="home-flow__step-num">{s.num}</div>
              <div className="home-flow__step-title">{s.title}</div>
              <div className="home-flow__step-text">{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
