export const MOOD_LABELS = {
  romantic: { label: 'Romantic', emoji: '💕' },
  action: { label: 'Action', emoji: '💥' },
  comedy: { label: 'Comedy', emoji: '😂' },
  thriller: { label: 'Thriller', emoji: '🔪' },
  tragic: { label: 'Tragic', emoji: '😭' },
  masala: { label: 'Masala', emoji: '🌶️' },
  mythological: { label: 'Mythological', emoji: '⚡' },
  '90s-throwback': { label: '90s Throwback', emoji: '📼' },
};

export const formatMood = (mood) =>
  MOOD_LABELS[mood] ? `${MOOD_LABELS[mood].emoji} ${MOOD_LABELS[mood].label}` : mood;

export const timeAgo = (iso) => {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
};

export const fullName = (user) =>
  user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : '';

export const formatIST = (iso) => {
  if (!iso) return '';
  const formatted = new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${formatted} IST`;
};

