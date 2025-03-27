import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../features/auth/authSlice';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const ArticleMeta = ({ 
  article, 
  onFollow, 
  onFavorite, 
  onEdit, 
  onDelete 
}) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthor = currentUser && article.author.username === currentUser.username;
  
  return (
    <div className="article-meta d-flex align-items-center">
      <Link to={`/profile/${article.author.username}`}>
        <img 
          src={article.author.image} 
          alt={article.author.username} 
          className="rounded-circle me-2"
          width="32"
          height="32"
        />
      </Link>
      
      <div className="d-flex flex-column">
        <Link 
          to={`/profile/${article.author.username}`}
          className="fw-bold text-success text-decoration-none"
        >
          {article.author.username}
        </Link>
        <span className="text-muted small">
          {formatDate(article.createdAt)}
        </span>
      </div>
      
      <div className="ms-auto">
        {isAuthor ? (
          <>
            <Link
              to={`/editor/${article.slug}`}
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={onEdit}
            >
              <i className="bi bi-pencil"></i> Edit
            </Link>
            
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onDelete}
            >
              <i className="bi bi-trash"></i> Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={onFollow}
            >
              <i className={`bi bi-person-${article.author.following ? 'dash' : 'plus'}`}></i> {' '}
              {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
            </Button>
            
            <Button
              variant={article.favourited ? 'success' : 'outline-success'}
              size="sm"
              onClick={onFavorite}
            >
              <i className="bi bi-heart-fill"></i> {' '}
              {article.favourited ? 'Unfavorite' : 'Favorite'} ({article.favouritesCount})
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleMeta;