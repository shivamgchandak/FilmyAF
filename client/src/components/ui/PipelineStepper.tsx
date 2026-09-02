import Icon, { Spinner } from './Icon';

export type StepStatus = 'pending' | 'active' | 'complete';

export interface Step {
  id: string;
  label: string;
  subtitle?: string;
  status: StepStatus;
}

/** The three agents the server actually runs, in order. */
export const PIPELINE: Array<{ id: string; label: string; subtitle: string }> = [
  { id: 'DIRECTOR', label: 'Director', subtitle: 'Choosing the title and the shape' },
  { id: 'CASTING', label: 'Casting', subtitle: 'Finding people worth arguing' },
  { id: 'SCREENWRITER', label: 'Screenwriter', subtitle: 'Writing the scenes' },
];

export const stepsForStage = (stage: number): Step[] =>
  PIPELINE.map((s, i) => ({
    ...s,
    status: i < stage ? 'complete' : i === stage ? 'active' : 'pending',
  }));

function StepIndicator({ status, large }: { status: StepStatus; large?: boolean }) {
  const box = large ? 'w-10 h-10' : 'w-7 h-7';

  if (status === 'complete') {
    return (
      <div className={[box, 'rounded-[2px] flex items-center justify-center bg-[#D6294B] text-[#F4F1E8] font-mono font-semibold'].join(' ')}
        style={{ fontSize: large ? 17 : 13 }}>
        <Icon name="check" size={large ? 17 : 13} />
      </div>
    );
  }

  if (status === 'active') {
    return (
      <div className={[box, 'rounded-[2px] flex items-center justify-center border-2 border-[#D6294B] bg-[var(--accent-sub)] pulse-active'].join(' ')}>
        <Spinner size={large ? 16 : 12} />
      </div>
    );
  }

  return (
    <div className={[box, 'rounded-[2px] flex items-center justify-center border border-[var(--border-strong)] bg-[var(--surface)]'].join(' ')}>
      <div className={[large ? 'w-2 h-2' : 'w-1.5 h-1.5', 'rounded-[1px] bg-[var(--t3)]'].join(' ')} />
    </div>
  );
}

const labelColor = (s: StepStatus) =>
  s === 'pending' ? 'text-[var(--t3)]' : s === 'active' ? 'text-[#D6294B]' : 'text-[var(--t1)]';

interface Props {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  large?: boolean;
}

export default function PipelineStepper({ steps, orientation = 'horizontal', large = false }: Props) {
  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <StepIndicator status={step.status} large={large} />
              {i < steps.length - 1 && (
                <div
                  className="w-px flex-1 mt-1 mb-1"
                  style={{
                    minHeight: '32px',
                    backgroundColor: step.status === 'complete' ? '#D6294B' : 'var(--border)',
                  }}
                />
              )}
            </div>
            <div className="pt-1 pb-6">
              <p className={['mono-label', labelColor(step.status)].join(' ')}>{step.label}</p>
              {step.subtitle && <p className="body-sm text-[var(--t3)] mt-0.5">{step.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-0 w-full">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-start flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-2 w-[130px] shrink-0">
            <StepIndicator status={step.status} large={large} />
            <div className="text-center">
              <p className={['mono-label', large ? 'text-[12px]' : '', labelColor(step.status)].join(' ')}>
                {step.label}
              </p>
              {step.subtitle && (
                <p className="text-[var(--t3)] mt-1" style={{ fontSize: '11px', lineHeight: 1.4 }}>
                  {step.subtitle}
                </p>
              )}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-px mx-3"
              style={{
                marginTop: large ? 20 : 14,
                backgroundColor: step.status === 'complete' ? '#D6294B' : 'var(--border)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
