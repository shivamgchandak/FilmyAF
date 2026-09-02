import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedService } from '../../services/feedService.js';

const initialState = {
  popular: [],
  recent: [],
  mostCloned: [],
  /** "All scripts" is the only endless tab, so it carries its own paging state. */
  all: { items: [], cursor: null, hasMore: true, status: 'idle' },
  activeTab: 'popular',
  status: 'idle',
  error: null,
};

export const loadPopular = createAsyncThunk('feed/popular', () => feedService.popular());
export const loadRecent = createAsyncThunk('feed/recent', () => feedService.recent());
export const loadMostCloned = createAsyncThunk('feed/most-cloned', () => feedService.mostCloned());

export const loadAll = createAsyncThunk(
  'feed/all',
  ({ cursor = null } = {}) => feedService.all({ cursor }),
  {
    // Guard against a scroll handler firing twice before the first page lands,
    // and against paging past the end.
    condition: ({ cursor = null } = {}, { getState }) => {
      const { all } = getState().feed;
      if (all.status === 'loading') return false;
      if (cursor && !all.hasMore) return false;
      return true;
    },
  }
);

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

    b.addCase(loadAll.pending, (s) => { s.all.status = 'loading'; });
    b.addCase(loadAll.fulfilled, (s, a) => {
      const firstPage = !a.meta.arg?.cursor;
      s.all.status = 'success';
      s.all.items = firstPage ? a.payload.scripts : [...s.all.items, ...a.payload.scripts];
      s.all.cursor = a.payload.nextCursor;
      s.all.hasMore = Boolean(a.payload.hasMore);
    });
    b.addCase(loadAll.rejected, (s) => { s.all.status = 'error'; });
  },
});

export const { setActiveTab } = slice.actions;
export default slice.reducer;
