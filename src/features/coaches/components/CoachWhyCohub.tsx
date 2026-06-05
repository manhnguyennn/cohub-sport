const SELF_LIST = [
  'Mất nhiều thời gian để tìm kiếm HLV',
  'Chi phí không xứng đáng với chất lượng',
  'Không được hoàn tiền nếu bạn không hài lòng',
  'Khó để chọn lịch học phù hợp',
  'Không phù hợp với trình độ của bản thân',
  'Huấn luyện viên không có chứng chỉ và kinh nghiệm',
  'Mất nhiều thời gian để tìm kiếm HLV',
];

const COHUB_LIST = [
  'Cá nhân hoá cho bạn',
  'Coach trên khắp Việt Nam',
  '500+ coach đã xác minh, có video & đánh giá thật',
  'Phù hợp mọi trình độ',
  'Nhắn tin trao đổi với coach bất cứ lúc nào',
  'Coach sẵn sàng theo nhu cầu của bạn',
  'Cách học hiệu quả và tiết kiệm nhất',
];

export default function CoachWhyCohub() {
  return (
    <section className="coach-why">
      <div className="coach-why__container">
        <h2 className="coach-why__title">Tại sao chọn CoHub</h2>
        <p className="coach-why__sub">
          Tại CoHub, bạn được huấn luyện bởi những chuyên gia phù hợp nhất, theo cách phù hợp nhất với chính bạn.
        </p>

        <div className="coach-why__table">
          <div className="coach-why__col">
            <div className="coach-why__col-head">Tự tìm kiếm HLV</div>
            <ul className="coach-why__list">
              {SELF_LIST.map((t, i) => (
                <li key={i}>
                  <svg className="coach-why__icon-x" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="coach-why__col coach-why__col--brand">
            <div className="coach-why__col-head coach-why__col-head--brand">CoHub</div>
            <ul className="coach-why__list">
              {COHUB_LIST.map((t, i) => (
                <li key={i}>
                  <svg className="coach-why__icon-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
