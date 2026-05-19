import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scriptService } from '../../services/scriptService.js';
import { loadLocal, saveLocal, clearLocal } from '../../utils/localHistory.js';

const initialState = {
  local: loadLocal(),
  server: [],
  status: 'idle',
};

export const loadServerHistory = createAsyncThunk('history/load', () => scriptService.myHistory());


export const migrateLocalThunk = createAsyncThunk(
  'history/migrate',
  async (_arg, { getState }) => {
    const { history } = getState();
    const entries = history.local || [];
    if (entries.length === 0) return { migrated: 0, remaining: [] };

    const remaining = [];
    let migrated = 0;
    for (const e of entries) {

      if (!e || !Array.isArray(e.scenes) || e.scenes.length === 0) {
        continue;
      }
      try {
        await scriptService.save({
          title: e.title,
          tagline: e.tagline || '',
          situation: e.situation,
          mood: e.mood || 'masala',
          characters: e.characters || [],
          scenes: e.scenes,
          isPublic: true,
        });
        migrated += 1;
      } catch (err) {
        console.warn('[migrate] keeping entry locally, upload failed:', err.message);
        remaining.push(e);
      }
    }
    saveLocal(remaining);
    return { migrated, remaining };
  }
);

const slice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    pushLocal(state, action) {
      state.local = [action.payload, ...state.local].slice(0, 25);
      saveLocal(state.local);
    },
    clearLocalHistory(state) {
      state.local = [];
      clearLocal();
    },
  },
  extraReducers: (b) => {
    b.addCase(loadServerHistory.pending, (s) => { s.status = 'loading'; });
    b.addCase(loadServerHistory.fulfilled, (s, a) => {
      s.status = 'success';
      s.server = a.payload.scripts;
    });
    b.addCase(loadServerHistory.rejected, (s) => { s.status = 'error'; });

    b.addCase(migrateLocalThunk.fulfilled, (s, a) => {
      s.local = a.payload.remaining || [];
    });
  },
});

export const { pushLocal, clearLocalHistory } = slice.actions;
export default slice.reducer;
