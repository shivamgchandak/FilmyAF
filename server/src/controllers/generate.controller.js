import { asyncHandler } from '../utils/asyncHandler.js';
import {
  runFullPipeline,
  regenerateOneScene,
  regenerateTitleAndTagline,
  regenerateAllCharacters,
} from '../services/llm/agents.js';
import { Script } from '../models/Script.js';
import {
  findByIdOrFail,
  assertOwner,
  regenerateFromPrompt,
} from '../services/scripts.service.js';

export const generateScript = asyncHandler(async (req, res) => {
  const { situation, mood = 'masala', save = false } = req.body;
  const generated = await runFullPipeline({ situation, mood });

  if (save && req.user) {
    const doc = await Script.create({
      ...generated,
      userId: req.user._id,
      isPublic: true,
    });
    return res.status(201).json({ success: true, data: { script: doc, saved: true } });
  }

  res.json({ success: true, data: { script: generated, saved: false } });
});

export const regenerateScene = asyncHandler(async (req, res) => {
  const { scriptId, sceneIndex, instruction } = req.body;
  const script = await findByIdOrFail(scriptId);
  assertOwner(script, req.user._id);

  const newScene = await regenerateOneScene({ script, sceneIndex, instruction });
  const idx = script.scenes.findIndex((s) => s.index === sceneIndex);
  if (idx === -1) {
    script.scenes.push(newScene);
  } else {
    script.scenes[idx] = newScene;
  }
  await script.save();
  res.json({ success: true, data: { script } });
});

export const regenerateTitle = asyncHandler(async (req, res) => {
  const { scriptId } = req.body;
  const script = await findByIdOrFail(scriptId);
  assertOwner(script, req.user._id);

  const { title, tagline } = await regenerateTitleAndTagline({ script });
  script.title = title;
  script.tagline = tagline;
  await script.save();
  res.json({ success: true, data: { script } });
});

export const regenerateCharacters = asyncHandler(async (req, res) => {
  const { scriptId } = req.body;
  const script = await findByIdOrFail(scriptId);
  assertOwner(script, req.user._id);

  const newCast = await regenerateAllCharacters({ script });
  const renameMap = {};
  script.characters.forEach((c, i) => {
    if (newCast[i]) renameMap[c.name] = newCast[i].name;
  });
  script.characters = newCast;
  script.scenes = script.scenes.map((s) => {
    const sceneObj = typeof s.toObject === 'function' ? s.toObject() : { ...s };
    sceneObj.dialogue = (sceneObj.dialogue || []).map((d) => ({
      ...d,
      character: renameMap[d.character] || d.character,
    }));
    return sceneObj;
  });
  script.markModified('scenes');
  await script.save();
  res.json({ success: true, data: { script } });
});


export const editScript = asyncHandler(async (req, res) => {
  const { scriptId, situation, mood } = req.body;
  const script = await findByIdOrFail(scriptId);
  assertOwner(script, req.user._id);
  const updated = await regenerateFromPrompt(script, { situation, mood });
  await updated.populate([
    { path: 'userId', select: 'firstName lastName username avatarEmoji' },
    { path: 'originalAuthor', select: 'firstName lastName username avatarEmoji' },
  ]);
  res.json({ success: true, data: { script: updated } });
});
