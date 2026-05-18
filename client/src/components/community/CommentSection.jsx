import { useEffect, useState } from 'react';
import CommentForm from './CommentForm.jsx';
import { commentService } from '../../services/commentService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { timeAgo, fullName } from '../../utils/formatters.js';

export default function CommentSection({ scriptId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await commentService.list(scriptId);
        if (!cancelled) setComments(d.comments);
      } catch (err) {
        if (!cancelled) toast.error(err.message || 'Failed to load comments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [scriptId]);

  const onAdded = (c) => setComments((prev) => [c, ...prev]);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentService.remove(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="heading text-2xl text-bolly-saffron">Audience reactions 💬</h2>
      <CommentForm scriptId={scriptId} onAdded={onAdded} />

      {loading ? (
        <p className="text-sm text-bolly-paper/50">Loading…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-bolly-paper/50">Be the first to react!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c._id} className="card">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{c.userId?.avatarEmoji || '🎬'}</span>
                  <span className="font-semibold text-sm">{fullName(c.userId)}</span>
                  <span className="text-xs text-bolly-paper/40">· {timeAgo(c.createdAt)}</span>
                </div>
                {user && c.userId?._id === user._id && (
                  <button
                    onClick={() => onDelete(c._id)}
                    className="text-xs text-bolly-paper/40 hover:text-bolly-red"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-bolly-paper/90 text-sm whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
