import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ScriptCard from '../components/script/ScriptCard';
import { ScriptCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { loadServerHistory } from '../redux/slices/historySlice.js';
import { useAuth } from '../hooks/useAuth.js';
import { moodLabel } from '../lib/moods';
import { timeAgo } from '../utils/formatters.js';

export default function History() {
  const dispatch = useDispatch<any>();
  const { isAuthenticated } = useAuth();
  const { local, server, status } = useSelector((s: any) => s.history);

  useEffect(() => {
    if (isAuthenticated) dispatch(loadServerHistory());
  }, [dispatch, isAuthenticated]);

  const scripts = isAuthenticated ? server : local;
  const empty = scripts.length === 0;
  const loading = isAuthenticated && status === 'loading' && empty;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <title>My scripts · FilmyAF</title>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-px bg-[#D6294B]" />
          <span className="mono-label text-[#D6294B]">{isAuthenticated ? 'Your library' : 'On this device'}</span>
        </div>
        <h1
          className="text-[var(--t1)] mb-2"
          style={{ fontFamily: 'var(--font-display)', fontSize: 40, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.01em' }}
        >
          {isAuthenticated ? 'My scripts' : 'Saved on this device'}
        </h1>
        <p className="body-md text-[var(--t2)]">
          {isAuthenticated
            ? "Everything you've written and kept."
            : 'These live in this browser only. Create an account to keep them for good.'}
        </p>
      </header>

      {!isAuthenticated && !empty && (
        <div className="border border-[#D6294B]/40 bg-[var(--accent-sub)] rounded-[2px] px-5 py-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="mono-label text-[#D6294B] mb-1">Not saved yet</p>
            <p className="body-sm text-[var(--t2)]">
              Clear your browser and these are gone. An account keeps them, and makes them shareable.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link to="/login?redirect=/history"><Button size="sm" variant="secondary">Log in</Button></Link>
            <Link to="/signup?redirect=/history"><Button size="sm">Create account</Button></Link>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => <ScriptCardSkeleton key={i} />)}
        </div>
      ) : empty ? (
        <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] px-6 py-16 text-center">
          <p className="display-sm text-[var(--t1)] mb-2">Nothing shot yet</p>
          <p className="body-md text-[var(--t2)] mb-6 max-w-[400px] mx-auto">
            Write your first script and it'll show up here.
          </p>
          <Link to="/generate"><Button>Write my script</Button></Link>
        </div>
      ) : isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scripts.map((s: any) => <ScriptCard key={s._id} script={s} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scripts.map((s: any, i: number) => (
            <div key={i} className="flex flex-col border border-[var(--border)] rounded-[2px] bg-[var(--surface)] overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-[var(--border)]">
                <Badge mood={s.mood} />
                <span className="mono-label text-[var(--t3)]">{timeAgo(s.createdAt)}</span>
              </div>
              <div className="px-4 py-4 flex-1">
                <h3
                  className="text-[22px] uppercase leading-none mb-2 text-[var(--t1)]"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
                >
                  {s.title}
                </h3>
                {s.tagline && <p className="body-sm text-[var(--t2)] italic leading-relaxed">{s.tagline}</p>}
              </div>
              <div className="px-4 pb-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="mono-label text-[var(--t3)]">
                  {s.characters?.length || 0} cast · {s.scenes?.length || 0} scenes
                </span>
                <span className="mono-label text-[var(--t3)]">{moodLabel(s.mood)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
