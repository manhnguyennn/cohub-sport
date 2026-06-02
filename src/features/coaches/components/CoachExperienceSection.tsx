import type { Coach } from '@app-types/coach';

type Props = { coach: Coach };

export default function CoachExperienceSection({ coach }: Props) {
  const experiences = coach.experiences ?? [];
  const certificates = coach.certificates ?? [];
  if (experiences.length === 0 && certificates.length === 0) return null;

  return (
    <section id="experience" className="coach-section coach-experience-section">
      <div className="coach-experience-grid">
        {/* Kinh nghiệm — timeline trong card orange */}
        <div>
          <h2 className="coach-section__title">Kinh nghiệm</h2>
          <div className="exp-card">
            {experiences.map((e, i) => {
              const isLast = i === experiences.length - 1;
              return (
                <div className="exp-card__row" key={`${e.year}-${i}`}>
                  <div className="exp-card__rail" aria-hidden>
                    {i > 0 && <span className="exp-card__rail-line exp-card__rail-line--top" />}
                    <span className="exp-card__rail-dot" />
                    {!isLast && <span className="exp-card__rail-line exp-card__rail-line--bottom" />}
                  </div>
                  <div className="exp-card__body">
                    <span className="exp-card__year">{e.year}</span>
                    <span className="exp-card__org">{e.organization}</span>
                    <span className="exp-card__role">{e.role}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chứng chỉ — card list */}
        <div>
          <h2 className="coach-section__title">Chứng chỉ</h2>
          <div className="cert-list">
            {certificates.map((c, i) => (
              <div className="cert-card" key={`${c.year}-${i}`}>
                <span className="cert-card__icon" aria-hidden>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden>
                    <path d="M15.58 12.97l-.18 4.79c-.07 1.31-1.03 2.96-2.08 3.71l-.71.51c-.84.6-2.21.6-3.04 0l-.71-.51c-1.05-.75-2.01-2.4-2.08-3.71l-.18-4.79c-.04-.92.62-2.04 1.41-2.39l1.85-.79c1.18-.5 3.07-.5 4.25 0l1.85.79c.79.35 1.45 1.47 1.41 2.39z" />
                    <path d="M19.06 7.27l-2.55-.59c-.61-.14-.83-.6-.48-1.04l1.61-2.04c.34-.43.06-.99-.5-.99h-9.28c-.56 0-.83.56-.5.99l1.61 2.04c.35.44.13.9-.48 1.04l-2.55.59C5.5 7.43 5.2 8.13 5.71 8.82l2.04 2.8c.55.76 1.45 1.18 2.4 1.18h3.71c.95 0 1.85-.42 2.4-1.18l2.04-2.8c.5-.69.2-1.39-.24-1.55z" />
                  </svg>
                </span>
                <div className="cert-card__body">
                  <strong>{c.name}</strong>
                  <small>{c.year}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
