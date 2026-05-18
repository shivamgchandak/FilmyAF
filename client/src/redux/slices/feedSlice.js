import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedService } from '../../services/feedService.js';

const initialState = {
  popular: [],
  recent: [],
  mostCloned: [],
  activeTab: 'popular',
  status: 'idle',
  error: null,
};

export const loadPopular = createAsyncThunk('feed/popular', () => feedService.popular());
export const loadRecent = createAsyncThunk('feed/recent', () => feedService.recent());
export const loadMostCloned = createAsyncThunk('feed/most-cloned', () => feedService.mostCloned());

const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadPopular.pending, (s) => { s.status = 'loading'; });
    b.addCase(loadPopular.fulfilled, (s, a) => { s.status = 'success'; s.popular = a.payload.scripts; });
    b.addCase(loadPopular.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message; });

    b.addCase(loadRecent.pending, (s) => { s.status = 'loading'; });
    b.addCase(loadRecent.fulfilled, (s, a) => { s.status = 'success'; s.recent = a.payload.scripts; });
    b.addCase(loadRecent.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message; });

    b.addCase(loadMostCloned.pending, (s) => { s.status = 'loading'; });
    b.addCase(loadMostCloned.fulfilled, (s, a) => { s.status = 'success'; s.mostCloned = a.payload.scripts; });
    b.addCase(loadMostCloned.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message; });
  },
});

export const { setActiveTab } = slice.actions;
export default slice.reducer;
