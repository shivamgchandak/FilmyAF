import { MOOD_LABEL, MOOD_SUBTITLE, MOOD_MARK, type MoodKey } from '../../lib/moods';

interface MoodTileProps {
  mood: MoodKey;
  selected?: boolean;
  onClick?: () => void;
}

export default function MoodTile({ mood, selected = false, onClick }: MoodTileProps) {
  const Mark = MOOD_MARK[mood];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'flex flex-col items-start gap-2 px-4 py-4 border rounded-[2px] cursor-pointer transition-all duration-150 text-left w-full',
        selected
          ? 'border-[#D6294B] bg-[var(--accent-sub)] text-[#D6294B]'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--t2)] hover:border-[var(--border-strong)] hover:text-[var(--t1)] hover:bg-[var(--surface-hi)]',
      ].join(' ')}
    >
      <div className={selected ? 'text-[#D6294B]' : 'text-[var(--t3)]'} style={{ transition: 'color 150ms' }}>
        <Mark />
      </div>
      <div>
        <p className="mono-label" style={{ color: selected ? '#D6294B' : 'var(--t1)' }}>
          {MOOD_LABEL[mood]}
        </p>
        <p
          className="mt-0.5"
          style={{ fontSize: '11px', color: selected ? 'rgba(214,41,75,0.7)' : 'var(--t3)' }}
        >
          {MOOD_SUBTITLE[mood]}
        </p>
      </div>
    </button>
  );
}
