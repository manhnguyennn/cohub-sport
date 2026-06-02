type SpinnerProps = { size?: number; label?: string };

export default function Spinner({ size = 24, label = 'Đang tải…' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `${Math.max(2, size / 10)}px solid var(--border)`,
        borderTopColor: 'var(--brand)',
        borderRadius: '50%',
        animation: 'cohub-spin 0.8s linear infinite',
      }}
    >
      <style>{`@keyframes cohub-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
