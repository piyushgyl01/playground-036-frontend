import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { getCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';

// Import components
import Header from '../components/Header';
import Footer from '../components/Footer';
import PrivateRoute from '../components/PrivateRoute';

// Import pages
import Home from '../features/home/Home';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Profile from '../features/profile/Profile';
import Settings from '../features/settings/Settings';
import ArticlePage from '../features/article/ArticlePage';
import ArticleEditor from '../features/article/ArticleEditor';

// Import Bootstrap & icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Try to load the current user from token if available
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        
        <main className="flex-grow-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/profile/:username" element={<Profile />} />
            
            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/settings" element={<Settings />} />
              <Route path="/editor" element={<ArticleEditor />} />
              <Route path="/editor/:slug" element={<ArticleEditor />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;