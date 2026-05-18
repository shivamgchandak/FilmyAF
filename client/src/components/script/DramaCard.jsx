import { forwardRef } from 'react';
import { formatMood } from '../../utils/formatters.js';

const DramaCard = forwardRef(function DramaCard({ script }, ref) {
  const bestLine =
    script.scenes?.[0]?.dialogue?.[0]?.line ||
    script.scenes?.[0]?.description ||
    script.tagline;

  return (
    <div
      ref={ref}
      style={{
        width: 600,
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1a0a0a 100%)',
        padding: '40px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#F5F5F5',
        border: '2px solid #FF6B35',
        borderRadius: 16,
      }}
    >
      <div style={{ fontSize: 12, color: '#FFD700', letterSpacing: 2, marginBottom: 8 }}>
        🎬 FILMYAF PRESENTS
      </div>
      <h1
        style={{
          fontFamily: '"Bebas Neue", Anton, Impact, sans-serif',
          fontSize: 48,
          lineHeight: 1,
          color: '#FFFFFF',
          margin: 0,
          letterSpacing: 1,
        }}
      >
        {script.title}
      </h1>
      <p
        style={{
          fontSize: 18,
          color: '#FFD700',
          fontStyle: 'italic',
          margin: '8px 0 24px',
        }}
      >
        "{script.tagline}"
      </p>

      <div
        style={{
          background: 'rgba(230,57,70,0.15)',
          border: '1px solid rgba(230,57,70,0.4)',
          padding: '16px 20px',
          borderRadius: 12,
          fontSize: 16,
          lineHeight: 1.5,
          color: '#F5F5F5',
        }}
      >
        "{bestLine}"
      </div>

      <div
        style={{
          marginTop: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: 'rgba(245,245,245,0.6)',
        }}
      >
        <span>
          {formatMood(script.mood)} · {script.scenes?.length || 0} scenes
        </span>
        <span style={{ color: '#FF6B35' }}>filmyaf.app</span>
      </div>
    </div>
  );
});

export default DramaCard;
