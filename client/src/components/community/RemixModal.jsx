import { useState } from 'react';
import Modal from '../shared/Modal.jsx';
import Button from '../shared/Button.jsx';
import MoodSelector from '../generator/MoodSelector.jsx';

export default function RemixModal({
  open,
  onClose,
  title = 'Remix this script',
  ctaLabel = 'Remix',
  initialSituation = '',
  initialMood = 'masala',
  onSubmit,
  helperText,
}) {
  const [situation, setSituation] = useState(initialSituation);
  const [mood, setMood] = useState(initialMood);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const reset = () => {
    setSituation(initialSituation);
    setMood(initialMood);
    setErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!situation.trim() || situation.trim().length < 5) {
      setErr('Situation must be at least 5 characters');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      await onSubmit({ situation: situation.trim(), mood });
      onClose();
    } catch (e2) {
      setErr(e2.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!busy) {
          reset();
          onClose();
        }
      }}
      title={title}
    >
      {helperText && (
        <p className="text-sm text-bolly-paper/60 mb-4">{helperText}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-bolly-paper/80">
            Your situation / prompt
          </label>
          <textarea
            className={`input min-h-[110px] resize-y ${err ? 'border-bolly-red' : ''}`}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            maxLength={500}
            placeholder="Edit the original or write your own spin…"
          />
          <div className="flex justify-between mt-1 text-xs">
            <span className="text-bolly-red">{err}</span>
            <span className="text-bolly-paper/40">{situation.length}/500</span>
          </div>
        </div>

        <MoodSelector value={mood} onChange={setMood} />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            disabled={busy}
            className="btn-ghost"
          >
            Cancel
          </button>
          <Button type="submit" loading={busy}>
            {busy ? 'Rolling cameras…' : ctaLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
