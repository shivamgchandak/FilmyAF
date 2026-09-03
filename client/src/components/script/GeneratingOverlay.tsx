import { useEffect, useRef, useState } from 'react';
import PipelineStepper, { PIPELINE, type Step } from '../ui/PipelineStepper';

/**
 * Stage progress comes from the server over SSE - `stage` is the index of the
 * agent currently working, advanced by a real event as each one returns.
 *
 * The weighted timer below is the FALLBACK, used only when no `stage` is
 * supplied (the non-streaming endpoint). It is an estimate weighted by each
 * agent's token budget (800 / 1800 / 4000) and it never claims completion -
 * the last stage stays active until the request actually resolves.
 *
 * The production log stays time-driven either way: it is flavour, not status,
 * and it has more lines than there are agents.
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
  'Almost there. The screenwriter is slow on purpose…',
];

interface Props {
  /** set true the moment the response lands; the stepper snaps to complete */
  finished?: boolean;
  /** real stage index from the stream; omit to fall back to the timer */
  stage?: number;
  title?: string;
  tagline?: string;
}

export default function GeneratingOverlay({
  finished = false,
  stage: liveStage,
  title,
  tagline,
}: Props) {
  const [estimatedStage, setEstimatedStage] = useState(0);
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
      setEstimatedStage(s);
      setLogLine(Math.min(Math.floor(p * LOG_LINES.length), LOG_LINES.length - 1));
    }, 300);
    return () => clearInterval(id);
  }, [finished]);

  const stage = typeof liveStage === 'number' ? liveStage : estimatedStage;

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

        <div className="text-center min-h-[110px] w-full flex flex-col justify-center">
          <p className="mono-label mb-4" style={{ color: 'rgba(244,241,232,0.3)' }}>FilmyAF presents</p>
          {title ? (
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
              <div className="w-10 h-px bg-[#D6294B] mx-auto mt-4 fade-in-up" />
              {tagline && (
                <p
                  className="body-md italic mt-3 fade-in-up px-2"
                  style={{ color: 'rgba(244,241,232,0.6)' }}
                >
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

        {/* The horizontal stepper has a hard floor of 3 x 130px columns plus
            two connectors - about 438px - so on a phone the third agent hangs
            off the screen. Below sm it runs vertically instead, which is the
            same component and the same information, just stacked. */}
        <div className="w-full">
          <div className="sm:hidden">
            <PipelineStepper steps={steps} orientation="vertical" />
          </div>
          <div className="hidden sm:block">
            <PipelineStepper steps={steps} orientation="horizontal" large />
          </div>
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
