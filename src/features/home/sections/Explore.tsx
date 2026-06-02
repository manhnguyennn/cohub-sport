'use client'

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ROUTES } from "@config/routes";
import type { Sport } from "@app-types/sport";

type ExploreProps = {
  /** Từ sportService.list() — server fetch.
   *  Chỉ render category 'sport' để khớp design "Khám phá các môn thể thao". */
  sports: Sport[];
};

const Explore: React.FC<ExploreProps> = ({ sports }) => {
  const swiperRef = useRef<SwiperClass | null>(null);

  // Chỉ lấy 8 sport đầu (theo design)
  const sportsCategories = sports.filter((s) => s.category === 'sport').slice(0, 8);

  const [hovered, setHovered] = useState(
    new Array(sportsCategories.length).fill(false)
  );

  return (
    <div className="explore-section">
      <div className="explore-section__page">
        <div className="explore-section__container">
          <div className="explore-section__head">
            <h2 className="explore-section__title">Khám phá các môn thể thao</h2>
            <div className="explore-section__line">
              <div className="explore-section__subtitle">
                Mỗi bước tiến đều cần người đồng hành đúng. Tại{" "}
                <span className="highlight">Cohub</span>, bạn được
                huấn luyện bởi những chuyên gia phù hợp nhất, theo cách phù hợp nhất
                với chính bạn.
              </div>

              <div className="explore-section__controller">
                <button
                  type="button"
                  className="explore-section__control-btn"
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Previous"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9.57 18.82C9.76 18.82 9.95 18.75 10.1 18.6C10.39 18.31 10.39 17.83 10.1 17.54L4.56 12L10.1 6.46C10.39 6.17 10.39 5.69 10.1 5.4C9.81 5.11 9.33 5.11 9.04 5.4L2.97 11.47C2.68 11.76 2.68 12.24 2.97 12.53L9.04 18.6C9.19 18.75 9.38 18.82 9.57 18.82Z" fill="black" />
                    <path d="M3.67 12.75H20.5C20.91 12.75 21.25 12.41 21.25 12C21.25 11.59 20.91 11.25 20.5 11.25L3.67 11.25C3.26 11.25 2.92 11.59 2.92 12C2.92 12.41 3.26 12.75 3.67 12.75Z" fill="black" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="explore-section__control-btn"
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Next"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14.43 5.18C14.24 5.18 14.05 5.25 13.9 5.4C13.61 5.69 13.61 6.17 13.9 6.46L19.44 12L13.9 17.54C13.61 17.83 13.61 18.31 13.9 18.6C14.19 18.89 14.67 18.89 14.96 18.6L21.03 12.53C21.32 12.24 21.32 11.76 21.03 11.47L14.96 5.4C14.81 5.25 14.62 5.18 14.43 5.18Z" fill="black" />
                    <path d="M20.33 11.25H3.5C3.09 11.25 2.75 11.59 2.75 12C2.75 12.41 3.09 12.75 3.5 12.75H20.33C20.74 12.75 21.08 12.41 21.08 12C21.08 11.59 20.74 11.25 20.33 11.25Z" fill="black" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="explore-section__body">
          <div className="sports__container">
            {/* sport-grid: dùng class riêng để tránh xung đột với .coach-section__content */}
            <div className="sport-grid">
              <Swiper
                modules={[FreeMode, Pagination]}
                slidesPerView="auto"
                onSwiper={(s) => { swiperRef.current = s; }}
                spaceBetween={14}
                freeMode={{
                  enabled: true,
                  momentum: true,
                  momentumRatio: 0.5,
                  momentumVelocityRatio: 0.5,
                }}
                grabCursor
                className="line"
                pagination={{ clickable: true, el: '.swiper--pagination' }}
              >
                {sportsCategories.map((sport, index) => (
                  <SwiperSlide
                    className={`card ${index === sportsCategories.length - 1 ? "last" : ""}`}
                    onMouseEnter={() =>
                      setHovered((prev) => {
                        const copy = [...prev];
                        copy[index] = true;
                        return copy;
                      })
                    }
                    onMouseLeave={() =>
                      setHovered((prev) => {
                        const copy = [...prev];
                        copy[index] = false;
                        return copy;
                      })
                    }
                    key={sport.id}
                    style={{
                      backgroundImage: `url(${sport.image})`,
                      backgroundPosition: "center",
                      width: "285.438px",
                      backgroundSize: hovered[index] ? "105%" : "cover",
                    }}
                  >
                    <Link
                      href={`${ROUTES.coaches}?sport=${sport.slug}`}
                      className="overlay"
                    >
                      <div className="title-container">
                        <div className="title">{sport.name}</div>
                        <div className="arrow">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path
                              d="M15.4507 13.1297C15.3387 13.2416 15.1855 13.3124 15.0087 13.3124C14.667 13.3124 14.3841 13.0295 14.3841 12.6877L14.3841 6.15879L7.85518 6.15879C7.51341 6.15879 7.23057 5.87595 7.23057 5.53418C7.23057 5.19241 7.51341 4.90957 7.85518 4.90957L15.0087 4.90957C15.3505 4.90957 15.6334 5.19241 15.6334 5.53418L15.6334 12.6877C15.6334 12.8645 15.5626 13.0177 15.4507 13.1297Z"
                              fill="white"
                            />
                            <path
                              d="M15.3505 6.07653L5.43337 15.9937C5.19177 16.2353 4.79108 16.2353 4.54949 15.9937C4.30789 15.7521 4.30789 15.3514 4.54949 15.1098L14.4667 5.19264C14.7083 4.95105 15.1089 4.95105 15.3505 5.19264C15.5921 5.43424 15.5921 5.83493 15.3505 6.07653Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="role">{sport.coachCount ?? 0} Coach</div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper--pagination"></div>
            </div>
          </div>
        </div>

        {/* Bottom CTA → /coaches */}
        <Link href={ROUTES.coaches} className="show-all--btn">
          Xem tất cả
          <div className="sports__button-icon-container">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 6H14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11L15 6L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 10" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Explore;
