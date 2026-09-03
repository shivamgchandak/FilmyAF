import { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadPopular,
  loadRecent,
  loadMostCloned,
  loadAll,
  setActiveTab,
} from '../redux/slices/feedSlice.js';
import ScriptCard from '../components/script/ScriptCard';
import { ScriptCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { useAuth } from '../hooks/useAuth.js';
import { useTakes } from '../hooks/useTakes';

const TABS = [
  { key: 'popular', label: 'Trending' },
  { key: 'recent', label: 'Recent' },
  { key: 'mostCloned', label: 'Most Cloned' },
  { key: 'all', label: 'All Scripts' },
];

export default function Home() {
  const dispatch = useDispatch<any>();
  const { isAuthenticated } = useAuth();
  const { cost, grant, grantPeriod, anonymous } = useTakes();
  const { popular, recent, mostCloned, all, activeTab, status } = useSelector((s: any) => s.feed);

  useEffect(() => {
    dispatch(loadPopular());
    dispatch(loadRecent());
    dispatch(loadMostCloned());
  }, [dispatch]);

  // "All scripts" pages in on demand, so only fetch it when the tab is opened.
  useEffect(() => {
    if (activeTab === 'all' && all.status === 'idle') dispatch(loadAll({}));
  }, [activeTab, all.status, dispatch]);

  const isAll = activeTab === 'all';
  const scripts = isAll
    ? all.items
    : activeTab === 'popular'
      ? popular
      : activeTab === 'recent'
        ? recent
        : mostCloned;

  const loading = isAll
    ? all.status === 'loading' && all.items.length === 0
    : status === 'loading' && scripts.length === 0;
  const failed = isAll
    ? all.status === 'error' && all.items.length === 0
    : status === 'error' && scripts.length === 0;

  /* Infinite scroll: a sentinel below the grid asks for the next page as it
     comes into view. The thunk itself refuses overlapping and past-the-end
     calls, so a fast scroll can't stack requests. */
  const sentinel = useRef<HTMLDivElement | null>(null);
  const loadMore = useCallback(() => {
    if (isAll && all.hasMore && all.status !== 'loading') dispatch(loadAll({ cursor: all.cursor }));
  }, [isAll, all.hasMore, all.status, all.cursor, dispatch]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !isAll) return;
    const io = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { rootMargin: '400px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [isAll, loadMore]);

  const facts: Array<[string, React.ReactNode]> = [
    [
      'Per generation',
      <span key="c" className="inline-flex items-baseline gap-1.5">
        {cost('generate')}
        <Icon name="takes" size={16} />
      </span>,
    ],
    [
      grantPeriod === 'device' ? 'Takes per device' : 'Daily Credit',
      <span key="c" className="inline-flex items-baseline gap-1.5">
        {grant ?? (anonymous ? 5 : 10)}
        <Icon name="takes" size={16} />
      </span>,
    ],
    ['Drama available', '∞'],
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      <title>FilmyAF · Your life, but Bollywood</title>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="grain-surface relative border-b border-[var(--border)]" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 relative z-[2]">
          {/* gap-x stays 0 until md: a 12-col grid with a 40px gap has a
              minimum width of 11 x 40 = 440px, which overflows a 377px phone
              even though every child is col-span-12 there. */}
          <div className="grid grid-cols-12 gap-y-10 md:gap-x-10 items-end">
            <div className="col-span-12 md:col-span-7 lg:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="mono-label text-[#D6294B]">AI screenplay generator</span>
              </div>

              <h1 className="display-hero text-[var(--t1)] mb-6">
                Your life is mid.
                <br />
                <span className="text-[#D6294B]">We'll fix that</span>
                <br />
                in three acts.
              </h1>

              <p className="body-lg text-[var(--t2)] max-w-[540px] mb-8">
                Type a mundane situation. Pick a mood. Get back a full Bollywood screenplay:
                characters, scenes and dialogue you'll quote on WhatsApp.
              </p>

              <div className="flex items-center gap-5 flex-wrap">
                <Link to="/generate">
                  <Button size="lg">
                    Write my script
                    <Icon name="arrow" size={14} />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/signup" className="mono-label text-[var(--t3)] hover:text-[var(--t1)] transition-colors">
                    Sign up for 30 <Icon name="takes" size={12} /> ↗
                  </Link>
                )}
              </div>
            </div>

            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <div className="border border-[var(--border)] rounded-[2px] bg-[var(--bg)] p-6">
                <div className="mono-label text-[var(--t3)] mb-5">By the numbers</div>
                {facts.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-3 border-t border-[var(--border)] first:border-t-0">
                    <span className="mono-label text-[var(--t3)]">{label}</span>
                    <span
                      className="tabular-nums"
                      style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--t1)' }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feed ─────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex items-center border-b border-[var(--border)] mb-8 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => dispatch(setActiveTab(t.key))}
              className={[
                'px-3.5 sm:px-5 py-3 mono-label transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0',
                activeTab === t.key
                  ? 'text-[#D6294B] border-[#D6294B]'
                  : 'text-[var(--t3)] border-transparent hover:text-[var(--t1)]',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => <ScriptCardSkeleton key={i} />)}
          </div>
        ) : failed ? (
          <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] px-6 py-14 text-center">
            <p className="display-sm text-[var(--t1)] mb-2">The projector jammed</p>
            <p className="body-md text-[var(--t2)] mb-6 max-w-[420px] mx-auto">
              We couldn't load the feed. It's us, not you.
            </p>
            <Button variant="secondary" onClick={() => dispatch(isAll ? loadAll({}) : loadPopular())}>
              Try again
            </Button>
          </div>
        ) : scripts.length === 0 ? (
          <div className="border border-[var(--border)] rounded-[2px] bg-[var(--surface)] px-6 py-14 text-center">
            <p className="display-sm text-[var(--t1)] mb-2">Nothing showing yet</p>
            <p className="body-md text-[var(--t2)] mb-6 max-w-[420px] mx-auto">
              Be the first to put some drama on the board.
            </p>
            <Link to="/generate"><Button>Write my script</Button></Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {scripts.map((s: any) => <ScriptCard key={s._id} script={s} />)}
            </div>

            {isAll && (
              <>
                <div ref={sentinel} aria-hidden="true" className="h-px" />
                {all.status === 'loading' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                    {[0, 1, 2].map((i) => <ScriptCardSkeleton key={i} />)}
                  </div>
                )}
                {all.status === 'error' && (
                  <div className="text-center mt-8">
                    <Button variant="secondary" onClick={loadMore}>Load more</Button>
                  </div>
                )}
                {!all.hasMore && all.items.length > 0 && (
                  <p className="mono-label text-[var(--t3)] text-center mt-10">
                    That's every script · {all.items.length}
                  </p>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
