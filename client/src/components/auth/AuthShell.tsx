import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  eyebrow: string;
  heading: ReactNode;
  blurb: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ eyebrow, heading, blurb, children, footer }: Props) {
  return (
    <div className="grid grid-cols-12 min-h-[calc(100vh-3.5rem)]">
      {/* Poster panel. It used to force `.dark` on itself and paint #14120F
          regardless of theme, which left a slab of night down the side of an
          otherwise paper-white page. It now reads the ambient tokens like every
          other surface, so it is paper in light and ink in dark. */}
      <div
        className="grain-surface grain-coarse hidden lg:flex col-span-5 flex-col justify-between p-12 border-r border-[var(--border)] relative overflow-hidden"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--t1)' }}
      >
        <Link to="/" className="relative z-10 flex items-baseline gap-1">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1 }}>FILMY</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, color: '#D6294B' }}>AF</span>
        </Link>

        <div className="relative z-10">
          <div className="w-10 h-px bg-[#D6294B] mb-6" />
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 3.4vw, 52px)',
              textTransform: 'uppercase',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
            }}
          >
            Your life is mid.
            <br />
            <span style={{ color: '#D6294B' }}>We'll fix that</span>
            <br />
            in three acts.
          </p>
          <p className="body-md mt-6 max-w-[320px]" style={{ color: 'var(--t2)' }}>
            Every script you keep, every clone of it, every reaction: all of it lives on your account.
          </p>
        </div>

        <p className="relative z-10 mono-label" style={{ color: 'var(--t3)' }}>
          © 2026 FilmyAF · All takes reserved
        </p>
      </div>

      {/* Form panel */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-[#D6294B]" />
            <span className="mono-label text-[#D6294B]">{eyebrow}</span>
          </div>
          <h1
            className="text-[var(--t1)] mb-2"
            style={{ fontFamily: 'var(--font-display)', fontSize: 38, textTransform: 'uppercase', lineHeight: 0.98, letterSpacing: '-0.01em' }}
          >
            {heading}
          </h1>
          <p className="body-md text-[var(--t2)] mb-8">{blurb}</p>
          {children}
          <div className="mt-6 pt-6 border-t border-[var(--border)] body-sm text-[var(--t2)] text-center">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
