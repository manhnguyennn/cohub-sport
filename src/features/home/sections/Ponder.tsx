'use client';

import React, { useRef, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

/**
 * Ponder section — 7 "pain point" bubble + 1 center.
 *
 * v2: bỏ position:absolute và class `.b1`…`.b6` xếp bằng tọa độ pixel cứng.
 *     SCSS đã chuyển sang CSS grid 3×3 — class .b1…b6 chỉ còn dùng cho grid-area.
 *     Animation reveal lần lượt via IntersectionObserver + class .is-visible.
 */
const Ponder: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timeouts: number[] = [];
    const node = containerRef.current;
    if (!node) return;

    // Thứ tự reveal cố ý:
    //  - 6 bubble xung quanh hiện lần lượt, mỗi cái cách 350ms
    //  - sau khi 6 bubble đã hiện hết, dừng 400ms rồi center bùng ra
    // Index 0..5 = bubbles ngoài, 6 = center
    const ORDER_DELAY_MS = 350;
    const CENTER_PAUSE_MS = 400;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        bubbleRefs.current.forEach((el, i) => {
          const isCenter = i === 6;
          const baseDelay = i * ORDER_DELAY_MS;
          const delay = isCenter ? baseDelay + CENTER_PAUSE_MS : baseDelay;
          const id = window.setTimeout(() => {
            el?.classList.add("is-visible");
          }, delay);
          timeouts.push(id);
        });
      } else {
        timeouts.forEach(clearTimeout);
        timeouts.length = 0;
        bubbleRefs.current.forEach((el) => el?.classList.remove("is-visible"));
      }
    });

    observer.observe(node);
    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  const MarqueeItem = () => (
    <span className="ponder-section__masonry">
      <span className="text">Start today</span>
      <span className="star-container" />
      <span className="text">Keep growing</span>
      <span className="star-container" />
      <span className="text">Learn faster</span>
      <span className="star-container" />
      <span className="text">Rise higher</span>
      <span className="star-container" />
      <span className="text">Push beyond limits</span>
      <span className="star-container" />
    </span>
  );

  // 6 pain points + 1 center
  const bubbles: { text: string; color: 'gray' | 'yellow' | 'red'; pos: string }[] = [
    { text: 'Tìm kiếm HLV giỏi ở đâu?',                                  color: 'gray',   pos: 'b1' },
    { text: 'Tôi không biết ai thực sự phù hợp với tôi',                  color: 'yellow', pos: 'b2' },
    { text: 'Có quá nhiều HLV "lùa gà" trên mạng',                        color: 'yellow', pos: 'b4' },
    { text: 'Chi phí bỏ ra cho HLV không xứng đáng với kết quả nhận được', color: 'yellow', pos: 'b3' },
    { text: 'Tôi bị mất niềm tin vào HLV trên mạng',                      color: 'gray',   pos: 'b6' },
    { text: 'Tôi cần ai đó chỉ dẫn đúng lúc khó nhất',                    color: 'gray',   pos: 'b5' },
  ];

  return (
    <section className="ponder-section">
      <div className="ponder-section__container" ref={containerRef}>
        <h2 className="ponder-section__title">
          Bạn đã cố gắng tự tập luyện chăm chỉ{" "}
          <span className="highlight">nhưng vẫn không hiệu quả?</span>
        </h2>

        <p className="ponder-section__subtitle">
          Xem bao nhiêu video trên YouTube cũng không thể giúp bạn tiến bộ.
          Bạn cần một huấn luyện viên thật sự phù hợp, nhưng giữa thị trường hỗn loạn,
          đâu mới là người đáng tin?
        </p>

        <motion.div
          className="ponder-section__content"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {bubbles.map((b, i) => (
            <div
              key={b.pos}
              ref={(el) => { bubbleRefs.current[i] = el; }}
              className={`ponder-section__item ${b.color} ${b.pos}`}
            >
              {b.text}
            </div>
          ))}

          {/* Câu hỏi trung tâm */}
          <div
            ref={(el) => { bubbleRefs.current[6] = el; }}
            className="ponder-section__item red center"
          >
            Làm thế nào để tôi chơi thực sự tốt hơn?
          </div>
        </motion.div>
      </div>

      <Marquee speed={40} gradient={false}>
        {Array(20).fill(0).map((_, i) => (
          <div key={i}><MarqueeItem /></div>
        ))}
      </Marquee>
    </section>
  );
};

export default Ponder;
