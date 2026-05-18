import { useRef, useState } from 'react';
import DramaCard from '../script/DramaCard.jsx';
import { downloadDramaCard } from '../../utils/shareCard.js';
import { useToast } from '../../hooks/useToast.js';

export default function ShareButton({ script }) {
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const shareUrl = `${import.meta.env.VITE_APP_URL || window.location.origin}/script/${script.shareSlug}`;
  const text = `${script.title} — "${script.tagline}" · FilmyAF 🎬`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard 📋');
    } catch {
      toast.error('Could not copy');
    }
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${shareUrl}`)}`,
      '_blank'
    );
  };

  const twitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const png = async () => {
    setBusy(true);
    try {
      await downloadDramaCard(cardRef.current, `filmyaf-${script.shareSlug}`);
      toast.success('Drama card downloaded! 🖼️');
    } catch (err) {
      toast.error(err.message || 'Export failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="card">
        <h4 className="text-sm font-semibold mb-3">Share this drama 📣</h4>
        <div className="flex flex-wrap gap-2">
          <button onClick={copyLink} className="btn-secondary text-sm">📋 Copy link</button>
          <button onClick={whatsapp} className="btn-secondary text-sm">💬 WhatsApp</button>
          <button onClick={twitter} className="btn-secondary text-sm">🐦 Twitter / X</button>
          <button onClick={png} disabled={busy} className="btn-secondary text-sm">
            {busy ? '⏳ Rendering…' : '🖼️ Drama card PNG'}
          </button>
        </div>
      </div>

      {/* Off-screen render target for PNG export */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <DramaCard ref={cardRef} script={script} />
      </div>
    </>
  );
}
