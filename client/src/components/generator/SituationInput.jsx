import { useState } from 'react';

const SUGGESTIONS = [
  'Fight between two founders over putting sugar in coffee',
  'Mom finds out son ordered Maggi instead of eating dal',
  'Office IT guy refuses to reset everyone’s password',
  'Two roommates argue about whose turn it is to do dishes',
  'Guy forgets his anniversary and has to come up with an excuse',
];

export default function SituationInput({ value, onChange, error }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-bolly-paper/80">
        What's the situation?
      </label>
      <textarea
        className={`input min-h-[110px] resize-y ${error ? 'border-bolly-red' : ''}`}
        placeholder="e.g. Fight between two founders over putting sugar in coffee"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={500}
      />
      <div className="flex justify-between mt-1 text-xs">
        <span className="text-bolly-red">{error}</span>
        <span className="text-bolly-paper/40">{value.length}/500</span>
      </div>

      {(focused || !value) && (
        <div className="mt-3 animate-fade-in">
          <p className="text-xs text-bolly-paper/50 mb-2">Need inspiration?</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-bolly-saffron/40 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
