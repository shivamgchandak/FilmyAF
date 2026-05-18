import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadPopular,
  loadRecent,
  loadMostCloned,
  setActiveTab,
} from '../redux/slices/feedSlice.js';
import ScriptFeedCard from '../components/community/ScriptFeedCard.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

const TABS = [
  { key: 'popular', label: '🔥 Trending' },
  { key: 'recent', label: '🆕 Recent' },
  { key: 'mostCloned', label: '🔁 Most Cloned' },
];

export default function Home() {
  const dispatch = useDispatch();
  const { popular, recent, mostCloned, activeTab, status } = useSelector((s) => s.feed);

  useEffect(() => {
    dispatch(loadPopular());
    dispatch(loadRecent());
    dispatch(loadMostCloned());
  }, [dispatch]);

  const scripts =
    activeTab === 'popular' ? popular : activeTab === 'recent' ? recent : mostCloned;

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-12 sm:py-20 px-4">
        <h1 className="heading text-5xl sm:text-7xl text-bolly-paper mb-3">
          Turn your <span className="text-bolly-saffron">boring life</span>
          <br />
          into <span className="text-bolly-red">Bollywood.</span>
        </h1>
        <p className="text-lg text-bolly-paper/70 max-w-xl mx-auto mb-6">
          Real life is mid. We fix that. Give us a mundane situation, get a full Bollywood
          script back — title, characters, scenes, and dialogues you'll quote on WhatsApp.
        </p>
        <Link to="/generate" className="btn-primary text-lg px-8 py-4">
          🎬 Generate your drama
        </Link>
      </section>

      {/* Feed */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => dispatch(setActiveTab(t.key))}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeTab === t.key
                    ? 'bg-bolly-red text-white'
                    : 'bg-white/5 text-bolly-paper/70 hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-bolly-paper/40">Showing top 6</span>
        </div>

        {status === 'loading' && scripts.length === 0 ? (
          <p className="text-bolly-paper/50">Loading the masala…</p>
        ) : scripts.length === 0 ? (
          <EmptyState
            emoji="🎬"
            title="No scripts here yet"
            description="Be the first to drop some drama on FilmyAF."
            action={<Link to="/generate" className="btn-primary">Generate one</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scripts.map((s) => (
              <ScriptFeedCard key={s._id} script={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
