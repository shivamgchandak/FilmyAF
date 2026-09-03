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
import { spend, debit, refund, TAKE_COSTS } from '../services/takes.service.js';

const authorPopulate = [
  { path: 'userId', select: 'firstName lastName username avatarEmoji' },
  { path: 'originalAuthor', select: 'firstName lastName username avatarEmoji' },
];

/**
 * Every endpoint below charges takes through `spend`, which debits first,
 * runs the work, and refunds if the work throws. Ownership is always checked
 * BEFORE the debit so a forbidden request never costs anything.
 */

export const generateScript = asyncHandler(async (req, res) => {
  const { situation, mood = 'masala', save = false } = req.body;

  const { result: generated, takesRemaining } = await spend(
    req,
    TAKE_COSTS.generate,
    'a new script',
    () => runFullPipeline({ situation, mood })
  );

  if (save && req.user) {
    const doc = await Script.create({
      ...generated,
      userId: req.user._id,
      isPublic: true,
    });
    return res
      .status(201)
      .json({ success: true, data: { script: doc, saved: true, takesRemaining } });
  }

  res.json({ success: true, data: { script: generated, saved: false, takesRemaining } });
});

/**
 * Same pipeline as generateScript, delivered as Server-Sent Events so the
 * browser can show the title the moment the Director agent returns instead of
 * staring at "Untitled" for the whole ~26s run.
 *
 * Events: director → casting → screenwriter → done (or failed).
 *
 * This does NOT use `spend`, because spend debits and runs the work in one
 * call and there is no way to write SSE headers between the two. A failed
 * debit (out of takes, bad input) has to come back as an ordinary JSON error
 * with a real status code - once the stream is open, the status is already 200
 * and the browser will not treat it as an error. So: debit first, open the
 * stream only once it succeeds, and refund by hand if the pipeline throws.
 */
export const generateScriptStream = asyncHandler(async (req, res) => {
  const { situation, mood = 'masala', save = false } = req.body;

  // Pre-flight, still plain JSON on failure. Nothing is written to the socket.
  const takesRemaining = await debit(req, TAKE_COSTS.generate, 'a new script');

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    // Render fronts services with a proxy; without this it may buffer the
    // whole response and deliver every event at once, which defeats the point.
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders?.();

  let closed = false;
  req.on('close', () => {
    closed = true;
  });

  const send = (event, data) => {
    if (closed || res.writableEnded) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // A comment frame every 15s: idle proxies drop a connection that says
  // nothing, and the Screenwriter agent alone can run longer than that.
  const heartbeat = setInterval(() => {
    if (!closed && !res.writableEnded) res.write(': keep-alive\n\n');
  }, 15000);

  try {
    const generated = await runFullPipeline({
      situation,
      mood,
      onStage: (stage, payload) => send(stage, payload),
    });

    let script = generated;
    let saved = false;
    if (save && req.user) {
      script = await Script.create({ ...generated, userId: req.user._id, isPublic: true });
      saved = true;
    }

    send('done', { script, saved, takesRemaining });
  } catch (err) {
    // The user paid up front and got nothing - give it back.
    await refund(req, TAKE_COSTS.generate).catch((e) =>
      console.error(`[generate/stream] refund failed: ${e.message}`)
    );
    send('failed', {
      code: err.code || 'GENERATION_FAILED',
      message: err.message || 'Generation failed',
    });
  } finally {
    clearInterval(heartbeat);
    if (!res.writableEnded) res.end();
  }
});

export const regenerateScene = asyncHandler(async (req, res) => {
  const { scriptId, sceneIndex, instruction } = req.body;
  const script = await findByIdOrFail(scriptId);
  assertOwner(script, req.user._id);

  const { result: newScene, takesRemaining } = await spend(
    req,
    TAKE_COSTS.rerollScene,
    'a scene re-roll',
    () => regenerateOneScene({ script, sceneIndex, instruction })
  );

  const idx = script.scenes.findIndex((s) => s.index === sceneIndex);
  if (idx === -1) script.scenes.push(newScene);
  else script.scenes[idx] = newScene;
  script.markModified('scenes');
  await script.save();

  res.json({ success: true, data: { script, takesRemaining } });
});

export const regenerateTitle = asyncHandler(async (req, res) => {
  const { scriptId } = req.body;
  const script = await findByIdOrFail(scriptId);
  assertOwner(script, req.user._id);

  const { result, takesRemaining } = await spend(
    req,
    TAKE_COSTS.rerollTitle,
    'a new title',
    () => regenerateTitleAndTagline({ script })
  );

  script.title = result.title;
  script.tagline = result.tagline;
  await script.save();

  res.json({ success: true, data: { script, takesRemaining } });
});

export const regenerateCharacters = asyncHandler(async (req, res) => {
  const { scriptId } = req.body;
  const script = await findByIdOrFail(scriptId);
  assertOwner(script, req.user._id);

  const { result: newCast, takesRemaining } = await spend(
    req,
    TAKE_COSTS.recast,
    'a recast',
    () => regenerateAllCharacters({ script })
  );

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
  script.markModified('characters');
  script.markModified('scenes');
  await script.save();

  res.json({ success: true, data: { script, takesRemaining } });
});

export const editScript = asyncHandler(async (req, res) => {
  const { scriptId, situation, mood } = req.body;
  const script = await findByIdOrFail(scriptId);
  assertOwner(script, req.user._id);

  const { result: updated, takesRemaining } = await spend(
    req,
    TAKE_COSTS.editScript,
    'a full re-write',
    () => regenerateFromPrompt(script, { situation, mood })
  );

  await updated.populate(authorPopulate);
  res.json({ success: true, data: { script: updated, takesRemaining } });
});
