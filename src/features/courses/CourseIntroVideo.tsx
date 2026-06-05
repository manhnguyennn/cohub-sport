'use client';

/**
 * Khối video giới thiệu (figma): poster bo góc + nút play overlay.
 * Mock: click → toast (chưa có video thật).
 */
import Image from 'next/image';
import AppIcon from '@components/ui/AppIcon';
import { useToast } from '@contexts/ToastContext';

export default function CourseIntroVideo({ poster, title }: { poster: string; title: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      className="course-intro-video"
      onClick={() => toast.info('Demo: video giới thiệu khoá học sẽ phát ở bản chính thức.')}
      aria-label={`Phát video giới thiệu — ${title}`}
    >
      <Image src={poster} alt="" fill sizes="(max-width: 1024px) 100vw, 720px" style={{ objectFit: 'cover' }} />
      <span className="course-intro-video__play" aria-hidden>
        <AppIcon name="play" size={26} color="#fff" variant="Bold" />
      </span>
    </button>
  );
}
