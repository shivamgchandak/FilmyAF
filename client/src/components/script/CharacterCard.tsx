const MARKS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

interface Character {
  name: string;
  role: string;
  description: string;
  signatureStyle?: string;
  emoji?: string;
}

export default function CharacterCard({ character, index }: { character: Character; index: number }) {
  return (
    <div className="flex gap-4 p-4 border border-[var(--border)] rounded-[2px] bg-[var(--surface)]">
      <div
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-[var(--border-strong)] rounded-[2px] bg-[var(--bg)] text-[var(--t3)]"
        style={{ fontFamily: 'var(--font-display)', fontSize: '14px' }}
      >
        {MARKS[index] ?? String(index + 1)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span
            className="text-[var(--t1)]"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '15px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {character.name}
          </span>
          <span className="mono-label text-[#D6294B]">{character.role}</span>
        </div>
        <p className="body-sm text-[var(--t2)] leading-relaxed mb-2">{character.description}</p>
        {character.signatureStyle && (
          <div className="flex items-start gap-1.5">
            <span className="mono-label text-[var(--t3)] flex-shrink-0 pt-px">Tic ·</span>
            <span className="body-sm text-[var(--t3)] italic">{character.signatureStyle}</span>
          </div>
        )}
      </div>
    </div>
  );
}
