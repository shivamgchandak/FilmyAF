import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Icon, { Metric, Spinner } from '../components/ui/Icon';
import { CostLabel } from '../components/ui/TakesCounter';
import Modal from '../components/ui/Modal';
import CharacterCard from '../components/script/CharacterCard';
import SceneCard from '../components/script/SceneCard';
import SharePanel from '../components/script/SharePanel';
import RemixModal from '../components/script/RemixModal';
import Comments from '../components/script/Comments';

import { scriptService } from '../services/scriptService.js';
import { generateService } from '../services/generateService.js';
import { likeService } from '../services/likeService.js';
import {
  regenerateSceneThunk,
  regenerateTitleThunk,
  regenerateCharactersThunk,
} from '../redux/slices/scriptSlice.js';
import { useAuth } from '../hooks/useAuth.js';
import { useTakes } from '../hooks/useTakes';
import { useToast } from '../hooks/useToast.js';
import { fullName, formatIST, timeAgo } from '../utils/formatters.js';

export default function ScriptView() {
  const { slug } = useParams();
  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const toast = useToast();
  const regenStatus = useSelector((s: any) => s.script.regenStatus);
  const { cost, canAfford } = useTakes();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const d = await scriptService.bySlug(slug);
        if (cancelled) return;
        setScript(d.script);
        setLikeCount(d.script.likeCount ?? 0);
        try {
          const l = await likeService.status(d.script._id);
          if (!cancelled) { setLiked(l.hasLiked); setLikeCount(l.likeCount); }
        } catch { /* like status is non-essential */ }
      } catch (e: any) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const author = script?.userId;
  const isOwner = Boolean(user && author && (author._id === user._id || author === user._id));

  const requireAuth = () => {
    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  const toggleLike = async () => {
    if (!isAuthenticated) return requireAuth();
    setLiked((v) => !v);
    setLikeCount((c) => c + (liked ? -1 : 1));
    try {
      const d = await likeService.toggle(script._id);
      setLiked(d.liked);
      setLikeCount(d.likeCount);
    } catch {
      setLiked((v) => !v);
      setLikeCount((c) => c + (liked ? 1 : -1));
    }
  };

  const onClone = async ({ situation, mood }: any) => {
    const d = await scriptService.clone(script._id, { situation, mood });
    navigate(`/script/${d.script.shareSlug}`);
  };

  const onEdit = async ({ situation, mood }: any) => {
    const d = await generateService.editScript(script._id, situation, mood);
    setScript(d.script);
    toast.success('Script updated');
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      await scriptService.remove(script._id);
      toast.success('Script deleted');
      navigate('/');
    } catch (e: any) {
      toast.error(e?.message || 'Delete failed');
      setDeleting(false);
    }
  };

  const rerollTitle = async () => {
    const r = await dispatch(regenerateTitleThunk({ scriptId: script._id }));
    if (r.error) toast.error(r.payload?.message || 'Could not re-roll the title');
    else setScript(r.payload.script);
  };

  const rerollScene = async (index: number) => {
    const r = await dispatch(regenerateSceneThunk({ scriptId: script._id, sceneIndex: index }));
    if (r.error) toast.error(r.payload?.message || 'Could not re-roll that scene');
    else setScript(r.payload.script);
  };

  const recast = async () => {
    const r = await dispatch(regenerateCharactersThunk({ scriptId: script._id }));
    if (r.error) toast.error(r.payload?.message || 'Could not recast');
    else setScript(r.payload.script);
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
        <p className="mono-label text-[var(--t3)]">Loading the drama…</p>
      </div>
    );
  }

  if (err || !script) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-24 text-center">
        <p className="display-md text-[var(--t1)] mb-3">Cut! Script not found.</p>
        <p className="body-md text-[var(--t2)] mb-8">{err || 'This one may have been taken off-screen.'}</p>
        <Link to="/"><Button>Back to the feed</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <title>{`${script.title} · FilmyAF`}</title>
      <meta name="description" content={script.tagline} />
      <meta property="og:title" content={script.title} />
      <meta property="og:description" content={script.tagline} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={script.title} />
      <meta name="twitter:description" content={script.tagline} />

      <Link to="/" className="inline-flex items-center gap-2 mono-label text-[var(--t3)] hover:text-[var(--t1)] transition-colors mb-8">
        <Icon name="back" size={12} /> All scripts
      </Link>

      <div className="grid grid-cols-12 gap-8">
        {/* ── Main column ─────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8">
          <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] mb-8 overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-[var(--border)]" style={{ backgroundColor: 'var(--surface-hi)' }}>
              {script.mood ? <Badge mood={script.mood} /> : <span />}
              <span className="mono-label text-[var(--t3)]">{timeAgo(script.createdAt)}</span>
            </div>

            <div className="grain-surface px-6 py-8">
              <div className="relative z-[2]">
                <p className="mono-label text-[var(--t3)] mb-4">FilmyAF presents</p>
                <h1
                  className="text-[var(--t1)] mb-4"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 64px)', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 0.93, textWrap: 'balance' }}
                >
                  {script.title}
                </h1>
                <div className="w-12 h-px bg-[#D6294B] mb-4" />
                {script.tagline && <p className="body-lg italic text-[var(--t2)] mb-6 max-w-[480px]">{script.tagline}</p>}

                <div className="flex items-start gap-3 pt-4 border-t border-[var(--border)]">
                  <span className="mono-label text-[var(--t3)] pt-px flex-shrink-0">Based on —</span>
                  <p className="body-sm text-[var(--t2)] italic leading-relaxed">{script.situation}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-x-4 gap-y-3 flex-wrap px-6 py-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-4 flex-1 min-w-0 flex-wrap">
                <button
                  onClick={toggleLike}
                  aria-pressed={liked}
                  className={['transition-colors', liked ? 'text-[#D6294B]' : 'text-[var(--t3)] hover:text-[#D6294B]'].join(' ')}
                >
                  <Metric name={liked ? 'liked' : 'like'} value={likeCount} size={13} />
                </button>
                <span className="text-[var(--t3)]"><Metric name="comment" value={script.commentCount ?? 0} size={13} /></span>
                <span className="text-[var(--t3)]"><Metric name="clone" value={script.cloneCount ?? 0} size={13} /></span>
                <span className="text-[var(--t3)]"><Metric name="view" value={script.viewCount ?? 0} size={13} /></span>
              </div>

              <div className="flex items-center gap-2">
                {/* Cloning your own script would just duplicate it, so the
                    control is not offered to the owner at all. Signed-out
                    visitors still see it — clicking is what asks them to join. */}
                {!isOwner && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => (isAuthenticated ? setCloneOpen(true) : navigate(`/signup?redirect=${encodeURIComponent(window.location.pathname)}`))}
                    title={isAuthenticated ? 'Make it yours' : 'Create an account to clone this'}
                  >
                    <Icon name="clone" size={11} /> Clone
                  </Button>
                )}
                {isOwner && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditOpen(true)}
                      disabled={!canAfford('editScript')}
                      title={canAfford('editScript') ? undefined : 'Not enough takes'}
                    >
                      <Icon name="edit" size={11} /> Edit
                      <span className="opacity-60 ml-1">· {cost('editScript')}</span>
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleteOpen(true)} title="Delete">
                      <Icon name="delete" size={11} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cast */}
          {script.characters?.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="mono-label text-[var(--t2)]">Cast</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
                {isOwner ? (
                  <button
                    onClick={recast}
                    disabled={regenStatus.characters || !canAfford('recast')}
                    title={canAfford('recast') ? 'New cast, same story' : 'Not enough takes'}
                    className="mono-label text-[var(--t3)] hover:text-[#D6294B] transition-colors disabled:opacity-40 disabled:hover:text-[var(--t3)] flex items-center gap-2"
                  >
                    {regenStatus.characters ? <Spinner size={11} /> : <Icon name="reroll" size={11} />}
                    Recast
                    <CostLabel takes={cost('recast')} affordable={canAfford('recast')} />
                  </button>
                ) : (
                  <span className="mono-label text-[var(--t3)]">{script.characters.length}</span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {script.characters.map((c: any, i: number) => (
                  <CharacterCard key={c.name ?? i} character={c} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Scenes */}
          {script.scenes?.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="mono-label text-[var(--t2)]">Scenes</span>
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
                    cost={cost('rerollScene')}
                    affordable={canAfford('rerollScene')}
                    onReroll={rerollScene}
                  />
                ))}
              </div>
            </section>
          )}

          <Comments scriptId={script._id} />
        </div>

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-20 flex flex-col gap-6">
            <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] p-5">
              <p className="mono-label text-[var(--t3)] mb-4">Written by</p>
              {author ? (
                <Link to={`/profile/${author.username}`} className="flex items-center gap-3 group">
                  <Avatar emoji={author.avatarEmoji} handle={author.username} name={fullName(author)} size="md" />
                  <div className="min-w-0">
                    <p className="mono-label text-[var(--t1)] group-hover:text-[#D6294B] transition-colors truncate">{fullName(author)}</p>
                    <p className="body-sm text-[var(--t3)] truncate">@{author.username}</p>
                  </div>
                </Link>
              ) : (
                <p className="body-sm text-[var(--t2)] flex items-center gap-2">
                  <Icon name="anonymous" size={16} /> Anonymous
                </p>
              )}

              {script.clonedFrom && script.originalAuthor && (
                <p className="mono-label text-[var(--t3)] mt-4 pt-4 border-t border-[var(--border)]">
                  Cloned from{' '}
                  <Link to={`/profile/${script.originalAuthor.username}`} className="text-[#D6294B] hover:underline">
                    @{script.originalAuthor.username}
                  </Link>
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-1">
                <p className="mono-label text-[var(--t3)]">Shot on {formatIST(script.createdAt)}</p>
                {script.lastEditedAt && (
                  <p className="mono-label text-[var(--t3)]">Reshot {formatIST(script.lastEditedAt)}</p>
                )}
              </div>
            </div>

            <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] p-5">
              <p className="mono-label text-[var(--t3)] mb-4">Share this drama</p>
              <SharePanel script={script} />
            </div>
          </div>
        </aside>
      </div>

      <RemixModal
        open={cloneOpen}
        onClose={() => setCloneOpen(false)}
        title="Clone & remix"
        subtitle="Leave it as-is for a straight copy, or change the situation or mood to get your own version."
        ctaLabel="Clone & remix"
        initialSituation={script.situation}
        initialMood={script.mood}
        onSubmit={onClone}
      />

      <RemixModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit your script"
        subtitle="Changing the situation or mood re-runs all three agents on this same script."
        ctaLabel="Save & re-generate"
        initialSituation={script.situation}
        initialMood={script.mood}
        onSubmit={onEdit}
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this script?"
        subtitle="This cannot be undone. Its likes and comments go with it."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>Keep it</Button>
            <Button variant="danger" onClick={onDelete} loading={deleting}>Delete forever</Button>
          </>
        }
      >
        <p className="body-md text-[var(--t2)]">
          <span className="text-[var(--t1)]">{script.title}</span> will be removed from the feed and
          from your history.
        </p>
      </Modal>
    </div>
  );
}
