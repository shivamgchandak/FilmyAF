export default function SceneCard({ scene, onRegenerate, regenerating }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="badge bg-bolly-red/20 text-bolly-red mb-1">
            Scene {scene.index}
          </span>
          <h3 className="heading text-xl text-bolly-paper">{scene.heading}</h3>
          {scene.location && (
            <p className="text-xs text-bolly-paper/40 mt-0.5">{scene.location}</p>
          )}
        </div>
        {onRegenerate && (
          <button
            onClick={() => onRegenerate(scene.index)}
            disabled={regenerating}
            className="btn-ghost text-xs whitespace-nowrap"
          >
            {regenerating ? '⏳' : '🔄'} Re-roll
          </button>
        )}
      </div>

      <p className="text-sm text-bolly-paper/70 italic mb-4 leading-relaxed">
        {scene.description}
      </p>

      <div className="space-y-3 border-l-2 border-bolly-saffron/30 pl-4">
        {scene.dialogue.map((d, i) => (
          <div key={i}>
            <p className="text-xs font-bold uppercase tracking-wider text-bolly-saffron">
              {d.character}
              {d.action && (
                <span className="ml-2 text-bolly-paper/40 normal-case font-normal italic">
                  ({d.action})
                </span>
              )}
            </p>
            <p className="text-bolly-paper mt-0.5">{d.line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
