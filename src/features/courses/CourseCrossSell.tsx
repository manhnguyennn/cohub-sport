import Link from 'next/link';
import AppIcon from '@components/ui/AppIcon';
import { formatVND } from '@lib/date';
import { ROUTES } from '@config/routes';

type Props = {
  coachName: string;
  coachSlug: string;
  /** Học phí buổi lẻ rẻ nhất của coach (VND) */
  fromPrice?: number;
};

/**
 * Cross-sell ngược về Flow 2 (spec §4.3.5 K5) — đặt cuối trang course detail.
 * "Lịch không phù hợp? Đặt buổi lẻ với coach theo lịch riêng của bạn."
 */
export default function CourseCrossSell({ coachName, coachSlug, fromPrice }: Props) {
  return (
    <section className="course-crosssell">
      <div className="course-crosssell__icon" aria-hidden><AppIcon name="lamp" size={22} /></div>
      <div className="course-crosssell__body">
        <h3>Lịch không phù hợp?</h3>
        <p>
          Bạn có thể đặt buổi lẻ với Coach {coachName} theo lịch riêng của bạn.
          {fromPrice != null && <> Từ {formatVND(fromPrice)}/buổi.</>}
        </p>
      </div>
      <Link href={`${ROUTES.coachDetail(coachSlug)}#open-sessions`} className="course-crosssell__btn">
        Xem lịch dạy mở của coach →
      </Link>
    </section>
  );
}
