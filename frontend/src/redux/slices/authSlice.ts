import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  checkingSession: true,
  onlineUsers: [], // Array of user IDs currently online
  error: null,
  theme: 'dark',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.checkingSession = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.checkingSession = false;
      state.onlineUsers = [];
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCheckingSession: (state, action) => {
      state.checkingSession = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  loginSuccess,
  updateUser,
  setAccessToken,
  logoutSuccess,
  setLoading,
  setError,
  setCheckingSession,
  setOnlineUsers,
} = authSlice.actions;

export default authSlice.reducer;
