import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ScriptCard from '../components/script/ScriptCard';
import { ScriptCardSkeleton } from '../components/ui/Skeleton';
import { scriptService } from '../services/scriptService.js';
import { fullName } from '../utils/formatters.js';

interface Stats {
  scripts: number;
  likes: number;
  clones: number;
}

/** 3.2k rather than 3247 - a profile stat is a sense of scale, not an audit. */
const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}k` : String(n ?? 0);

/** A section rule: label on the left, hairline filling the rest. */
function SectionLabel({ children, trailing }: { children: string; trailing?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="mono-label text-[var(--t2)]">{children}</span>
      <div className="flex-1 h-px bg-[var(--border)]" />
      {trailing && <span className="mono-label text-[var(--t3)]">{trailing}</span>}
    </div>
  );
}

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({ scripts: 0, likes: 0, clones: 0 });
  const [topMoods, setTopMoods] = useState<Array<{ mood: string; count: number }>>([]);
  const [topScripts, setTopScripts] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const d = await scriptService.byUsername(username);
        if (cancelled) return;
        setUser(d.user);
        setStats(d.stats || { scripts: 0, likes: 0, clones: 0 });
        setTopMoods(d.topMoods || []);
        setTopScripts(d.topScripts || []);
      } catch (e: any) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => <ScriptCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (err || !user) {
    return (
      <div className="max-w-[560px] mx-auto px-6 py-24 text-center">
        <p className="display-md text-[var(--t1)] mb-3">No such name on the call sheet</p>
        <p className="body-md text-[var(--t2)] mb-8">We couldn't find @{username}.</p>
        <Link to="/"><Button>Back to the feed</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <title>{`@${user.username} · FilmyAF`}</title>

      <header className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] p-6 mb-10 grain-surface">
        <div className="relative z-[2] flex items-center gap-5 flex-wrap">
          <Avatar emoji={user.avatarEmoji} handle={user.username} name={fullName(user)} size="lg" />
          <div className="min-w-0">
            <h1
              className="text-[var(--t1)]"
              style={{ fontFamily: 'var(--font-display)', fontSize: 34, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.01em' }}
            >
              {fullName(user)}
            </h1>
            <p className="mono-label text-[var(--t3)] mt-1">@{user.username}</p>
          </div>

          {/* Totals come from the server, over every script - summing the three
              cards below would report a writer's three best as their whole body
              of work. */}
          <div className="flex items-center gap-8 ml-auto">
            {([
              ['Scripts', stats.scripts],
              ['Likes', stats.likes],
              ['Clones', stats.clones],
            ] as const).map(([label, value]) => (
              <div key={label} className="text-right">
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--t1)', lineHeight: 1 }}>
                  {compact(value)}
                </p>
                <p className="mono-label text-[var(--t3)] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {topMoods.length > 0 && (
        <div className="mb-10">
          <SectionLabel>Preferred moods</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {topMoods.map((m) => (
              <Badge key={m.mood} mood={m.mood} />
            ))}
          </div>
        </div>
      )}

      <SectionLabel trailing={stats.scripts > topScripts.length ? `Top ${topScripts.length} of ${stats.scripts}` : undefined}>
        Top scripts
      </SectionLabel>

      {topScripts.length === 0 ? (
        <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] px-6 py-14 text-center">
          <p className="body-md text-[var(--t2)]">Nothing public here yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topScripts.map((s) => <ScriptCard key={s._id} script={s} />)}
        </div>
      )}
    </div>
  );
}
