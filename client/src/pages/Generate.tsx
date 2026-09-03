import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { Textarea } from '../components/ui/Input';
import MoodTile from '../components/ui/MoodTile';
import SuggestionChip from '../components/ui/SuggestionChip';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import TakesCounter, { CostLabel } from '../components/ui/TakesCounter';
import GeneratingOverlay from '../components/script/GeneratingOverlay';
import ScriptBody from '../components/script/ScriptBody';
import { MOOD_KEYS, MOOD_LABEL, type MoodKey } from '../lib/moods';

import { generateStreamThunk, saveCurrentThunk } from '../redux/slices/scriptSlice.js';
import { pushLocal } from '../redux/slices/historySlice.js';
import { validateSituation } from '../utils/validators.js';
import { useAuth } from '../hooks/useAuth.js';
import { useTakes } from '../hooks/useTakes';
import { useToast } from '../hooks/useToast.js';
import { suggestionService } from '../services/suggestionService.js';

/* The title now arrives mid-run from the Director, so this is only the
   completion beat - long enough to see every stage tick over and "Print!"
   land, short enough not to feel like padding. */
const REVEAL_MS = 1000;

/* Rendered immediately so the chip row never flashes empty, then replaced by
   the day's set once /suggestions/daily answers. If that call fails the seed
   just stays - a user who doesn't know what to type still gets examples. */
const SEED_SUGGESTIONS = [
  'Fight between two founders over putting sugar in coffee',
  'Mom finds out son ordered Maggi instead of eating dal',
  "Office IT guy refuses to reset everyone's password",
  'Two roommates argue about whose turn it is to do dishes',
  'Guy forgets his anniversary and has to come up with an excuse',
];


