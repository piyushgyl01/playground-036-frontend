import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { favoriteArticle, unfavoriteArticle } from '../features/article/articleSlice';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import TagList from './TagList';

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const ArticlePreview = ({ article }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const { 
    slug, 
    title, 
    description, 
    createdAt, 
    tagList, 
    author, 
    favouritesCount, 
    favourited 
  } = article;
  
  const handleFavorite = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (favourited) {
      dispatch(unfavoriteArticle(slug));
    } else {
      dispatch(favoriteArticle(slug));
    }
  };
  
  return (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <Link to={`/profile/${author.username}`}>
              <img 
                src={author.image} 
                alt={author.username} 
                className="rounded-circle me-2"
                width="32"
                height="32"
              />
            </Link>
            
            <div>
              <Link 
                to={`/profile/${author.username}`}
                className="fw-bold text-success text-decoration-none"
              >
                {author.username}
              </Link>
              <p className="text-muted small mb-0">
                {formatDate(createdAt)}
              </p>
            </div>
          </div>
          
          <Button
            size="sm"
            variant={favourited ? 'success' : 'outline-success'}
            onClick={handleFavorite}
            className="d-flex align-items-center"
          >
            <i className="bi bi-heart-fill me-1"></i>
            {favouritesCount}
          </Button>
        </div>
        
        <Link 
          to={`/article/${slug}`}
          className="text-decoration-none text-dark"
        >
          <Card.Title className="fw-bold">{title}</Card.Title>
          <Card.Text className="text-muted">{description}</Card.Text>
        </Link>
        
        <div className="d-flex justify-content-between align-items-center">
          <Link 
            to={`/article/${slug}`}
            className="text-muted small text-decoration-none"
          >
            Read more...
          </Link>
          
          <TagList tagList={tagList} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArticlePreview;