import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@config/routes';

const FindMore = () => {
  const bgFind = {
    background:
      "linear-gradient(14deg, rgba(0, 80, 255, 0.6) 28.58%, rgba(0, 80, 255, 0) 80.47%), url('/images/teambuilding.webp') center / cover",
  };

  const bgBecome = {
    background:
      "linear-gradient(14deg, rgba(46, 177, 111, 0.6) 28.58%, rgba(46, 177, 111, 0) 80.47%), url('/images/career.webp') center / cover",
  };

  return (
    <div className="find-more">
      {/* Hai banner cạnh nhau — khác CTA (không còn trùng nội dung) */}
      <div className="find-more__container">
        <div className="find-more__item" style={bgFind}>
          <div className="title">Find your future coach</div>
          <div className="subtitle">
            Dù bạn là người mới hay đã ở trình độ thi đấu, luôn có một HLV phù hợp đồng hành cùng bạn
            trên hành trình bứt phá.
          </div>
          <Link href={ROUTES.coaches} className="button">
            Browse Coaches
          </Link>
        </div>

        <div className="find-more__item" style={bgBecome}>
          <div className="title">Trở thành huấn luyện viên</div>
          <div className="subtitle">
            Bạn là chuyên gia trong lĩnh vực của mình? Tạo profile, kết nối với học viên trên toàn quốc
            và xây dựng nguồn thu nhập bền vững.
          </div>
          <Link href={ROUTES.registerCoach} className="button">
            Đăng ký HLV
          </Link>
        </div>
      </div>

      {/* Banner CTA cuối */}
      <div className="find-more__container">
        <div className="find-more__banner">
          <div className="title">
            Nếu bạn đã sẵn sàng bứt phá, <br />
            <span className="green">hãy bắt đầu ngay thôi</span>
          </div>
          <Link href={ROUTES.coaches} className="button">
            Tìm kiếm huấn luyện viên
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindMore;
