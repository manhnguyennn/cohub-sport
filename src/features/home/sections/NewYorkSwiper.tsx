'use client';

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Navigation, Pagination, FreeMode } from "swiper/modules";
const NewYorkSwiper = () => {
    const data = [
        {
            title: "I’m quite visual. I like to see what I want to change, what’s going well, in front of me. The app is good for that. I can put a picture to my mind to see and a voice to guide me.",
            image: "/assets/image.webp"
        },
        {
            title: "I’m quite visual. I like to see what I want to change, what’s going well, in front of me. The app is good for that. I can put a picture to my mind to see and a voice to guide me.",
            image: "/assets/image.webp"
        }
    ]
    return (
        <div className="swiper--newyork">
            <Swiper className="swiper--newyork__container"
                freeMode={true}
                slidesPerView={1}
                spaceBetween={0}
                pagination={{
                    clickable: true,
                    el: ".swiper--newyork__pagination",
                    bulletClass: "swiper-pagination-bullet",
                    bulletActiveClass: "swiper-pagination-bullet-active",
                }}
                modules={[Navigation, Pagination, FreeMode]}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index}>
                        <img src={item.image} className="title" alt="img" />
                        <div className="subtitle">
                            {item.title}
                        </div>
                    </SwiperSlide>
                ))}

            </Swiper>

            <div className="swiper--newyork__pagination">

            </div>
        </div>
    );
};
export default NewYorkSwiper;