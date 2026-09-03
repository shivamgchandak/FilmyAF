import { User } from 'lucide-react';

/**
 * An account's avatarEmoji is the avatar when there is one.
 *
 * Otherwise this is Lucide's `User` mark, not a face emoji and not the clapper.
 * The clapper was the old blanket default: it is the app's logo and it also
 * sits in the takes counter, so using it as a person marker made every user
 * look like the same user. '🎬' is therefore read as "never chosen", not as a
 * preference, until an account picks something deliberately.
 */
interface AvatarProps {
  emoji?: string;
  handle?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

/** The old blanket default. Treated as unset. */
const LEGACY_PLACEHOLDER = '🎬';

const SIZES = {
  xs: { box: 'w-6 h-6', text: 'text-[11px]', icon: 14 },
  sm: { box: 'w-8 h-8', text: 'text-[14px]', icon: 17 },
  md: { box: 'w-10 h-10', text: 'text-[18px]', icon: 21 },
  lg: { box: 'w-14 h-14', text: 'text-[26px]', icon: 28 },
};

const SHELL =
  'rounded-[2px] flex items-center justify-center flex-shrink-0 select-none border border-[var(--border)] bg-[var(--surface-hi)]';

export default function Avatar({ emoji, handle = '', name, size = 'md', className = '' }: AvatarProps) {
  const s = SIZES[size];
  const chosen = emoji && emoji !== LEGACY_PLACEHOLDER ? emoji : '';

  return (
    <div title={name ?? handle} className={[s.box, s.text, SHELL, className].join(' ')}>
      {chosen || <User size={s.icon} strokeWidth={1.75} className="text-[var(--t2)]" />}
    </div>
  );
}
