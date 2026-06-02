import React from "react";

interface DiagramItem {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

/**
 * Diagram — 3 cột nội dung thực (bỏ 2 ô trống cũ).
 * Layout: 1 card lớn bên trái (Experience) + 2 card nhỏ stacked bên phải.
 */
const Diagram: React.FC = () => {
  const mainFeature: DiagramItem = {
    title: "Experience",
    subtitle: "Đội ngũ huấn luyện viên của chúng tôi đều có kinh nghiệm trên 5 năm giảng dạy",
    backgroundImage: "/images/half.jpg",
  };

  const secondaryFeatures: DiagramItem[] = [
    {
      title: "Professional",
      subtitle: "Đội ngũ huấn luyện viên chuyên nghiệp với chứng chỉ quốc tế",
      backgroundImage: "/images/half.jpg",
    },
    {
      title: "Dedication",
      subtitle: "Tận tâm với từng học viên, đồng hành cùng sự phát triển",
      backgroundImage: "/images/half.jpg",
    },
  ];

  const ArrowIcon = () => (
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
  );

  return (
    <section className="diagram-section">
      <div className="diagram-section__container">
        <h2 className="diagram-section__title">
          Đồng hành phát triển kỹ năng
          <span className="diagram-section__title highlight"> lan tỏa tinh thần tự tin và chiến thắng</span>
        </h2>

        <div className="diagram-section__body">
          {/* Main Feature — card lớn */}
          <div
            className="half-1"
            style={{ backgroundImage: `linear-gradient(199deg, rgba(2,12,3,0) 26.95%, #020C03 87.19%), url(${mainFeature.backgroundImage})` }}
          >
            <div className="overlay">
              <div className="title">{mainFeature.title}</div>
              <div className="subtitle-container">
                <div className="content-container">
                  <div className="subtitle">{mainFeature.subtitle}</div>
                </div>
                <ArrowIcon />
              </div>
            </div>
          </div>

          {/* Secondary Features — 2 card nhỏ stacked (bỏ 2 ô trống cũ) */}
          <div className="half-2">
            {secondaryFeatures.map((feature, index) => (
              <div
                key={index}
                className="item"
                style={{ backgroundImage: `linear-gradient(199deg, rgba(2,12,3,0) 26.95%, #020C03 87.19%), url(${feature.backgroundImage})` }}
              >
                <div className="overlay">
                  <div className="title">{feature.title}</div>
                  <div className="subtitle-container">
                    <div className="content-container">
                      <div className="subtitle">{feature.subtitle}</div>
                    </div>
                    <ArrowIcon />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Diagram;
