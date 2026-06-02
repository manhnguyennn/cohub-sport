import React from "react";

/**
 * Usage section — 3 unique value props (bỏ 6 item trùng lặp cũ).
 * Layout: CSS grid auto-fit minmax → 3 cột desktop, 2 cột tablet, 1 cột mobile.
 */
const Usage: React.FC = () => {
  const usageItem = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="33" viewBox="0 0 38 33" fill="none">
          <g clipPath="url(#u-clip-1)">
            <path d="M6.79938 26.6866C6.22967 26.3763 5.75328 25.9194 5.41959 25.3631C5.08478 24.7994 4.91245 24.1541 4.92166 23.4985V14.866L0.947381 12.6698C0.65086 12.5124 0.402323 12.2779 0.228001 11.9911C0.0741803 11.7196 -0.00451973 11.412 1.2596e-06 11.1C1.2596e-06 10.7751 0.0760012 10.4789 0.229312 10.2116C0.382622 9.94561 0.622415 9.71892 0.950001 9.53285L16.1382 1.2554C16.4 1.10854 16.6803 0.997484 16.9716 0.925195C17.5495 0.782748 18.1534 0.782748 18.7314 0.925195C19.017 0.995954 19.2948 1.10602 19.5661 1.2554L36.7224 10.5929C37.029 10.758 37.2636 10.9821 37.4274 11.2651C37.5899 11.5482 37.6711 11.8535 37.6711 12.1797V23.9204C37.6711 24.3424 37.5283 24.6962 37.2426 24.9818C37.1041 25.1224 36.9382 25.233 36.7551 25.3069C36.5721 25.3809 36.3759 25.4165 36.1786 25.4116C35.7554 25.4116 35.4016 25.2675 35.1159 24.9818C34.976 24.8434 34.8658 24.6779 34.7921 24.4953C34.7185 24.3128 34.6828 24.1172 34.6875 23.9204V12.7524L30.7839 14.8646V23.4972C30.7839 24.1864 30.6175 24.8075 30.286 25.3631C29.9519 25.9174 29.4919 26.359 28.9062 26.684L19.57 31.7314C19.3069 31.8802 19.0247 31.9926 18.7314 32.0655C18.1534 32.2078 17.5496 32.2078 16.9716 32.0655C16.6782 31.9926 16.3961 31.8802 16.133 31.7314L6.80069 26.6853L6.79938 26.6866Z" fill="#FE211D" />
            <path d="M36.2573 12.0957V26.0234" stroke="#FFBCBB" strokeWidth="2.98497" strokeLinecap="round" />
          </g>
          <defs><clipPath id="u-clip-1"><rect width="38" height="31.4483" fill="white" transform="translate(0 0.820312)" /></clipPath></defs>
        </svg>
      ),
      title: "Elite coaches",
      subtitle: "Đội ngũ chuyên gia hàng đầu, đã qua kiểm duyệt nghiêm ngặt và có hồ sơ thành tích rõ ràng.",
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="35" viewBox="0 0 38 35" fill="none">
          <g clipPath="url(#u-clip-2)">
            <path d="M25.9135 18.1851H24.4795V19.6192V31.0917V32.5258H25.9135H33.2369C34.5568 32.5258 35.627 31.4556 35.627 30.1356V20.5753C35.627 19.2552 34.5568 18.1851 33.2369 18.1851H25.9135Z" stroke="#FAF3E2" strokeWidth="2.86811" />
            <path d="M12.213 14.3604H13.6471V15.7945V31.0911V32.5252H12.213H4.56466C3.24464 32.5252 2.17456 31.455 2.17456 30.1351V16.7506C2.17456 15.4305 3.24464 14.3604 4.56466 14.3604H12.213Z" stroke="#FCE9C5" strokeWidth="2.86811" />
            <path d="M22.7296 32.5254H24.1638V31.0913V5.27828C24.1638 3.95826 23.0937 2.88818 21.7736 2.88818H16.0374C14.7173 2.88818 13.6473 3.95826 13.6473 5.27828V31.0913V32.5254H15.0814H22.7296Z" stroke="#F4B43F" strokeWidth="2.86811" />
          </g>
          <defs><clipPath id="u-clip-2"><rect width="36.5185" height="34" fill="white" transform="translate(0.740723 0.544434)" /></clipPath></defs>
        </svg>
      ),
      title: "Đánh giá toàn diện",
      subtitle: "Chia sẻ mục tiêu, chỉ số luyện tập, chấn thương, rào cản và nhiều hơn để được tư vấn cá nhân hoá.",
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="35" viewBox="0 0 38 35" fill="none">
          <g clipPath="url(#u-clip-3)">
            <path d="M7.55266 29.2254L3.72487 33.0533C3.18067 33.5975 2.55495 33.7206 1.84773 33.4228C1.14049 33.125 0.786865 32.5888 0.786865 31.8141V4.0009C0.786865 3.03505 1.12148 2.2175 1.79071 1.54827C2.45993 0.879048 3.27748 0.544434 4.24333 0.544434H33.6598C34.6257 0.544434 35.4432 0.879048 36.1125 1.54827C36.7816 2.2175 37.1162 3.03505 37.1162 4.0009V25.769C37.1162 26.7349 36.7816 27.5524 36.1125 28.2217C35.4432 28.8909 34.6257 29.2254 33.6598 29.2254H7.55266Z" fill="#FAF3E2" />
            <path d="M22.4821 22.0554H11.5979C11.1052 22.0554 10.694 21.8905 10.3643 21.5607C10.0346 21.2311 9.86975 20.8199 9.86975 20.3272V9.44303C9.86975 8.95032 10.0346 8.5391 10.3643 8.20939C10.694 7.87969 11.1052 7.71484 11.5979 7.71484H22.4821C22.9747 7.71484 23.386 7.87969 23.7157 8.20939C24.0453 8.5391 24.2102 8.95032 24.2102 9.44303V13.4143L27.2218 10.4027C27.3689 10.2557 27.5288 10.2189 27.7016 10.2925C27.8745 10.366 27.9609 10.502 27.9609 10.7006V19.0695C27.9609 19.2681 27.8745 19.4042 27.7016 19.4777C27.5288 19.5512 27.3689 19.5146 27.2218 19.3675L24.2102 16.356V20.3272C24.2102 20.8199 24.0453 21.2311 23.7157 21.5607C23.386 21.8905 22.9747 22.0554 22.4821 22.0554Z" fill="#7A9FFF" />
          </g>
          <defs><clipPath id="u-clip-3"><rect width="36.5185" height="34" fill="white" transform="translate(0.740723 0.544434)" /></clipPath></defs>
        </svg>
      ),
      title: "Phản hồi nhanh",
      subtitle: "Không cần chờ đợi giữa buổi tập. Gửi câu hỏi & video bất cứ lúc nào, HLV phản hồi trong vòng giờ.",
    },
  ];

  return (
    <section className="usage-section">
      <div className="usage-section__container">
        <div className="usage-section__content">
          <h2 className="title">
            There&apos;s a better way.{" "}
            <span className="highlight">Become the best you know you can be.</span>
          </h2>

          {/* Grid auto-fit — không còn chia row cứng %3 */}
          <div className="body-container">
            <div className="body">
              {usageItem.map((item) => (
                <div className="item" key={item.id}>
                  <div className="icon">{item.icon}</div>
                  <div className="title">{item.title}</div>
                  <div className="subtitle">{item.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Usage;
