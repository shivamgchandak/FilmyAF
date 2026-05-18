import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  loadServerHistory,
  clearLocalHistory,
} from '../redux/slices/historySlice.js';
import ScriptFeedCard from '../components/community/ScriptFeedCard.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { formatMood, timeAgo } from '../utils/formatters.js';

export default function History() {
  const dispatch = useDispatch();
  const { local, server } = useSelector((s) => s.history);

  useEffect(() => {
    dispatch(loadServerHistory());
  }, [dispatch]);

  const empty = local.length === 0 && server.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Helmet>
        <title>History · FilmyAF</title>
      </Helmet>

      <div>
        <h1 className="heading text-4xl text-bolly-paper mb-1">Your past dramas 🎬</h1>
        <p className="text-bolly-paper/60">Everything you've generated, on this device + your account.</p>
      </div>

      {empty ? (
        <EmptyState
          emoji="🎞️"
          title="No history yet"
          description="Generate your first script to see it here."
          action={<Link to="/generate" className="btn-primary">Generate one</Link>}
        />
      ) : (
        <>
          {server.length > 0 && (
            <section>
              <h2 className="heading text-2xl text-bolly-saffron mb-3">Saved to your account</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {server.map((s) => (
                  <ScriptFeedCard key={s._id} script={s} />
                ))}
              </div>
            </section>
          )}

          {local.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="heading text-2xl text-bolly-saffron">On this device</h2>
                <button
                  onClick={() => {
                    if (window.confirm('Clear local history?')) dispatch(clearLocalHistory());
                  }}
                  className="btn-ghost text-xs"
                >
                  Clear local
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {local.map((s, i) => {
                  const inner = (
                    <>
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
                      <p className="text-xs text-bolly-paper/40 mt-2 line-clamp-2">{s.situation}</p>
                    </>
                  );
                  return s.shareSlug ? (
                    <Link
                      key={i}
                      to={`/script/${s.shareSlug}`}
                      className="card block hover:border-bolly-saffron/40 transition"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={i} className="card">
                      {inner}
                      <p className="text-xs text-bolly-paper/40 mt-2">
                        Not saved to account.
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
