import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { scriptService } from '../services/scriptService.js';
import ScriptDisplay from '../components/script/ScriptDisplay.jsx';
import ShareButton from '../components/community/ShareButton.jsx';
import LikeButton from '../components/community/LikeButton.jsx';
import CloneButton from '../components/community/CloneButton.jsx';
import CommentSection from '../components/community/CommentSection.jsx';
import EditScriptButton from '../components/script/EditScriptButton.jsx';
import DeleteScriptButton from '../components/script/DeleteScriptButton.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { fullName, formatIST } from '../utils/formatters.js';

export default function ScriptView() {
  const { slug } = useParams();
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const d = await scriptService.bySlug(slug);
        if (!cancelled) setScript(d.script);
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-bolly-paper/60">
        Loading the drama…
      </div>
    );
  }

  if (err || !script) {
    return (
      <EmptyState
        emoji="🎬"
        title="Script not found"
        description={err || 'This drama may have been taken off-screen.'}
        action={<Link to="/" className="btn-primary">Back to feed</Link>}
      />
    );
  }

  const author = script.userId;
  const isOwner = user && author && (author._id === user._id || author === user._id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Helmet>
        <title>{script.title} · FilmyAF</title>
        <meta name="description" content={script.tagline} />
        <meta property="og:title" content={script.title} />
        <meta property="og:description" content={script.tagline} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={script.title} />
        <meta name="twitter:description" content={script.tagline} />
      </Helmet>

      {/* Timestamps row */}
      <div className="text-xs text-bolly-paper/50 flex flex-wrap gap-x-3 gap-y-1">
        <span>🎬 Generated on {formatIST(script.createdAt)}</span>
        {script.lastEditedAt && (
          <span className="text-bolly-gold/80">
            ✏️ Last updated on {formatIST(script.lastEditedAt)}
          </span>
        )}
      </div>

      {/* Author + actions row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm text-bolly-paper/60">
          {author ? (
            <>
              by{' '}
              <Link
                to={`/profile/${author.username}`}
                className="text-bolly-saffron hover:underline"
              >
                {author.avatarEmoji || '🎬'} {fullName(author)}
              </Link>
            </>
          ) : (
            <span>👻 anonymous</span>
          )}
          {script.clonedFrom && script.originalAuthor && (
            <>
              {' · '}
              <span className="text-bolly-gold">
                🔁 cloned from{' '}
                <Link
                  to={`/profile/${script.originalAuthor.username}`}
                  className="hover:underline"
                >
                  @{script.originalAuthor.username}
                </Link>
              </span>
            </>
          )}
          {' · '}
          <span>👁️ {script.viewCount || 0}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <LikeButton scriptId={script._id} initialCount={script.likeCount} />
          <CloneButton script={script} />
          {isOwner && (
            <>
              <EditScriptButton
                script={script}
                onUpdated={(updated) => setScript(updated)}
              />
              <DeleteScriptButton scriptId={script._id} />
            </>
          )}
        </div>
      </div>

      <ScriptDisplay script={script} isOwner={isOwner} />
      <ShareButton script={script} />
      <CommentSection scriptId={script._id} />
    </div>
  );
}
