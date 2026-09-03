import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { commentService } from '../../services/commentService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { timeAgo, fullName } from '../../utils/formatters.js';

/** Byline + delete control. Identical for a root comment and a reply. */
function CommentHead({ c, user, onDelete }: { c: any; user: any; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Avatar emoji={c.userId?.avatarEmoji} handle={c.userId?.username} size="xs" />
      <Link
        to={`/profile/${c.userId?.username}`}
        className="mono-label text-[var(--t1)] hover:text-[#D6294B] transition-colors"
      >
        {fullName(c.userId)}
      </Link>
      <span className="mono-label text-[var(--t3)]">· {timeAgo(c.createdAt)}</span>
      {user && c.userId?._id === user._id && (
        <button
          onClick={onDelete}
          aria-label="Delete comment"
          className="ml-auto text-[var(--t3)] hover:text-[#D6294B] transition-colors"
        >
          <Icon name="delete" size={12} />
        </button>
      )}
    </div>
  );
}

export default function Comments({ scriptId }: { scriptId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyBusy, setReplyBusy] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await commentService.list(scriptId);
        if (!cancelled) setComments(d.comments);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [scriptId]);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      const d = await commentService.add(scriptId, text.trim());
      setComments((prev) => [d.comment, ...prev]);
      setText('');
    } catch (err: any) {
      toast.error(err?.message || 'Could not post that');
    } finally {
      setBusy(false);
    }
  };

  const postReply = async (parentId: string) => {
    const body = replyText.trim();
    if (!body) return;
    setReplyBusy(true);
    try {
      const d = await commentService.add(scriptId, body, parentId);
      setComments((prev) => [...prev, d.comment]);
      setReplyText('');
      setReplyTo(null);
    } catch (err: any) {
      toast.error(err?.message || 'Could not post that');
    } finally {
      setReplyBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await commentService.remove(id);
      // The server takes a parent's replies with it, so drop them here too
      // rather than leaving replies pointing at a comment that is gone.
      setComments((prev) => prev.filter((c) => c._id !== id && String(c.parentId) !== id));
      if (replyTo === id) setReplyTo(null);
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  /* The API returns one flat list, newest first. Roots keep that order;
     replies are flipped to oldest-first, because a conversation reads down. */
  const roots = comments.filter((c) => !c.parentId);
  const repliesOf = (id: string) =>
    comments
      .filter((c) => String(c.parentId) === String(id))
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="mono-label text-[var(--t2)]">Audience reactions</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="mono-label text-[var(--t3)]">{comments.length}</span>
      </div>

      {isAuthenticated ? (
        <form onSubmit={post} className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] p-4 mb-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="What did you think?"
            className="w-full bg-transparent text-[var(--t1)] placeholder:text-[var(--t3)] text-[14px] leading-relaxed resize-none focus:outline-none"
          />
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <span className="mono-sm text-[var(--t3)]">{text.length}/500</span>
            <Button type="submit" size="sm" loading={busy} disabled={!text.trim()}>Post</Button>
          </div>
        </form>
      ) : (
        <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] px-4 py-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="body-sm text-[var(--t2)]">Sign in to leave a reaction.</p>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}>
            Log in
          </Button>
        </div>
      )}

      {loading ? (
        <p className="body-sm text-[var(--t3)]">Loading…</p>
      ) : failed ? (
        <p className="body-sm text-[var(--t3)]">Couldn't load the comments.</p>
      ) : comments.length === 0 ? (
        <p className="body-sm text-[var(--t3)]">No reactions yet. Be the first.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {roots.map((c) => {
            const replies = repliesOf(c._id);
            return (
              <div key={c._id} className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] p-4">
                <CommentHead c={c} user={user} onDelete={() => remove(c._id)} />
                <p className="body-sm text-[var(--t1)] whitespace-pre-wrap">{c.content}</p>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(replyTo === c._id ? null : c._id);
                      setReplyText('');
                    }}
                    className="mono-label text-[var(--t3)] hover:text-[#D6294B] transition-colors mt-3"
                  >
                    {replyTo === c._id ? 'Cancel' : 'Reply'}
                  </button>
                )}

                {(replies.length > 0 || replyTo === c._id) && (
                  <div className="mt-4 pl-4 border-l border-[var(--border)] flex flex-col gap-4">
                    {replies.map((r) => (
                      <div key={r._id}>
                        <CommentHead c={r} user={user} onDelete={() => remove(r._id)} />
                        <p className="body-sm text-[var(--t1)] whitespace-pre-wrap">{r.content}</p>
                      </div>
                    ))}

                    {replyTo === c._id && (
                      <form
                        onSubmit={(e) => { e.preventDefault(); postReply(c._id); }}
                        className="border border-[var(--border)] rounded-[2px] bg-[var(--bg)] p-3"
                      >
                        <textarea
                          autoFocus
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          maxLength={500}
                          rows={2}
                          placeholder={`Reply to ${fullName(c.userId) || 'this'}…`}
                          className="w-full bg-transparent text-[var(--t1)] placeholder:text-[var(--t3)] text-[14px] leading-relaxed resize-none focus:outline-none"
                        />
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                          <span className="mono-sm text-[var(--t3)]">{replyText.length}/500</span>
                          <Button type="submit" size="sm" loading={replyBusy} disabled={!replyText.trim()}>
                            Reply
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
