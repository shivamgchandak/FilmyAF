/**
 * Mood vocabulary, keyed by the values the API actually stores
 * (server/src/models/Script.js MOODS). Labels, colours, one-line
 * subtitles and the custom line-art marks all hang off these keys.
 */
export const MOOD_KEYS = [
  'romantic',
  'action',
  'comedy',
  'thriller',
  'tragic',
  'masala',
  'mythological',
  '90s-throwback',
] as const;

export type MoodKey = (typeof MOOD_KEYS)[number];

export const MOOD_LABEL: Record<MoodKey, string> = {
  romantic: 'Romantic',
  action: 'Action',
  comedy: 'Comedy',
  thriller: 'Thriller',
  tragic: 'Tragic',
  masala: 'Masala',
  mythological: 'Mythological',
  '90s-throwback': '90s Throwback',
};

export const MOOD_SUBTITLE: Record<MoodKey, string> = {
  romantic: 'Love in three acts',
  action: 'Every second counts',
  comedy: 'Tragedy with better timing',
  thriller: 'The plot was there',
  tragic: 'Someone cries beautifully',
  masala: 'Everything, all at once',
  mythological: 'The gods are watching',
  '90s-throwback': 'VHS quality, peak emotion',
};

export const MOOD_COLORS: Record<MoodKey, { bg: string; text: string }> = {
  romantic: { bg: 'rgba(214,41,75,0.10)', text: '#D6294B' },
  action: { bg: 'rgba(232,88,41,0.10)', text: '#C94E1A' },
  comedy: { bg: 'rgba(232,163,61,0.12)', text: '#A06A0A' },
  thriller: { bg: 'rgba(26,24,21,0.08)', text: 'var(--t2)' },
  tragic: { bg: 'rgba(91,77,139,0.10)', text: '#5B4D8B' },
  masala: { bg: 'rgba(214,41,75,0.10)', text: '#D6294B' },
  mythological: { bg: 'rgba(61,155,120,0.10)', text: '#2A7A5E' },
  '90s-throwback': { bg: 'rgba(232,163,61,0.12)', text: '#8A5E00' },
};

export const isMoodKey = (v: unknown): v is MoodKey =>
  typeof v === 'string' && (MOOD_KEYS as readonly string[]).includes(v);

export const moodLabel = (v: unknown): string => (isMoodKey(v) ? MOOD_LABEL[v] : String(v ?? ''));

/* ── Marks: line art, one per mood. Inherit currentColor. ───────── */

const Romantic = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="6" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="18" y="6" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 10h4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 22 C14 20, 10 18, 10 15 C10 13 11.5 12 13 12.5 C14 12.8 15 13.5 16 14.5 C17 13.5 18 12.8 19 12.5 C20.5 12 22 13 22 15 C22 18 18 20 16 22Z" stroke="currentColor" strokeWidth="1.3" fill="none" />
  </svg>
);

const Action = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M6 22L16 6l10 16H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6 22h20" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 6v16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="16" cy="6" r="2" fill="currentColor" />
  </svg>
);

const Comedy = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="12" cy="14" r="8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="22" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 16 Q12 19 15 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M19 20 Q22 23 25 20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const Thriller = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <ellipse cx="16" cy="16" rx="13" ry="8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    <path d="M3 16 Q9 10 16 16 Q23 22 29 16" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2" />
  </svg>
);

const Tragic = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 6 C16 6 24 10 24 17 C24 21 20.4 24 16 24 C11.6 24 8 21 8 17 C8 10 16 6 16 6Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 14 Q16 17 19 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M16 24 L16 28" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 27 L20 27" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const Masala = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 26 C16 26 8 20 8 14 C8 10 11 8 14 9 C14 9 14 12 16 12 C18 12 18 9 18 9 C21 8 24 10 24 14 C24 20 16 26 16 26Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 13 C13 13 13 16 16 16 C19 16 19 13 19 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M16 6 C16 6 15 8 16 9 C17 8 16 6 16 6Z" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const Mythological = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L16 28" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 10 L16 4 L22 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 14 L10 18 L16 22 L22 18 L24 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 26 Q16 28 20 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Throwback = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="10" width="24" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="8" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="18" y="8" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="11" cy="17" r="3" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="21" cy="17" r="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M14 17 L18 17" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const MOOD_MARK: Record<MoodKey, () => React.ReactElement> = {
  romantic: Romantic,
  action: Action,
  comedy: Comedy,
  thriller: Thriller,
  tragic: Tragic,
  masala: Masala,
  mythological: Mythological,
  '90s-throwback': Throwback,
};
