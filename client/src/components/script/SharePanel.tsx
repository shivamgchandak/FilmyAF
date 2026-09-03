import { useRef, useState } from 'react';
import DramaCard from './DramaCard';
import Icon, { Spinner } from '../ui/Icon';
import { downloadDramaCard } from '../../utils/shareCard.js';
import { useToast } from '../../hooks/useToast.js';

export default function SharePanel({ script }: { script: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const url = `${import.meta.env.VITE_APP_URL || window.location.origin}/script/${script.shareSlug}`;
  const text = `${script.title}: "${script.tagline}" · FilmyAF`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the link');
    }
  };

  const png = async () => {
    setBusy(true);
    try {
      await downloadDramaCard(cardRef.current, `filmyaf-${script.shareSlug}`);
      toast.success('Poster downloaded');
    } catch (err: any) {
      toast.error(err?.message || 'Export failed');
    } finally {
      setBusy(false);
    }
  };

  const tile =
    'flex flex-col items-center gap-2 p-3 border border-[var(--border)] rounded-[2px] transition-all group';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center border border-[var(--border)] rounded-[2px] overflow-hidden">
        {/* Show host + slug rather than clipping a long origin mid-word. */}
        <span className="flex-1 min-w-0 px-3 py-2 mono-sm text-[var(--t3)] bg-[var(--surface)] truncate" title={url}>
          {url.replace(/^https?:\/\//, '')}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-4 py-2 border-l border-[var(--border)] mono-label bg-[var(--surface-hi)] hover:bg-[#D6294B] hover:text-[#F4F1E8] hover:border-[#D6294B] transition-colors"
          style={{ color: copied ? '#D6294B' : 'var(--t2)' }}
        >
          <Icon name="copy" size={11} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank')}
          className={`${tile} hover:border-[#25D366] hover:bg-[rgba(37,211,102,0.05)]`}
        >
          <Icon name="whatsapp" size={18} />
          <span className="mono-label text-[var(--t3)] group-hover:text-[#25D366]">WhatsApp</span>
        </button>
        <button
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')}
          className={`${tile} hover:border-[var(--t1)] hover:bg-[var(--surface-hi)]`}
        >
          <Icon name="x" size={16} />
          <span className="mono-label text-[var(--t3)] group-hover:text-[var(--t1)]">X</span>
        </button>
        <button onClick={png} disabled={busy} className={`${tile} hover:border-[#D6294B] hover:bg-[var(--accent-sub)] disabled:opacity-50`}>
          {busy ? <Spinner size={18} /> : <Icon name="poster" size={18} />}
          <span className="mono-label text-[var(--t3)] group-hover:text-[#D6294B]">
            {busy ? 'Rendering' : 'Poster'}
          </span>
        </button>
      </div>

      {/* Off-screen capture target */}
      <div style={{ position: 'absolute', left: -99999, top: 0 }} aria-hidden="true">
        <DramaCard ref={cardRef} script={script} />
      </div>
    </div>
  );
}
