import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import chatReducer from './slices/chatSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
