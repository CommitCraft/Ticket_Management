import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/auth';
import { clearAccessToken, setAccessToken } from '../services/token';

interface AuthState {
  user: User | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  initialized: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user;
      state.initialized = true;
      setAccessToken(action.payload.accessToken);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearCredentials(state) {
      state.user = null;
      state.initialized = true;
      clearAccessToken();
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    }
  }
});

export const { setCredentials, setUser, clearCredentials, setInitialized } = authSlice.actions;
export default authSlice.reducer;
