// Base API URL - update this to match your API endpoint
export const API_URL = 'http://localhost:3000/api';

// API endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users',
  CURRENT_USER: '/user',
  
  // Articles
  ARTICLES: '/articles',
  FEED: '/articles/feed',
  ARTICLE: slug => `/articles/${slug}`,
  COMMENTS: slug => `/articles/${slug}/comments`,
  FAVORITE: slug => `/articles/${slug}/favorite`,
  
  // Profiles
  PROFILE: username => `/profiles/${username}`,
  FOLLOW: username => `/profiles/${username}/follow`,
  
  // Tags
  TAGS: '/tags'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'blogify_token',
  USER: 'blogify_user'
};