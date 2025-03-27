import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice';

const Header = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <Navbar bg="light" expand="lg" className="py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
          Blogify
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="nav-link">
              Home
            </Nav.Link>
            
            {isAuthenticated ? (
              // Authenticated user navigation
              <>
                <Nav.Link as={NavLink} to="/editor" className="nav-link">
                  <i className="bi bi-pencil-square"></i> New Article
                </Nav.Link>
                
                <Nav.Link as={NavLink} to="/settings" className="nav-link">
                  <i className="bi bi-gear"></i> Settings
                </Nav.Link>
                
                <Nav.Link 
                  as={NavLink} 
                  to={`/profile/${currentUser?.username}`} 
                  className="nav-link d-flex align-items-center"
                >
                  {currentUser?.image && (
                    <img 
                      src={currentUser.image} 
                      alt={currentUser.username} 
                      className="rounded-circle me-1"
                      width="26"
                      height="26"
                    />
                  )}
                  {currentUser?.username}
                </Nav.Link>
              </>
            ) : (
              // Non-authenticated user navigation
              <>
                <Nav.Link as={NavLink} to="/login" className="nav-link">
                  Sign in
                </Nav.Link>
                
                <Nav.Link as={NavLink} to="/register" className="nav-link">
                  Sign up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;