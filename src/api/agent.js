import axios from 'axios';
import { API_URL, ENDPOINTS, STORAGE_KEYS } from './constants';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// Add request interceptor to include token in requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Clear user data if unauthorized
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return Promise.reject(error);
  }
);

// Auth API methods
const Auth = {
  login: credentials => 
    api.post(ENDPOINTS.LOGIN, { user: credentials }),
  
  register: user => 
    api.post(ENDPOINTS.REGISTER, { user }),
  
  getCurrentUser: () => 
    api.get(ENDPOINTS.CURRENT_USER),
  
  updateUser: user => 
    api.put(ENDPOINTS.CURRENT_USER, { user })
};

// Articles API methods
const Articles = {
  getAll: params => 
    api.get(ENDPOINTS.ARTICLES, { params }),
  
  getFeed: params =>
    api.get(ENDPOINTS.FEED, { params }),
  
  get: slug => 
    api.get(ENDPOINTS.ARTICLE(slug)),
  
  create: article => 
    api.post(ENDPOINTS.ARTICLES, { article }),
  
  update: (slug, article) => 
    api.put(ENDPOINTS.ARTICLE(slug), { article }),
  
  delete: slug => 
    api.delete(ENDPOINTS.ARTICLE(slug)),
  
  favorite: slug => 
    api.post(ENDPOINTS.FAVORITE(slug)),
  
  unfavorite: slug => 
    api.delete(ENDPOINTS.FAVORITE(slug))
};

// Comments API methods
const Comments = {
  getAll: slug => 
    api.get(ENDPOINTS.COMMENTS(slug)),
  
  create: (slug, comment) => 
    api.post(ENDPOINTS.COMMENTS(slug), { comment }),
  
  delete: (slug, commentId) => 
    api.delete(`${ENDPOINTS.COMMENTS(slug)}/${commentId}`)
};

// Profile API methods
const Profile = {
  get: username => 
    api.get(ENDPOINTS.PROFILE(username)),
  
  follow: username => 
    api.post(ENDPOINTS.FOLLOW(username)),
  
  unfollow: username => 
    api.delete(ENDPOINTS.FOLLOW(username))
};

// Tags API methods
const Tags = {
  getAll: () => 
    api.get(ENDPOINTS.TAGS)
};

// Export all API methods
const agent = {
  Auth,
  Articles,
  Comments,
  Profile,
  Tags
};

export default agent;