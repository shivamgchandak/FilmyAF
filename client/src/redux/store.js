import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import scriptReducer from './slices/scriptSlice.js';
import feedReducer from './slices/feedSlice.js';
import historyReducer from './slices/historySlice.js';
import uiReducer from './slices/uiSlice.js';
import takesReducer from './slices/takesSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    script: scriptReducer,
    feed: feedReducer,
    history: historyReducer,
    ui: uiReducer,
    takes: takesReducer,
  },
});
