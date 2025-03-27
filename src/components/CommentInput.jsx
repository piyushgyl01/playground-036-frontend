import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addComment } from '../features/article/articleSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';

const CommentInput = ({ articleSlug }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!body.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await dispatch(addComment({ slug: articleSlug, comment: { body } })).unwrap();
      setBody('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Card className="mb-4">
        <Card.Body className="text-center">
          <p>
            <Link to="/login" className="text-success">Sign in</Link> or {' '}
            <Link to="/register" className="text-success">sign up</Link> to add comments.
          </p>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write a comment..."
              value={body}
              onChange={e => setBody(e.target.value)}
              disabled={isSubmitting}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img 
                src={currentUser?.image} 
                alt={currentUser?.username} 
                className="rounded-circle me-2"
                width="30"
                height="30"
              />
            </div>
            
            <Button 
              type="submit" 
              variant="success" 
              disabled={isSubmitting || !body.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CommentInput;