import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
}

const initialState: UIState = {
  darkMode: localStorage.getItem('helpdesk-theme') === 'dark'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    }
  }
});

export const { setDarkMode, toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
