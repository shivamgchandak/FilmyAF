import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Spinner } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#D6294B] text-[#F4F1E8] border border-[#D6294B] hover:bg-[#BF2241] hover:border-[#BF2241] active:bg-[#A81D38]',
  secondary:
    'bg-transparent text-[var(--t1)] border border-[var(--border-strong)] hover:bg-[var(--surface)] hover:border-[var(--t2)] active:bg-[var(--surface-hi)]',
  ghost:
    'bg-transparent text-[var(--t2)] border border-transparent hover:text-[var(--t1)] hover:bg-[var(--surface)] active:bg-[var(--surface-hi)]',
  danger:
    'bg-transparent text-[#D6294B] border border-[#D6294B] hover:bg-[#D6294B] hover:text-[#F4F1E8] active:bg-[#BF2241]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[11px] gap-1.5',
  md: 'px-4 py-2 text-[13px] gap-2',
  lg: 'px-6 py-3 text-[14px] gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-mono uppercase tracking-[0.1em] font-medium transition-all duration-150 cursor-pointer select-none rounded-[2px]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Spinner size={12} />}
      {children}
    </button>
  );
}
