import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { commentService } from '../../services/commentService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { timeAgo, fullName } from '../../utils/formatters.js';

export default function Comments({ scriptId }: { scriptId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
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

  const remove = async (id: string) => {
    try {
      await commentService.remove(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed');
    }
  };

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
          {comments.map((c) => (
            <div key={c._id} className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar emoji={c.userId?.avatarEmoji} handle={c.userId?.username} size="xs" />
                <Link to={`/profile/${c.userId?.username}`} className="mono-label text-[var(--t1)] hover:text-[#D6294B] transition-colors">
                  {fullName(c.userId)}
                </Link>
                <span className="mono-label text-[var(--t3)]">· {timeAgo(c.createdAt)}</span>
                {user && c.userId?._id === user._id && (
                  <button
                    onClick={() => remove(c._id)}
                    aria-label="Delete comment"
                    className="ml-auto text-[var(--t3)] hover:text-[#D6294B] transition-colors"
                  >
                    <Icon name="delete" size={12} />
                  </button>
                )}
              </div>
              <p className="body-sm text-[var(--t1)] whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
