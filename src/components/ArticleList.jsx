import React from 'react';
import { Pagination, Spinner } from 'react-bootstrap';
import ArticlePreview from './ArticlePreview';

const ArticleList = ({ 
  articles, 
  articlesCount, 
  currentPage, 
  onPageChange, 
  status, 
  articlesPerPage = 10
}) => {
  // Calculate total number of pages
  const totalPages = Math.ceil(articlesCount / articlesPerPage);
  
  // Create pagination items
  const paginationItems = [];
  for (let number = 0; number < totalPages; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number + 1}
      </Pagination.Item>
    );
  }
  
  if (status === 'loading') {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  
  if (articles.length === 0) {
    return (
      <div className="text-center my-5">
        <p>No articles found.</p>
      </div>
    );
  }
  
  return (
    <div>
      {articles.map(article => (
        <ArticlePreview key={article.slug} article={article} />
      ))}
      
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <Pagination>
            {paginationItems}
          </Pagination>
        </nav>
      )}
    </div>
  );
};

export default ArticleList;