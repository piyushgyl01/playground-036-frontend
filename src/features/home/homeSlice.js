import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import agent from '../../api/agent';

// Get global articles async thunk
export const getGlobalArticles = createAsyncThunk(
  'home/getGlobalArticles',
  async (params, { rejectWithValue }) => {
    try {
      const response = await agent.Articles.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get articles'
      );
    }
  }
);

// Get feed articles async thunk
export const getFeedArticles = createAsyncThunk(
  'home/getFeedArticles',
  async (params, { rejectWithValue }) => {
    try {
      const response = await agent.Articles.getFeed(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get feed'
      );
    }
  }
);

// Get all tags async thunk
export const getTags = createAsyncThunk(
  'home/getTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await agent.Tags.getAll();
      return response.data.tags;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get tags'
      );
    }
  }
);

// Home slice
const homeSlice = createSlice({
  name: 'home',
  initialState: {
    articles: [],
    articlesCount: 0,
    tags: [],
    feedTab: 'global', // 'global', 'feed', or 'tag'
    currentTag: null,
    currentPage: 0,
    status: 'idle',
    tagsStatus: 'idle',
    error: null
  },
  reducers: {
    setFeedTab: (state, action) => {
      state.feedTab = action.payload;
      state.currentPage = 0;
    },
    setCurrentTag: (state, action) => {
      state.currentTag = action.payload;
      state.feedTab = 'tag';
      state.currentPage = 0;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get global articles cases
      .addCase(getGlobalArticles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getGlobalArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      })
      .addCase(getGlobalArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Get feed articles cases
      .addCase(getFeedArticles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getFeedArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      })
      .addCase(getFeedArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Get tags cases
      .addCase(getTags.pending, (state) => {
        state.tagsStatus = 'loading';
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.tagsStatus = 'succeeded';
        state.tags = action.payload;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.tagsStatus = 'failed';
        state.error = action.payload;
      });
  }
});

// Export actions
export const { setFeedTab, setCurrentTag, setCurrentPage } = homeSlice.actions;

// Selectors
export const selectArticles = (state) => state.home.articles;
export const selectArticlesCount = (state) => state.home.articlesCount;
export const selectTags = (state) => state.home.tags;
export const selectFeedTab = (state) => state.home.feedTab;
export const selectCurrentTag = (state) => state.home.currentTag;
export const selectCurrentPage = (state) => state.home.currentPage;
export const selectHomeStatus = (state) => state.home.status;
export const selectTagsStatus = (state) => state.home.tagsStatus;
export const selectHomeError = (state) => state.home.error;

export default homeSlice.reducer;