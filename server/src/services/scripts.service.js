import { Script } from '../models/Script.js';
import { ApiError } from '../utils/ApiError.js';
import { runFullPipeline } from './llm/agents.js';

export const createScript = async (data) => Script.create(data);

export const findByIdOrFail = async (id) => {
  const script = await Script.findById(id);
  if (!script) throw ApiError.notFound('Script not found');
  return script;
};

export const findBySlugOrFail = async (slug) => {
  const script = await Script.findOne({ shareSlug: slug });
  if (!script) throw ApiError.notFound('Script not found');
  return script;
};

export const assertOwner = (script, userId) => {
  if (!userId || !script.userId || !script.userId.equals(userId)) {
    throw ApiError.forbidden('You can only edit your own scripts. Clone it first!');
  }
};

/**
 * Clone a script. If the cloner provided a custom situation or a different mood,
 * we re-run the full LLM pipeline so the new script reflects the remix.
 */
export const cloneScript = async (original, clonerUserId, { situation, mood } = {}) => {
  const origSituation = (original.situation || '').trim();
  const newSituation = (situation || '').trim();
  const wantsRemix =
    (newSituation && newSituation !== origSituation) ||
    (mood && mood !== original.mood);

  let payload;
  if (wantsRemix) {
    const finalSituation = situation?.trim() || original.situation;
    const finalMood = mood || original.mood;
    const regenerated = await runFullPipeline({
      situation: finalSituation,
      mood: finalMood,
    });
    payload = {
      title: regenerated.title,
      tagline: regenerated.tagline,
      situation: finalSituation,
      mood: finalMood,
      characters: regenerated.characters,
      scenes: regenerated.scenes,
    };
  } else {
    payload = {
      title: original.title,
      tagline: original.tagline,
      situation: original.situation,
      mood: original.mood,
      characters: original.characters.map((c) => c.toObject?.() || c),
      scenes: original.scenes.map((s) => s.toObject?.() || s),
    };
  }

  const cloned = await Script.create({
    userId: clonerUserId,
    ...payload,
    isPublic: true,
    clonedFrom: original._id,
    originalAuthor: original.originalAuthor || original.userId,
  });
  await Script.findByIdAndUpdate(original._id, { $inc: { cloneCount: 1 } });
  return cloned;
};

/**
 * Edit an existing script's prompt + mood and re-run the full LLM pipeline.
 * Replaces title, tagline, characters and scenes. Owner-only — call site
 * is responsible for assertOwner.
 */
export const regenerateFromPrompt = async (script, { situation, mood }) => {
  const regenerated = await runFullPipeline({
    situation,
    mood: mood || script.mood,
  });
  script.title = regenerated.title;
  script.tagline = regenerated.tagline;
  script.situation = situation;
  script.mood = mood || script.mood;
  script.characters = regenerated.characters;
  script.scenes = regenerated.scenes;
  script.lastEditedAt = new Date();
  script.markModified('characters');
  script.markModified('scenes');
  await script.save();
  return script;
};
