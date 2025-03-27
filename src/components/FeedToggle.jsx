import React from 'react';
import { Nav } from 'react-bootstrap';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';

const FeedToggle = ({ feedTab, onTabChange, tag }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  return (
    <div className="feed-toggle mb-4">
      <Nav variant="tabs">
        {isAuthenticated && (
          <Nav.Item>
            <Nav.Link 
              className={feedTab === 'feed' ? 'active' : ''}
              onClick={() => onTabChange('feed')}
            >
              Your Feed
            </Nav.Link>
          </Nav.Item>
        )}
        
        <Nav.Item>
          <Nav.Link 
            className={feedTab === 'global' ? 'active' : ''}
            onClick={() => onTabChange('global')}
          >
            Global Feed
          </Nav.Link>
        </Nav.Item>
        
        {tag && (
          <Nav.Item>
            <Nav.Link 
              className={feedTab === 'tag' ? 'active' : ''}
            >
              <i className="bi bi-hash"></i> {tag}
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>
    </div>
  );
};

export default FeedToggle;