export default function Generate() {
  const [situation, setSituation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(SEED_SUGGESTIONS);
  const [reveal, setReveal] = useState<{ title: string; tagline?: string } | null>(null);
  /* Set on mount as well as cleared on unmount. Under StrictMode React mounts,
     unmounts and remounts in dev, so a ref that is only cleared in the cleanup
     stays false forever after that first simulated unmount - which stranded the
     overlay and skipped the navigate. */
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { currentScript, generationStatus, stream } = useSelector((s: any) => s.script);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const toast = useToast();

  const { balance, known, dailyGrant, anonymous, cost, canAfford } = useTakes();
  const generateCost = cost('generate');
  const affordable = canAfford('generate');
  const isGenerating = generationStatus === 'loading';
  const canGenerate = situation.trim().length >= 5 && mood !== null && affordable;

  useEffect(() => {
    let live = true;
    suggestionService
      .daily()
      .then((d: { suggestions?: string[] }) => {
        if (live && Array.isArray(d?.suggestions) && d.suggestions.length) {
          setSuggestions(d.suggestions);
        }
      })
      .catch(() => {
        /* Seed stays on screen - chips are a nicety, not a blocker. */
      });
    return () => {
      live = false;
    };
  }, []);

  const onGenerate = async () => {
    const e = validateSituation(situation);
    setError(e || '');
    if (e || !mood) return;

    const result = await dispatch(generateStreamThunk({ situation, mood, save: isAuthenticated }));
    if (result.error) {
      toast.error(result.payload?.message || 'Generation failed');
      return;
    }
    const s = result.payload.script;

    // Keep the overlay up, now showing the real title, before the page changes.
    setReveal({ title: s.title, tagline: s.tagline });
    await new Promise((r) => setTimeout(r, REVEAL_MS));
    if (!mounted.current) return;
    setReveal(null);

    if (!isAuthenticated) {
      dispatch(pushLocal({
        title: s.title, tagline: s.tagline, mood, situation,
        characters: s.characters || [], scenes: s.scenes || [],
        createdAt: new Date().toISOString(),
      }));
    }
    if (result.payload.saved && s.shareSlug) navigate(`/script/${s.shareSlug}`);
  };

  const onSaveToAccount = async () => {
    if (!isAuthenticated) { navigate('/login?redirect=/generate'); return; }
    setSaving(true);
    try {
      const r = await dispatch(saveCurrentThunk());
      if (r.error) toast.error(r.payload?.message || 'Save failed');
      else navigate(`/script/${r.payload.script.shareSlug}`);
    } finally { setSaving(false); }
  };

  /* ── Result ─────────────────────────────────────────── */
  if (currentScript && !isGenerating && !reveal) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <title>{`${currentScript.title} · FilmyAF`}</title>
        <div className="max-w-[760px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#D6294B]" />
            <span className="mono-label text-[#D6294B]">That's a wrap</span>
          </div>

          <ScriptBody script={currentScript} />

          <div className="flex flex-wrap gap-3 justify-center mt-10 pt-8 border-t border-[var(--border)]">
            {!currentScript._id && (
              <Button onClick={onSaveToAccount} loading={saving}>
                {isAuthenticated ? 'Save to my account' : 'Create an account to keep it'}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                setSituation(''); setMood(null);
                dispatch({ type: 'script/clearCurrent' });
              }}
            >
              Start fresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────── */
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <title>Generate · FilmyAF</title>
      {(isGenerating || reveal) && (
        <GeneratingOverlay
          finished={!!reveal}
          stage={stream?.stage}
          title={reveal?.title ?? stream?.preview?.title}
          tagline={reveal?.tagline ?? stream?.preview?.tagline}
        />
      )}

      {/* gap-x waits for lg, where the 8/4 split actually exists. A 12-col
          grid with a 32px gap has a floor of 11 x 32 = 352px, which overflows
          any phone even though both children are col-span-12 there. */}
      <div className="grid grid-cols-12 gap-y-8 lg:gap-x-8">
        <div className="col-span-12 lg:col-span-8">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#D6294B]" />
              <span className="mono-label text-[#D6294B]">Scene setup</span>
            </div>
            <h1
              className="text-[var(--t1)] mb-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: 40, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.01em' }}
            >
              What happened?
            </h1>
            <p className="body-md text-[var(--t2)]">
              Describe the most mundane thing. We'll make it cinematic.
            </p>
          </header>

          <div className="mb-6">
            <Textarea
              label="The situation"
              placeholder="Mom finds out son ordered Maggi instead of dal…"
              maxChars={500}
              rows={5}
              value={situation}
              error={error}
              onChange={(e) => { setSituation(e.target.value); if (error) setError(''); }}
            />
          </div>

          <div className="mb-10">
            <p className="mono-label text-[var(--t3)] mb-3">Or try one of these</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <SuggestionChip key={s} text={s} onClick={() => setSituation(s)} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="mono-label text-[var(--t2)]">Pick a mood</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="mono-label text-[var(--t3)]">Required</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MOOD_KEYS.map((m) => (
                <MoodTile key={m} mood={m} selected={mood === m} onClick={() => setMood(mood === m ? null : m)} />
              ))}
            </div>
          </div>
        </div>

        {/* Production brief */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <div className="border border-[var(--border)] rounded-[2px] p-6 bg-[var(--surface)]">
              <p className="mono-label text-[var(--t3)] mb-6">Production brief</p>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <p className="mono-label text-[var(--t3)] mb-1">Situation</p>
                  <p className="body-sm text-[var(--t1)] italic leading-relaxed">
                    {situation || <span className="text-[var(--t3)]">Not written yet…</span>}
                  </p>
                </div>
                <div>
                  <p className="mono-label text-[var(--t3)] mb-1">Mood</p>
                  <p className="body-sm text-[var(--t1)]">
                    {mood ? MOOD_LABEL[mood] : <span className="text-[var(--t3)]">Not selected</span>}
                  </p>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="mono-label text-[var(--t3)]">Cost</span>
                  <CostLabel takes={generateCost} affordable={affordable} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="mono-label text-[var(--t3)]">Your balance</span>
                  {known ? (
                    <TakesCounter remaining={balance!} anonymous={anonymous} />
                  ) : (
                    <span className="mono-label text-[var(--t3)]">-</span>
                  )}
                </div>
              </div>

              {known && !affordable ? (
                <div className="border border-[#D6294B]/40 bg-[var(--accent-sub)] rounded-[2px] p-4">
                  <p className="mono-label text-[#D6294B] mb-2">That's a wrap for now</p>
                  {anonymous ? (
                    <>
                      <p className="body-sm text-[var(--t2)] mb-4">
                        You've used your {5} free takes on this device. An account gets you
                        {' '}{10} more every day, and they pile up. They never expire.
                      </p>
                      <Link to={`/signup?redirect=/generate`}>
                        <Button fullWidth>Create an account</Button>
                      </Link>
                    </>
                  ) : (
                    <p className="body-sm text-[var(--t2)]">
                      You have {balance} take{balance === 1 ? '' : 's'} and this costs {generateCost}.
                      Another {dailyGrant} land tomorrow, on top of whatever you have left.
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <Button fullWidth disabled={!canGenerate} loading={isGenerating} onClick={onGenerate}>
                    Action · generate script
                    {!isGenerating && <Icon name="arrow" size={13} />}
                  </Button>
                  {!canGenerate && (
                    <p className="mono-label text-[var(--t3)] text-center mt-3">
                      {!situation.trim() ? 'Write a situation first' : 'Pick a mood to continue'}
                    </p>
                  )}
                </>
              )}

              {!isAuthenticated && (
                <p className="body-sm text-[var(--t3)] mt-4 pt-4 border-t border-[var(--border)] leading-relaxed">
                  You're not signed in, so the script won't be saved. You can create an account
                  afterwards to keep it.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
