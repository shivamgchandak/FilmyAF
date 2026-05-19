import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { loadServerHistory } from '../redux/slices/historySlice.js';
import ScriptFeedCard from '../components/community/ScriptFeedCard.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { formatMood, timeAgo } from '../utils/formatters.js';
import { useAuth } from '../hooks/useAuth.js';

export default function History() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { local, server } = useSelector((s) => s.history);

  useEffect(() => {
    if (isAuthenticated) dispatch(loadServerHistory());
  }, [dispatch, isAuthenticated]);

  // Single source: server when logged in, local when logged out.
  const scripts = isAuthenticated ? server : local;
  const empty = scripts.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Helmet>
        <title>History · FilmyAF</title>
      </Helmet>

      {/* Header */}
      <div>
        <h1 className="heading text-4xl text-bolly-paper mb-1">
          {isAuthenticated ? 'Your dramas 🎬' : 'On this device 📼'}
        </h1>
        <p className="text-bolly-paper/60">
          {isAuthenticated
            ? "Everything you've saved to your account."
            : 'Scripts you generated in this browser.'}
        </p>
      </div>

      {/* One save CTA above the grid — only when logged out and there's
          something worth saving. */}
      {!isAuthenticated && !empty && (
        <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-bolly-paper">
            Save these dramas to your account <span className="ml-1">🎬</span>
          </p>
          <div className="flex gap-2">
            <Link to="/login?redirect=/history" className="btn-secondary text-sm">
              Login
            </Link>
            <Link to="/signup?redirect=/history" className="btn-primary text-sm">
              Sign up
            </Link>
          </div>
        </div>
      )}

      {/* Cards */}
      {empty ? (
        <EmptyState
          emoji="🎞️"
          title="No history yet"
          description="Generate your first script to see it here."
          action={<Link to="/generate" className="btn-primary">Generate one</Link>}
        />
      ) : isAuthenticated ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scripts.map((s) => (
            <ScriptFeedCard key={s._id} script={s} />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scripts.map((s, i) => (
            <div key={i} className="card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="badge bg-bolly-saffron/20 text-bolly-saffron">
                  {formatMood(s.mood)}
                </span>
                <span className="text-xs text-bolly-paper/40">{timeAgo(s.createdAt)}</span>
              </div>
              <h3 className="heading text-xl text-bolly-paper">{s.title}</h3>
              {s.tagline && (
                <p className="text-sm italic text-bolly-gold mt-1 line-clamp-2">"{s.tagline}"</p>
              )}
              <p className="text-xs text-bolly-paper/50 mt-2 line-clamp-2">{s.situation}</p>
              {Array.isArray(s.scenes) && s.scenes.length > 0 && (
                <p className="text-xs text-bolly-paper/40 mt-2">
                  🎭 {s.characters?.length || 0} characters · 🎬 {s.scenes.length} scenes
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
