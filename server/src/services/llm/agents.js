import { callLLM, parseJSON } from './client.js';
import {
  directorPrompt,
  castingPrompt,
  screenwriterPrompt,
  regenerateScenePrompt,
  regenerateTitlePrompt,
  regenerateCharactersPrompt,
} from './prompts.js';
import { ApiError } from '../../utils/ApiError.js';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const isInt = (v) => typeof v === 'number' && Number.isInteger(v);

const validateDirector = (obj) => {
  if (!obj || typeof obj !== 'object') return 'Director response is not an object';
  if (!isNonEmptyString(obj.title)) return 'Missing/invalid title';
  if (!isNonEmptyString(obj.tagline)) return 'Missing/invalid tagline';
  if (!isNonEmptyString(obj.genreTone)) return 'Missing/invalid genreTone';
  if (!isInt(obj.numScenes) || obj.numScenes < 3 || obj.numScenes > 5)
    return 'numScenes must be int 3-5';
  if (!isInt(obj.characterCount) || obj.characterCount < 2 || obj.characterCount > 4)
    return 'characterCount must be int 2-4';
  return null;
};

const validateCharacter = (c) => {
  if (!c || typeof c !== 'object') return 'character not object';
  if (!isNonEmptyString(c.name)) return 'character.name missing';
  if (!isNonEmptyString(c.role)) return 'character.role missing';
  if (!isNonEmptyString(c.description)) return 'character.description missing';
  return null;
};

const validateCasting = (obj, expectedCount) => {
  if (!obj || typeof obj !== 'object') return 'Casting response is not an object';
  if (!Array.isArray(obj.characters)) return 'characters must be array';
  if (obj.characters.length !== expectedCount)
    return `expected ${expectedCount} characters, got ${obj.characters.length}`;
  for (const c of obj.characters) {
    const e = validateCharacter(c);
    if (e) return e;
  }
  return null;
};

const validateScene = (s, expectedIndex, characterNames) => {
  if (!s || typeof s !== 'object') return 'scene not object';
  if (s.index !== expectedIndex) return `scene.index expected ${expectedIndex}`;
  if (!isNonEmptyString(s.heading)) return 'scene.heading missing';
  if (!isNonEmptyString(s.description)) return 'scene.description missing';
  if (!Array.isArray(s.dialogue) || s.dialogue.length < 2)
    return 'scene needs 2+ dialogue entries';
  for (const d of s.dialogue) {
    if (!isNonEmptyString(d.character) || !isNonEmptyString(d.line))
      return 'dialogue entry missing character/line';
    if (characterNames && !characterNames.includes(d.character)) {
      return `dialogue.character "${d.character}" is not one of ${characterNames.join(', ')}`;
    }
  }
  return null;
};

const validateScreenwriter = (obj, expectedScenes, characterNames) => {
  if (!obj || typeof obj !== 'object') return 'Screenwriter response is not an object';
  if (!Array.isArray(obj.scenes)) return 'scenes must be array';
  if (obj.scenes.length !== expectedScenes)
    return `expected ${expectedScenes} scenes, got ${obj.scenes.length}`;
  for (let i = 0; i < obj.scenes.length; i += 1) {
    const e = validateScene(obj.scenes[i], i + 1, characterNames);
    if (e) return `scene ${i + 1}: ${e}`;
  }
  return null;
};

const callAndValidate = async ({
  systemPrompt,
  userPrompt,
  temperature,
  maxTokens,
  validate,
  label,
}) => {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const raw = await callLLM({
      systemPrompt,
      userPrompt:
        attempt === 1
          ? userPrompt
          : `${userPrompt}\n\nIMPORTANT: Your previous response failed validation. Return ONLY valid JSON matching the schema exactly.`,
      temperature,
      maxTokens,
    });
    try {
      const parsed = parseJSON(raw);
      const err = validate(parsed);
      if (!err) return parsed;
      console.warn(`[${label}] validation failed attempt ${attempt}: ${err}`);
    } catch (e) {
      console.warn(`[${label}] JSON parse failed attempt ${attempt}: ${e.message}`);
    }
  }
  throw ApiError.internal(
    `Our ${label} agent forgot the lines and walked off set. Try again. 🎬`
  );
};

export const runFullPipeline = async ({ situation, mood }) => {
  const directorOut = await callAndValidate({
    ...buildPrompt(directorPrompt({ situation, mood })),
    temperature: 0.4,
    maxTokens: 800,
    validate: validateDirector,
    label: 'Director',
  });

  const castingOut = await callAndValidate({
    ...buildPrompt(castingPrompt({ situation, mood, director: directorOut })),
    temperature: 0.9,
    maxTokens: 1800,
    validate: (obj) => validateCasting(obj, directorOut.characterCount),
    label: 'Casting',
  });

  const characterNames = castingOut.characters.map((c) => c.name);
  const screenplayOut = await callAndValidate({
    ...buildPrompt(
      screenwriterPrompt({
        situation,
        mood,
        director: directorOut,
        characters: castingOut.characters,
      })
    ),
    temperature: 0.95,
    maxTokens: 4000,
    validate: (obj) =>
      validateScreenwriter(obj, directorOut.numScenes, characterNames),
    label: 'Screenwriter',
  });

  return {
    title: directorOut.title,
    tagline: directorOut.tagline,
    situation,
    mood,
    characters: castingOut.characters.map((c) => ({
      name: c.name,
      role: c.role,
      description: c.description,
      signatureStyle: c.signatureStyle || '',
      emoji: c.emoji || '🎭',
    })),
    scenes: screenplayOut.scenes,
  };
};

export const regenerateOneScene = async ({ script, sceneIndex, instruction }) => {
  const characterNames = script.characters.map((c) => c.name);
  const out = await callAndValidate({
    ...buildPrompt(regenerateScenePrompt({ script, sceneIndex, instruction })),
    temperature: 0.95,
    maxTokens: 2000,
    validate: (obj) => {
      if (!obj || !obj.scene) return 'response missing "scene"';
      return validateScene(obj.scene, sceneIndex, characterNames);
    },
    label: 'Scene-regen',
  });
  return out.scene;
};

export const regenerateTitleAndTagline = async ({ script }) => {
  const out = await callAndValidate({
    ...buildPrompt(regenerateTitlePrompt({ script })),
    temperature: 0.85,
    maxTokens: 400,
    validate: (obj) => {
      if (!isNonEmptyString(obj?.title)) return 'missing title';
      if (!isNonEmptyString(obj?.tagline)) return 'missing tagline';
      return null;
    },
    label: 'Title-regen',
  });
  return { title: out.title, tagline: out.tagline };
};

export const regenerateAllCharacters = async ({ script }) => {
  const expected = script.characters.length;
  const out = await callAndValidate({
    ...buildPrompt(regenerateCharactersPrompt({ script })),
    temperature: 0.9,
    maxTokens: 1800,
    validate: (obj) => validateCasting(obj, expected),
    label: 'Cast-regen',
  });
  return out.characters.map((c) => ({
    name: c.name,
    role: c.role,
    description: c.description,
    signatureStyle: c.signatureStyle || '',
    emoji: c.emoji || '🎭',
  }));
};

function buildPrompt({ system, user }) {
  return { systemPrompt: system, userPrompt: user };
}
