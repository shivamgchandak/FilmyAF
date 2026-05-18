import { useDispatch, useSelector } from 'react-redux';
import TitleCard from './TitleCard.jsx';
import CharacterCard from './CharacterCard.jsx';
import SceneCard from './SceneCard.jsx';
import RegenerateMenu from './RegenerateMenu.jsx';
import {
  regenerateSceneThunk,
  regenerateTitleThunk,
} from '../../redux/slices/scriptSlice.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';

export default function ScriptDisplay({ script, isOwner }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const regenStatus = useSelector((s) => s.script.regenStatus);

  const isSavedScript = !!script._id;

  const regenScene = async (sceneIndex) => {
    if (!isSavedScript || !isOwner) {
      toast.info('Save the script first to regenerate scenes.');
      return;
    }
    const r = await dispatch(regenerateSceneThunk({ scriptId: script._id, sceneIndex }));
    if (r.error) toast.error(r.payload?.message || 'Scene regen failed');
    else toast.success(`Scene ${sceneIndex} remixed 🎬`);
  };

  const regenTitle = async () => {
    if (!isSavedScript || !isOwner) {
      toast.info('Save the script first to regenerate the title.');
      return;
    }
    const r = await dispatch(regenerateTitleThunk({ scriptId: script._id }));
    if (r.error) toast.error(r.payload?.message || 'Title regen failed');
    else toast.success('Title remixed 🎬');
  };

  return (
    <div className="space-y-6">
      <TitleCard
        script={script}
        onRegenerate={isOwner ? regenTitle : null}
        regenerating={regenStatus.title}
      />

      {script.characters?.length > 0 && (
        <div>
          <h2 className="heading text-2xl text-bolly-saffron mb-3">The Cast 🎭</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {script.characters.map((c) => (
              <CharacterCard key={c.name} character={c} />
            ))}
          </div>
        </div>
      )}

      {isOwner && isSavedScript && <RegenerateMenu script={script} regenStatus={regenStatus} />}

      <div>
        <h2 className="heading text-2xl text-bolly-saffron mb-3">The Scenes 🎬</h2>
        <div className="space-y-4">
          {script.scenes?.map((s) => (
            <SceneCard
              key={s.index}
              scene={s}
              onRegenerate={isOwner ? regenScene : null}
              regenerating={regenStatus.scene === s.index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
