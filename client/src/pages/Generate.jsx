import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import SituationInput from '../components/generator/SituationInput.jsx';
import MoodSelector from '../components/generator/MoodSelector.jsx';
import GenerateButton from '../components/generator/GenerateButton.jsx';
import LoadingDrama from '../components/generator/LoadingDrama.jsx';
import ScriptDisplay from '../components/script/ScriptDisplay.jsx';
import ShareButton from '../components/community/ShareButton.jsx';

import { generateThunk, saveCurrentThunk } from '../redux/slices/scriptSlice.js';
import { pushLocal } from '../redux/slices/historySlice.js';
import { validateSituation } from '../utils/validators.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

export default function Generate() {
  const [situation, setSituation] = useState('');
  const [mood, setMood] = useState('masala');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { currentScript, generationStatus, error: serverError } = useSelector((s) => s.script);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const onGenerate = async () => {
    const e = validateSituation(situation);
    setError(e || '');
    if (e) return;
    const result = await dispatch(
      generateThunk({ situation, mood, save: isAuthenticated })
    );
    if (result.error) {
      toast.error(result.payload?.message || 'Generation failed');
      return;
    }
    dispatch(
      pushLocal({
        title: result.payload.script.title,
        tagline: result.payload.script.tagline,
        mood,
        situation,
        shareSlug: result.payload.script.shareSlug || null,
        createdAt: new Date().toISOString(),
      })
    );
    if (result.payload.saved && result.payload.script.shareSlug) {
      navigate(`/script/${result.payload.script.shareSlug}`);
    }
  };

  const onSaveToAccount = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/generate');
      return;
    }
    setSaving(true);
    try {
      const r = await dispatch(saveCurrentThunk());
      if (r.error) {
        toast.error(r.payload?.message || 'Save failed');
      } else {
        toast.success('Saved! 🎬');
        navigate(`/script/${r.payload.script.shareSlug}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const isOwner =
    !!user && currentScript?.userId && (currentScript.userId === user._id || currentScript.userId._id === user._id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Generate · FilmyAF</title>
      </Helmet>

      {!currentScript || generationStatus === 'loading' ? (
        <>
          <h1 className="heading text-4xl text-bolly-paper mb-1">Pitch your scene 🎬</h1>
          <p className="text-bolly-paper/60 mb-6">
            Tell us the situation — we'll turn it into Bollywood.
          </p>

          <div className="card space-y-5">
            <SituationInput value={situation} onChange={setSituation} error={error} />
            <MoodSelector value={mood} onChange={setMood} />
            <GenerateButton
              loading={generationStatus === 'loading'}
              onClick={onGenerate}
              disabled={!situation.trim()}
            />
            {serverError && (
              <p className="text-bolly-red text-sm text-center">
                {serverError.message}
              </p>
            )}
            {!isAuthenticated && (
              <p className="text-xs text-bolly-paper/40 text-center">
                You're not logged in — script will be generated but not saved. Sign up to keep
                your dramas, like, comment, and clone others'.
              </p>
            )}
          </div>
        </>
      ) : null}

      {generationStatus === 'loading' && (
        <div className="mt-6">
          <LoadingDrama />
        </div>
      )}

      {currentScript && generationStatus !== 'loading' && (
        <div className="mt-2 space-y-6 animate-slide-up">
          <ScriptDisplay script={currentScript} isOwner={isOwner} />

          {currentScript.shareSlug && <ShareButton script={currentScript} />}

          <div className="flex flex-wrap gap-3 justify-center">
            {!currentScript._id && (
              <button
                onClick={onSaveToAccount}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? '⏳ Saving…' : '💾 Save to my account'}
              </button>
            )}
            <button
              onClick={() => {
                setSituation('');
                setMood('masala');
                dispatch({ type: 'script/clearCurrent' });
              }}
              className="btn-secondary"
            >
              ✨ Start fresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
