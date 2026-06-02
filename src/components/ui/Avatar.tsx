import Image from 'next/image';
import { cn } from '@lib/cn';

type AvatarProps = {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
};

export default function Avatar({ src, alt, size = 40, className }: AvatarProps) {
  if (!src) {
    return (
      <div
        className={cn(className)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'var(--bg-subtle)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: size * 0.4,
          fontWeight: 600,
        }}
        aria-label={alt}
      >
        {alt.slice(0, 1).toUpperCase()}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
    />
  );
}
