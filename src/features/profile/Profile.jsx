import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Nav, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  getProfile, 
  followUser, 
  unfollowUser, 
  getProfileArticles, 
  getFavoritedArticles, 
  setActiveTab, 
  setCurrentPage,
  resetProfileState,
  selectProfile, 
  selectProfileArticles, 
  selectProfileArticlesCount, 
  selectActiveTab, 
  selectProfileCurrentPage,
  selectProfileStatus, 
  selectProfileArticlesStatus
} from './profileSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../auth/authSlice';
import ArticleList from '../../components/ArticleList';

const ARTICLES_PER_PAGE = 10;

const Profile = () => {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  
  const profile = useAppSelector(selectProfile);
  const articles = useAppSelector(selectProfileArticles);
  const articlesCount = useAppSelector(selectProfileArticlesCount);
  const activeTab = useAppSelector(selectActiveTab);
  const currentPage = useAppSelector(selectProfileCurrentPage);
  const profileStatus = useAppSelector(selectProfileStatus);
  const articlesStatus = useAppSelector(selectProfileArticlesStatus);
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const isCurrentUser = currentUser && currentUser.username === username;
  
  // Load profile data
  useEffect(() => {
    dispatch(getProfile(username));
    
    return () => {
      dispatch(resetProfileState());
    };
  }, [dispatch, username]);
  
  // Load articles based on active tab and pagination
  useEffect(() => {
    const params = { 
      limit: ARTICLES_PER_PAGE, 
      offset: currentPage * ARTICLES_PER_PAGE 
    };
    
    if (activeTab === 'articles') {
      dispatch(getProfileArticles({ username, params }));
    } else if (activeTab === 'favorited') {
      dispatch(getFavoritedArticles({ username, params }));
    }
  }, [dispatch, username, activeTab, currentPage]);
  
  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };
  
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };
  
  const handleFollow = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    if (profile.following) {
      dispatch(unfollowUser(username));
    } else {
      dispatch(followUser(username));
    }
  };
  
  if (profileStatus === 'loading') {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading profile...</span>
        </Spinner>
      </Container>
    );
  }
  
  if (!profile) {
    return null;
  }
  
  return (
    <div className="profile-page">
      {/* User info header */}
      <div className="bg-light py-5 mb-4">
        <Container className="text-center">
          <Image 
            src={profile.image} 
            alt={profile.username} 
            roundedCircle 
            width={100}
            height={100}
            className="mb-3"
          />
          
          <h3>{profile.username}</h3>
          
          <p className="text-muted">
            {profile.bio || 'No bio available.'}
          </p>
          
          <div>
            {isCurrentUser ? (
              <Link 
                to="/settings" 
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="bi bi-gear"></i> Edit Profile Settings
              </Link>
            ) : (
              <Button 
                variant={profile.following ? 'secondary' : 'outline-secondary'} 
                size="sm"
                onClick={handleFollow}
              >
                <i className={`bi bi-person-${profile.following ? 'dash' : 'plus'}`}></i> 
                {profile.following ? ` Unfollow ${profile.username}` : ` Follow ${profile.username}`}
              </Button>
            )}
          </div>
        </Container>
      </div>
      
      <Container>
        <Row>
          <Col xs={12} md={10} className="mx-auto">
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link 
                  className={activeTab === 'articles' ? 'active' : ''}
                  onClick={() => handleTabChange('articles')}
                >
                  My Articles
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  className={activeTab === 'favorited' ? 'active' : ''}
                  onClick={() => handleTabChange('favorited')}
                >
                  Favorited Articles
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <ArticleList 
              articles={articles}
              articlesCount={articlesCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              status={articlesStatus}
              articlesPerPage={ARTICLES_PER_PAGE}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;