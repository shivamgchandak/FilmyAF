import Icon, { Spinner } from '../ui/Icon';

/**
 * The model returns `action` already wrapped in parentheses about half the
 * time, which is what produced the "((taps spoon))" bug in v1. Strip any
 * wrapping pair first, then add exactly one.
 */
export const cleanParenthetical = (raw: string): string =>
  raw.trim().replace(/^\((.*)\)$/s, '$1').trim();

interface DialogueRowProps {
  character: string;
  action?: string;
  line: string;
}

export function DialogueRow({ character, action, line }: DialogueRowProps) {
  const parenthetical = action ? cleanParenthetical(action) : '';
  return (
    <div className="py-2.5 border-t border-[var(--border)] first:border-t-0">
      <div className="screenplay-speaker mb-0.5">{character}</div>
      {parenthetical && <div className="screenplay-parenthetical mb-1">({parenthetical})</div>}
      <div className="screenplay-line">{line}</div>
    </div>
  );
}

interface Scene {
  index: number;
  heading: string;
  location?: string;
  description: string;
  dialogue?: DialogueRowProps[];
}

interface SceneCardProps {
  scene: Scene;
  isOwner?: boolean;
  regenerating?: boolean;
  cost?: number;
  affordable?: boolean;
  onReroll?: (index: number) => void;
}

export default function SceneCard({
  scene,
  isOwner = false,
  regenerating = false,
  cost,
  affordable = true,
  onReroll,
}: SceneCardProps) {
  return (
    <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-hi)]">
        <div className="flex items-center gap-4 min-w-0">
          <span
            className="text-[28px] leading-none text-[var(--t3)] flex-shrink-0"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1 }}
          >
            {String(scene.index).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="slug-line text-[var(--t1)] truncate">{scene.heading}</p>
            {scene.location && (
              <p className="mono-label text-[var(--t3)] text-[9px] mt-0.5 truncate">{scene.location}</p>
            )}
          </div>
        </div>
        {isOwner && onReroll && (
          <button
            onClick={() => onReroll(scene.index)}
            disabled={regenerating || !affordable}
            title={affordable ? 'Rewrite just this scene' : 'Not enough takes'}
            className="flex items-center gap-1.5 mono-label text-[var(--t3)] hover:text-[#D6294B] transition-colors px-2 py-1 border border-transparent hover:border-[var(--border)] rounded-[2px] disabled:opacity-40 disabled:hover:text-[var(--t3)] flex-shrink-0"
          >
            {regenerating ? <Spinner size={11} /> : <Icon name="reroll" size={11} />}
            {regenerating ? 'Rolling' : 'Re-roll'}
            {typeof cost === 'number' && (
              <span className="opacity-60 tabular-nums">· {cost}</span>
            )}
          </button>
        )}
      </div>

      <div className="px-5 pt-4 pb-2">
        <p className="screenplay-action mb-4">{scene.description}</p>
        <div className="pl-6 border-l-2 border-[var(--border)]">
          {(scene.dialogue ?? []).map((d, i) => (
            <DialogueRow key={i} {...d} />
          ))}
        </div>
      </div>
    </div>
  );
}
