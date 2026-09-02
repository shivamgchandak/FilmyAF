import type { ReactElement } from 'react';

/**
 * FilmyAF's icon set, drawn inline — no library, nothing to install.
 *
 * Two registers, chosen by job:
 *   · EMOJI carry identity and warmth: the clapper on the takes wallet, the
 *     masks on the cast, the ghost on an anonymous author, the frame on a
 *     poster export. These are the product's voice and they stay.
 *   · DRAWN MARKS carry interface state: likes, counts, controls. They sit at
 *     11-13px beside numbers, so they must inherit currentColor and share the
 *     numerals' baseline. Emoji can do neither — 🤍 is white on cream, and 🔁
 *     paints its own colour box next to a grey count. These are the same
 *     1.4px line marks the mood tiles already use, so the set reads as one.
 */

const s = { stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;

const MARKS: Record<string, (filled?: boolean) => ReactElement> = {
  like: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M8 13.5C8 13.5 1.8 10 1.8 5.9 1.8 4 3.2 2.8 4.8 3.1c1 .2 2.2 1.1 3.2 2.4 1-1.3 2.2-2.2 3.2-2.4 1.6-.3 3 .9 3 2.8C14.2 10 8 13.5 8 13.5Z" {...s} />
    </svg>
  ),
  liked: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M8 13.5C8 13.5 1.8 10 1.8 5.9 1.8 4 3.2 2.8 4.8 3.1c1 .2 2.2 1.1 3.2 2.4 1-1.3 2.2-2.2 3.2-2.4 1.6-.3 3 .9 3 2.8C14.2 10 8 13.5 8 13.5Z" {...s} fill="currentColor" />
    </svg>
  ),
  comment: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M2.5 3.5h11v7.5h-6l-3.2 2.5v-2.5h-1.8Z" {...s} />
    </svg>
  ),
  clone: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1" {...s} />
      <path d="M10.5 3.5h-8v8" {...s} />
    </svg>
  ),
  view: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M1.5 8S3.9 3.8 8 3.8 14.5 8 14.5 8 12.1 12.2 8 12.2 1.5 8 1.5 8Z" {...s} />
      <circle cx="8" cy="8" r="2" {...s} />
    </svg>
  ),
  edit: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M11.2 2.6 13.4 4.8 5.6 12.6l-3 .8.8-3Z" {...s} />
      <path d="M9.8 4 12 6.2" {...s} />
    </svg>
  ),
  delete: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M2.8 4.3h10.4M6.3 4.3V2.8h3.4v1.5M4.3 4.3l.7 8.9h6l.7-8.9" {...s} />
    </svg>
  ),
  reroll: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M13.2 7.2A5.2 5.2 0 1 1 11.6 3.6" {...s} />
      <path d="M13.4 1.8v3.2h-3.2" {...s} />
    </svg>
  ),
  copy: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1" {...s} />
      <path d="M10.5 3.5h-8v8" {...s} />
    </svg>
  ),
  share: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M5.5 10.5 10.5 5.5M6.4 5.2h4.4v4.4" {...s} />
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M3 8.4 6.4 11.8 13 5.2" {...s} strokeWidth={2} />
    </svg>
  ),
  close: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M4 4l8 8M12 4l-8 8" {...s} />
    </svg>
  ),
  menu: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" {...s} />
    </svg>
  ),
  arrow: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M2.5 8h11M9.4 4 13.5 8l-4.1 4" {...s} />
    </svg>
  ),
  back: () => (
    <svg viewBox="0 0 16 16" width="100%" height="100%">
      <path d="M13.5 8h-11M6.6 4 2.5 8l4.1 4" {...s} />
    </svg>
  ),
};

/** Identity marks stay emoji — they are the product's voice, not its chrome. */
const EMOJI: Record<string, string> = {
  takes: '🎬',
  cast: '🎭',
  anonymous: '👻',
  image: '🖼️',
  reel: '🎞️',
  sparkle: '✨',
};

export type IconName = keyof typeof MARKS | keyof typeof EMOJI;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  spin?: boolean;
}

export default function Icon({ name, size = 13, className = '', spin = false }: IconProps) {
  const box = {
    width: size,
    height: size,
    fontSize: `${size}px`,
    lineHeight: 1,
  } as const;

  const wrap = ['inline-flex items-center justify-center shrink-0 select-none', spin ? 'spin' : '', className].join(' ');

  if (name in EMOJI) {
    return (
      <span aria-hidden="true" className={wrap} style={{ ...box, transform: 'translateY(0.5px)' }}>
        {EMOJI[name as keyof typeof EMOJI]}
      </span>
    );
  }

  const Mark = MARKS[name as keyof typeof MARKS];
  if (!Mark) {
    if (import.meta.env.DEV) console.warn(`[Icon] unknown name "${String(name)}"`);
    return null;
  }
  return (
    <span aria-hidden="true" className={wrap} style={box}>
      {Mark()}
    </span>
  );
}

/** A drawn ring — an emoji hourglass cannot spin smoothly or take a colour. */
export function Spinner({ size = 13, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={['inline-block shrink-0 spin rounded-full', className].join(' ')}
      style={{
        width: size,
        height: size,
        border: `${Math.max(1.5, size / 9)}px solid currentColor`,
        borderTopColor: 'transparent',
        opacity: 0.85,
      }}
    />
  );
}

/**
 * An icon locked to a number, so a row of metrics lands on one baseline
 * whichever marks are in it.
 */
export function Metric({
  name,
  value,
  size = 12,
  className = '',
}: {
  name: IconName;
  value: number | string;
  size?: number;
  className?: string;
}) {
  return (
    <span className={['inline-flex items-center gap-1.5 mono-label tabular-nums leading-none', className].join(' ')}>
      <Icon name={name} size={size} />
      {value}
    </span>
  );
}
