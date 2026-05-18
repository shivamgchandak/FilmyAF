import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import RemixModal from './RemixModal.jsx';
import { scriptService } from '../../services/scriptService.js';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Opens a RemixModal pre-filled with the source script's situation + mood.
 * On submit, calls POST /scripts/:id/clone with the (possibly edited) prompt.
 * Server decides whether to plain-clone or re-run the LLM pipeline.
 */
export default function CloneButton({ script }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const openModal = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOpen(true);
  };

  const onSubmit = async ({ situation, mood }) => {
    const willRegen =
      situation.trim() !== (script.situation || '').trim() || mood !== script.mood;
    const tid = toast.loading(
      willRegen ? 'Remixing the script with your prompt…' : 'Cloning the script…'
    );
    try {
      const d = await scriptService.clone(script._id, { situation, mood });
      toast.dismiss(tid);
      toast.success(willRegen ? 'Remix ready 🎬' : 'Cloned 🎬');
      navigate(`/script/${d.script.shareSlug}`);
    } catch (err) {
      toast.dismiss(tid);
      const msg = err.message || 'Clone failed';
      toast.error(msg);
      console.error('[clone] failed:', err);
      // re-throw so the modal also shows the error inline
      throw err;
    }
  };

  return (
    <>
      <button onClick={openModal} className="btn-secondary text-sm">
        🔁 Clone & Remix
        {script.cloneCount > 0 && (
          <span className="text-xs opacity-70">({script.cloneCount})</span>
        )}
      </button>
      <RemixModal
        open={open}
        onClose={() => setOpen(false)}
        title="Clone & Remix"
        ctaLabel="Clone & Remix"
        helperText="Edit the prompt or mood to get your own spin. Leave them as-is to clone the original word-for-word."
        initialSituation={script.situation || ''}
        initialMood={script.mood || 'masala'}
        onSubmit={onSubmit}
      />
    </>
  );
}
