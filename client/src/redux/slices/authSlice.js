import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService.js';

const TOKEN_KEY = 'filmyaf_token';

const initialState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  status: 'idle', // idle | loading | success | error
  error: null,
};

export const signupThunk = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.signup(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  } catch (e) {
    return rejectWithValue({ message: e.message, details: e.details });
  }
});

export const loginThunk = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.login(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  } catch (e) {
    return rejectWithValue({ message: e.message, details: e.details });
  }
});

export const loadUserThunk = createAsyncThunk('auth/load', async (_arg, { getState }) => {
  const { auth } = getState();
  if (!auth.token) return { user: null };
  const data = await authService.me();
  return data;
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(signupThunk.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    });
    b.addCase(signupThunk.fulfilled, (s, a) => {
      s.status = 'success';
      s.user = a.payload.user;
      s.token = a.payload.token;
    });
    b.addCase(signupThunk.rejected, (s, a) => {
      s.status = 'error';
      s.error = a.payload || { message: a.error.message };
    });
    b.addCase(loginThunk.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.status = 'success';
      s.user = a.payload.user;
      s.token = a.payload.token;
    });
    b.addCase(loginThunk.rejected, (s, a) => {
      s.status = 'error';
      s.error = a.payload || { message: a.error.message };
    });
    b.addCase(loadUserThunk.fulfilled, (s, a) => {
      if (a.payload?.user) s.user = a.payload.user;
    });
    b.addCase(loadUserThunk.rejected, (s) => {
      // token must have been invalid
      s.user = null;
      s.token = null;
      localStorage.removeItem(TOKEN_KEY);
    });
  },
});

export const { logout, clearError } = slice.actions;
export default slice.reducer;
