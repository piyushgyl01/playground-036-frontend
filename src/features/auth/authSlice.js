import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import agent from '../../api/agent';
import { STORAGE_KEYS } from '../../api/constants';

// Load user from localStorage if available
const loadUser = () => {
  try {
    const userString = localStorage.getItem(STORAGE_KEYS.USER);
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Check for token in localStorage
const loadToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
  } catch (error) {
    return null;
  }
};

// Login async thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await agent.Auth.login(credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to login'
      );
    }
  }
);

// Register async thunk
export const register = createAsyncThunk(
  'auth/register',
  async (user, { rejectWithValue }) => {
    try {
      const response = await agent.Auth.register(user);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to register'
      );
    }
  }
);

// Get current user async thunk
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Auth.getCurrentUser();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get current user'
      );
    }
  }
);

// Update user async thunk
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user, { rejectWithValue }) => {
    try {
      const response = await agent.Auth.updateUser(user);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to update user'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUser(),
    token: loadToken(),
    isAuthenticated: !!loadToken(),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      // Remove token and user from localStorage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // Reset state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Save user and token to localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Save user and token to localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        
        // Update user in localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        
        // Remove token and user from localStorage
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      })
      
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        
        // Update user in localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;