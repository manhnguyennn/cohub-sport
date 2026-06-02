import Link from 'next/link';
import { ROUTES } from '@config/routes';

export default function CoachFinalCta() {
  return (
    <section className="coach-final-cta">
      <div className="coach-final-cta__container">
        <div className="coach-final-cta__grid">
          <div className="coach-final-cta__card coach-final-cta__card--coach">
            <div>
              <div className="coach-final-cta__card-title">Find your future coach</div>
              <p className="coach-final-cta__card-text">
                Whether you&apos;re a beginner trying to learn the basics or training to compete at the
                highest levels, you&apos;re not on this journey alone. Get a coach who will guide you to your goals.
              </p>
            </div>
            <Link href={ROUTES.coaches} className="coach-final-cta__card-btn">
              Browse Coaches
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="coach-final-cta__card coach-final-cta__card--sport">
            <div>
              <div className="coach-final-cta__card-title">Interested in other sports?</div>
              <p className="coach-final-cta__card-text">
                Our vision at CoHub is to create a platform that gives all students of the world
                access to the best coaches on earth, no matter the sport.
              </p>
            </div>
            <Link href={ROUTES.coaches} className="coach-final-cta__card-btn">
              See other sports
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
