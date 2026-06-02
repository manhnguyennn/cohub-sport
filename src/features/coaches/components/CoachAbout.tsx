import Image from 'next/image';
import type { Coach } from '@app-types/coach';

type CoachAboutProps = { coach: Coach };

export default function CoachAbout({ coach }: CoachAboutProps) {
  return (
    <section id="about" className="coach-section">
      <h2 className="coach-section__title">Giới thiệu</h2>

      <div className="coach-about">
        {/* Video hero */}
        <div className="coach-about__video">
          <Image
            src={coach.coverImage ?? coach.avatar}
            alt={coach.fullName}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            style={{ objectFit: 'cover' }}
          />
          <span className="coach-about__video-overlay" aria-hidden />
          <button type="button" className="coach-about__play" aria-label="Phát video giới thiệu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 4.5v15l13-7.5L5 4.5z" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Bio paragraph */}
        <p className="coach-about__bio">{coach.bio}</p>

        {/* Giảng dạy bullets */}
        {coach.teachingFocus && coach.teachingFocus.length > 0 && (
          <div className="coach-about__group">
            <div className="coach-about__sub-label">Giảng dạy</div>
            <ul className="coach-about__focus-list">
              {coach.teachingFocus.map((item) => (
                <li key={item}>
                  <span className="coach-about__bullet" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="#F59E0B" strokeWidth="1.5" />
                      <circle cx="8" cy="8" r="2.5" fill="#F59E0B" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Kỹ năng tags */}
        {coach.skills && coach.skills.length > 0 && (
          <div className="coach-about__group">
            <div className="coach-about__sub-label">Kỹ năng</div>
            <div className="coach-about__skills">
              {coach.skills.map((s) => (
                <span key={s} className="coach-about__skill">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
