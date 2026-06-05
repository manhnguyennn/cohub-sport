'use client';

/**
 * Lưới "Short Videos" của coach (figma): thumbnail + play + caption.
 * Mock: click → toast.
 */
import Image from 'next/image';
import AppIcon from '@components/ui/AppIcon';
import { useToast } from '@contexts/ToastContext';

export default function CourseShortVideos({ poster, captions }: { poster: string; captions: string[] }) {
  const toast = useToast();
  if (!captions.length) return null;

  return (
    <div className="course-videos">
      {captions.slice(0, 4).map((cap, i) => (
        <button
          key={i}
          type="button"
          className="course-videos__item"
          onClick={() => toast.info('Demo: video hướng dẫn sẽ phát ở bản chính thức.')}
        >
          <span className="course-videos__thumb">
            <Image src={poster} alt="" fill sizes="180px" style={{ objectFit: 'cover' }} />
            <span className="course-videos__play" aria-hidden>
              <AppIcon name="play" size={18} color="#fff" variant="Bold" />
            </span>
          </span>
          <span className="course-videos__cap">{cap}</span>
        </button>
      ))}
    </div>
  );
}
