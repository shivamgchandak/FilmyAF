import { useState } from 'react';

const baseInput = [
  'w-full bg-[var(--surface)] border border-[var(--border)] rounded-[2px]',
  'font-sans text-[var(--t1)] placeholder:text-[var(--t3)]',
  'focus:outline-none focus:border-[#D6294B] focus:ring-0',
  'transition-colors duration-150',
].join(' ');

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="mono-label text-[var(--t2)]">{label}</label>}
      <input
        className={[baseInput, 'px-3 py-2.5 text-[14px]', error ? 'border-[#D6294B]' : '', className].join(' ')}
        {...props}
      />
      {error && <p className="mono-sm text-[#D6294B]">{error}</p>}
      {hint && !error && <p className="mono-sm text-[var(--t3)]">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxChars?: number;
}

export function Textarea({
  label,
  error,
  hint,
  maxChars = 500,
  className = '',
  onChange,
  value,
  ...props
}: TextareaProps) {
  const [internal, setInternal] = useState(0);
  const count = typeof value === 'string' ? value.length : internal;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternal(e.target.value.length);
    onChange?.(e);
  };

  const pct = count / maxChars;
  const counterColor = pct > 0.9 ? '#D6294B' : pct > 0.75 ? '#E8A33D' : 'var(--t3)';

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="mono-label text-[var(--t2)]">{label}</label>}
      <div className="relative">
        <textarea
          rows={4}
          value={value}
          maxLength={maxChars}
          onChange={handleChange}
          className={[
            baseInput,
            'px-3 py-2.5 pb-7 text-[14px] resize-none leading-relaxed',
            error ? 'border-[#D6294B]' : '',
            className,
          ].join(' ')}
          {...props}
        />
        <span className="absolute bottom-2 right-3 mono-sm pointer-events-none" style={{ color: counterColor }}>
          {count}/{maxChars}
        </span>
      </div>
      {error && <p className="mono-sm text-[#D6294B]">{error}</p>}
      {hint && !error && <p className="mono-sm text-[var(--t3)]">{hint}</p>}
    </div>
  );
}
