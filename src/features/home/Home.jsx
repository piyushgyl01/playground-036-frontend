import React, { useEffect } from 'react';
import { Container, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  getGlobalArticles, 
  getFeedArticles, 
  getTags, 
  setFeedTab, 
  setCurrentTag, 
  setCurrentPage,
  selectArticles,
  selectArticlesCount,
  selectFeedTab,
  selectCurrentTag,
  selectCurrentPage,
  selectHomeStatus,
  selectTags,
  selectTagsStatus
} from './homeSlice';
import { selectIsAuthenticated } from '../auth/authSlice';
import ArticleList from '../../components/ArticleList';
import FeedToggle from '../../components/FeedToggle';

const ARTICLES_PER_PAGE = 10;

const Home = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const articles = useAppSelector(selectArticles);
  const articlesCount = useAppSelector(selectArticlesCount);
  const feedTab = useAppSelector(selectFeedTab);
  const currentTag = useAppSelector(selectCurrentTag);
  const currentPage = useAppSelector(selectCurrentPage);
  const status = useAppSelector(selectHomeStatus);
  const tags = useAppSelector(selectTags);
  const tagsStatus = useAppSelector(selectTagsStatus);
  
  // Load articles based on current feed tab and pagination
  useEffect(() => {
    const fetchArticles = () => {
      const offset = currentPage * ARTICLES_PER_PAGE;
      const params = { limit: ARTICLES_PER_PAGE, offset };
      
      if (feedTab === 'feed' && isAuthenticated) {
        dispatch(getFeedArticles(params));
      } else if (feedTab === 'tag' && currentTag) {
        dispatch(getGlobalArticles({ ...params, tag: currentTag }));
      } else {
        dispatch(getGlobalArticles(params));
      }
    };
    
    fetchArticles();
  }, [dispatch, feedTab, currentTag, currentPage, isAuthenticated]);
  
  // Load tags
  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);
  
  // Check for tag in search params on initial load
  useEffect(() => {
    const tag = searchParams.get('tag');
    if (tag) {
      dispatch(setCurrentTag(tag));
    }
  }, [dispatch, searchParams]);
  
  const handleTabChange = (tab) => {
    dispatch(setFeedTab(tab));
  };
  
  const handleTagClick = (tag) => {
    dispatch(setCurrentTag(tag));
  };
  
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };
  
  return (
    <div className="home-page">
      {/* Banner */}
      <div className="bg-success text-white p-5 mb-4 text-center">
        <Container>
          <h1 className="display-4">Blogify</h1>
          <p className="lead">A place to share knowledge and ideas.</p>
        </Container>
      </div>
      
      <Container>
        <Row>
          <Col md={9}>
            <FeedToggle 
              feedTab={feedTab} 
              onTabChange={handleTabChange} 
              tag={currentTag}
            />
            
            <ArticleList 
              articles={articles}
              articlesCount={articlesCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              status={status}
              articlesPerPage={ARTICLES_PER_PAGE}
            />
          </Col>
          
          <Col md={3}>
            <div className="sidebar">
              <p className="mb-2 fw-bold">Popular Tags</p>
              {tagsStatus === 'loading' ? (
                <div className="text-center my-3">
                  <Spinner animation="border" size="sm" variant="success" />
                </div>
              ) : tags.length > 0 ? (
                <ListGroup>
                  {tags.map(tag => (
                    <ListGroup.Item 
                      key={tag}
                      action
                      onClick={() => handleTagClick(tag)}
                      className="d-inline-block me-1 mb-1 border border-success tag-pill"
                      style={{ 
                        borderRadius: '25px', 
                        padding: '0.25rem 0.75rem',
                        cursor: 'pointer',
                        backgroundColor: currentTag === tag ? '#28a745' : 'white',
                        color: currentTag === tag ? 'white' : '#212529'
                      }}
                    >
                      {tag}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No tags available.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;