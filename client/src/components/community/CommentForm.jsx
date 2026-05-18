import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button.jsx';
import { commentService } from '../../services/commentService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';

export default function CommentForm({ scriptId, onAdded }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  if (!isAuthenticated) {
    return (
      <div className="card text-sm text-bolly-paper/60">
        <button
          onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
          className="text-bolly-saffron hover:underline"
        >
          Login
        </button>{' '}
        to leave a comment.
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      const d = await commentService.add(scriptId, text.trim());
      onAdded?.(d.comment);
      setText('');
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err.message || 'Failed to post comment');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-3">
      <textarea
        className="input min-h-[80px] resize-y"
        placeholder="Drop your thoughts… ✍️"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-bolly-paper/40">{text.length}/500</span>
        <Button type="submit" loading={busy} disabled={!text.trim()}>
          Post comment
        </Button>
      </div>
    </form>
  );
}
