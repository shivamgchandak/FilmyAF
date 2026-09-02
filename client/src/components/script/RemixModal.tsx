import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Textarea } from '../ui/Input';
import MoodTile from '../ui/MoodTile';
import { MOOD_KEYS, type MoodKey } from '../../lib/moods';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  initialSituation?: string;
  initialMood?: MoodKey;
  onSubmit: (v: { situation: string; mood: MoodKey }) => Promise<void>;
}

export default function RemixModal({
  open,
  onClose,
  title = 'Clone & remix',
  subtitle,
  ctaLabel = 'Remix',
  initialSituation = '',
  initialMood = 'masala',
  onSubmit,
}: Props) {
  const [situation, setSituation] = useState(initialSituation);
  const [mood, setMood] = useState<MoodKey>(initialMood);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const close = () => {
    if (busy) return;
    setSituation(initialSituation);
    setMood(initialMood);
    setErr('');
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (situation.trim().length < 5) {
      setErr('Give us at least 5 characters');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      await onSubmit({ situation: situation.trim(), mood });
      onClose();
    } catch (e2: any) {
      setErr(e2?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title={title} subtitle={subtitle} wide>
      <form onSubmit={submit} className="flex flex-col gap-6">
        <Textarea
          label="The situation"
          value={situation}
          error={err}
          maxChars={500}
          rows={4}
          onChange={(e) => { setSituation(e.target.value); if (err) setErr(''); }}
        />

        <div>
          <p className="mono-label text-[var(--t2)] mb-3">Mood</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {MOOD_KEYS.map((m) => (
              <MoodTile key={m} mood={m} selected={mood === m} onClick={() => setMood(m)} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
          <Button type="button" variant="ghost" onClick={close} disabled={busy}>Cancel</Button>
          <Button type="submit" loading={busy}>{busy ? 'Rolling cameras' : ctaLabel}</Button>
        </div>
      </form>
    </Modal>
  );
}
