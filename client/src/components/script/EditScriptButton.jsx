import { useState } from 'react';
import toast from 'react-hot-toast';
import RemixModal from '../community/RemixModal.jsx';
import { generateService } from '../../services/generateService.js';

/**
 * Owner-only. Opens the RemixModal pre-filled with the script's current
 * situation + mood. On submit, calls /generate/edit-script which re-runs
 * the full LLM pipeline and bumps lastEditedAt.
 */
export default function EditScriptButton({ script, onUpdated }) {
  const [open, setOpen] = useState(false);

  const onSubmit = async ({ situation, mood }) => {
    const tid = toast.loading('Re-rolling the script with your new prompt…');
    try {
      const d = await generateService.editScript(script._id, situation, mood);
      toast.dismiss(tid);
      toast.success('Script updated 🎬');
      onUpdated?.(d.script);
    } catch (err) {
      toast.dismiss(tid);
      toast.error(err.message || 'Edit failed');
      console.error('[edit-script] failed:', err);
      throw err;
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary text-sm">
        ✏️ Edit
      </button>
      <RemixModal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit your script"
        ctaLabel="Save & Re-generate"
        helperText="Change the situation or mood — we'll re-run the Director, Casting and Screenwriter agents."
        initialSituation={script.situation || ''}
        initialMood={script.mood || 'masala'}
        onSubmit={onSubmit}
      />
    </>
  );
}
