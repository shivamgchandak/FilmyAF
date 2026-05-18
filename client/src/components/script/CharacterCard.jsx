export default function CharacterCard({ character }) {
  return (
    <div className="card hover:border-bolly-saffron/40 transition">
      <div className="flex items-start gap-3">
        <div className="text-4xl">{character.emoji || '🎭'}</div>
        <div className="flex-1">
          <h4 className="heading text-xl text-bolly-paper">{character.name}</h4>
          <p className="text-xs uppercase tracking-wider text-bolly-saffron mb-1">
            {character.role}
          </p>
          <p className="text-sm text-bolly-paper/70 leading-relaxed">
            {character.description}
          </p>
          {character.signatureStyle && (
            <p className="mt-2 text-xs text-bolly-paper/50 italic">
              ✨ {character.signatureStyle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
