import CoachCard from './CoachCard';
import { EmptyState } from '@components/ui';
import type { Coach } from '@app-types/coach';

type CoachGridProps = {
  coaches: Coach[];
  emptyMessage?: string;
};

export default function CoachGrid({ coaches, emptyMessage = 'Chưa có HLV phù hợp.' }: CoachGridProps) {
  if (!coaches.length) {
    return <EmptyState title="Không tìm thấy HLV" description={emptyMessage} />;
  }
  return (
    <div className="home-coaches__grid">
      {coaches.map((c) => (
        <CoachCard key={c.id} coach={c} />
      ))}
    </div>
  );
}
