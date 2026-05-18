import { formatMood } from '../../utils/formatters.js';

export default function TitleCard({ script, onRegenerate, regenerating }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-bolly-red/20 rounded-full blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="badge bg-bolly-saffron/20 text-bolly-saffron mb-2">
              {formatMood(script.mood)}
            </span>
            <h1 className="heading text-4xl sm:text-5xl text-bolly-paper mb-2 leading-tight">
              {script.title}
            </h1>
            <p className="text-lg text-bolly-gold italic">"{script.tagline}"</p>
          </div>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={regenerating}
              className="btn-ghost text-xs whitespace-nowrap"
              title="Regenerate title + tagline"
            >
              {regenerating ? '⏳' : '🔄'} Re-roll
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
