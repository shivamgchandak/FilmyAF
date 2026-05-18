import { useDispatch } from 'react-redux';
import {
  regenerateTitleThunk,
  regenerateCharactersThunk,
} from '../../redux/slices/scriptSlice.js';
import { useToast } from '../../hooks/useToast.js';

export default function RegenerateMenu({ script, regenStatus }) {
  const dispatch = useDispatch();
  const toast = useToast();

  const onTitle = async () => {
    const r = await dispatch(regenerateTitleThunk({ scriptId: script._id }));
    if (r.error) toast.error(r.payload?.message || 'Failed to regenerate title');
    else toast.success('Title remixed 🎬');
  };

  const onCharacters = async () => {
    const r = await dispatch(regenerateCharactersThunk({ scriptId: script._id }));
    if (r.error) toast.error(r.payload?.message || 'Failed to recast');
    else toast.success('New cast! 🎭');
  };

  return (
    <div className="card">
      <h4 className="text-sm font-semibold text-bolly-paper/70 mb-3">
        Owner tools 🎬
      </h4>
      <div className="flex flex-wrap gap-2">
        <button onClick={onTitle} disabled={regenStatus.title} className="btn-secondary text-sm">
          {regenStatus.title ? '⏳ Working…' : '🔄 New title & tagline'}
        </button>
        <button
          onClick={onCharacters}
          disabled={regenStatus.characters}
          className="btn-secondary text-sm"
        >
          {regenStatus.characters ? '⏳ Recasting…' : '🎭 Recast characters'}
        </button>
      </div>
      <p className="text-xs text-bolly-paper/40 mt-3">
        Individual scenes can be re-rolled from the scene cards below.
      </p>
    </div>
  );
}
