'use client';

import { useState } from 'react';
import { cn } from '@lib/cn';

const FAQS = [
  {
    q: 'Tôi cần chuẩn bị gì cho buổi tập đầu tiên?',
    a: 'Bạn chỉ cần trang phục thoải mái và đến sớm 10 phút. Nếu buổi tập yêu cầu dụng cụ riêng, coach sẽ nhắn trước cho bạn.',
  },
  {
    q: 'Coach có hỗ trợ học viên mới hoàn toàn không?',
    a: 'Có. Coach sẽ đánh giá trình độ ở buổi đầu và thiết kế lộ trình phù hợp với người mới bắt đầu.',
  },
  {
    q: 'Tôi nên đặt buổi 1-1 hay đăng ký khoá học?',
    a: 'Đặt buổi 1-1 (Lịch dạy mở) phù hợp khi bạn muốn linh hoạt. Khoá học phù hợp khi bạn muốn lộ trình nhiều buổi với mức giá trọn gói tiết kiệm hơn.',
  },
  {
    q: 'Huỷ buổi tập thế nào?',
    a: 'Bạn huỷ trực tiếp trong mục Lịch của tôi. Huỷ trước 24 giờ được hoàn 100%, trong vòng 24 giờ hoàn 50%. Nếu coach huỷ, bạn được hoàn 100%.',
  },
];

export default function CoachFaq() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <section className="coach-faq">
      <div className="coach-faq__container">
        <h2 className="coach-faq__title">Câu hỏi thường gặp</h2>

        {FAQS.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={f.q}
              className={cn('coach-faq__item', isOpen && 'coach-faq__item--open')}
            >
              <button
                type="button"
                className="coach-faq__btn"
                aria-expanded={isOpen}
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
              >
                <span>{f.q}</span>
                <svg className="coach-faq__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && <div className="coach-faq__body">{f.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
