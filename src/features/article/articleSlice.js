import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import agent from '../../api/agent';

// Get article async thunk
export const getArticle = createAsyncThunk(
  'article/getArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await agent.Articles.get(slug);
      return response.data.article;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get article'
      );
    }
  }
);

// Create article async thunk
export const createArticle = createAsyncThunk(
  'article/createArticle',
  async (article, { rejectWithValue }) => {
    try {
      const response = await agent.Articles.create(article);
      return response.data.article;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to create article'
      );
    }
  }
);

// Update article async thunk
export const updateArticle = createAsyncThunk(
  'article/updateArticle',
  async ({ slug, article }, { rejectWithValue }) => {
    try {
      const response = await agent.Articles.update(slug, article);
      return response.data.article;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to update article'
      );
    }
  }
);

// Delete article async thunk
export const deleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async (slug, { rejectWithValue }) => {
    try {
      await agent.Articles.delete(slug);
      return slug;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to delete article'
      );
    }
  }
);

// Favorite article async thunk
export const favoriteArticle = createAsyncThunk(
  'article/favoriteArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await agent.Articles.favorite(slug);
      return response.data.article;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to favorite article'
      );
    }
  }
);

// Unfavorite article async thunk
export const unfavoriteArticle = createAsyncThunk(
  'article/unfavoriteArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await agent.Articles.unfavorite(slug);
      return response.data.article;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to unfavorite article'
      );
    }
  }
);

// Get article comments async thunk
export const getComments = createAsyncThunk(
  'article/getComments',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await agent.Comments.getAll(slug);
      return response.data.comments;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to get comments'
      );
    }
  }
);

// Add comment async thunk
export const addComment = createAsyncThunk(
  'article/addComment',
  async ({ slug, comment }, { rejectWithValue }) => {
    try {
      const response = await agent.Comments.create(slug, comment);
      return response.data.comment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to add comment'
      );
    }
  }
);

// Delete comment async thunk
export const deleteComment = createAsyncThunk(
  'article/deleteComment',
  async ({ slug, commentId }, { rejectWithValue }) => {
    try {
      await agent.Comments.delete(slug, commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || 'Failed to delete comment'
      );
    }
  }
);

// Article slice
const articleSlice = createSlice({
  name: 'article',
  initialState: {
    article: null,
    comments: [],
    status: 'idle',
    commentStatus: 'idle',
    error: null,
  },
  reducers: {
    resetArticleState: (state) => {
      state.article = null;
      state.comments = [];
      state.status = 'idle';
      state.commentStatus = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get article cases
      .addCase(getArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(getArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Create article cases
      .addCase(createArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update article cases
      .addCase(updateArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.article = action.payload;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Delete article cases
      .addCase(deleteArticle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state) => {
        state.status = 'succeeded';
        state.article = null;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Favorite/unfavorite article cases
      .addCase(favoriteArticle.fulfilled, (state, action) => {
        state.article = action.payload;
      })
      .addCase(unfavoriteArticle.fulfilled, (state, action) => {
        state.article = action.payload;
      })
      
      // Get comments cases
      .addCase(getComments.pending, (state) => {
        state.commentStatus = 'loading';
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.commentStatus = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.commentStatus = 'failed';
        state.error = action.payload;
      })
      
      // Add comment cases
      .addCase(addComment.pending, (state) => {
        state.commentStatus = 'loading';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.commentStatus = 'succeeded';
        state.comments.unshift(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commentStatus = 'failed';
        state.error = action.payload;
      })
      
      // Delete comment cases
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          comment => comment.id !== action.payload
        );
      });
  }
});

// Export actions
export const { resetArticleState } = articleSlice.actions;

// Selectors
export const selectArticle = (state) => state.article.article;
export const selectComments = (state) => state.article.comments;
export const selectArticleStatus = (state) => state.article.status;
export const selectCommentStatus = (state) => state.article.commentStatus;
export const selectArticleError = (state) => state.article.error;

export default articleSlice.reducer;