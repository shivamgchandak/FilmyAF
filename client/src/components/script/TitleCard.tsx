import Badge from '../ui/Badge';
import Icon, { Spinner } from '../ui/Icon';

interface TitleCardProps {
  title: string;
  tagline?: string;
  mood?: string;
  isOwner?: boolean;
  regenerating?: boolean;
  onReroll?: () => void;
}

export default function TitleCard({
  title,
  tagline,
  mood,
  isOwner = false,
  regenerating = false,
  onReroll,
}: TitleCardProps) {
  return (
    <div className="grain-surface border border-[var(--border)] rounded-[2px] bg-[var(--surface)] px-6 py-7">
      <div className="relative z-[2] flex items-start justify-between gap-4">
        <div className="min-w-0">
          {mood && <Badge mood={mood} className="mb-3" />}
          <h1 className="display-lg text-[var(--t1)] mb-2" style={{ textWrap: 'balance' }}>
            {title}
          </h1>
          {tagline && <p className="body-lg text-[var(--t2)] italic">{tagline}</p>}
        </div>
        {isOwner && onReroll && (
          <button
            onClick={onReroll}
            disabled={regenerating}
            title="New title and tagline"
            className="flex items-center gap-1.5 mono-label text-[var(--t3)] hover:text-[#D6294B] transition-colors px-2 py-1 border border-transparent hover:border-[var(--border)] rounded-[2px] disabled:opacity-40 flex-shrink-0"
          >
            {regenerating ? <Spinner size={11} /> : <Icon name="reroll" size={11} />}
            {regenerating ? 'Rolling' : 'Re-roll'}
          </button>
        )}
      </div>
    </div>
  );
}
