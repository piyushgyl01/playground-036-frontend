import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import agent from '../../api/agent';

// Get profile async thunk
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (username, { rejectWithValue }) => {
    try {
      const response = await agent.Profile.get(username);
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get profile'
      );
    }
  }
);

// Follow user async thunk
export const followUser = createAsyncThunk(
  'profile/followUser',
  async (username, { rejectWithValue }) => {
    try {
      const response = await agent.Profile.follow(username);
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to follow user'
      );
    }
  }
);

// Unfollow user async thunk
export const unfollowUser = createAsyncThunk(
  'profile/unfollowUser',
  async (username, { rejectWithValue }) => {
    try {
      const response = await agent.Profile.unfollow(username);
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to unfollow user'
      );
    }
  }
);

// Get profile articles async thunk
export const getProfileArticles = createAsyncThunk(
  'profile/getProfileArticles',
  async ({ username, params }, { rejectWithValue }) => {
    try {
      // Add author to params to filter by username
      const queryParams = { ...params, author: username };
      const response = await agent.Articles.getAll(queryParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get articles'
      );
    }
  }
);

// Get favorited articles async thunk
export const getFavoritedArticles = createAsyncThunk(
  'profile/getFavoritedArticles',
  async ({ username, params }, { rejectWithValue }) => {
    try {
      // Add favorited to params to filter by favorited articles
      const queryParams = { ...params, favorited: username };
      const response = await agent.Articles.getAll(queryParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get favorited articles'
      );
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    articles: [],
    articlesCount: 0,
    activeTab: 'articles', // 'articles' or 'favorited'
    currentPage: 0,
    status: 'idle',
    articlesStatus: 'idle',
    error: null
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.currentPage = 0;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    resetProfileState: (state) => {
      state.profile = null;
      state.articles = [];
      state.articlesCount = 0;
      state.status = 'idle';
      state.articlesStatus = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get profile cases
      .addCase(getProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Follow/unfollow user cases
      .addCase(followUser.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      
      // Get profile articles cases
      .addCase(getProfileArticles.pending, (state) => {
        state.articlesStatus = 'loading';
      })
      .addCase(getProfileArticles.fulfilled, (state, action) => {
        state.articlesStatus = 'succeeded';
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      })
      .addCase(getProfileArticles.rejected, (state, action) => {
        state.articlesStatus = 'failed';
        state.error = action.payload;
      })
      
      // Get favorited articles cases
      .addCase(getFavoritedArticles.pending, (state) => {
        state.articlesStatus = 'loading';
      })
      .addCase(getFavoritedArticles.fulfilled, (state, action) => {
        state.articlesStatus = 'succeeded';
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      })
      .addCase(getFavoritedArticles.rejected, (state, action) => {
        state.articlesStatus = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  setActiveTab, 
  setCurrentPage, 
  resetProfileState 
} = profileSlice.actions;

// Selectors
export const selectProfile = (state) => state.profile.profile;
export const selectProfileArticles = (state) => state.profile.articles;
export const selectProfileArticlesCount = (state) => state.profile.articlesCount;
export const selectActiveTab = (state) => state.profile.activeTab;
export const selectProfileCurrentPage = (state) => state.profile.currentPage;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileArticlesStatus = (state) => state.profile.articlesStatus;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;