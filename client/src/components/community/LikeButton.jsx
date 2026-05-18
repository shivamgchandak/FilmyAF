import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { likeService } from '../../services/likeService.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function LikeButton({ scriptId, initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await likeService.status(scriptId);
        if (!cancelled) {
          setCount(d.likeCount);
          setLiked(d.hasLiked);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scriptId]);

  const onClick = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (busy) return;
    setBusy(true);
    setLiked((v) => !v);
    setCount((c) => c + (liked ? -1 : 1));
    try {
      const d = await likeService.toggle(scriptId);
      setLiked(d.liked);
      setCount(d.likeCount);
    } catch {
      // revert
      setLiked((v) => !v);
      setCount((c) => c + (liked ? 1 : -1));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
        liked
          ? 'bg-bolly-red/20 text-bolly-red'
          : 'bg-white/5 text-bolly-paper/70 hover:bg-white/10'
      }`}
      disabled={busy}
    >
      <span className={liked ? 'animate-pulse' : ''}>{liked ? '❤️' : '🤍'}</span>
      {count}
    </button>
  );
}
