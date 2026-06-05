'use client';

import React, { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@config/routes";
import AppIcon from "@components/ui/AppIcon";
import SportSearchModal from "./SportSearchModal";
import type { Sport } from "@app-types/sport";

type FeatureHeroProps = {
  /** Server-fetched sports — dùng cho modal tìm kiếm */
  sports: Sport[];
};

const FeatureHero: React.FC<FeatureHeroProps> = ({ sports }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="feature-hero">
      <div className="feature-hero__container">
        <div className="feature-hero__content">
          <h1 className="feature-hero__title feature-hero__title--accent">
            Tìm đúng coach. <br />
            <span className="highlight">Bứt phá</span> đúng cách.
          </h1>
          <p className="feature-hero__subtitle">
            Kết nối với coach đã xác minh. Đặt buổi 1-1 hoặc đăng ký khoá học có lịch sẵn — bạn chọn cách phù hợp với mình.
          </p>

          {/* Search bar lớn — click mở modal chọn môn + khu vực + lịch */}
          <button
            type="button"
            className="hero-search"
            onClick={() => setSearchOpen(true)}
          >
            <span className="hero-search__seg hero-search__seg--sport">
              <AppIcon name="search" size={18} />
              Bạn muốn học môn gì?
            </span>
            <span className="hero-search__divider" aria-hidden />
            <span className="hero-search__seg hero-search__seg--area">
              <AppIcon name="location" size={16} />
              Khu vực
            </span>
            <span className="hero-search__btn">
              <AppIcon name="search" size={18} color="#fff" />
              <span className="hero-search__btn-label">Tìm coach</span>
            </span>
          </button>

          {/* Entry thứ cấp sang Khoá học (Flow 3) */}
          <Link href={ROUTES.courses} className="feature-hero__course-link">
            Hoặc xem khoá học có sẵn
            <AppIcon name="next" size={15} />
          </Link>
        </div>
      </div>

      {searchOpen && (
        <SportSearchModal sports={sports} onClose={() => setSearchOpen(false)} />
      )}
    </div>
  );
};

export default FeatureHero;
