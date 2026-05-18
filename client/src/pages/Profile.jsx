import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { scriptService } from '../services/scriptService.js';
import ScriptFeedCard from '../components/community/ScriptFeedCard.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { fullName } from '../utils/formatters.js';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const d = await scriptService.byUsername(username);
        if (!cancelled) {
          setUser(d.user);
          setScripts(d.scripts);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [username]);

  if (loading) return <p className="text-center p-8 text-bolly-paper/60">Loading…</p>;
  if (err || !user) {
    return (
      <EmptyState
        emoji="👻"
        title="User not found"
        action={<Link to="/" className="btn-primary">Back home</Link>}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Helmet>
        <title>@{user.username} · FilmyAF</title>
      </Helmet>

      <div className="card flex items-center gap-4">
        <div className="text-5xl">{user.avatarEmoji || '🎬'}</div>
        <div>
          <h1 className="heading text-3xl">{fullName(user)}</h1>
          <p className="text-bolly-paper/60">@{user.username}</p>
        </div>
      </div>

      <h2 className="heading text-2xl text-bolly-saffron">Public dramas</h2>
      {scripts.length === 0 ? (
        <p className="text-bolly-paper/50">No public scripts yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scripts.map((s) => (
            <ScriptFeedCard key={s._id} script={s} />
          ))}
        </div>
      )}
    </div>
  );
}
