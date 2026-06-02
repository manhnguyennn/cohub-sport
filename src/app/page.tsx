import {
  FeatureHero,
  Explore,
  Ponder,
  Diagram,
  Coach,
  Advantages,
  Usage,
  Sponsor,
  Customers,
  NewYorkSwiper,
  Question,
  FindMore,
} from '@features/home/sections';
import { coachService } from '@services/coach.service';
import { sportService } from '@services/sport.service';

/**
 * Home page = Features page bản gốc, port nguyên trạng từ CRA project.
 *
 * 3 trang prototype (Home / Coaches / Coach detail) liên kết qua data thật:
 *   - Section Coach   → coachService.featured()  → card link /coaches/[slug]
 *   - Section Explore → sportService.list()      → card link /coaches?sport=
 *   - FeatureHero     → chip + dropdown sport    → /coaches?sport= hoặc ?q=
 *   - FindMore        → CTA → /coaches
 */
export default async function HomePage() {
  // Parallel server fetch — mock data ở local, BE swap sau qua env DATA_SOURCE
  const [sports, featuredCoaches] = await Promise.all([
    sportService.list(),
    coachService.featured(),
  ]);

  return (
    <>
      <FeatureHero sports={sports} />
      <Explore sports={sports} />
      <Ponder />
      <Diagram />
      <Coach coaches={featuredCoaches} />
      <Advantages />
      <Usage />
      <Sponsor />
      <div className="background--black">
        <Customers />
        <NewYorkSwiper />
        <Question />
        <FindMore />
      </div>
    </>
  );
}
