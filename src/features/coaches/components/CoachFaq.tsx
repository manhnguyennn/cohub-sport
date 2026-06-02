'use client';

import { useState } from 'react';
import { cn } from '@lib/cn';

const FAQS = [
  {
    q: 'What is an online golf lesson?',
    a: 'Online lessons let bạn gửi video swing để coach review và cho feedback chi tiết, kết hợp video call 1-1 để hướng dẫn từng tư thế.',
  },
  {
    q: 'How do I sign up for Skillest?',
    a: 'Nhấn nút đăng ký, hoàn tất profile, chọn HLV phù hợp với mục tiêu của bạn và bắt đầu lộ trình.',
  },
  {
    q: 'How do I choose a coach?',
    a: 'Lọc theo bộ môn, ngôn ngữ, mức giá và đọc đánh giá của học viên khác. CoHub gợi ý HLV phù hợp với bạn.',
  },
  {
    q: 'What are the different types of lesson plans I can purchase?',
    a: 'Có các gói single session, 4-session pack, 8-session pack hoặc lộ trình theo tháng. Mỗi gói có ưu đãi khác nhau.',
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
