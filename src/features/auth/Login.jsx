import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, selectAuthStatus, selectAuthError, selectIsAuthenticated } from './authSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/');
    } catch (err) {
      // Error is handled in the auth slice
    }
  };
  
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center mb-4">
            <h1 className="display-4">Sign In</h1>
            <p>
              <Link to="/register" className="text-success">
                Need an account?
              </Link>
            </p>
          </div>
          
          {error && (
            <Alert variant="danger">
              {typeof error === 'object' ? (
                <ul className="mb-0 ps-3">
                  {Object.entries(error).map(([key, value]) => (
                    <li key={key}>{key} {value}</li>
                  ))}
                </ul>
              ) : (
                error
              )}
            </Alert>
          )}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password.
              </Form.Control.Feedback>
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                variant="success" 
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;