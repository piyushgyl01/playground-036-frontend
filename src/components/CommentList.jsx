import React from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { deleteComment } from '../features/article/articleSlice';
import { selectCurrentUser } from '../features/auth/authSlice';

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const CommentList = ({ comments, articleSlug, status }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  
  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment({ slug: articleSlug, commentId }));
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading comments...</span>
        </Spinner>
      </div>
    );
  }
  
  if (comments.length === 0) {
    return (
      <div className="text-center my-4">
        <p className="text-muted">No comments yet.</p>
      </div>
    );
  }
  
  return (
    <div className="comment-list">
      {comments.map(comment => (
        <Card key={comment.id} className="mb-3">
          <Card.Body>
            <p className="mb-3">{comment.body}</p>
            
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Link to={`/profile/${comment.author.username}`}>
                  <img 
                    src={comment.author.image} 
                    alt={comment.author.username} 
                    className="rounded-circle me-2"
                    width="24"
                    height="24"
                  />
                </Link>
                
                <span>
                  <Link 
                    to={`/profile/${comment.author.username}`}
                    className="text-success text-decoration-none fw-bold"
                  >
                    {comment.author.username}
                  </Link>
                  <span className="text-muted ms-2 small">
                    {formatDate(comment.createdAt)}
                  </span>
                </span>
              </div>
              
              {currentUser && currentUser.username === comment.author.username && (
                <Button 
                  variant="link" 
                  className="btn-sm text-danger p-0"
                  onClick={() => handleDelete(comment.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default CommentList;