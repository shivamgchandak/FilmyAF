import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Icon, { Metric } from '../ui/Icon';
import { timeAgo } from '../../utils/formatters.js';

const fmt = (n?: number): string => {
  const v = n ?? 0;
  return v >= 1000 ? `${(v / 1000).toFixed(1).replace('.0', '')}k` : String(v);
};

interface Author {
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarEmoji?: string;
}

interface Script {
  _id?: string;
  shareSlug?: string;
  title: string;
  tagline?: string;
  mood?: string;
  userId?: Author | string | null;
  likeCount?: number;
  commentCount?: number;
  cloneCount?: number;
  createdAt?: string;
}

export default function ScriptCard({ script }: { script: Script }) {
  const author = typeof script.userId === 'object' && script.userId ? script.userId : null;

  return (
    <Link
      to={script.shareSlug ? `/script/${script.shareSlug}` : '#'}
      className="flex flex-col border border-[var(--border)] rounded-[2px] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hi)] transition-all duration-150 overflow-hidden group"
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-[var(--border)]">
        {script.mood ? <Badge mood={script.mood} /> : <span />}
        <span className="mono-label text-[var(--t3)]">{timeAgo(script.createdAt)}</span>
      </div>

      <div className="px-4 py-4 flex-1 flex flex-col">
        <h3
          className="text-[22px] uppercase leading-none mb-2 text-[var(--t1)] group-hover:text-[#D6294B] transition-colors line-clamp-2"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
        >
          {script.title}
        </h3>
        {/* Clamped and height-reserved so every card in a row breaks its
            footer rule at the same y - ragged dividers read as broken. */}
        <p className="body-sm text-[var(--t2)] italic leading-relaxed line-clamp-2 min-h-[2.9em]">
          {script.tagline}
        </p>
      </div>

      <div className="flex items-center gap-3 px-4 pb-4 pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5 mr-auto min-w-0">
          {author ? (
            <>
              <Avatar emoji={author.avatarEmoji} handle={author.username} size="xs" />
              <span className="mono-label text-[var(--t3)] truncate">@{author.username}</span>
            </>
          ) : (
            <span className="mono-label text-[var(--t3)] flex items-center gap-1">
              <Icon name="anonymous" size={11} /> anonymous
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 text-[var(--t3)]">
          <Metric name="like" value={fmt(script.likeCount)} />
          <Metric name="comment" value={fmt(script.commentCount)} />
          {(script.cloneCount ?? 0) > 0 && <Metric name="clone" value={fmt(script.cloneCount)} />}
        </div>
      </div>
    </Link>
  );
}
