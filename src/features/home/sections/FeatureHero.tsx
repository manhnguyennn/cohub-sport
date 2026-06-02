'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@config/routes";
import type { Sport } from "@app-types/sport";

type FeatureHeroProps = {
  /** Server-fetched sports — dùng cho dropdown + chip category */
  sports: Sport[];
};

const FeatureHero: React.FC<FeatureHeroProps> = ({ sports }) => {
  const router = useRouter();

  // 7 sport phổ biến nhất để hiện chip
  const chipSports = useMemo(
    () => sports.filter((s) => s.category === 'sport').slice(0, 7),
    [sports],
  );

  // Dropdown options = tên sport thật
  const options = useMemo(() => sports.map((s) => s.name), [sports]);

  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter((o) => o.toLowerCase().includes(searchValue.toLowerCase()));

  function submit() {
    const text = searchValue.trim();
    if (!text) {
      router.push(ROUTES.coaches);
      return;
    }
    // Nếu chính xác là 1 sport → query theo sport, nếu không → free text q=
    const match = sports.find((s) => s.name.toLowerCase() === text.toLowerCase());
    if (match) {
      router.push(`${ROUTES.coaches}?sport=${match.slug}`);
    } else {
      router.push(`${ROUTES.coaches}?q=${encodeURIComponent(text)}`);
    }
  }

  return (
    <div className="feature-hero">
      <div className="feature-hero__container">
        <div className="feature-hero__content">
          <h1 className="feature-hero__title">
            Find Your Perfect <br />
            <span className="highlight">Coach </span> & Accelerate Growth
          </h1>
          <p className="feature-hero__subtitle">
            Kết nối với những huấn luyện viên hàng đầu để rèn luyện kỹ năng mới, và khai phá tiềm năng của bạn qua các buổi coaching 1-1
          </p>

          <div className="feature-hero__buttons">
            <form
              className="search-container"
              onSubmit={(e) => { e.preventDefault(); submit(); }}
            >
              <div className={`search-bar ${open ? "open" : ""}`}>
                <div className="search-icon">
                  <div className="search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M8.58335 17C12.9556 17 16.5 13.4556 16.5 9.08332C16.5 4.71107 12.9556 1.16666 8.58335 1.16666C4.2111 1.16666 0.666687 4.71107 0.666687 9.08332C0.666687 13.4556 4.2111 17 8.58335 17Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="divider">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3" height="4" viewBox="0 0 3 4" fill="none">
                      <path d="M2.33335 2.83335L0.666687 1.16669" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  className="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 150)}
                  placeholder="Chọn môn thể thao bạn muốn học"
                />

                <div className="dropdownIcon" onClick={() => setOpen(!open)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="7" viewBox="0 0 11 7" fill="none">
                    <path d="M5.65579 6.51057C5.53527 6.51057 5.4231 6.49133 5.31927 6.45287C5.21542 6.41442 5.1167 6.34839 5.02312 6.25479L0.528889 1.76057C0.390422 1.62212 0.319589 1.44808 0.316389 1.23847C0.313172 1.02887 0.384006 0.851629 0.528889 0.706766C0.673758 0.561882 0.849388 0.489441 1.05579 0.489441C1.26219 0.489441 1.43782 0.561882 1.58269 0.706766L5.65579 4.77984L9.72893 0.706766C9.86733 0.568299 10.0413 0.497466 10.251 0.494266C10.4606 0.491049 10.6378 0.561882 10.7827 0.706766C10.9275 0.851629 11 1.02727 11 1.23367C11 1.44007 10.9275 1.6157 10.7827 1.76057L6.28847 6.25479C6.19488 6.34839 6.09617 6.41442 5.99232 6.45287C5.88848 6.49133 5.77631 6.51057 5.65579 6.51057Z" fill="white" fillOpacity="0.3" />
                  </svg>
                </div>

                {open && filtered.length > 0 && (
                  <div className="dropdown-menu">
                    {filtered.map((item) => (
                      <div
                        key={item}
                        className="dropdown-item"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchValue(item);
                          setOpen(false);
                          const match = sports.find((s) => s.name === item);
                          if (match) router.push(`${ROUTES.coaches}?sport=${match.slug}`);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="search-button">Danh sách coach</button>
            </form>

            <div className="hero-category">
              <div className="category-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                  <path d="M2.25 13.2888L6.43966 9.09914L9.23276 11.8922L15.75 5.375" stroke="white" strokeWidth="1.65517" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.0948 5.375H15.75V10.0302" stroke="white" strokeWidth="1.65517" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {chipSports.map((sport) => (
                <Link
                  key={sport.id}
                  href={`${ROUTES.coaches}?sport=${sport.slug}`}
                  className="category-item"
                >
                  {sport.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureHero;
