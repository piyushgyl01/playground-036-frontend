import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  getArticle, 
  getComments, 
  resetArticleState, 
  favoriteArticle, 
  unfavoriteArticle, 
  deleteArticle,
  selectArticle,
  selectArticleStatus,
  selectArticleError
} from './articleSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../auth/authSlice';
import CommentInput from '../../components/CommentInput';
import CommentList from '../../components/CommentList';
import TagList from '../../components/TagList';

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const ArticlePage = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const article = useAppSelector(selectArticle);
  const status = useAppSelector(selectArticleStatus);
  const error = useAppSelector(selectArticleError);
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Load article and comments
  useEffect(() => {
    dispatch(getArticle(slug));
    dispatch(getComments(slug));
    
    return () => {
      dispatch(resetArticleState());
    };
  }, [dispatch, slug]);
  
  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (article.favourited) {
      dispatch(unfavoriteArticle(slug));
    } else {
      dispatch(favoriteArticle(slug));
    }
  };
  
  const handleFollow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // TODO: Implement follow/unfollow functionality
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(deleteArticle(slug))
        .unwrap()
        .then(() => navigate('/'));
    }
  };
  
  if (status === 'loading') {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  if (status === 'failed') {
    return (
      <Container className="my-5 text-center">
        <h3 className="text-danger">Error loading article</h3>
        <p>{error}</p>
        <Link to="/" className="btn btn-outline-success">
          Go back to home
        </Link>
      </Container>
    );
  }
  
  if (!article) {
    return null;
  }
  
  const isAuthor = currentUser && article.author.username === currentUser.username;
  
  return (
    <div className="article-page">
      {/* Article banner */}
      <div className="bg-dark text-white p-5">
        <Container>
          <h1>{article.title}</h1>
          
          <div className="d-flex my-4">
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
                className="text-white fw-bold text-decoration-none"
              >
                {article.author.username}
              </Link>
              <span className="text-light small">
                {formatDate(article.createdAt)}
              </span>
            </div>
            
            <div className="ms-auto">
              {isAuthor ? (
                <>
                  <Link
                    to={`/editor/${slug}`}
                    className="btn btn-outline-light btn-sm me-2"
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </Link>
                  
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="me-2"
                    onClick={handleFollow}
                  >
                    <i className="bi bi-person-plus"></i> {' '}
                    {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
                  </Button>
                  
                  <Button
                    variant={article.favourited ? 'success' : 'outline-success'}
                    size="sm"
                    onClick={handleFavorite}
                  >
                    <i className="bi bi-heart-fill"></i> {' '}
                    {article.favourited ? 'Unfavorite' : 'Favorite'} ({article.favouritesCount})
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
      
      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="article-content mb-4">
              <ReactMarkdown>{article.body}</ReactMarkdown>
            </div>
            
            <TagList tagList={article.tagList} />
            
            <hr className="my-4" />
            
            <div className="article-actions d-flex justify-content-center my-4">
              <div className="d-flex align-items-center">
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
                    className="text-success fw-bold text-decoration-none"
                  >
                    {article.author.username}
                  </Link>
                  <span className="text-muted small">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="ms-auto">
                {isAuthor ? (
                  <>
                    <Link
                      to={`/editor/${slug}`}
                      className="btn btn-outline-success btn-sm me-2"
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </Link>
                    
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleDelete}
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
                      onClick={handleFollow}
                    >
                      <i className="bi bi-person-plus"></i> {' '}
                      {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
                    </Button>
                    
                    <Button
                      variant={article.favourited ? 'success' : 'outline-success'}
                      size="sm"
                      onClick={handleFavorite}
                    >
                      <i className="bi bi-heart-fill"></i> {' '}
                      {article.favourited ? 'Unfavorite' : 'Favorite'} ({article.favouritesCount})
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <hr className="my-4" />
            
            {/* Comments section */}
            <div className="comments-section">
              <CommentInput articleSlug={slug} />
              <CommentList 
                articleSlug={slug} 
                comments={article.comments || []} 
                status={status} 
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ArticlePage;