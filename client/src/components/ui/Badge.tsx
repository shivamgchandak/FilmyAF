import type { ReactNode } from 'react';
import { MOOD_COLORS, MOOD_LABEL, isMoodKey } from '../../lib/moods';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  /** API mood value, e.g. "90s-throwback" — renders the mood's own colours + label */
  mood?: string;
  variant?: BadgeVariant;
  children?: ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  success: { backgroundColor: 'rgba(45,122,79,0.10)', color: '#2D7A4F' },
  warning: { backgroundColor: 'rgba(232,163,61,0.12)', color: '#A06A0A' },
  danger: { backgroundColor: 'rgba(214,41,75,0.10)', color: '#D6294B' },
  neutral: { backgroundColor: 'var(--surface)', color: 'var(--t2)' },
};

export default function Badge({ mood, variant = 'neutral', children, className = '' }: BadgeProps) {
  const style =
    mood && isMoodKey(mood)
      ? { backgroundColor: MOOD_COLORS[mood].bg, color: MOOD_COLORS[mood].text }
      : VARIANT_STYLES[variant];

  const label = children ?? (mood && isMoodKey(mood) ? MOOD_LABEL[mood] : mood);

  return (
    <span
      style={style}
      className={['inline-flex items-center mono-label px-2 py-0.5 rounded-[2px]', className].join(' ')}
    >
      {label}
    </span>
  );
}
