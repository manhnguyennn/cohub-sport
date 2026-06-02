'use client';

import Masonry from "react-masonry-css";

// const heights = ["58vh", "69.14vh", "49.88vh", "46.42vh", "42.96vh", "77.16vh"];
const breakpointCols = { default: 3, 1400: 2, 924: 1 };
const heights = [
  {
    image: "/images/Testimonial.png",
    title: "10 out of 10!",
    text: "Chỉ sau 3 tháng, tôi cải thiện cú swing, tăng thêm khoảng cách và tự tin hơn khi ra sân.",
    name: "Matt McCormick",
    avatar: "/images/Testimonial.png"
  },
  {
    image: "/images/Testimonial.png",
    title: "Chỉ sau 3 tháng,",
    text: "Chỉ sau 3 tháng, tôi cải thiện cú swing, tăng thêm khoảng cách và tự tin hơn khi ra sân. Chỉ sau 3 tháng, tôi cải thiện cú swing, tăng thêm khoảng cách và tự tin hơn khi ra sân.",
    name: "Matt McCormick",
    avatar: "/images/Testimonial.png"
  },
  {
    image: "/images/Testimonial.png",
    title: "Chỉ sau 3 tháng,",
    text: "Chỉ sau 3 tháng, tôi cải thiện cú swing, tăng thêm khoảng cách và tự tin hơn khi ra sân. hi",
    name: "Matt McCormick",
    avatar: "/images/Testimonial.png"
  }, {
    image: "/images/Testimonial.png",
    title: "10 out of 10!",
    text: "Chỉ sau 3 tháng, tôi cải thiện cú swing, tăng thêm khoảng cách và tự tin hơn khi ra sân.",
    name: "Matt McCormick",
    avatar: "/images/Testimonial.png"
  },
  {
    image: "/images/Testimonial.png",
    title: "Chỉ sau 3 tháng,",
    text: "Chỉ sau 3 tháng, tôi cải thiện cú swing, tăng thêm khoảng cách và tự tin hơn khi ra sân. Chỉ sau 3 tháng, tôi cải thiện cú swing, tăng thêm khoảng cách và tự tin hơn khi ra sân.",
    name: "Matt McCormick",
    avatar: "/images/Testimonial.png"
  },
  {
    image: "/images/Testimonial.png",
    title: "Chỉ sau 3 tháng,",
    text: "Chỉ sau 3 tháng, tôi cải thiện cú swing, tăng thêm khoảng cách và tự tin hơn khi ra sân. hi",
    name: "Matt McCormick",
    avatar: "/images/Testimonial.png"
  }
]

export default function Customers() {
  return (
    <section className="customer-section">
      <div className="customer-section__container">
        <div className="title">Khách hàng nói gì về CoHub</div>
        <div className="content">


          <Masonry
            breakpointCols={breakpointCols}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {heights.map((height, index) => (
              <div
                key={index}
                className="my-item"
                style={{
                  background: "#1F1F21",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <div className="unit-container">
                  <img src={height.image} className="pic-1" alt="img" />
                  <div className="title">{height.title}</div>
                  <div className="subtitle">
                    {height.text}
                  </div>
                  <div className="line">
                    <img src={height.avatar} className="avatar-container" alt="img" />


                    <div className="name-container">{height.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>

        </div>
      </div>
    </section>
  );
}
