/**
 * FilmyAF users pick an avatarEmoji at signup, so that is the avatar.
 * Initials on a generated hue are the fallback when a record has none.
 */
interface AvatarProps {
  emoji?: string;
  handle?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  xs: { box: 'w-6 h-6', text: 'text-[11px]' },
  sm: { box: 'w-8 h-8', text: 'text-[14px]' },
  md: { box: 'w-10 h-10', text: 'text-[18px]' },
  lg: { box: 'w-14 h-14', text: 'text-[26px]' },
};

function hue(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (str.charCodeAt(i) + h * 31) % 360;
  return h;
}

export default function Avatar({ emoji, handle = '', name, size = 'md', className = '' }: AvatarProps) {
  const s = SIZES[size];

  if (emoji) {
    return (
      <div
        title={name ?? handle}
        className={[s.box, s.text, 'rounded-[2px] flex items-center justify-center flex-shrink-0 select-none border border-[var(--border)] bg-[var(--surface-hi)]', className].join(' ')}
      >
        {emoji}
      </div>
    );
  }

  const initials = (name ?? handle)
    .split(/[\s.]+/)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');

  return (
    <div
      title={name ?? handle}
      className={[s.box, 'rounded-[2px] flex items-center justify-center font-mono font-semibold text-[#F4F1E8] select-none flex-shrink-0 uppercase tracking-wider text-[11px]', className].join(' ')}
      style={{ backgroundColor: `hsl(${hue(handle)},45%,38%)` }}
    >
      {initials || '?'}
    </div>
  );
}
