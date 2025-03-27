import React from 'react';
import { Card, ListGroup, Spinner } from 'react-bootstrap';

const Sidebar = ({ tags, status, onTagClick, currentTag }) => {
  if (status === 'loading') {
    return (
      <Card className="sidebar-tags">
        <Card.Header>Popular Tags</Card.Header>
        <Card.Body className="text-center py-4">
          <Spinner animation="border" size="sm" variant="success" />
        </Card.Body>
      </Card>
    );
  }
  
  if (!tags || tags.length === 0) {
    return (
      <Card className="sidebar-tags">
        <Card.Header>Popular Tags</Card.Header>
        <Card.Body>
          <p className="text-muted mb-0">No tags available.</p>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="sidebar-tags">
      <Card.Header>Popular Tags</Card.Header>
      <Card.Body>
        <div className="tag-list d-flex flex-wrap">
          {tags.map(tag => (
            <span 
              key={tag}
              className={`badge me-1 mb-1 ${currentTag === tag ? 'bg-success' : 'bg-secondary'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Sidebar;