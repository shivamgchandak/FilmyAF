import TitleCard from './TitleCard';
import CharacterCard from './CharacterCard';
import SceneCard from './SceneCard';

interface Props {
  script: any;
  isOwner?: boolean;
  regenStatus?: { scene: number | null; title: boolean; characters: boolean };
  onRerollTitle?: () => void;
  onRerollScene?: (index: number) => void;
}

const NO_REGEN = { scene: null, title: false, characters: false };

export default function ScriptBody({
  script,
  isOwner = false,
  regenStatus = NO_REGEN,
  onRerollTitle,
  onRerollScene,
}: Props) {
  return (
    <div className="flex flex-col gap-10">
      <TitleCard
        title={script.title}
        tagline={script.tagline}
        mood={script.mood}
        isOwner={isOwner}
        regenerating={regenStatus.title}
        onReroll={onRerollTitle}
      />

      {script.characters?.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="mono-label text-[var(--t2)]">The cast</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="mono-label text-[var(--t3)]">{script.characters.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {script.characters.map((c: any, i: number) => (
              <CharacterCard key={c.name ?? i} character={c} index={i} />
            ))}
          </div>
        </section>
      )}

      {script.scenes?.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="mono-label text-[var(--t2)]">The scenes</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="mono-label text-[var(--t3)]">{script.scenes.length}</span>
          </div>
          <div className="flex flex-col gap-4">
            {script.scenes.map((s: any) => (
              <SceneCard
                key={s.index}
                scene={s}
                isOwner={isOwner}
                regenerating={regenStatus.scene === s.index}
                onReroll={onRerollScene}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
