import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateService } from '../../services/generateService.js';
import { scriptService } from '../../services/scriptService.js';

const initialState = {
  currentScript: null,
  generationStatus: 'idle', 
  error: null,
  /* Live pipeline state, fed by the SSE stream. `stage` is the index of the
     agent currently working (0 Director, 1 Casting, 2 Screenwriter); preview
     holds what has landed so far, so the overlay can show the real title while
     Casting and the Screenwriter are still running. */
  stream: { stage: 0, preview: null },
  regenStatus: {
    scene: null,        
    title: false,
    characters: false,
  },
};

export const generateThunk = createAsyncThunk(
  'script/generate',
  async ({ situation, mood, save }, { rejectWithValue }) => {
    try {
      const data = await generateService.generate(situation, mood, save);
      return data;
    } catch (e) {
      return rejectWithValue({ message: e.message, details: e.details });
    }
  }
);

/** Ordered to match PIPELINE in components/ui/PipelineStepper. */
const STAGE_INDEX = { director: 0, casting: 1, screenwriter: 2 };

export const generateStreamThunk = createAsyncThunk(
  'script/generateStream',
  async ({ situation, mood, save }, { dispatch, rejectWithValue }) => {
    try {
      return await generateService.generateStream({
        situation,
        mood,
        save,
        onStage: (stage, payload) => {
          dispatch(stageLanded({ stage, payload }));
        },
      });
    } catch (e) {
      return rejectWithValue({ message: e.message, details: e.details, code: e.code });
    }
  }
);

export const saveCurrentThunk = createAsyncThunk(
  'script/save',
  async (_arg, { getState, rejectWithValue }) => {
    const { script } = getState();
    if (!script.currentScript) throw new Error('Nothing to save');
    try {
      const data = await scriptService.save(script.currentScript);
      return data;
    } catch (e) {
      return rejectWithValue({ message: e.message });
    }
  }
);

export const regenerateSceneThunk = createAsyncThunk(
  'script/regenScene',
  async ({ scriptId, sceneIndex, instruction }, { rejectWithValue }) => {
    try {
      return await generateService.regenerateScene(scriptId, sceneIndex, instruction);
    } catch (e) {
      return rejectWithValue({ message: e.message });
    }
  }
);

export const regenerateTitleThunk = createAsyncThunk(
  'script/regenTitle',
  async ({ scriptId }, { rejectWithValue }) => {
    try {
      return await generateService.regenerateTitle(scriptId);
    } catch (e) {
      return rejectWithValue({ message: e.message });
    }
  }
);

export const regenerateCharactersThunk = createAsyncThunk(
  'script/regenCharacters',
  async ({ scriptId }, { rejectWithValue }) => {
    try {
      return await generateService.regenerateCharacters(scriptId);
    } catch (e) {
      return rejectWithValue({ message: e.message });
    }
  }
);

const slice = createSlice({
  name: 'script',
  initialState,
  reducers: {
    setCurrentScript(state, action) {
      state.currentScript = action.payload;
    },
    clearCurrent(state) {
      state.currentScript = null;
      state.generationStatus = 'idle';
      state.error = null;
      state.stream = { stage: 0, preview: null };
    },
    /* An agent finished. Advance the stepper past it and keep whatever it
       produced - the Director's title is the reason this endpoint exists. */
    stageLanded(state, action) {
      const { stage, payload } = action.payload;
      const idx = STAGE_INDEX[stage];
      if (idx === undefined) return;
      state.stream.stage = Math.min(idx + 1, 2);
      if (stage === 'director') {
        state.stream.preview = { title: payload.title, tagline: payload.tagline };
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(generateThunk.pending, (s) => {
      s.generationStatus = 'loading';
      s.error = null;
    });
    b.addCase(generateThunk.fulfilled, (s, a) => {
      s.generationStatus = 'success';
      s.currentScript = a.payload.script;
    });
    b.addCase(generateThunk.rejected, (s, a) => {
      s.generationStatus = 'error';
      s.error = a.payload || { message: a.error.message };
    });

    b.addCase(generateStreamThunk.pending, (s) => {
      s.generationStatus = 'loading';
      s.error = null;
      s.stream = { stage: 0, preview: null };
    });
    b.addCase(generateStreamThunk.fulfilled, (s, a) => {
      s.generationStatus = 'success';
      s.currentScript = a.payload.script;
    });
    b.addCase(generateStreamThunk.rejected, (s, a) => {
      s.generationStatus = 'error';
      s.error = a.payload || { message: a.error.message };
      s.stream = { stage: 0, preview: null };
    });

    b.addCase(saveCurrentThunk.fulfilled, (s, a) => {
      s.currentScript = a.payload.script;
    });

    b.addCase(regenerateSceneThunk.pending, (s, a) => {
      s.regenStatus.scene = a.meta.arg.sceneIndex;
    });
    b.addCase(regenerateSceneThunk.fulfilled, (s, a) => {
      s.regenStatus.scene = null;
      s.currentScript = a.payload.script;
    });
    b.addCase(regenerateSceneThunk.rejected, (s) => {
      s.regenStatus.scene = null;
    });

    b.addCase(regenerateTitleThunk.pending, (s) => {
      s.regenStatus.title = true;
    });
    b.addCase(regenerateTitleThunk.fulfilled, (s, a) => {
      s.regenStatus.title = false;
      s.currentScript = a.payload.script;
    });
    b.addCase(regenerateTitleThunk.rejected, (s) => {
      s.regenStatus.title = false;
    });

    b.addCase(regenerateCharactersThunk.pending, (s) => {
      s.regenStatus.characters = true;
    });
    b.addCase(regenerateCharactersThunk.fulfilled, (s, a) => {
      s.regenStatus.characters = false;
      s.currentScript = a.payload.script;
    });
    b.addCase(regenerateCharactersThunk.rejected, (s) => {
      s.regenStatus.characters = false;
    });
  },
});

export const { setCurrentScript, clearCurrent, stageLanded } = slice.actions;
export default slice.reducer;
