import Image from 'next/image';
import type { CoachShortVideo } from '@app-types/coach';

type Props = { videos: CoachShortVideo[] };

export default function CoachShortVideos({ videos }: Props) {
  if (!videos || videos.length === 0) return null;

  // Lặp video lên đủ 4 ô (theo design Figma) nếu mock không đủ
  const display = videos.length >= 4 ? videos.slice(0, 4) : [...videos, ...videos].slice(0, 4);

  return (
    <section id="videos" className="coach-section coach-videos">
      <div className="coach-videos__head">
        <h2 className="coach-section__title">Short Videos</h2>
        <div className="coach-videos__nav">
          <button type="button" className="coach-videos__nav-btn" aria-label="Trước">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <button type="button" className="coach-videos__nav-btn coach-videos__nav-btn--solid" aria-label="Sau">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      <div className="coach-videos__grid">
        {display.map((v, i) => (
          <article className="coach-videos__card" key={`${v.id}-${i}`}>
            <div className="coach-videos__item">
              <Image src={v.thumbnail} alt={v.title} fill sizes="(max-width: 768px) 50vw, 200px" style={{ objectFit: 'cover' }} />
              <span className="coach-videos__overlay" aria-hidden />
              <button type="button" className="coach-videos__play" aria-label={`Phát: ${v.title}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M5 4.5v15l13-7.5L5 4.5z" />
                </svg>
              </button>
            </div>
            <p className="coach-videos__title">{v.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
