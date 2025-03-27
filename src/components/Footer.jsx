import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light py-3 mt-5">
      <Container className="text-center">
        <p className="text-muted mb-0">
          <a 
            href="https://github.com/gothinkster/realworld" 
            className="text-decoration-none text-success fw-bold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blogify
          </a> - A RealWorld implementation with React, Redux, and Bootstrap
        </p>
      </Container>
    </footer>
  );
};

export default Footer;