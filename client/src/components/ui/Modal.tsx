import { useEffect, type ReactNode } from 'react';
import Icon from './Icon';

interface ModalProps {
  open?: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export default function Modal({
  open = true,
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(20,18,15,0.72)' }}
      onClick={onClose}
    >
      <div
        className={[
          'bg-[var(--bg)] border border-[var(--border-strong)] rounded-[4px] shadow-[var(--shadow-md)] flex flex-col max-h-[90vh]',
          wide ? 'w-full max-w-2xl' : 'w-full max-w-md',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--border)]">
          <div>
            {title && <h2 className="heading-sm text-[var(--t1)] uppercase tracking-wide">{title}</h2>}
            {subtitle && <p className="body-sm text-[var(--t3)] mt-1">{subtitle}</p>}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-[var(--t3)] hover:text-[var(--t1)] transition-colors ml-4 mt-0.5 font-mono"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
