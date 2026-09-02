import { forwardRef } from 'react';
import { moodLabel } from '../../lib/moods';

/**
 * Rendered off-screen and captured by html-to-image, so every style must be
 * inline — Tailwind classes and CSS variables do not survive the capture.
 * 1080x1080 so it lands as a native-resolution square on WhatsApp and X.
 */
const DramaCard = forwardRef<HTMLDivElement, { script: any }>(function DramaCard({ script }, ref) {
  const bestLine =
    script.scenes?.[0]?.dialogue?.[0]?.line || script.scenes?.[0]?.description || script.tagline;

  const perfs = Array.from({ length: 26 });
  const perf = {
    width: 28,
    height: 26,
    border: '2px solid rgba(244,241,232,0.20)',
    borderRadius: 2,
    flexShrink: 0,
  } as const;

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: '#1A1815',
        color: '#F4F1E8',
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 52, backgroundColor: '#0E0D0A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
        {perfs.map((_, i) => <div key={i} style={perf} />)}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 88px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(244,241,232,0.35)', marginBottom: 34 }}>
          FilmyAF presents
        </div>

        <div style={{ fontFamily: "'Anton', Impact, sans-serif", fontSize: 96, lineHeight: 0.93, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 26 }}>
          {script.title}
        </div>

        <div style={{ width: 92, height: 3, backgroundColor: '#D6294B', margin: '0 auto 26px' }} />

        {script.tagline && (
          <div style={{ fontSize: 30, fontStyle: 'italic', color: 'rgba(244,241,232,0.66)', marginBottom: 52, lineHeight: 1.4 }}>
            {script.tagline}
          </div>
        )}

        <div style={{ border: '1px solid rgba(214,41,75,0.45)', backgroundColor: 'rgba(214,41,75,0.10)', padding: '30px 34px', borderRadius: 2, fontSize: 27, lineHeight: 1.5 }}>
          “{bestLine}”
        </div>
      </div>

      <div style={{ padding: '0 88px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(244,241,232,0.45)' }}>
        <span>{moodLabel(script.mood)} · {script.scenes?.length || 0} scenes</span>
        <span style={{ color: '#D6294B' }}>filmyaf.vercel.app</span>
      </div>

      <div style={{ height: 52, backgroundColor: '#0E0D0A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
        {perfs.map((_, i) => <div key={i} style={perf} />)}
      </div>
    </div>
  );
});

export default DramaCard;
