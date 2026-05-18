import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scriptService } from '../../services/scriptService.js';
import { loadLocal, saveLocal, clearLocal } from '../../utils/localHistory.js';

const initialState = {
  local: loadLocal(),
  server: [],
  status: 'idle',
};

export const loadServerHistory = createAsyncThunk('history/load', () => scriptService.myHistory());

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
  },
});

export const { pushLocal, clearLocalHistory } = slice.actions;
export default slice.reducer;
