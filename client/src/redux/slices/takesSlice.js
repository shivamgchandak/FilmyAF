import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { takesService } from '../../services/takesService.js';

/** Mirrors server/src/services/takes.service.js - kept here so the UI can
 *  price an action before the request is made. */
export const TAKE_COSTS = {
  generate: 3,
  editScript: 3,
  recast: 1,
  rerollScene: 1,
  rerollTitle: 1,
};

const initialState = {
  balance: null,      // null until the server has told us
  dailyGrant: 10,
  grant: null,
  grantPeriod: 'daily',
  anonymous: true,
  accumulates: true,
  costs: TAKE_COSTS,
  status: 'idle',
};

export const loadTakes = createAsyncThunk('takes/load', () => takesService.get());

const slice = createSlice({
  name: 'takes',
  initialState,
  reducers: {
    setBalance(state, action) {
      if (typeof action.payload === 'number') state.balance = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadTakes.pending, (s) => { s.status = 'loading'; });
    b.addCase(loadTakes.fulfilled, (s, a) => {
      s.status = 'success';
      s.balance = a.payload.takes.balance;
      s.dailyGrant = a.payload.takes.dailyGrant;
      s.grant = a.payload.takes.grant ?? a.payload.takes.dailyGrant;
      s.grantPeriod = a.payload.takes.grantPeriod ?? 'daily';
      s.anonymous = a.payload.takes.anonymous;
      s.accumulates = a.payload.takes.accumulates;
      if (a.payload.costs) s.costs = a.payload.costs;
    });
    b.addCase(loadTakes.rejected, (s) => { s.status = 'error'; });
  },
});

export const { setBalance } = slice.actions;
export default slice.reducer;
