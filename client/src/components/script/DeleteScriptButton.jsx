import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scriptService } from '../../services/scriptService.js';
import { useToast } from '../../hooks/useToast.js';

export default function DeleteScriptButton({ scriptId }) {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const onDelete = async () => {
    if (!window.confirm('Delete this script forever? This cannot be undone.')) return;
    setBusy(true);
    try {
      await scriptService.remove(scriptId);
      toast.success('Script deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="btn-ghost text-sm hover:text-bolly-red"
    >
      {busy ? '⏳' : '🗑️'} Delete
    </button>
  );
}
