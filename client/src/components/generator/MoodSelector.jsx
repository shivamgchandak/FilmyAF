import { MOOD_LABELS } from '../../utils/formatters.js';

export default function MoodSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-bolly-paper/80">
        Pick the drama mood
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(MOOD_LABELS).map(([key, { label, emoji }]) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`p-3 rounded-xl border text-sm font-semibold transition ${
                active
                  ? 'bg-bolly-red/20 border-bolly-red text-bolly-paper shadow-lg shadow-bolly-red/20'
                  : 'bg-white/5 border-white/10 text-bolly-paper/70 hover:border-bolly-saffron/40'
              }`}
            >
              <div className="text-2xl mb-1">{emoji}</div>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
