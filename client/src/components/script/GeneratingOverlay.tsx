import { useEffect, useRef, useState } from 'react';
import PipelineStepper, { PIPELINE, type Step } from '../ui/PipelineStepper';

/**
 * The server runs Director → Casting → Screenwriter as one POST with no
 * progress events, so stage timing here is an ESTIMATE weighted by how long
 * each agent actually takes (token budgets 800 / 1800 / 4000).
 *
 * The estimate never claims completion: the final stage stays "active" until
 * the request truly resolves, however long that takes. Making this exact means
 * streaming stage events from the server — worth doing, see notes.
 */
const STAGE_WEIGHTS = [0.15, 0.35, 0.5];
const EXPECTED_MS = 26000;

const LOG_LINES = [
  'Reading the situation…',
  'Deciding how many scenes this deserves…',
  'Naming the film…',
  'Casting people worth arguing…',
  'Giving everyone something to want…',
  'Setting the first scene…',
  'Writing dialogue…',
  'Checking nobody quoted a real film…',
  'Almost there — the screenwriter is slow on purpose…',
];

interface Props {
  /** set true the moment the response lands; the stepper snaps to complete */
  finished?: boolean;
  title?: string;
  tagline?: string;
}

export default function GeneratingOverlay({ finished = false, title, tagline }: Props) {
  const [stage, setStage] = useState(0);
  const [logLine, setLogLine] = useState(0);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - startedAt.current;
      const p = Math.min(elapsed / EXPECTED_MS, 0.999);
      let acc = 0;
      let s = 0;
      for (let i = 0; i < STAGE_WEIGHTS.length; i += 1) {
        acc += STAGE_WEIGHTS[i];
        if (p < acc) { s = i; break; }
        s = STAGE_WEIGHTS.length - 1;
      }
      setStage(s);
      setLogLine(Math.min(Math.floor(p * LOG_LINES.length), LOG_LINES.length - 1));
    }, 300);
    return () => clearInterval(id);
  }, [finished]);

  const steps: Step[] = PIPELINE.map((s, i) => ({
    ...s,
    status: finished ? 'complete' : i < stage ? 'complete' : i === stage ? 'active' : 'pending',
  }));

  return (
    <div
      className="dark fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-y-auto"
      style={{ backgroundColor: '#14120F', color: '#F4F1E8' }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(244,241,232,0.035) 1px, transparent 1px)',
          backgroundSize: '5px 5px',
        }}
      />

      <div className="film-strip fixed top-0 inset-x-0 z-10" />
      <div className="film-strip fixed bottom-0 inset-x-0 z-10" />

      <div className="relative z-10 w-full max-w-[680px] mx-auto flex flex-col items-center gap-10 py-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-[#D6294B]" />
          <span className="mono-label text-[#D6294B]">Production in progress</span>
          <div className="w-8 h-px bg-[#D6294B]" />
        </div>

        <div className="text-center min-h-[110px] flex flex-col justify-center">
          <p className="mono-label mb-4" style={{ color: 'rgba(244,241,232,0.3)' }}>FilmyAF presents</p>
          {finished && title ? (
            <>
              <h2
                className="fade-in-up"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(36px, 7vw, 72px)',
                  letterSpacing: '-0.01em',
                  lineHeight: 0.92,
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </h2>
              {tagline && (
                <p className="body-md italic mt-4 fade-in-up" style={{ color: 'rgba(244,241,232,0.6)' }}>
                  {tagline}
                </p>
              )}
            </>
          ) : (
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,5vw,44px)', color: 'rgba(244,241,232,0.18)', textTransform: 'uppercase' }}>
              Untitled
              <span className="text-[#D6294B] cursor-blink ml-1">|</span>
            </p>
          )}
        </div>

        <div className="w-full flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(244,241,232,0.1)' }} />
          <span className="mono-label" style={{ color: 'rgba(244,241,232,0.2)' }}>◆</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(244,241,232,0.1)' }} />
        </div>

        <div className="w-full">
          <PipelineStepper steps={steps} orientation="horizontal" large />
        </div>

        <div className="w-full border border-[rgba(244,241,232,0.08)] rounded-[2px] p-4" style={{ backgroundColor: 'rgba(244,241,232,0.03)' }}>
          <div className="mono-label mb-3" style={{ color: 'rgba(244,241,232,0.2)' }}>Production log</div>
          <div className="flex flex-col gap-1">
            {LOG_LINES.slice(0, logLine + 1).map((line, i) => (
              <div key={i} className="flex items-start gap-2 fade-in-up" style={{ color: i === logLine ? '#F4F1E8' : 'rgba(244,241,232,0.3)' }}>
                <span className="mono-sm flex-shrink-0" style={{ color: '#D6294B' }}>›</span>
                <span className="mono-sm">{line}</span>
              </div>
            ))}
            {finished && (
              <div className="flex items-start gap-2 fade-in-up">
                <span className="mono-sm flex-shrink-0" style={{ color: '#D6294B' }}>›</span>
                <span className="mono-sm text-[#D6294B]">Print!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
