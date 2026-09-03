import {
  Heart,
  Swords,
  Laugh,
  Skull,
  Frown,
  Flame,
  Zap,
  Videotape,
  type LucideIcon,
} from 'lucide-react';

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

/* ── Marks: one Lucide icon per mood, inheriting currentColor. ────
   Sizing is left to the call site so a tile and a badge can share the map.
   Two of the eight have no literal equivalent in the set: 🌶️ masala has no
   chilli, so it takes Flame (the heat, not the vegetable), and 🔪 thriller has
   no knife, so it takes Skull - the threat rather than the instrument. */

export const MOOD_MARK: Record<MoodKey, LucideIcon> = {
  romantic: Heart,
  action: Swords,
  comedy: Laugh,
  thriller: Skull,
  tragic: Frown,
  masala: Flame,
  mythological: Zap,
  '90s-throwback': Videotape,
};
