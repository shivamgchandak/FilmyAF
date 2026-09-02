import Icon from './Icon';

export type TakeStatus = 'healthy' | 'low' | 'empty';

/** Low is "can't afford the main action" — a generation costs 3. */
export const takeStatus = (remaining: number): TakeStatus =>
  remaining <= 0 ? 'empty' : remaining < 3 ? 'low' : 'healthy';

const STATUS_COLOR: Record<TakeStatus, string> = {
  healthy: 'var(--t2)',
  low: '#E8A33D',
  empty: '#D6294B',
};

interface Props {
  remaining: number;
  compact?: boolean;
  anonymous?: boolean;
  className?: string;
}

/**
 * The clapper IS the word — "3 🎬" reads faster than "3 takes" and keeps the
 * unit in the product's own voice. The title attribute carries the words for
 * anyone who needs them.
 */
export default function TakesCounter({ remaining, compact = false, anonymous = false, className = '' }: Props) {
  const color = STATUS_COLOR[takeStatus(remaining)];
  const label = anonymous
    ? `${remaining} free takes left on this device`
    : `${remaining} takes left`;

  if (compact) {
    return (
      <span
        className={['inline-flex items-center gap-1.5 tabular-nums leading-none', className].join(' ')}
        style={{ color }}
        title={label}
      >
        <Icon name="takes" size={13} />
        <span className="mono-label" style={{ color }}>{remaining}</span>
      </span>
    );
  }

  return (
    <span
      className={['inline-flex items-center gap-2 px-3 py-1.5 border rounded-[2px] tabular-nums leading-none', className].join(' ')}
      style={{ color, borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      title={label}
    >
      <Icon name="takes" size={15} />
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1 }}>{remaining}</span>
    </span>
  );
}

/** A price tag: the number, then the clapper. No word needed. */
export function CostLabel({ takes, affordable = true }: { takes: number; affordable?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 mono-label tabular-nums leading-none"
      style={{ color: affordable ? 'var(--t2)' : '#D6294B' }}
      title={`Costs ${takes} take${takes === 1 ? '' : 's'}`}
    >
      {takes}
      <Icon name="takes" size={12} />
    </span>
  );
}
