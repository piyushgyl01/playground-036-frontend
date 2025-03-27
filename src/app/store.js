import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import articleReducer from '../features/article/articleSlice';
import profileReducer from '../features/profile/profileSlice';
import homeReducer from '../features/home/homeSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    article: articleReducer,
    profile: profileReducer,
    home: homeReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
});