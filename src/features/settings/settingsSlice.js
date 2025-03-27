import { createSlice } from '@reduxjs/toolkit';
import { updateUser } from '../auth/authSlice';

// Settings slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    status: 'idle',
    error: null
  },
  reducers: {
    resetSettingsState: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Update user cases from auth slice
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { resetSettingsState } = settingsSlice.actions;

// Selectors
export const selectSettingsStatus = (state) => state.settings.status;
export const selectSettingsError = (state) => state.settings.error;

export default settingsSlice.reducer;