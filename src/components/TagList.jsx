import React from 'react';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TagList = ({ tagList, onClick }) => {
  if (!tagList || tagList.length === 0) {
    return null;
  }
  
  return (
    <div className="tag-list">
      {tagList.map(tag => (
        tag && (
          <Badge 
            bg="secondary" 
            text="light" 
            className="me-1 mb-1" 
            key={tag}
            onClick={onClick ? () => onClick(tag) : undefined}
            as={onClick ? 'span' : Link}
            to={onClick ? undefined : `/?tag=${tag}`}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
          >
            {tag}
          </Badge>
        )
      ))}
    </div>
  );
};

export default TagList;