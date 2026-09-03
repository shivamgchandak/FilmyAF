import type { ReactElement } from 'react';
import { Sun, Moon, ImageDown, type LucideIcon } from 'lucide-react';

/**
 * FilmyAF's icon set, drawn inline - no library, nothing to install.
 *
 * Three registers, chosen by job:
 *   · EMOJI carry identity and warmth: the clapper on the takes wallet, the
 *     masks on the cast, the ghost on an anonymous author, the frame on a
 *     poster export. These are the product's voice and they stay.
 *   · DRAWN MARKS carry interface state: likes, counts, controls. They sit at
 *     11-13px beside numbers, so they must inherit currentColor and share the
 *     numerals' baseline. Emoji can do neither - 🤍 is white on cream, and 🔁
 *     paints its own colour box next to a grey count. These are the same
 *     1.4px line marks the mood tiles already use, so the set reads as one.
 *   · LUCIDE covers the theme switch only. Sun and moon have no emoji that
 *     reads at 14px in a 28px box - ☀️ and 🌗 arrive pre-coloured and go muddy
 *     against the border, where a line mark takes --t3 and lifts on hover.
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

/** Identity marks stay emoji - they are the product's voice, not its chrome. */
const EMOJI: Record<string, string> = {
  takes: '🎬',
  cast: '🎭',
  anonymous: '👻',
  image: '🖼️',
  reel: '🎞️',
  sparkle: '✨',
};

/** Chrome that emoji cannot serve: theme state and the poster export, both of
 *  which must take a colour from the control they sit in. */
const LUCIDE: Record<string, LucideIcon> = {
  sun: Sun,
  moon: Moon,
  poster: ImageDown,
};

/**
 * Brand glyphs, inlined.
 *
 * Lucide ships no third-party logos - the project removed its brand set, so
 * there is no `Whatsapp` or `Twitter` to import. These are the official marks:
 * solid shapes on a 24-box, filled with currentColor and carrying no stroke,
 * which is why they live apart from MARKS (line art) rather than inside it.
 * A logo is a fixed shape - do not restyle or redraw these.
 */
const BRANDS: Record<string, () => ReactElement> = {
  whatsapp: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  ),
  x: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
};

export type IconName =
  | keyof typeof MARKS
  | keyof typeof EMOJI
  | keyof typeof LUCIDE
  | keyof typeof BRANDS;

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

  const Lucide = LUCIDE[name as keyof typeof LUCIDE];
  if (Lucide) {
    return (
      <span aria-hidden="true" className={wrap} style={box}>
        {/* Relative stroke, not absoluteStrokeWidth: 2 on Lucide's 24-box
            renders ~1.1px at 13px, which sits beside the drawn marks' 1.6-on-16
            (~1.3px) without either register looking bolder than the other. */}
        <Lucide size={size} strokeWidth={2} />
      </span>
    );
  }

  const Brand = BRANDS[name as keyof typeof BRANDS];
  if (Brand) {
    return (
      <span aria-hidden="true" className={wrap} style={box}>
        {Brand()}
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

/** A drawn ring - an emoji hourglass cannot spin smoothly or take a colour. */
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
