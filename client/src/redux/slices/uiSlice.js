import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {
    modal: null, // { type, props }
  },
  reducers: {
    openModal(state, action) {
      state.modal = action.payload;
    },
    closeModal(state) {
      state.modal = null;
    },
  },
});

export const { openModal, closeModal } = slice.actions;
export default slice.reducer;
