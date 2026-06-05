'use client';

import { useState } from 'react';
import { cn } from '@lib/cn';

const FAQS = [
  {
    q: 'Tôi có cần kinh nghiệm trước không?',
    a: 'Không. Khoá học được thiết kế cho người mới — coach sẽ hướng dẫn từ những bước cơ bản nhất.',
  },
  {
    q: 'Nếu tôi nghỉ 1 buổi thì sao?',
    a: 'Bạn vẫn có thể theo dõi nội dung buổi đã nghỉ qua ghi chú của coach. Một số coach hỗ trợ học bù tuỳ lịch trống.',
  },
  {
    q: 'Có học bù không?',
    a: 'Tuỳ chính sách của từng coach. Bạn có thể nhắn coach để sắp xếp buổi bù nếu báo trước.',
  },
  {
    q: 'Tôi cần mang gì đến buổi tập?',
    a: 'Phần “Bạn cần chuẩn bị” trong khoá học liệt kê đầy đủ dụng cụ và trang phục cần thiết.',
  },
  {
    q: 'Coach có hỗ trợ thêm sau buổi tập không?',
    a: 'Có. Bạn có thể nhắn tin trao đổi với coach trong suốt thời gian khoá học để được giải đáp.',
  },
  {
    q: 'Tôi có thể chuyển sang khoá khác nếu không phù hợp không?',
    a: 'Trước khi khai giảng, bạn có thể huỷ và đăng ký khoá khác theo chính sách hoàn tiền. Sau khai giảng, vui lòng liên hệ hỗ trợ.',
  },
];

export default function CourseFAQ() {
  const [openIdx, setOpenIdx] = useState<number>(-1);

  return (
    <section className="course-faq">
      <h2>Câu hỏi thường gặp</h2>
      {FAQS.map((f, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={f.q} className={cn('course-faq__item', isOpen && 'course-faq__item--open')}>
            <button
              type="button"
              className="course-faq__btn"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
            >
              <span>{f.q}</span>
              <svg className="course-faq__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && <div className="course-faq__body">{f.a}</div>}
          </div>
        );
      })}
    </section>
  );
}
