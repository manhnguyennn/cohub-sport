import { Spinner } from '@components/ui';

export default function Loading() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner size={36} />
    </div>
  );
}
