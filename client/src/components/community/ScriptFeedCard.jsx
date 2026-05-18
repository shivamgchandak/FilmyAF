import { Link } from 'react-router-dom';
import { formatMood, fullName, timeAgo } from '../../utils/formatters.js';

export default function ScriptFeedCard({ script }) {
  return (
    <Link
      to={`/script/${script.shareSlug}`}
      className="card block hover:border-bolly-saffron/40 hover:scale-[1.01] transition group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="badge bg-bolly-saffron/20 text-bolly-saffron">
          {formatMood(script.mood)}
        </span>
        <span className="text-xs text-bolly-paper/40">{timeAgo(script.createdAt)}</span>
      </div>

      <h3 className="heading text-xl text-bolly-paper group-hover:text-bolly-saffron transition">
        {script.title}
      </h3>
      {script.tagline && (
        <p className="text-sm italic text-bolly-gold mt-1 line-clamp-2">"{script.tagline}"</p>
      )}

      <div className="flex items-center justify-between mt-4 text-xs text-bolly-paper/60">
        <span>
          {script.userId ? (
            <>
              {script.userId.avatarEmoji || '🎬'} @{script.userId.username || fullName(script.userId)}
            </>
          ) : (
            <>👻 anonymous</>
          )}
        </span>
        <span className="flex items-center gap-3">
          <span>❤️ {script.likeCount || 0}</span>
          <span>💬 {script.commentCount || 0}</span>
          {script.cloneCount > 0 && <span>🔁 {script.cloneCount}</span>}
        </span>
      </div>
    </Link>
  );
}
